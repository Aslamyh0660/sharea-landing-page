// Sharea like counter — Cloudflare Pages Function (production backend).
//
// Serves the same contract the client expects (src/lib/likes.ts):
//   GET  /api/likes           → { ok: true, count } | 503 { ok: false, reason }
//   POST /api/likes {action}  → { ok: true, count, liked } | 429/400/503
//
// Storage: a Cloudflare KV namespace bound as LIKES_KV (see wrangler.toml).
//   key "count"              — the public counter (single global value)
//   key "rl:<ip>"            — per-IP rate-limit marker, 60s TTL
//
// Honesty rules (mirrored from the brief):
//   - the count always comes from storage; on any storage failure we return
//     503 and the client shows its explicit "unavailable" state;
//   - localStorage on the client only DISCOURAGES repeat likes; KV rate
//     limiting is the server-side guard; neither claims "one person, one like".

interface Env {
  LIKES_KV: KVNamespace
}

const RATE_WINDOW_SECONDS = 60

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  })

const clientIp = (req: Request): string =>
  req.headers.get("cf-connecting-ip") ??
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown"

async function readCount(env: Env): Promise<number> {
  const raw = await env.LIKES_KV.get("count")
  const n = raw === null ? 0 : Number.parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const count = await readCount(env)
    return json({ ok: true, count })
  } catch (err) {
    console.error("[likes] GET failed:", err)
    return json({ ok: false, reason: "unavailable" }, 503)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json().catch(() => null)) as {
      action?: string
    } | null
    const action = body?.action
    if (action !== "like" && action !== "unlike") {
      return json({ ok: false, reason: "bad_request" }, 400)
    }

    const ip = clientIp(request)
    const rlKey = `rl:${ip}`
    const limited = await env.LIKES_KV.get(rlKey)
    if (limited !== null) {
      return json({ ok: false, reason: "rate_limited" }, 429)
    }
    // KV is eventually consistent: this is an honest best-effort guard,
    // not an absolute one-per-person guarantee.
    await env.LIKES_KV.put(rlKey, "1", { expirationTtl: RATE_WINDOW_SECONDS })

    const current = await readCount(env)
    const next = action === "like" ? current + 1 : Math.max(0, current - 1)
    await env.LIKES_KV.put("count", String(next))

    return json({ ok: true, count: next, liked: action === "like" })
  } catch (err) {
    console.error("[likes] POST failed:", err)
    return json({ ok: false, reason: "unavailable" }, 503)
  }
}

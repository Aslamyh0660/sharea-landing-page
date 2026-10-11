/**
 * Like-counter client.
 *
 * Contract (identical in local preview and in the Cloudflare Pages Function):
 *   GET  /api/likes            → { ok: true, count } | { ok: false, reason }
 *   POST /api/likes {action}   → { ok: true, count, liked } | { ok: false, reason }
 *     action: "like" | "unlike"
 *
 * Honesty rules:
 *  - the count always comes from the server; if the server is unreachable we
 *    show an explicit "unavailable" state and never invent a number;
 *  - localStorage only discourages repeat likes on this device — it is not a
 *    proof of "one person, one like" (the server also rate-limits per IP).
 */
import { LIKES_ENDPOINT, STORAGE } from "@/config"

export type LikeStatus = "loading" | "ready" | "unavailable"

export type LikesSnapshot = {
  status: LikeStatus
  count: number | null
  liked: boolean
}

export function readLocalLiked(): boolean {
  try {
    return localStorage.getItem(STORAGE.liked) === "1"
  } catch {
    return false
  }
}

function writeLocalLiked(liked: boolean) {
  try {
    if (liked) localStorage.setItem(STORAGE.liked, "1")
    else localStorage.removeItem(STORAGE.liked)
  } catch {
    // private mode / storage full: the server-side guard still applies
  }
}

async function parse(res: Response) {
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; count?: number; liked?: boolean; reason?: string }
    | null
  if (!res.ok || !data || data.ok !== true || typeof data.count !== "number") {
    return null
  }
  return data
}

export async function fetchLikes(): Promise<LikesSnapshot> {
  const liked = readLocalLiked()
  try {
    const res = await fetch(LIKES_ENDPOINT, { headers: { accept: "application/json" } })
    const data = await parse(res)
    if (!data) return { status: "unavailable", count: null, liked }
    return { status: "ready", count: data.count ?? 0, liked }
  } catch {
    return { status: "unavailable", count: null, liked }
  }
}

export async function sendLike(action: "like" | "unlike"): Promise<LikesSnapshot> {
  const liked = action === "like"
  try {
    const res = await fetch(LIKES_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    })
    const data = await parse(res)
    if (!data) return { status: "unavailable", count: null, liked: readLocalLiked() }
    const nowLiked = data.liked ?? liked
    writeLocalLiked(nowLiked)
    return { status: "ready", count: data.count ?? 0, liked: nowLiked }
  } catch {
    return { status: "unavailable", count: null, liked: readLocalLiked() }
  }
}

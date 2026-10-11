// Scratch: tune navy neutral chroma + gold tertiary tone for the Sharea theme
import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities"

const navy = Hct.fromInt(argbFromHex("#0F2A4A"))
const gold = Hct.fromInt(argbFromHex("#D4A24C"))
const goldLight = Hct.fromInt(argbFromHex("#F3D48A"))
const deep = Hct.fromInt(argbFromHex("#0A1C33"))
const warm = Hct.fromInt(argbFromHex("#F5EEDC"))
console.log("brand HCT:")
console.log(" navy  hue", navy.hue.toFixed(1), "chroma", navy.chroma.toFixed(1), "tone", navy.tone.toFixed(1))
console.log(" gold  hue", gold.hue.toFixed(1), "chroma", gold.chroma.toFixed(1), "tone", gold.tone.toFixed(1))
console.log(" goldL hue", goldLight.hue.toFixed(1), "chroma", goldLight.chroma.toFixed(1), "tone", goldLight.tone.toFixed(1))
console.log(" deep  hue", deep.hue.toFixed(1), "chroma", deep.chroma.toFixed(1), "tone", deep.tone.toFixed(1))
console.log(" warm  hue", warm.hue.toFixed(1), "chroma", warm.chroma.toFixed(1), "tone", warm.tone.toFixed(1))

const mdc = new MaterialDynamicColors()

function schemeFor(neutralChroma, nvChroma, isDark) {
  return new DynamicScheme({
    sourceColorHct: navy,
    contrastLevel: 0,
    isDark,
    specVersion: "2021",
    variant: Variant.TONAL_SPOT,
    primaryPalette: TonalPalette.fromHueAndChroma(navy.hue, Math.max(navy.chroma, 36)),
    tertiaryPalette: TonalPalette.fromHueAndChroma(gold.hue, Math.max(gold.chroma, 24)),
    neutralPalette: TonalPalette.fromHueAndChroma(navy.hue, neutralChroma),
    neutralVariantPalette: TonalPalette.fromHueAndChroma(navy.hue, nvChroma),
  })
}

const roles = (s) => {
  const out = {}
  for (const c of [...mdc.allColors, mdc.surfaceVariant(), mdc.surfaceTint(), mdc.shadow(), mdc.scrim()])
    out[c.name.replaceAll("_", "-")] = hexFromArgb(c.getArgb(s))
  return out
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const cr = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

for (const nc of [6, 10, 12, 14, 16, 20]) {
  const s = schemeFor(nc, nc + 4, true)
  const r = roles(s)
  console.log(
    `neutralChroma=${nc}`,
    "surface", r["surface"],
    "sc-low", r["surface-container-low"],
    "sc-high", r["surface-container-high"],
    "outline-variant", r["outline-variant"],
    "on-surface", r["on-surface"]
  )
}

console.log("\ngold palette tones (dark):")
const gpal = TonalPalette.fromHueAndChroma(gold.hue, Math.max(gold.chroma, 24))
for (const t of [70, 75, 80, 85, 87, 90, 92, 95]) {
  console.log(` tone ${t}: ${hexFromArgb(gpal.tone(t))}`)
}
console.log("brand goldLight #F3D48A tone in gold palette:", gpal.tone(goldLight.tone).toFixed(1), "(HCT tone", goldLight.tone.toFixed(1) + ")")

// contrast of candidate CTA pairs
for (const t of [80, 85, 87, 90]) {
  const bg = hexFromArgb(gpal.tone(t))
  for (const ot of [10, 20, 30]) {
    const fg = hexFromArgb(gpal.tone(ot))
    const ratio = cr(fg, bg).toFixed(2)
    if (ot === 20) console.log(`tertiary t${t} ${bg} vs on-tertiary t${ot} ${fg}: ${ratio}:1`)
  }
}

// what chroma reproduces #0A1C33 at its own tone?
const targetHct = deep
for (const nc of [8, 10, 12, 14, 16]) {
  const pal = TonalPalette.fromHueAndChroma(targetHct.hue, nc)
  const cand = hexFromArgb(pal.tone(Math.round(targetHct.tone)))
  console.log(`deep-navy hue chroma ${nc} @tone ${Math.round(targetHct.tone)} → ${cand}`)
}

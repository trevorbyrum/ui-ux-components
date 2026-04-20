/*
  DESIGN TOKENS — rebuilt from first principles per Color Design doc.
  
  Core ideas:
  - OKLCH throughout. No hex authoring.
  - Dark-first: :root IS dark. Light is the override.
  - Tinted neutrals: grays carry the accent hue at very low chroma (0.005–0.015)
  - Single accent, two lightness levels for dark/light parity.
  - 12-step scale (Radix-style semantic roles per step).
  - Near-black base at L≈0.14, never pure black.
  - Text: primary 0.93, secondary 0.72, tertiary 0.55. Never pure white.
  - Chroma peaks at 0.24–0.28 in the mid-range, not the anemic 0.16 I was using.
*/

// Max chroma varies by hue in sRGB gamut. Warm hues (yellow/orange)
// have much lower max chroma than cool hues at mid-lightness.
function maxChroma(hue) {
  // Approximate sRGB gamut boundary at L=0.5
  if (hue >= 50 && hue <= 110) return 0.20;  // yellow-green zone
  if (hue >= 30 && hue <= 50) return 0.22;   // orange zone
  if (hue >= 110 && hue <= 150) return 0.20; // green zone
  if (hue >= 0 && hue <= 30) return 0.20;    // red zone
  return 0.28;                                // blue-violet zone
}

function generateAccentScale(hue) {
  const mc = maxChroma(hue);
  // Scale chroma relative to the gamut-safe max for this hue
  const c = (ratio) => Math.min(mc, mc * ratio).toFixed(3);
  return {
    1:  `oklch(0.98 ${c(0.04)} ${hue})`,   // page bg tint
    2:  `oklch(0.96 ${c(0.08)} ${hue})`,   // subtle bg
    3:  `oklch(0.92 ${c(0.16)} ${hue})`,   // component bg
    4:  `oklch(0.86 ${c(0.32)} ${hue})`,   // component bg hover
    5:  `oklch(0.80 ${c(0.48)} ${hue})`,   // component bg active
    6:  `oklch(0.72 ${c(0.60)} ${hue})`,   // subtle border
    7:  `oklch(0.64 ${c(0.75)} ${hue})`,   // border, secondary fill
    8:  `oklch(0.56 ${c(0.90)} ${hue})`,   // solid fill hover
    9:  `oklch(0.50 ${c(1.00)} ${hue})`,   // solid fill — THE ACCENT
    10: `oklch(0.44 ${c(0.90)} ${hue})`,   // solid fill pressed
    11: `oklch(0.72 ${c(0.60)} ${hue})`,   // low-contrast text
    12: `oklch(0.88 ${c(0.32)} ${hue})`,   // high-contrast text
  };
}

function generateNeutralScale(hue) {
  // Neutrals tinted toward accent hue — subtle but cohesive
  // Chroma: 0.006–0.015 (barely perceptible, never pure gray)
  const c = 0.008; // base chroma tint
  return {
    1:  `oklch(0.99 ${c * 0.5} ${hue})`,
    2:  `oklch(0.97 ${c * 0.6} ${hue})`,
    3:  `oklch(0.94 ${c * 0.7} ${hue})`,
    4:  `oklch(0.91 ${c * 0.8} ${hue})`,
    5:  `oklch(0.87 ${c} ${hue})`,
    6:  `oklch(0.82 ${c} ${hue})`,
    7:  `oklch(0.72 ${c} ${hue})`,
    8:  `oklch(0.55 ${c * 1.2} ${hue})`,
    9:  `oklch(0.40 ${c * 1.2} ${hue})`,
    10: `oklch(0.28 ${c} ${hue})`,
    11: `oklch(0.20 ${c * 0.8} ${hue})`,
    12: `oklch(0.14 ${c * 0.6} ${hue})`,
    13: `oklch(0.10 ${c * 0.4} ${hue})`,
  };
}

function buildTheme(hue, mode) {
  const accent = generateAccentScale(hue);
  const neutral = generateNeutralScale(hue);
  const dark = mode === 'dark';

  return {
    // Raw scales for advanced use
    accent, neutral,

    // ─── Surfaces ───
    // Dark: base at L≈0.14 (neutral.12), raised at L≈0.20 (neutral.11)
    // Light: base at L≈0.99 (neutral.1), raised stays white
    pageBg:    dark ? `oklch(0.07 ${0.004 * 0.3} ${hue})` : neutral[2],
    surfaceBg: dark ? neutral[12] : neutral[1],
    raisedBg:  dark ? neutral[11] : neutral[1],
    subtleBg:  dark ? neutral[10] : neutral[3],

    // ─── Borders ───
    border:     dark ? `oklch(0.24 0.008 ${hue})` : neutral[4],
    borderSoft: dark ? `oklch(0.30 0.006 ${hue})` : neutral[3],

    // ─── Text ─── (never pure white, never pure black)
    fg1: dark ? `oklch(0.96 0.003 ${hue})` : `oklch(0.18 0.01 ${hue})`,
    fg2: dark ? `oklch(0.75 0.006 ${hue})` : `oklch(0.45 0.01 ${hue})`,
    fg3: dark ? `oklch(0.65 0.006 ${hue})` : `oklch(0.60 0.008 ${hue})`,

    // ─── Accent — single hue, role-appropriate lightness ───
    // Dark mode: lighter accent (step 7–8 for fills, 11–12 for text)
    // Light mode: darker accent (step 9–10 for fills)
    accentSolid:  dark ? accent[8]  : accent[9],
    accentHover:  dark ? accent[7]  : accent[8],
    accentActive: dark ? accent[9]  : accent[10],
    accentSubtle: dark ? `oklch(0.20 0.04 ${hue})` : accent[3],
    accentText:   dark ? accent[11] : accent[10],
    accentOnSolid: '#fff',  // always white on solid accent — dark or light

    // ─── Feedback (minimal — only when needed) ───
    success: `oklch(${dark ? 0.65 : 0.50} 0.22 145)`,
    error:   `oklch(${dark ? 0.55 : 0.50} 0.26 30)`,

    // ─── Constants ───
    radius: '5px',
    radiusLg: '8px',
    font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    hue, mode,
  };
}

Object.assign(window, { buildTheme, generateAccentScale, generateNeutralScale });

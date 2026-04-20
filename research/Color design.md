# Dark-first color design and how to make Claude respect it

**Claude's color defaults are now a documented problem with a documented fix.** Anthropic's own Frontend Design skill and Cookbook name the bias — "purple gradients on white backgrounds, Inter font, centered layouts" — and ship system prompts engineered to counter it. The larger design world has converged on the same aesthetic solution Claude struggles to reach alone: **dark-first interfaces, warm or neutral near-blacks instead of pure black, a single desaturated accent, and OKLCH-based token systems** that generate both themes from one definition. The gap between what top products look like (Linear, Vercel, Supabase, Anthropic's own site) and what Claude produces by default is not a matter of taste but of statistics: Claude samples the mean of public web code, and the mean was frozen in 2020 around Tailwind UI's `bg-indigo-500`. Closing that gap is a prompting problem with concrete mechanics, and most of this report is the instruction manual.

This report walks from the physics up: color-space fundamentals → palette methodology → contrast → modern trends → dark mode execution → Claude-specific prompting → token architecture that ties it all together. Every recommendation is sourced to first-party design system documentation, WCAG/APCA primary specs, or Anthropic's own engineering posts.

---

## 1. The color variables, and why most designers are using the wrong space

Every color can be described by four independent properties: **hue** (its identity on the wheel, 0–360°), **chroma or saturation** (how far it departs from gray), **lightness** (how bright it reads), and **alpha** (how much of the background shows through). The defining rule most designers get wrong is that **these four dimensions are only truly independent in perceptually uniform color spaces like OKLCH or CIELAB**. In HSL — the space CSS has used since 2003 and that Figma still defaults to — changing one variable silently warps the others.

The classic demonstration: `hsl(240 100% 50%)` (blue) and `hsl(60 100% 50%)` (yellow) have identical nominal lightness, but yellow's measured luminance is roughly **nine times higher**. White text on the blue passes WCAG; white on the yellow is unreadable. This is why the SASS `darken()` function is notorious for silently breaking accessibility — darkening a saturated blue by 10% doesn't do the same thing as darkening a saturated yellow by 10%. **HSL is a cylindrical wrapper around gamma-encoded sRGB with no reference to human vision.**

Chroma and saturation are not synonyms, and the distinction matters for systems. **Chroma is absolute** — the colorfulness of a patch judged against a similarly illuminated white — while **saturation is relative**, chroma divided by its own lightness. In OKLCH, maximum chroma varies per hue: a vivid yellow can reach ~0.4, a vivid blue caps around 0.31 in the sRGB gamut. This means a well-designed OKLCH palette has literal "gaps" in certain L/H combinations because those colors don't exist at that brightness — a feature, not a bug, because it forces designers to acknowledge the physical limits of the display instead of pretending every hue has equal range.

**OKLCH has won the next-generation color-space war.** Björn Ottosson's Oklab (December 2020) was designed specifically to fix CIELAB's blue hue-shift bug — where reducing chroma on a blue causes the hue to drift toward purple. It's adopted natively in Tailwind v4 (every default palette token is now OKLCH), in Radix Colors, in Photoshop's default gradient interpolation, in Unity and Godot, and as a W3C CSS Color Module 4 standard with full modern browser support since 2023. Authoring syntax looks like `oklch(70% 0.15 250)` — lightness 70%, chroma 0.15, hue 250° (blue). Evil Martians' `oklch.com` picker has become the standard tool.

The practical takeaways: **use OKLCH for authoring palettes, tokens, and gradients; use hex or sRGB only as output/fallback.** Use `color-mix(in oklch, ...)` for programmatic shades. Use the CSS Color 5 relative-color syntax for dark/light variants: `oklch(from var(--accent) calc(l + 0.2) calc(c * 0.6) h)` derives the dark-mode accent from the light-mode one in a single line. For wide-gamut displays (all modern iPhones since 2016, all MacBooks since 2015, most premium Androids and monitors), OKLCH colors with chroma above sRGB's ~0.31 cap automatically render in Display P3 — future-proofing identity to the ~50% larger P3 gamut and eventually Rec.2020 without rewriting any tokens.

---

## 2. Picking a palette without ending up with thirty-five slightly different blues

The classical color-wheel harmonies (monochromatic, analogous, complementary, split-complementary, triadic, tetradic) remain useful as a *starting relationship* between brand and accent, but Refactoring UI's warning is the rule to internalize: **you cannot build a real UI from five hex codes.** A working system needs eight to ten grays, five to ten shades of the primary, and five to ten shades of each accent — roughly forty to sixty tokens total. Color-wheel schemes tell you what relationship to pick; shade ladders tell you what to build.

The **60–30–10 rule** remains the practical compass: 60% dominant neutral for surfaces, 30% secondary neutral for structural elements (nav, cards, sidebars), 10% for the accent that signals action. Modern content-heavy SaaS (Notion, Linear) pushes this to 70–20–10, reserving color as a scarce resource. The stronger version of the rule, borrowed from Stripe's engineering blog on accessible color systems, is to **design grayscale first and apply color last** — if the hierarchy works without color, color carries information rather than decoration.

**Mature design systems converge on three to five key hues**: one primary/brand, one neutral family tuned to the brand's temperature, and two to three semantic colors (success, warning, danger/error). Each gets expanded into an 11- or 12-step ladder. Tailwind uses 50–950 (11 stops); Radix uses 1–12 (12 stops, each with an assigned semantic role). The Tailwind 50–950 numbering survived from Google Material specifically because it leaves numeric room for insertions, doesn't collide with percent scales, and yields perceptually even stops when plotted against lightness.

**Neutral construction is where brands establish temperature.** Warm grays (Tailwind `stone`, Radix `sand` or `olive`) carry a slight yellow or red tint and feel handmade, organic, editorial — Notion and Anthropic's brand sites use them. Cool grays (Tailwind `slate` or `zinc`, Radix `slate` or `mauve`) carry a slight blue tint and feel technical, sharp — Linear, Vercel, GitHub Primer use them. True neutrals (Tailwind `neutral`, Radix `gray`) are clinical and harder to make feel warm. Radix's opinionated move is to pair your accent with a tinted gray sharing the accent's hue — a green product gets `sage` neutrals, an orange product gets `sand` — "the difference is subtle, but creates a more colorful, harmonious vibe."

Making an **accent "pop" without clashing** is a two-lever problem: hue distance and controlled chroma. The accent should have roughly 3:1+ contrast with surrounding neutrals (so it reads as clickable), a text-on-accent version that passes 4.5:1, and lower chroma than your error color so destructive actions still feel more urgent than the default CTA. Almost all failure modes come from maxing out saturation — "don't let lightness kill your saturation, but don't let saturation kill your sensibility either."

**Leonardo, Radix, Huetone, Tailwind, and Material 3 are the five reference palette systems worth studying.** Leonardo generates palettes from *target contrast ratios*, inverting the usual pick-then-audit workflow. Radix's 12-step system is the most semantically rigorous (steps 1–2 for page backgrounds, 3–5 for component backgrounds at default/hover/pressed, 6–8 for borders, 9–10 for solid fills, 11–12 for low- and high-contrast text). Material 3 introduced `surfaceTint` overlays that blend primary color at increasing opacity as elevation rises — the elevation cue itself carries brand character. **Do not generate ramps algorithmically from a single hex**; Tailwind's own docs now say "we picked all of Tailwind's default colors by hand" because no current algorithm beats careful manual tuning at the extremes.

---

## 3. Contrast that creates hierarchy without being harsh

WCAG 2.1 is the legal baseline: **4.5:1 for normal body text, 3:1 for large text** (≥18pt or 14pt bold), with AAA requiring 7:1 and 4.5:1 respectively. **Non-text elements need 3:1** — this is the number for borders that are the only indicator of a component, for focus rings, for icon-only buttons. A common misremembering is that borders need only 1.5:1; that applies only when the border is purely decorative and the component is otherwise identified.

**WCAG's contrast math is broken for dark mode**, which is why APCA (Accessible Perceptual Contrast Algorithm, Andrew Somers) is the candidate replacement in WCAG 3. APCA returns a perceptual lightness contrast value (Lc, roughly −108 to +106), is polarity-aware (dark-on-light scores differently than light-on-dark), and accounts for font weight and size. Its thresholds map to real-world comfort: **Lc 60 ≈ WCAG 4.5:1 body text, Lc 75 preferred for body, Lc 90 for fine text.** APCA correctly flags "pure white on pure black" (21:1 in WCAG, but harsh and vibrating) and correctly fails orange on white (which WCAG 2 infamously passes despite being unreadable). APCA is not yet legally binding — WCAG 2.1 AA remains the compliance benchmark in the ADA, EU, UK, and Canada — but it is the best-practice target for dark mode in particular.

**Minimum contrast is a floor, not a target**, and the difference is what makes design feel considered. Radix codifies discrete contrast steps so a UI automatically has hierarchy: primary text at step 12 (Lc ~90), secondary at step 11 (Lc ~60), tertiary at the placeholder threshold (~4.5:1), disabled intentionally failing at ~3:1 (WCAG exempts disabled states under SC 1.4.3). A long-form reading interface should use ~12:1 body contrast, *not* pure black on pure white, because sustained reading at 21:1 causes fatigue and halation.

**Depth without harsh contrast comes from tonal elevation, not drop shadows.** Material Design 3's move — replacing white overlays with a surface-tint overlay derived from the primary color — means elevation itself becomes chromatic. Radix's alpha variants of gray let panels stack over colored backgrounds without harsh seams. The underlying rule, from Refactoring UI: **in dark mode, closer elements should still be lighter than distant ones** — preserve the depth relationship, just invert which end of the lightness scale is "far."

---

## 4. Why tech design stopped looking like SaaS and what it looks like now

The 2024–2026 consensus aesthetic across the design-forward tech sector can be summarized in one sentence: **typography and negative space carry the identity; color is rationed to a single accent.** The maximalist "brand gradient blob" era peaked with Stripe around 2020 and is now kept alive mostly by Stripe itself. Every major new product launch since 2023 has fallen into one of two camps, and they are sharply distinguished by temperature.

**Vercel-core** is the dominant camp: true monochrome (Vercel's Geist uses pure `#000`/`#FFF`), dark-first, cool-neutral, Swiss-inspired grids, Geist Sans + Geist Mono typography. Accents exist only as *semantic* scales (blue for info, red for error, green for success) — they are not brand expression. Conic gradients on rotating borders provide the one allowed visual flourish; radial halos behind 3D product mockups replace the old gradient-background blob. Linear sits at the refined edge of this camp with a desaturated indigo `#5E6AD2` used sparingly against near-black `#08090A`. Supabase uses a single precise green `#3ECF8E` against `#11181C`. Cursor, Neon, Railway, and most shadcn-based products are textbook Vercel-core. OpenAI's February 2025 rebrand dropped everything except Cod Gray `#080808` and white — the pure form.

**Anthropic-core / warm editorial** is the differentiated counter-camp: cream backgrounds (`~#F4F1EA`), serif display type (Anthropic uses custom Copernicus; others use Tiempos or Fraunces), a single terracotta or mustard accent, book-like reading rhythms. Anthropic's own terracotta `#DA7756` / `oklch(0.70 0.14 45)` is explicitly anti-neon, anti-blue, anti-AI-default. Notion, Val.town, and parts of the indie-web resurgence have joined this camp. The tension point for 2026–2027 is whether dev-tool startups (currently overwhelmingly Vercel-core) start adopting warm editorial as a differentiator; Resend's pink and Val.town's mustard are the early signals.

Both camps share five rules: **rejection of saturated SaaS blue/purple; restraint to a single accent; semantic-token color systems over decorative palettes; OKLCH and P3 colorspaces in the CSS; and near-neutral rather than cold blue-gray dark modes** — even "cold" dark modes are now barely-tinted rather than slate-blue. Mesh gradients didn't disappear but got subtler and technically smarter: Stripe's signature animated mesh runs as a ~10kb WebGL shader with noise-distorted plane geometry, tightly angled color stops, and layered noise — what reads as "sophisticated lighting" rather than decoration.

The defining technical moves across both camps are **near-black (never pure black) backgrounds, glow-based elevation instead of drop shadows, and conic-gradient borders as the one permitted flourish**:

| Company | Accent | Background | Temperature |
|---|---|---|---|
| Linear | `#5E6AD2` muted indigo | `#08090A` | Cool |
| Vercel | semantic only | `#000`/`#FFF` | True neutral |
| Anthropic | `#DA7756` terracotta | `~#F4F1EA` cream | **Warm** |
| Supabase | `#3ECF8E` green | `#11181C` | Cool dark |
| Raycast | `#FF6363` red | `#151515` | Cool dark |
| Notion | none persistent | `#FFFFFF` / `#E3E2DE` | **Warm** |
| Stripe | `#635BFF` + mesh | `#FFFFFF` | Cool |
| Neon | electric cyan-green | `~#0C0D0D` | OLED dark |

---

## 5. Dark mode as a first-class design problem

**Dark mode is not "invert the colors."** The physics of emitted light on a screen is the inverse of reflected light on paper, which changes the perceptual weight of every layer relationship. Three things break at once when you invert: elevation semantics reverse (on light paper, darker = further via shadow; on dark screens, lighter = closer because you can't cast a shadow on black); saturated brand colors become painful against black; and contrast ratios flip unpredictably. The correct process, per Material 3, Apple HIG, Polaris, Carbon, and Radix, is to design a **separate dark palette with its own lightness curve, desaturated accents, and layer model** — then bind both modes to semantic tokens so component code doesn't change.

**Never use pure `#000000`.** Four independent problems converge on it: OLED smearing (pixels are literally off, and scrolling causes visible ghosting — documented by Marc Edwards on Mastodon and by Apollo's developer); halation against white text (astigmatic users see the white bleeding into the black); no elevation headroom (you can't step down from black, and you can't cast a shadow on it); and excessive dynamic range against bright imagery. Material chose `#121212` specifically because it leaves room for 12–16% white overlays to stay perceptually distinct. Tailwind's `gray-950` is `oklch(0.129 0.042 264.695)`, GitHub Primer uses `#0d1117`, Linear uses a slightly warm near-black around `oklch(0.14 0.005 85)`. **The best-practice move is to set the base surface at L ≈ 0.13–0.18 with very low chroma (0.005–0.02) on your brand hue** — tinting rather than achromatic.

**Material's layered-gray elevation table is the canonical reference** for stacking surfaces in dark mode. Starting from `#121212` at base, overlay a white fill whose alpha rises with elevation: 5% at 1dp, 7% at 2dp, 8% at 3dp, 11% at 6dp, 12% at 8dp, 14% at 12dp, topping at 16% at 24dp. Material 3 replaced literal overlays with **tonal elevation** — higher surfaces blend in the primary color at low opacity, so elevation itself carries brand character.

**Accents need three simultaneous adjustments in dark mode: lightness boost, chroma reduction, hue preservation.** A brand accent authored at `oklch(50% 0.20 250)` for light mode becomes roughly `oklch(75% 0.12 250)` for dark — the identifying hue is the same, but lightness jumps from 50% to 75% while chroma drops from 0.20 to 0.12. Radix's dark scales are not numerical inverses of light; step 9 in the dark scale is perceptually brighter and less saturated. This mirrors what Linear wrote in their own engineering post about moving to LCH: "a red and a yellow color with lightness 50 will appear roughly equally light to the human eye" — only in perceptual spaces can you generate a dark-mode variant that preserves contrast guarantees.

**Text on dark backgrounds should never be pure white.** The production standard is primary text at ~`oklch(0.95 0.005 hue)` (≈ `#e6e6e6`), secondary at ~0.72, tertiary/placeholder at ~0.55, disabled at ~0.40. Hierarchy comes from different lightness when the surface is known, or from white-with-alpha when the surface varies. Material uses 87%/60%/38% alpha on white for primary/secondary/disabled. Radix codifies this as steps 11 and 12 with APCA Lc targets of 60 and 90 — deliberately below pure-white contrast to avoid halation.

**Shadows lose their physics in dark mode.** A darker shadow is nearly invisible against a dark base; a lighter shadow is not physically intuitive. The three working replacements are stronger more-diffuse shadows with 0.4–0.6 opacity (only on non-pure-black bases), **a 1px top-edge specular highlight** (`inset 0 1px 0 rgba(255,255,255,0.08)` mimicking light catching a surface edge), or Material 3's tonal elevation entirely. Glassmorphism in dark mode is a specific combination: 4–8% white fill, backdrop blur with `saturate(180%)` to compensate for chroma loss, and a 12%-white inner border at the top edge.

**Dark-first — not "dark as an afterthought" — is the defining strategic move.** Products built dark-first read as premium and designed; products built light-first with a dark variant read as having a bolted-on dark mode. Linear, Raycast, Warp, Vercel dashboard, GitHub, Supabase, and every major dev tool defaults to dark. The token-system expression of dark-first is to **declare dark as the `:root` default and light as an override**:

```css
:root {
  color-scheme: dark;
  --surface-base: oklch(0.14 0.006 260);
  --text-primary: oklch(0.95 0.005 260);
  --accent: oklch(0.75 0.12 250);
}
[data-theme="light"] {
  color-scheme: light;
  --surface-base: oklch(0.99 0.003 260);
  --text-primary: oklch(0.20 0.01 260);
  --accent: oklch(0.50 0.20 250);
}
```

A blocking inline `<script>` in `<head>` reads `localStorage` and sets `data-theme` before first paint to prevent flash-of-wrong-theme (Josh Comeau's "Quest for the Perfect Dark Mode" is the canonical write-up).

---

## 6. How Claude actually picks colors, and how to make it pick better ones

**Claude's purple-gradient-on-white bias is now officially acknowledged by Anthropic.** Adam Wathan's August 2025 tweet — "I'd like to formally apologize for making every button in Tailwind UI `bg-indigo-500` five years ago, leading to every AI generated UI on earth also being indigo" — went viral with 1M+ views, and Anthropic's own Frontend Design skill explicitly names the anti-pattern: *"clichéd color schemes, particularly purple gradients on white backgrounds."* Anthropic's term for the underlying mechanism is **"distributional convergence"** — during sampling, the model predicts tokens from statistical patterns in training data, and safe design choices that offend no one dominate the web corpus. Without direction, Claude samples the high-probability center: `bg-gray-50` background, `from-indigo-500 to-purple-600` gradient, Inter font, three feature cards in a centered grid, subtle rounded-2xl shadow.

The failure mode when you just tell Claude to "avoid purple" is that **it converges on the next-most-common default**. Anthropic's own Cookbook contains this self-aware line: *"You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box."* This is Anthropic acknowledging in their own prompt that Claude moves one step down the frequency distribution when told to avoid the primary default — Inter becomes Space Grotesk, indigo becomes a slightly different blue-purple. The fix is not negative constraints alone but **committed positive direction**.

**The three techniques Anthropic documents as working, in order of effectiveness:**

First, **commit to a bold aesthetic direction** and enumerate it. The Frontend Design skill's core instruction is *"Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined. CRITICAL: Choose a clear conceptual direction and execute it with precision."* Polite "please make it nice and modern" prompts produce slop; prompts that commit to "editorial warm-cream with terracotta accents and serif display type, single-accent, dark-first, no gradients" produce differentiated output.

Second, **specify colors in OKLCH and ideally in CSS custom properties**. Anthropic's leaked Claude Design system prompt reads: *"Color usage: try to use colors from brand / design system, if you have one. If it's too restrictive, use oklch to define harmonious colors that match the existing palette. Avoid inventing new colors from scratch."* Claude Design Phase 1 commits to a palette in OKLCH before writing code (e.g., `oklch(0.98 0.005 85)` background, `oklch(0.55 0.14 230)` single accent). **OKLCH constraints stick better than hex** because Claude has been trained through its internal skills on OKLCH semantics; hex colors are more likely to be interpreted loosely and substituted.

Third, **use XML tags in system prompts or CLAUDE.md files**, not plain user messages. Anthropic's own skills use tags like `<frontend_aesthetics>`, `<use_interesting_fonts>`, `<always_use_solarpunk_theme>`. The CLAUDE.md pattern persists design systems across every chat in a Claude Code project — this is the single most durable way to prevent default drift. System prompts dominate user prompts; persistent project files dominate both.

**A prompt template that consistently works**, distilled from Anthropic's own Cookbook:

```
<frontend_aesthetics>
Commit to a bold aesthetic direction. For this project:
- Dark-first. Base surface: oklch(0.14 0.006 260). Never pure black.
- Single accent: oklch(0.70 0.14 45) (terracotta). No secondary accents.
- Typography: [specific serif]; never Inter, Roboto, or Space Grotesk.
- No gradients except a single radial halo behind hero elements.
- Elevation via tonal overlays, not drop shadows.
- Text hierarchy: oklch(0.95 0.005 260) primary, 0.72 secondary, 0.55 tertiary.
- All colors authored as CSS custom properties; components reference tokens only.

AVOID generic AI defaults:
- Purple-to-pink or blue-to-indigo gradients
- White or gray-50 backgrounds  
- Three-feature-card centered-grid hero layouts
- Pure #000 or pure #fff text/backgrounds
- Multiple competing accent colors
</frontend_aesthetics>
```

**What doesn't work reliably:** naming a reference without constraints ("design in the style of Linear") produces a weak shift because Claude has no grounded visual model of Linear specifically — it has a statistical average of "design-forward dev tools," which is itself slop-adjacent. Dumping a design-token JSON without usage rules also underperforms: Claude gets the palette but makes bad choices about which token goes where. The missing piece is *judgment* — rules like "one accent color; everything else grayscale" — not just values.

**Constraints degrade over long sessions.** Anthropic's harness-design post notes "context anxiety" in Sonnet 4.5: after context compaction, generic aesthetic defaults re-emerge. The practical implication is to re-inject the `<frontend_aesthetics>` block periodically in long sessions, or to keep it in a CLAUDE.md at the project root where it's refreshed every turn.

**Feature-specific notes.** Claude Artifacts default to React 18 + Tailwind + shadcn/ui + Lucide + Recharts — the environment itself biases toward a Tailwind aesthetic. Simon Willison's workaround ("I start most of my prompts with 'no react'") shifts the medium. Anthropic's own web-artifacts-builder skill carries this instruction verbatim: *"VERY IMPORTANT: To avoid what is often referred to as 'AI slop', avoid using excessive centered layouts, purple gradients, uniform rounded corners, and Inter font."* Claude Code v2.1's `/frontend-design` slash command triggers the BOLD-aesthetic preamble on demand. Claude Design (Anthropic Labs, powered by Claude Opus 4.7) reads codebases and extracts brand tokens automatically — the most hands-off option but heavy on usage quota.

**Anthropic's own terracotta brand does not bleed into Claude's defaults.** The defaults remain indigo/purple because they trace to training-data statistics, not Anthropic's brand. The Anthropic Branding skill applies the peach/cream/Crail palette only when explicitly invoked.

---

## 7. Design tokens as the bridge between theory and AI-generated code

Design tokens are the mechanism that makes every preceding recommendation enforceable, versionable, and consumable by AI tools. **The three-tier system — primitives, semantic tokens, component tokens — is the mature consensus** across Shopify Polaris, GitHub Primer, Adobe Spectrum, Atlassian, and IBM Carbon.

**Primitives are the raw palette atoms:** `gray-50` through `gray-950`, `blue-500`, `red-600`. They have no meaning, only values. Their job is to collapse infinite color possibilities to a finite intentional set, ending the "35 slightly different blues" problem. Tailwind v4's entire default palette is now expressed as OKLCH primitives in a `@theme` block.

**Semantic tokens are the pivot layer and the most important of the three:** `color.surface.primary`, `color.text.secondary`, `color.border.subtle`, `color.interactive.accent`, `color.feedback.error`. They reference primitives but describe *where and why*. The reason teams with a strong semantic layer can rebrand in a week while others take months is that dark mode, theming, and rebrands all happen at this layer — `color.surface.primary` re-points from `gray-50` to `gray-950` between themes and every component updates automatically. **The semantic name survives events that would break a literal name**: a rebrand from blue to green leaves `--color-interactive-accent` intact; `--blue-500` becomes nonsense.

**Component tokens solve self-service consistency:** `button.primary.background.hover`, `card.elevated.surface`, `input.border.focus`. They reference semantic tokens (occasionally skipping to primitives). Their name carries enough context that an engineer — or an LLM — implementing a CTA button doesn't have to interpret which semantic token applies. Nate Baldwin's Adobe Spectrum work documents that component-level tokens let patch updates cascade to all frameworks without repeat-tasks. The resolution chain: `button.primary.background.hover → color.interactive.accent.hover → blue.600 → oklch(0.577 0.245 255)`.

**The W3C Design Tokens Format Module reached its first stable specification (2025.10) in October 2025**, giving the community a vendor-neutral JSON format with `$value`, `$type`, `$description`, aliasing via `{token.path}` references, and native Display P3 and OKLCH support. Style Dictionary, Tokens Studio for Figma, and Terrazzo are the reference implementations. **The `$description` field is specifically valuable for AI tooling** — when an LLM reads a token file with descriptions like *"App background. Use for the outermost page container. Never use raw hex values; always reference this token,"* it produces substantially better output than when it reads a bare palette.

**The naming convention that works best with AI is `{namespace}-{category}-{property}-{variant}-{state}`** — Polaris's `--p-color-bg-surface-brand-hover`, Spectrum's `--spectrum-button-cta-background-color-hover`, DTCG's `$button.primary.backgroundColor.hover`. Four rules compound into self-documenting tokens: intent in the name (not color values), state as a suffix (`.hover`, `.active`, `.focus`, `.disabled`), element-role-prominence-state as the slot order, and `$description` metadata for usage rules. Claude reading a well-documented DTCG file will pick `var(--color-surface-primary)` over `#0a0a0a` because the description makes the intent unambiguous.

**The minimum viable dark-first token system** looks like this:

```css
:root { /* primitives */
  --gray-50: oklch(0.984 0.003 260);
  --gray-500: oklch(0.554 0.046 260);
  --gray-950: oklch(0.129 0.042 260);
  --accent-400: oklch(0.75 0.12 255);
  --accent-600: oklch(0.55 0.22 255);
}

:root { /* dark semantic — the base */
  color-scheme: dark;
  --color-surface-base: var(--gray-950);
  --color-text-primary: oklch(0.95 0.005 260);
  --color-border-subtle: oklch(0.28 0.006 260);
  --color-accent: var(--accent-400);
}

[data-theme="light"] { /* light override */
  color-scheme: light;
  --color-surface-base: var(--gray-50);
  --color-text-primary: oklch(0.20 0.01 260);
  --color-border-subtle: oklch(0.90 0.006 260);
  --color-accent: var(--accent-600);
}

/* component tokens */
:root {
  --button-primary-bg: var(--color-accent);
  --card-bg: var(--color-surface-base);
  --card-border: var(--color-border-subtle);
}
```

Pair this with a `CLAUDE.md` at the project root that names the tokens and the usage rules, and the purple-gradient problem largely goes away — Claude writes `background: var(--color-surface-base)` instead of guessing `bg-slate-50`, and the whole system inherits dark-first correctness.

---

## Closing synthesis

The threads converge on a single, non-obvious claim: **the best modern tech design and the best prompts for Claude are the same thing.** Both demand commitment to a bold direction rather than safe averages; both require expressing color in a perceptually uniform space (OKLCH) so that derivation and theming stay predictable; both treat color as a scarce resource with a single accent rather than a decorative free-for-all; both refuse pure black and pure white in favor of tinted near-blacks and off-whites; both pivot through a semantic token layer that makes dark/light/rebrand flips a single-file change; and both acknowledge that the default — unguided — is slop.

The leverage points have changed with the tooling. Five years ago the differentiator was *knowing* dark mode isn't inversion. Today that's table stakes; the differentiator is **authoring in OKLCH, committing to dark-first as the base rather than the variant, and structuring tokens with enough semantic density that AI coding assistants produce correct output on first pass.** Anthropic's own response to Claude's design weaknesses — the Frontend Design skill, the OKLCH-first Claude Design system, the `<frontend_aesthetics>` prompt pattern — is itself an endorsement of this stack: the company built the model's design defense around the same primitives (OKLCH, bold aesthetic commitment, semantic tokens, XML-tagged system prompts, CLAUDE.md persistence) that the rest of the industry arrived at independently.

The practical upshot for anyone designing a new product in 2026: build a 12-step OKLCH neutral scale tinted toward your brand hue, pair it with one accent at two lightness levels for dark/light parity, commit to dark-first with `:root` as dark and `[data-theme="light"]` as the override, express everything as semantic CSS custom properties with description-bearing DTCG JSON as the source of truth, and ship a `CLAUDE.md` or equivalent system prompt that enumerates both the positive constraints and the AI defaults to avoid. Everything from WCAG contrast to wide-gamut future-proofing to Claude's purple problem falls out of this structure as a side effect rather than a separate problem to solve.
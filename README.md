# ui-ux-components

A design-token-driven React component kit with exploration docs and UI/UX research.

**Core ideas**
- OKLCH color throughout — no hex authoring
- Dark-first — `:root` is dark, light is the override
- Tinted neutrals — grays carry the accent hue at very low chroma
- Single accent, gamut-aware max chroma per hue
- 12-step Radix-style semantic scale

## Layout

```
src/         React component source (JSX)
  tokens.jsx           design token generator (OKLCH scales)
  components.jsx       core components (Button, Card, Input, etc.)
  components-extra.jsx extended components
  design-canvas.jsx    demo canvas wiring tokens + components

docs/        HTML design exploration (open in a browser)
  Design System.html
  Color Strategies.html
  Component Variations.html
  Palette Strategies.html, Palette Strategies v2.html
  Style Exploration.html, Style Exploration v2.html
  Style Directions - Research-Informed.html
  Refined Directions.html
  Modern Tech Directions.html
  Hue Exploration.html
  Accent Options.html
  Finalists.html

research/    Source research and notes
  Color design.md
  Modern UI_UX_Research.md
  Psychological UI_UX Research.md
  Screenshot *.png
```

## Using the components

The `.jsx` files are authored in Claude-artifact style — they reference `React` as a global and do not use `import`/`export`. To consume them in a standard React app:

1. Add `import React from 'react';` and `export { Button, Card, ... };` at the bottom of each file.
2. Wire `tokens.jsx` to produce a theme object, pass it via prop or a `ThemeContext`.
3. Each component expects a `theme` prop containing at least: `mode`, `hue`, `pageBg`, `fg1`, `fg2`, `accentSolid`, `accentOnSolid`, `accentText`, `surfaceBg`, `subtleBg`.

## Viewing the design docs

Open any file in `docs/` directly in a browser — they are self-contained HTML with inline styles.

## License

MIT — see [LICENSE](LICENSE).

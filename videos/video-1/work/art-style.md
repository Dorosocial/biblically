# Art style — channel reference (Bible teaching, faceless)

> Read by `/make-visuals` every session. This is the fixed style contract every Wavespeed prompt
> must carry — do not let any beat drift from this, even for a beat that "needs more detail."

**Generator:** Wavespeed MCP (already connected in Claude Code). Not ChatGPT Image.

## Style requirements

Extremely simple drawings that look like **MS Paint sketches made by someone who is not good at
drawing** — quick, hand-done, amateur on purpose.

- White background
- Thick, uneven black outlines; wobbly hand-drawn lines
- Figures: round heads, line bodies (stickman-adjacent, not anatomically detailed)
- Simple dot/line eyes, very basic facial expressions
- Flat colors only — no shading, no gradients
- Basic shapes for objects: squares, circles, rectangles, arrows, simple tables, boxes, trees,
  rooms, signs, screens, question marks, simple symbols

**Explicitly avoid:** 3D, cinematic lighting, realistic cartoon style, Disney style, anime style,
polished/vector illustration, highly detailed backgrounds, complex textures, realistic humans,
glossy/modern design. The point is that it looks intentionally simple and a little "bad" — never
polished.

## Visual language

- Simple black line drawings, mostly white empty space
- Occasional flat colors: green, brown, gray, red, yellow, orange, blue
- Red arrows / red question marks for emphasis when the line calls for it
- Handwritten-style text only when it clarifies the beat — must be spelled correctly, short, easy
  to read
- Compositions stay clear and simple — no clutter

## Format

- 16:9 horizontal, full-bleed YouTube frame — never vertical or square
- Clean, readable, centered; don't crop important objects; leave breathing room around figures
- Avoid glitches, broken anatomy, unreadable text, messy overlapping objects, extra unwanted detail

## Per-beat prompt template

Every Wavespeed prompt = this fixed block + the one-line scene description for that beat only:

```
Extremely simple MS-Paint-style doodle drawing, white background, thick uneven black outlines,
wobbly hand-drawn lines, round-headed stickman-style figures, simple dot eyes, flat colors only
(green/brown/gray/red/yellow/orange/blue), no shading, no 3D, no realistic or polished style,
amateur hand-drawn look, 16:9 horizontal composition, centered, clean and readable.

Scene: <ONE beat-specific line — what's happening in THIS beat only, nothing from before or after>
```

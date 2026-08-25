# Black Hole / Accretion Disk / Spacetime Grid — Visual Reference Spec

Canonical design for these three recurring objects, reusable across videos
(first built for "What If Our Entire Universe Is Inside a Black Hole?").
Every shot in every video that shows "the black hole," "the accretion
disk," or "the spacetime grid" should render using this exact design —
same proportions, same color gradient, same lensing behavior — just viewed
from different distances/angles, not a simplified placeholder per-shot.

## The black hole (event horizon)

- A perfectly black sphere, razor-sharp high-contrast edge — no gradient
  or fuzziness at the silhouette boundary (real event horizons have an
  absolute edge).
- A thin, extremely bright ring hugging the silhouette directly — the
  "photon ring" (light that orbited the hole before escaping). This is the
  single brightest, sharpest element in the scene, distinctly brighter
  than the accretion disk itself.
- Scale: the horizon should feel genuinely massive in wide/establishing
  shots — not a small ball — with the disk extending well beyond it on
  both sides.

## The accretion disk

- NOT a smooth clean torus. Turbulent: visible swirling, streaky, uneven
  density/brightness around the ring, not a uniform band.
- Radius roughly 3-5x the horizon's radius — clearly larger than the black
  hole it surrounds.
- Color gradient, physically motivated (not a flat orange): innermost
  edge (hottest) = white/blue-white, outward through yellow, then orange,
  to deep red at the outer edge. The gradient must read clearly, not a
  single hue.
- Tilt: roughly 20-30° relative to the default camera view — not edge-on,
  not face-on — this is what shows off the lensing arcs below.
- THE KEY EFFECT — gravitational lensing: light from the far side of the
  disk (physically behind the hole from the camera) bends around and
  appears as a glowing arc ABOVE and BELOW the black sphere's silhouette.
  This is the Interstellar-Gargantua / EHT-M87 signature — the disk wraps
  over and under the sphere, not just flat-around it.

## Spacetime grid

- A large, glowing grid plane in a distinct, high-contrast color (not
  faint gray).
- Near a mass (black hole, star, Earth), the grid visibly funnels/indents
  into a smooth curved well — the "rubber sheet" gravity well — as a real
  3D deforming surface, not a flat texture trick.
- Funnel steepness scales with the represented mass/density: a black
  hole's well is dramatically steep/deep (near-vertical near center); a
  star's or Earth's is a much gentler, shallower dip.
- Grid lines stay legible even curving into the funnel — don't let them
  compress into an unreadable tangle at the center; fade opacity gradually
  toward the deepest point rather than rendering a solid mass of
  overlapping lines.

## Implementation notes (this codebase)

- `src/shared/BlackHole.tsx` implements the horizon + photon ring + disk +
  lensing arcs above. Superseded `src/blackhole/scene/BlackHole.tsx` (the
  earlier, simpler design from "Scientists Are Terrified of This Black
  Hole") — that file is left as-is so the earlier short isn't affected;
  new work should use `shared/BlackHole.tsx`.
- `src/shared/SpacetimeGrid.tsx` implements the funnel via a real per-vertex
  Y-displacement (not a texture), with `wellDepth`/`wellRadius` controlling
  steepness and a center-fade so the deepest, most-compressed lines don't
  read as a tangle.

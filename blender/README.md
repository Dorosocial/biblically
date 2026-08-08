# Blender assets

Scripts for generating/importing scenes with Blender, run headlessly via
Blender's Python API (`bpy`).

## Cube

- `create_cube.py` — creates a cube at the origin and saves it to a `.blend` file.
- `render_cube.py` — adds a camera/light (if missing) and renders the scene to a PNG.
- `cube.blend` — the generated scene containing the cube.
- `cube_render.png` — a preview render of the cube.

```sh
# Create the cube scene
blender --background --python create_cube.py -- cube.blend

# Render a preview image
blender --background cube.blend --python render_cube.py -- cube_render.png
```

## Magnet model

- `magnet_model/` — source glTF asset (`scene.gltf`, `scene.bin`) downloaded from
  Sketchfab; see `magnet_model/license.txt` for attribution/license (Sketchfab
  Standard — free for commercial/non-commercial use with attribution to the
  author, Ali Arcan Akgün).
- `import_magnet.py` — imports a glTF file into a clean Blender scene and
  saves it as a `.blend` file.
- `magnet_model.blend` — the imported scene.
- `render_magnet.py` — auto-frames all mesh objects, adds a camera/light if
  missing, and renders the scene to a PNG.
- `magnet_render.png` — a preview render of the magnet model.

```sh
# Import the glTF model into a new .blend scene
blender --background --python import_magnet.py -- magnet_model/scene.gltf magnet_model.blend

# Render a preview image
blender --background magnet_model.blend --python render_magnet.py -- magnet_render.png
```

Note: Blender's bundled Python needs `numpy` for the glTF importer
(`apt install python3-numpy` on Debian/Ubuntu, since Blender uses the system
Python here).

## HDRI world lighting

- `hdri/studio.exr` — equirectangular HDRI (4096×2048) used to light scenes.
- `setup_hdri_lighting.py` — wires the World's node tree as
  `Environment Texture (HDRI) -> Background -> World Output`, so both the
  lighting and the background reflect the HDRI. Image is stored as a
  blend-relative path (`//hdri/studio.exr`) so it stays portable with the repo.
- `magnet_model_hdri.blend` — the magnet scene with HDRI world lighting applied.
- `magnet_hdri_render.png` — a preview render showing the HDRI-lit magnet.

```sh
# Apply HDRI world lighting to an existing scene
blender --background magnet_model.blend --python setup_hdri_lighting.py -- hdri/studio.exr magnet_model_hdri.blend [strength]

# Render a preview image
blender --background magnet_model_hdri.blend --python render_magnet.py -- magnet_hdri_render.png
```

## Studio backdrop (infinity cove)

- `setup_studio_backdrop.py` — builds a curved "infinity cove" backdrop (floor
  smoothly curving into a wall, no visible seam) with a dark grid material, and
  adds it to the scene.
- `compose_studio_scene.py` — arranges the subject on the backdrop: rotates
  the cove so its floor faces the camera's preferred side, lifts the subject
  to rest on the floor (instead of clipping through it, since the imported
  model's origin isn't at its base), and frames a camera on the *subject*
  rather than the whole (much larger) backdrop.
- `render_studio_scene.py` — renders using the scene's already-configured
  camera, without re-framing (re-framing on the full scene bounding box would
  zoom out to fit the backdrop and shrink the subject to a speck).
- `magnet_scene_with_backdrop.blend` — the composed scene.
- `studio_scene_render.png` — a preview render.

```sh
# Build the backdrop
blender --background magnet_model_hdri.blend --python setup_studio_backdrop.py -- --output magnet_scene_with_backdrop.blend

# Arrange the subject + camera on it
blender --background magnet_scene_with_backdrop.blend --python compose_studio_scene.py -- --output magnet_scene_with_backdrop.blend

# Render a preview image
blender --background magnet_scene_with_backdrop.blend --python render_studio_scene.py -- studio_scene_render.png
```

## Magnet levitation animation

A 5-second (150 frames @ 30fps), 1920x1080 animation of one magnet falling
and settling into a hover above another, with a cinematic camera push-in.
Built on a copy of `magnet_model_hdri.blend` (no studio backdrop - see
below for why) using **Blender 5.2.0 LTS**, not the apt-installed 4.0.2:
that version predates EEVEE Next / ray tracing, and its Action API differs
(pre-4.4 `action.fcurves` vs. the newer layered
`action.layers[].strips[].channelbags[].fcurves`, which the scripts below
handle via a compatibility shim).

- `setup_levitation.py` — duplicates the magnet into `BottomMagnet` (world
  origin) and `TopMagnet`, then animates `TopMagnet` falling and settling
  into a hover above `BottomMagnet` with a decaying bounce. Uses Blender's
  Bounce/EaseOut easing between exactly two keyframes (start height, hover
  height) - this interpolation is a convex blend of the two values, so it's
  mathematically guaranteed to never overshoot past the hover height, i.e.
  the magnets can never touch.
- `setup_levitation_camera.py` — aims the camera at the gap between the two
  magnets and animates a slow push-in. The safe framing distance is derived
  from the camera's actual field of view at the target resolution, not a
  guessed constant.
- `setup_levitation_render_settings.py` — sets the render engine to EEVEE
  Next (`BLENDER_EEVEE` is the only/renamed EEVEE identifier from Blender
  4.2 onward) with `use_raytracing` enabled, 1920x1080 resolution, and a
  subtle depth-of-field (f/2.8, focused on the gap). Sample count is tuned
  down from EEVEE's 64 default to 32, since this environment has no GPU and
  EEVEE Next's ray tracing runs on CPU software rasterization - 32 was
  visually indistinguishable from 64 in test renders of this scene.
- `render_levitation_animation.py` — renders the animation as a PNG
  sequence. **Not** an FFMPEG/MP4 direct render: this Blender build's
  `image_settings.file_format` rejects `'FFMPEG'` at assignment time
  (`TypeError`) despite `bpy.app.build_options.codec_ffmpeg` reporting
  `True` - the runtime enum excludes it in this environment regardless.
- `encode_video.sh` — muxes the PNG sequence into an MP4 (H.264) with a
  standalone `ffmpeg` binary, sidestepping Blender's muxer entirely.
- `magnet_levitation.blend` — the built scene.
- `magnet_levitation.mp4` — the final rendered video.

Why no studio backdrop: placing `BottomMagnet` at the literal world origin
(0,0,0), as requested, puts it exactly where the studio cove's curve peaks
at its maximum height - geometrically hidden from any front-facing camera
on the open floor side (confirmed by tracing the camera ray against the
curve's profile). Rather than move the magnet off the requested coordinate
or fight the backdrop's geometry, this scene drops the backdrop and keeps
just the HDRI environment lighting.

```sh
# All scripts below assume a Blender 4.2+ build (this repo used 5.2.0 LTS,
# installed separately since the apt package here is 4.0.2). Substitute
# your own `blender` binary path.
BLENDER=/opt/blender-5.2.0/blender

# 1: duplicate + fall/settle animation
$BLENDER --background magnet_model_hdri.blend --python setup_levitation.py -- --output magnet_levitation.blend

# 2: camera push-in
$BLENDER --background magnet_levitation.blend --python setup_levitation_camera.py -- --output magnet_levitation.blend

# 3: render engine / resolution / DOF
$BLENDER --background magnet_levitation.blend --python setup_levitation_render_settings.py -- --output magnet_levitation.blend

# 4: render PNG sequence, then mux to MP4
mkdir -p frames
$BLENDER --background magnet_levitation.blend --python render_levitation_animation.py -- --output frames/frame_
./encode_video.sh frames/frame_ magnet_levitation.mp4 30
```

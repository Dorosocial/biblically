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

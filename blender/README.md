# Blender cube

Scripts for generating a simple cube scene with Blender, run headlessly via
Blender's Python API (`bpy`).

- `create_cube.py` — creates a cube at the origin and saves it to a `.blend` file.
- `render_cube.py` — adds a camera/light (if missing) and renders the scene to a PNG.
- `cube.blend` — the generated scene containing the cube.
- `cube_render.png` — a preview render of the cube.

## Usage

```sh
# Create the cube scene
blender --background --python create_cube.py -- cube.blend

# Render a preview image
blender --background cube.blend --python render_cube.py -- cube_render.png
```

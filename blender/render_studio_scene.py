"""
render_studio_scene.py
Renders the current scene using its already-configured camera (set up by
compose_studio_scene.py). Unlike render_magnet.py / render_cube.py, this
does not auto-frame on the scene's bounding box, since that would include
the large studio backdrop and zoom out past the subject.

Usage:
    blender --background <input.blend> --python render_studio_scene.py -- <output.png>
"""
import sys
import bpy

argv = sys.argv
output_path = "render.png"
if "--" in argv:
    extra_args = argv[argv.index("--") + 1:]
    if extra_args:
        output_path = extra_args[0]

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1000
scene.render.resolution_y = 750
scene.render.filepath = output_path
bpy.ops.render.render(write_still=True)
print(f"Rendered preview to {output_path}")

"""
Blender script: renders the cube scene to a PNG for a quick visual check.

Usage:
    blender --background <input.blend> --python render_cube.py -- <output.png>
"""
import sys
import bpy
import math

# Add a camera and light if the scene doesn't already have them.
if not bpy.data.objects.get("Camera"):
    bpy.ops.object.camera_add(location=(4, -4, 3), rotation=(math.radians(63), 0, math.radians(45)))
    bpy.context.scene.camera = bpy.context.active_object

if not bpy.data.objects.get("Light"):
    bpy.ops.object.light_add(type="SUN", location=(4, -4, 6))

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 800
scene.render.resolution_y = 600

argv = sys.argv
output_path = "cube_render.png"
if "--" in argv:
    extra_args = argv[argv.index("--") + 1:]
    if extra_args:
        output_path = extra_args[0]

scene.render.filepath = output_path
bpy.ops.render.render(write_still=True)
print(f"Rendered cube preview to {output_path}")

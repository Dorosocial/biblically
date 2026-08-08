"""
Blender script: frames all objects in view, adds a camera/light if missing,
and renders the scene to a PNG.

Usage:
    blender --background <input.blend> --python render_magnet.py -- <output.png>
"""
import sys
import bpy
import math
from mathutils import Vector

argv = sys.argv
output_path = "render.png"
if "--" in argv:
    extra_args = argv[argv.index("--") + 1:]
    if extra_args:
        output_path = extra_args[0]

# Compute the bounding box center/radius of all mesh objects to frame the camera.
meshes = [o for o in bpy.data.objects if o.type == "MESH"]
if not meshes:
    raise SystemExit("No mesh objects found in the scene.")

coords = []
for obj in meshes:
    for corner in obj.bound_box:
        coords.append(obj.matrix_world @ Vector(corner))

min_v = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
max_v = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
center = (min_v + max_v) / 2
radius = max((max_v - min_v).length / 2, 0.01)

if not bpy.data.objects.get("Camera"):
    cam_data = bpy.data.cameras.new("Camera")
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
else:
    cam_obj = bpy.data.objects["Camera"]

distance = radius * 3.5
cam_obj.location = center + Vector((distance, -distance, distance * 0.7))
direction = center - cam_obj.location
cam_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

if not bpy.data.objects.get("Light"):
    light_data = bpy.data.lights.new("Light", type="SUN")
    light_data.energy = 3
    light_obj = bpy.data.objects.new("Light", light_data)
    bpy.context.collection.objects.link(light_obj)
    light_obj.location = center + Vector((distance, -distance, distance))

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 800
scene.render.resolution_y = 600
scene.render.filepath = output_path
bpy.ops.render.render(write_still=True)
print(f"Rendered preview to {output_path}")

"""
Blender script: creates a simple cube and saves the scene.

Usage:
    blender --background --python create_cube.py -- <output.blend>
"""
import sys
import bpy

# Start from a clean scene.
bpy.ops.wm.read_factory_settings(use_empty=True)

# Add a cube at the origin.
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "Cube"

# Resolve output path passed after "--".
argv = sys.argv
output_path = "cube.blend"
if "--" in argv:
    extra_args = argv[argv.index("--") + 1:]
    if extra_args:
        output_path = extra_args[0]

bpy.ops.wm.save_as_mainfile(filepath=output_path)
print(f"Saved cube scene to {output_path}")

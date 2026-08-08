"""
Blender script: imports a glTF model and saves the scene.

Usage:
    blender --background --python import_magnet.py -- <input.gltf> <output.blend>
"""
import sys
import bpy

argv = sys.argv
extra_args = argv[argv.index("--") + 1:] if "--" in argv else []
if len(extra_args) < 2:
    raise SystemExit("Usage: blender --background --python import_magnet.py -- <input.gltf> <output.blend>")

input_path, output_path = extra_args[0], extra_args[1]

# Start from a clean scene.
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import the glTF model.
bpy.ops.import_scene.gltf(filepath=input_path)

imported = bpy.context.selected_objects
print(f"Imported {len(imported)} object(s): {[o.name for o in imported]}")

bpy.ops.wm.save_as_mainfile(filepath=output_path)
print(f"Saved scene with magnet model to {output_path}")

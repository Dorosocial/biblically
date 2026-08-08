"""
Blender script: sets up world lighting using an HDRI environment texture.

Wires up the World's shader nodes as:
    Environment Texture (HDRI) -> Background -> World Output
and enables the world for both viewport/render visibility.

Usage:
    blender --background <input.blend> --python setup_hdri_lighting.py -- <hdri.exr> <output.blend> [strength]
"""
import os
import sys
import bpy

argv = sys.argv
extra_args = argv[argv.index("--") + 1:] if "--" in argv else []
if len(extra_args) < 2:
    raise SystemExit(
        "Usage: blender --background <input.blend> --python setup_hdri_lighting.py "
        "-- <hdri.exr> <output.blend> [strength]"
    )

hdri_path = extra_args[0]
output_path = extra_args[1]
strength = float(extra_args[2]) if len(extra_args) > 2 else 1.0

# Ensure the scene has a World, and give it a fresh node tree.
world = bpy.context.scene.world
if world is None:
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world

world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links
nodes.clear()

output_node = nodes.new(type="ShaderNodeOutputWorld")
output_node.location = (300, 0)

background_node = nodes.new(type="ShaderNodeBackground")
background_node.location = (0, 0)
background_node.inputs["Strength"].default_value = strength

env_node = nodes.new(type="ShaderNodeTexEnvironment")
env_node.location = (-400, 0)
hdri_image = bpy.data.images.load(os.path.abspath(hdri_path))
# Store the path relative to the saved .blend so it stays portable alongside the repo.
hdri_image.filepath = bpy.path.relpath(hdri_image.filepath, start=os.path.dirname(os.path.abspath(output_path)))
env_node.image = hdri_image

links.new(env_node.outputs["Color"], background_node.inputs["Color"])
links.new(background_node.outputs["Background"], output_node.inputs["Surface"])

# Make sure the HDRI actually lights the scene in both engines.
bpy.context.scene.render.film_transparent = False

bpy.ops.wm.save_as_mainfile(filepath=output_path)
print(f"World lighting set up with HDRI '{hdri_path}' (strength={strength}); saved to {output_path}")

"""
setup_studio_backdrop.py
Builds a curved "infinity cove" studio backdrop (floor smoothly curving into
a wall, no visible seam) with a dark grid-pattern material, and adds it to
the existing magnet scene alongside the HDRI world lighting already set up.

Run headless, pointed at the existing blend file:
  blender --background blender/magnet_model_hdri.blend --python setup_studio_backdrop.py -- \
      --output blender/magnet_scene_with_backdrop.blend
"""

import bpy
import sys
import math
from pathlib import Path


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "grid_color": (0.08, 0.09, 0.11)}
    i = 0
    while i < len(argv):
        key = argv[i].lstrip("-").replace("-", "_")
        if key in args and i + 1 < len(argv):
            args[key] = argv[i + 1]
            i += 2
        else:
            i += 1
    return args


ARGS = parse_args()


def build_studio_backdrop(width=16.0, floor_depth=6.0, radius=2.5,
                           wall_height=8.0, segments=20,
                           grid_color=(0.08, 0.09, 0.11)):
    """Hand-built curved backdrop: flat floor -> quarter-circle curve ->
    flat wall, swept across width. This is the visible 'set' the camera
    sees; the HDRI (already set up) only handles lighting/reflections."""
    verts = []
    faces = []

    profile = [(floor_depth + radius, 0.0), (radius, 0.0)]
    for i in range(1, segments):
        theta = math.radians(-90 - 90 * (i / segments))
        y = radius + radius * math.cos(theta)
        z = radius + radius * math.sin(theta)
        profile.append((y, z))
    profile.append((0.0, radius))
    profile.append((0.0, wall_height))

    half_w = width / 2.0
    row_count = len(profile)
    for x in (-half_w, half_w):
        for (y, z) in profile:
            verts.append((x, y, z))

    for i in range(row_count - 1):
        a, b = i, i + 1
        c, d = row_count + i + 1, row_count + i
        faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new("StudioBackdrop")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("StudioBackdrop", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.polygons.foreach_set("use_smooth", [True] * len(obj.data.polygons))

    mat = bpy.data.materials.new("GridMaterial")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = 0.55

    tex_coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (4.0, 4.0, 4.0)

    sep = nodes.new("ShaderNodeSeparateXYZ")
    mod_x = nodes.new("ShaderNodeMath")
    mod_x.operation = "MODULO"
    mod_x.inputs[1].default_value = 1.0
    mod_y = nodes.new("ShaderNodeMath")
    mod_y.operation = "MODULO"
    mod_y.inputs[1].default_value = 1.0

    line_x = nodes.new("ShaderNodeMath")
    line_x.operation = "LESS_THAN"
    line_x.inputs[1].default_value = 0.02
    line_y = nodes.new("ShaderNodeMath")
    line_y.operation = "LESS_THAN"
    line_y.inputs[1].default_value = 0.02

    combine = nodes.new("ShaderNodeMath")
    combine.operation = "MAXIMUM"

    grid_color_node = nodes.new("ShaderNodeMixRGB")
    grid_color_node.inputs["Color1"].default_value = (*grid_color, 1.0)
    grid_color_node.inputs["Color2"].default_value = (0.35, 0.37, 0.4, 1.0)

    links.new(tex_coord.outputs["Generated"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], sep.inputs["Vector"])
    links.new(sep.outputs["X"], mod_x.inputs[0])
    links.new(sep.outputs["Y"], mod_y.inputs[0])
    links.new(mod_x.outputs[0], line_x.inputs[0])
    links.new(mod_y.outputs[0], line_y.inputs[0])
    links.new(line_x.outputs[0], combine.inputs[0])
    links.new(line_y.outputs[0], combine.inputs[1])
    links.new(combine.outputs[0], grid_color_node.inputs["Fac"])
    links.new(grid_color_node.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    obj.data.materials.append(mat)
    return obj


def main():
    grid_color = ARGS["grid_color"]
    if isinstance(grid_color, str):
        grid_color = tuple(float(v) for v in grid_color.split(","))

    build_studio_backdrop(grid_color=grid_color)

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

"""
build_circular_backdrop.py
Replaces the linear "infinity cove" backdrop (built for a single fixed
camera facing one direction) with a fully circular one: a floor+wall
surface of revolution around a vertical axis through the rig's pivot.

WHY: the RotatingCamera sweeps through all 360 degrees of azimuth as the
rig spins (that's the point of a rotating reference frame). A linear cove
only has a properly-lit "front" - confirmed by rendering frames 1, 8, 15,
22, 31 from RotatingCamera: a black wedge (the cove's unlit back/edge)
grows across the frame as rotation increases, fully obscuring the shot by
frame 31. A surface of revolution has no "back" to reveal from any angle.

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/build_circular_backdrop.py -- \
      --output rotating_rod/scene.blend
"""

import bpy
import sys
import math
from mathutils import Vector


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {
        "output": None,
        "wall_radius": "8.0",
        "curve_radius": "2.5",
        "wall_height": "8.0",
        "segments": "64",
    }
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


def emission_free_grid_material(grid_color=(0.08, 0.09, 0.11)):
    mat = bpy.data.materials.new("CircularGridMaterial")
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

    return mat


def build_circular_backdrop(center_xy, wall_radius, curve_radius,
                             wall_height, segments):
    """Revolves a (radius, z) profile around the vertical axis through
    center_xy to build a fully circular floor-curving-into-wall enclosure.

    NOTE (bug fixed during testing): the first version's profile ran from
    an "outer_radius" ring inward only to wall_radius, then up the wall -
    it never included the disc from r=0 to the start of the curve, so the
    floor was a ring/washer shape with a hollow, floorless void directly
    under the rig at the center. The rig sits at r=0, so this was fatal.
    A circular room built by revolving a profile doesn't need an "outer"
    floor beyond the wall at all (unlike the earlier linear cove, which had
    a camera-side floor extending toward one fixed viewing direction) -
    the room is symmetric in every direction, so the floor just needs to
    span from the center out to where it curves up into the wall.
    """
    floor_radius = wall_radius - curve_radius  # flat floor's outer edge, before the curve

    # Profile from the center (r=0) outward to the wall top, in (radius, z).
    # Quarter-circle arc centered at (floor_radius, curve_radius): starts
    # tangent-horizontal at (floor_radius, 0) matching the flat floor, ends
    # tangent-vertical at (wall_radius, curve_radius) matching the wall.
    profile = [(0.0, 0.0), (floor_radius, 0.0)]
    curve_segments = 20
    for i in range(1, curve_segments + 1):
        theta = math.radians(-90 + 90 * (i / curve_segments))
        r = floor_radius + curve_radius * math.cos(theta)
        z = curve_radius + curve_radius * math.sin(theta)
        profile.append((r, z))
    profile.append((wall_radius, wall_height))

    verts = []
    faces = []
    ring_count = len(profile)
    for seg in range(segments):
        angle = 2 * math.pi * seg / segments
        cos_a, sin_a = math.cos(angle), math.sin(angle)
        for (r, z) in profile:
            verts.append((center_xy[0] + r * cos_a, center_xy[1] + r * sin_a, z))

    for seg in range(segments):
        next_seg = (seg + 1) % segments
        for i in range(ring_count - 1):
            a = seg * ring_count + i
            b = seg * ring_count + i + 1
            c = next_seg * ring_count + i + 1
            d = next_seg * ring_count + i
            faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new("CircularBackdrop")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("CircularBackdrop", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.polygons.foreach_set("use_smooth", [True] * len(obj.data.polygons))

    obj.data.materials.append(emission_free_grid_material())
    return obj


def main():
    wall_radius = float(ARGS["wall_radius"])
    curve_radius = float(ARGS["curve_radius"])
    wall_height = float(ARGS["wall_height"])
    segments = int(ARGS["segments"])

    old = bpy.data.objects.get("StudioBackdrop")
    if old is not None:
        bpy.data.objects.remove(old, do_unlink=True)

    rig_pivot = bpy.data.objects["RigPivot"]
    center_xy = (rig_pivot.location.x, rig_pivot.location.y)

    build_circular_backdrop(center_xy, wall_radius, curve_radius,
                             wall_height, segments)

    print(f"Circular backdrop built: center={center_xy}, wall_radius={wall_radius}, "
          f"floor spans r=0 to {wall_radius}, wall_height={wall_height}, "
          f"segments={segments}")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

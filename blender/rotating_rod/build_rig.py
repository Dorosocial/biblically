"""
build_rig.py
Builds the "ball on a rotating rod" rig in the existing studio scene
(grid backdrop + HDRI already set up in magnet_scene_with_backdrop.blend):
removes the old magnet product-shot subject, adds a pivoting metal rod with
a chrome ball at the far end, and a glowing circular trajectory curve
matching the ball's orbit.

Run headless, pointed at the studio backdrop scene:
  blender --background blender/magnet_scene_with_backdrop.blend --python rotating_rod/build_rig.py -- \
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
        "pivot": "0,-5,3",     # world position of the rod's pivot end
        "rod_length": "2.2",
        "rod_radius": "0.05",
        "ball_radius": "0.32",
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


def polished_metal_material(name, base_color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = roughness
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def emission_material(name, color, strength):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    emit = nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = (*color, 1.0)
    emit.inputs["Strength"].default_value = strength
    mat.node_tree.links.new(emit.outputs["Emission"], out.inputs["Surface"])
    return mat


def remove_old_subject():
    """Removes the earlier magnet product-shot subject and its camera,
    keeping StudioBackdrop, Light, and the HDRI world untouched."""
    keep = {"StudioBackdrop"}
    to_remove = [o for o in list(bpy.data.objects) if o.name not in keep and o.type != "LIGHT"]
    for obj in to_remove:
        bpy.data.objects.remove(obj, do_unlink=True)
    # Purge orphaned mesh/curve/empty data left behind by the removed magnet.
    for block_collection in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.images):
        for block in list(block_collection):
            if block.users == 0:
                block_collection.remove(block)


def build_rig(pivot, rod_length, rod_radius, ball_radius):
    rig_pivot = bpy.data.objects.new("RigPivot", None)
    rig_pivot.empty_display_type = "PLAIN_AXES"
    rig_pivot.empty_display_size = 0.3
    rig_pivot.location = pivot
    bpy.context.collection.objects.link(rig_pivot)

    # Rod: a cylinder lying along local +X, from the pivot to rod_length.
    # Primitives are created in WORLD space, so their location must include
    # the pivot's own world position - parenting with matrix_parent_inverse
    # below preserves world position, it does not offset by the parent.
    bpy.ops.mesh.primitive_cylinder_add(
        radius=rod_radius, depth=rod_length, vertices=24,
        location=pivot + Vector((rod_length / 2, 0, 0)), rotation=(0, math.radians(90), 0)
    )
    rod = bpy.context.active_object
    rod.name = "Rod"
    rod.data.materials.append(polished_metal_material("RodMetal", (0.72, 0.73, 0.75), 0.25))
    rod.parent = rig_pivot
    rod.matrix_parent_inverse = rig_pivot.matrix_world.inverted()

    # Ball: chrome sphere at the far end of the rod.
    bpy.ops.mesh.primitive_uv_sphere_add(radius=ball_radius, segments=48, ring_count=32,
                                          location=pivot + Vector((rod_length, 0, 0)))
    ball = bpy.context.active_object
    ball.name = "Ball"
    bpy.ops.object.shade_smooth()
    ball.data.materials.append(polished_metal_material("ChromeMetal", (0.9, 0.9, 0.92), 0.04))
    ball.parent = rig_pivot
    ball.matrix_parent_inverse = rig_pivot.matrix_world.inverted()

    # Trajectory circle: a bezier circle in the rig's rotation plane (world
    # XY, matching RigPivot's default unrotated orientation), radius =
    # rod_length, centered at the pivot. Given emission material + bevel for
    # a glowing tube look.
    bpy.ops.curve.primitive_bezier_circle_add(radius=rod_length, location=pivot)
    traj = bpy.context.active_object
    traj.name = "TrajectoryCircle"
    traj.data.bevel_depth = 0.015
    traj.data.materials.append(emission_material("TrajectoryGlow", (0.25, 0.65, 1.0), 4.0))

    return rig_pivot, rod, ball, traj


def main():
    pivot = Vector(tuple(float(v) for v in ARGS["pivot"].split(",")))
    rod_length = float(ARGS["rod_length"])
    rod_radius = float(ARGS["rod_radius"])
    ball_radius = float(ARGS["ball_radius"])

    remove_old_subject()
    rig_pivot, rod, ball, traj = build_rig(pivot, rod_length, rod_radius, ball_radius)

    print(f"Rig built: pivot={tuple(pivot)}, rod_length={rod_length}, "
          f"ball at world {tuple(ball.matrix_world.translation)}")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

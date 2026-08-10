"""
build_arrows.py
Builds three force-arrow objects, each parented to RigPivot (so they ride
the rod's rotation naturally, staying correctly aligned relative to the
ball while attached) with keyframed visibility for their shot-list window:

  - InwardArrow: points from the ball toward the pivot - the real
    centripetal force. Visible 14-25s and 46-57.2865s (SHOT_LIST.md rows
    for "the rod is constantly pulling it toward the centre" and the
    closing "only the rod pulling inward" reinforcement).
  - TangentArrow: points perpendicular to the rod, in the ball's direction
    of travel - what the ball is "trying" to do (Newton's first law).
    Visible only 46-57.2865s, alongside InwardArrow, for "the ball keeps
    trying to move straight."
  - OutwardArrow: points away from the pivot, at the ball's attached
    local position - the apparent (not real) centrifugal illusion. This
    one must NOT appear in FixedCamera's view (there's no real outward
    force to show from outside) - render_rough_cut.py's split-screen path
    forces it hidden during the FixedCamera pass and visible only for
    RotatingCamera, on top of this script's own 42-46s time window.

Run after build_cameras.py (needs rod_length/ball_local_pos, and the
scene's frame range):
  blender --background rotating_rod/scene.blend --python rotating_rod/build_arrows.py -- \
      --output rotating_rod/scene.blend
"""

import bpy
import sys
import math
from mathutils import Vector


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None}
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

# (start, end) windows in seconds - matches SHOT_LIST.md.
INWARD_WINDOWS = [(14.0, 25.0), (46.0, 10_000.0)]
TANGENT_WINDOWS = [(46.0, 10_000.0)]
OUTWARD_WINDOWS = [(42.0, 46.0)]  # flight portion of the split-screen window


def arrow_material(color):
    mat = bpy.data.materials.new(f"ArrowMat_{color[0]:.1f}_{color[1]:.1f}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = (*color, 1.0)
    emission.inputs["Strength"].default_value = 4.0
    mat.node_tree.links.new(emission.outputs["Emission"], out.inputs["Surface"])
    return mat


def build_arrow_mesh(name, length, shaft_radius, head_radius, head_length, color):
    """Builds one arrow (cylinder shaft + cone head) pointing along local
    +X, tip at local +X*length, tail at local origin. Created directly
    with bmesh-free primitive ops then immediately re-centered - primitives
    are created in world space at the 3D cursor (the same real bug hit
    building the rod/ball originally), so build at origin pointing +Z
    (primitive default) then rotate+translate the whole object afterward
    rather than trying to fight the primitive's default orientation."""
    shaft_length = length - head_length
    bpy.ops.mesh.primitive_cylinder_add(radius=shaft_radius, depth=shaft_length,
                                         location=(0, 0, shaft_length / 2))
    shaft = bpy.context.active_object
    shaft.name = f"{name}_shaft_tmp"

    bpy.ops.mesh.primitive_cone_add(radius1=head_radius, depth=head_length,
                                     location=(0, 0, shaft_length + head_length / 2))
    head = bpy.context.active_object
    head.name = f"{name}_head_tmp"

    bpy.ops.object.select_all(action="DESELECT")
    shaft.select_set(True)
    head.select_set(True)
    bpy.context.view_layer.objects.active = head
    bpy.ops.object.join()
    arrow = bpy.context.active_object
    arrow.name = name

    # Primitive default axis is +Z; rotate -90 about Y so it points +X
    # instead (matches the rod's local +X convention used throughout).
    arrow.rotation_euler = (0.0, math.radians(90.0), 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

    arrow.data.materials.append(arrow_material(color))
    return arrow


def get_fcurves(action):
    if hasattr(action, "fcurves"):
        return action.fcurves
    fcurves = []
    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in strip.channelbags:
                fcurves.extend(channelbag.fcurves)
    return fcurves


def bake_hide_render(obj, name, windows, frame_start, frame_end, fps):
    """Keyframes hide_render (0=visible,1=hidden) with CONSTANT
    interpolation - a boolean-ish property, no interpolation between
    visible/hidden makes sense."""
    action = bpy.data.actions.new(name)
    obj.animation_data_create()
    obj.animation_data.action = action
    try:
        layer = action.layers.new("Layer")
        strip = layer.strips.new(type="KEYFRAME")
        channelbag = strip.channelbags.new(slot=action.slots.new(id_type="OBJECT", name=name))
        obj.animation_data.action_slot = action.slots[0]
        fcurve_source = channelbag
    except AttributeError:
        fcurve_source = action

    fcurve = fcurve_source.fcurves.new(data_path="hide_render")
    samples = []
    for frame in range(frame_start, frame_end + 1):
        t = (frame - 1) / fps
        visible = any(start <= t < end for (start, end) in windows)
        samples.append((frame, 0.0 if visible else 1.0))
    fcurve.keyframe_points.add(len(samples))
    flat = []
    for (frame, val) in samples:
        flat.extend((float(frame), val))
    fcurve.keyframe_points.foreach_set("co", flat)
    for kf in fcurve.keyframe_points:
        kf.interpolation = "CONSTANT"
    fcurve.update()


def main():
    scene = bpy.context.scene
    fps = scene.render.fps
    frame_start, frame_end = scene.frame_start, scene.frame_end

    rig_pivot = bpy.data.objects["RigPivot"]
    ball = bpy.data.objects["Ball"]
    ball_local_pos = rig_pivot.matrix_world.inverted() @ ball.matrix_world.translation
    rod_length = ball_local_pos.length
    ball_radius = ball.dimensions.x / 2.0

    for name in ("InwardArrow", "TangentArrow", "OutwardArrow"):
        if name in bpy.data.objects:
            bpy.data.objects.remove(bpy.data.objects[name], do_unlink=True)

    arrow_length = rod_length * 0.7
    shaft_radius = 0.05
    head_radius = 0.13
    head_length = arrow_length * 0.35
    # NOTE (bug found during testing): positioning arrows AT the ball's
    # own location put them overlapping/inside the ball and rod meshes -
    # the inward arrow read as a barely-visible sliver next to the rod,
    # and the tangent arrow (pointing further into the ball's own
    # 0.32-radius sphere before extending out) was invisible entirely,
    # swallowed by the chrome ball from this camera angle. Hovering all
    # three arrows above the rod plane (local +Z) keeps them clearly
    # separated from the metal geometry regardless of viewing angle.
    hover_z = 0.75

    # Inward: tip near the ball, pointing back toward the pivot (-local X).
    inward = build_arrow_mesh("InwardArrow", arrow_length, shaft_radius, head_radius,
                               head_length, color=(1.0, 0.35, 0.1))  # warm orange - "real force"
    inward.parent = rig_pivot
    inward.location = Vector((ball_local_pos.x - arrow_length, ball_local_pos.y, hover_z))
    inward.rotation_euler = (0.0, 0.0, math.radians(180.0))  # flip to point -X (toward pivot)
    bake_hide_render(inward, "InwardArrowVis", INWARD_WINDOWS, frame_start, frame_end, fps)

    # Tangent: perpendicular to the rod (local +Y, matching the actual
    # tangent velocity direction computed in build_motion.py for
    # omega > 0), positioned at the ball, showing its "straight" tendency.
    tangent = build_arrow_mesh("TangentArrow", arrow_length, shaft_radius, head_radius,
                                head_length, color=(0.3, 0.9, 1.0))  # cool cyan - "tendency", not a force
    tangent.parent = rig_pivot
    tangent.location = Vector((ball_local_pos.x, ball_local_pos.y, hover_z))
    tangent.rotation_euler = (0.0, 0.0, math.radians(90.0))  # +X -> +Y
    bake_hide_render(tangent, "TangentArrowVis", TANGENT_WINDOWS, frame_start, frame_end, fps)

    # Outward: at the ball's attached position, pointing away from the
    # pivot (+local X) - the illusion, camera-gated in the render script.
    outward = build_arrow_mesh("OutwardArrow", arrow_length, shaft_radius, head_radius,
                                head_length, color=(1.0, 0.85, 0.2))  # yellow - "apparent", matches on-screen label color
    outward.parent = rig_pivot
    outward.location = Vector((ball_local_pos.x, ball_local_pos.y, hover_z))
    bake_hide_render(outward, "OutwardArrowVis", OUTWARD_WINDOWS, frame_start, frame_end, fps)

    print(f"Arrows built: inward/tangent/outward, length={arrow_length:.2f}, "
          f"windows: inward={INWARD_WINDOWS}, tangent={TANGENT_WINDOWS}, outward={OUTWARD_WINDOWS}")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

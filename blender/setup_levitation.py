"""
setup_levitation.py
Step 1: Duplicates the magnet hierarchy into BottomMagnet (at world origin)
and TopMagnet (to be animated).
Step 2: Animates TopMagnet falling from above and settling into a hover
above BottomMagnet with a decaying bounce, guaranteed never to dip below
the hover height (so it never touches BottomMagnet).

Run headless, pointed at the existing blend file:
  blender --background blender/magnet_scene_with_backdrop.blend --python setup_levitation.py -- \
      --output blender/magnet_scene_with_backdrop.blend
"""

import bpy
import sys
import math
from mathutils import Vector


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "gap": 0.5, "start_height": 4.0, "fps": 30, "duration": 5.0}
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


def select_hierarchy(obj):
    obj.select_set(True)
    for child in obj.children:
        select_hierarchy(child)


def get_fcurves(action):
    """Compatibility shim: Blender <4.4 exposed action.fcurves directly;
    Blender 4.4+'s layered Action system nests them under
    layers[].strips[].channelbags[].fcurves instead."""
    if hasattr(action, "fcurves"):
        return action.fcurves
    fcurves = []
    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in strip.channelbags:
                fcurves.extend(channelbag.fcurves)
    return fcurves


def world_bbox(objs):
    coords = []
    for obj in objs:
        for corner in obj.bound_box:
            coords.append(obj.matrix_world @ Vector(corner))
    min_v = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
    max_v = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
    return min_v, max_v


def step1_duplicate_and_place():
    src_root = bpy.data.objects.get("Sketchfab_model")
    if src_root is None:
        raise SystemExit("ERROR: could not find 'Sketchfab_model' (the imported magnet root) in the scene")

    bpy.ops.object.select_all(action="DESELECT")
    select_hierarchy(src_root)
    bpy.context.view_layer.objects.active = src_root

    bpy.ops.object.duplicate(linked=False)

    dup_root_name = src_root.name + ".001"
    dup_root = bpy.data.objects.get(dup_root_name)
    if dup_root is None:
        raise SystemExit(f"ERROR: expected duplicated root named '{dup_root_name}' but it was not found")

    src_root.name = "BottomMagnet"
    dup_root.name = "TopMagnet"

    # BottomMagnet: exactly at world origin, upright, no leftover offset
    # from the earlier studio-photo composition.
    src_root.location = (0.0, 0.0, 0.0)
    src_root.rotation_euler = (0.0, 0.0, 0.0)

    bpy.context.view_layer.update()
    print(f"Step 1 done: BottomMagnet at {tuple(src_root.location)}, "
          f"TopMagnet created (name={dup_root.name})")
    return src_root, dup_root


def step2_animate(bottom, top, gap, start_height, fps, duration):
    scene = bpy.context.scene
    scene.render.fps = fps
    total_frames = round(duration * fps)
    scene.frame_start = 1
    scene.frame_end = total_frames

    # Measure BottomMagnet's true top surface and TopMagnet's true bottom
    # offset (the imported model's origin isn't at its base), so the gap is
    # measured between actual surfaces, not object origins.
    bottom_min, bottom_max = world_bbox([o for o in bottom.children_recursive if o.type == "MESH"])
    top_min, top_max = world_bbox([o for o in top.children_recursive if o.type == "MESH"])
    top_local_bottom_offset = top_min.z - top.location.z  # negative number

    hover_z = bottom_max.z + gap - top_local_bottom_offset
    start_z = hover_z + start_height

    top.location.x = 0.0
    top.location.y = 0.0
    top.location.z = start_z
    top.rotation_euler = (math.radians(5.0), 0.0, 0.0)
    top.keyframe_insert(data_path="location", index=2, frame=1)
    top.keyframe_insert(data_path="rotation_euler", index=0, frame=1)

    settle_frame = max(2, round(total_frames * 0.5))
    top.location.z = hover_z
    top.rotation_euler = (0.0, 0.0, 0.0)
    top.keyframe_insert(data_path="location", index=2, frame=settle_frame)
    top.keyframe_insert(data_path="rotation_euler", index=0, frame=settle_frame)

    # Bounce/EaseOut: Blender's bounce-out easing is a convex blend between
    # the start and end values (it never overshoots past either end), so
    # going from a high start_z down to hover_z guarantees the value never
    # drops below hover_z at any frame - TopMagnet can never dip into
    # BottomMagnet.
    fcurves = get_fcurves(top.animation_data.action)
    for fcurve in fcurves:
        if fcurve.data_path in ("location", "rotation_euler"):
            kf = fcurve.keyframe_points[0]
            kf.interpolation = "BOUNCE"
            kf.easing = "EASE_OUT"

    min_gap_check = hover_z + top_local_bottom_offset - bottom_max.z
    print(f"Step 2 done: TopMagnet falls from z={start_z:.3f} to hover z={hover_z:.3f} "
          f"(frames 1-{settle_frame} of {total_frames}, {fps} fps). "
          f"Rest clearance between magnets: {min_gap_check:.3f} units (never touches).")


def main():
    gap = float(ARGS["gap"])
    start_height = float(ARGS["start_height"])
    fps = int(ARGS["fps"])
    duration = float(ARGS["duration"])

    bottom, top = step1_duplicate_and_place()
    step2_animate(bottom, top, gap, start_height, fps, duration)

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

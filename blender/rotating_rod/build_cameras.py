"""
build_cameras.py
Adds a constant-angular-velocity rotation to RigPivot (placeholder motion
for isolated testing - the real per-shot speed profile comes later) and two
cameras:
  - FixedCamera: a normal world-space camera aimed at the rig, for the
    "outside" shots.
  - RotatingCamera: parented to RigPivot so it rotates WITH the rod. Framed
    on the ball at a fixed local offset, so in its view the ball appears
    stationary while the background sweeps past - the rotating reference
    frame the split-screen shot needs.

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/build_cameras.py -- \
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
        "rot_period": "3.0",   # seconds per full revolution, placeholder
        "duration": "36.0",
        "fps": "30",
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


def main():
    rot_period = float(ARGS["rot_period"])
    duration = float(ARGS["duration"])
    fps = int(ARGS["fps"])

    scene = bpy.context.scene
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = round(duration * fps)

    rig_pivot = bpy.data.objects["RigPivot"]
    ball = bpy.data.objects["Ball"]
    # NOTE: ball.location is NOT the local-to-pivot offset here - build_rig.py
    # parented the ball with a custom matrix_parent_inverse (keep-transform),
    # so .location still holds its original *world*-space creation
    # coordinates. The true local position must go through the matrices.
    ball_local_pos = rig_pivot.matrix_world.inverted() @ ball.matrix_world.translation

    # Placeholder constant rotation for isolated testing - simple linear
    # keyframes across the whole timeline, one full turn every rot_period
    # seconds. The real shot-by-shot speed profile (freeze, slow-mo, release
    # into a straight line, etc.) replaces this once each section is built.
    rig_pivot.rotation_mode = "XYZ"
    turns = duration / rot_period
    rig_pivot.rotation_euler[2] = 0.0
    rig_pivot.keyframe_insert(data_path="rotation_euler", index=2, frame=scene.frame_start)
    rig_pivot.rotation_euler[2] = turns * 2 * math.pi
    rig_pivot.keyframe_insert(data_path="rotation_euler", index=2, frame=scene.frame_end)
    for fcurve in get_fcurves(rig_pivot.animation_data.action):
        for kf in fcurve.keyframe_points:
            kf.interpolation = "LINEAR"

    # Fixed outside camera: looks at the rig's pivot from a normal 3/4
    # elevated angle, distance derived from the rig's rough size the same
    # way the levitation scene's camera distance was computed.
    if "FixedCamera" in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects["FixedCamera"], do_unlink=True)
    cam_data = bpy.data.cameras.new("FixedCamera")
    fixed_cam = bpy.data.objects.new("FixedCamera", cam_data)
    bpy.context.collection.objects.link(fixed_cam)
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920
    target = rig_pivot.location.copy()
    direction = Vector((0.0, -1.0, 0.2)).normalized()
    rod_length = ball_local_pos.length
    distance = rod_length * 6.0
    fixed_cam.location = target + direction * distance
    look_dir = target - fixed_cam.location
    fixed_cam.rotation_euler = look_dir.to_track_quat("-Z", "Y").to_euler()
    scene.camera = fixed_cam

    # Rotating-frame camera: parented to RigPivot, positioned in RigPivot's
    # LOCAL space offset from the ball so it keeps the ball framed
    # regardless of the pivot's world rotation.
    if "RotatingCamera" in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects["RotatingCamera"], do_unlink=True)
    rot_cam_data = bpy.data.cameras.new("RotatingCamera")
    rot_cam = bpy.data.objects.new("RotatingCamera", rot_cam_data)
    bpy.context.collection.objects.link(rot_cam)
    rot_cam.parent = rig_pivot
    # Local-space offset: behind and above the ball, looking back at it
    # along the rod's local +X axis (this offset never changes even as
    # RigPivot rotates in world space - that's what "locks" the camera to
    # the rotating frame).
    local_distance = rod_length * 3.0
    local_offset = ball_local_pos + Vector((0.0, -local_distance, local_distance * 0.4))
    rot_cam.location = local_offset
    local_look_dir = ball_local_pos - local_offset
    rot_cam.rotation_euler = local_look_dir.to_track_quat("-Z", "Y").to_euler()

    print(f"Cameras built. FixedCamera at world {tuple(round(v, 2) for v in fixed_cam.location)}, "
          f"RotatingCamera local offset {tuple(round(v, 2) for v in local_offset)} "
          f"(parented to RigPivot). Rotation: {turns:.2f} turns over {duration}s.")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

"""
build_motion.py
Replaces the placeholder "attached forever, constant rotation" animation
with the real physics the shot list needs: the rod spins continuously
(one constant angular velocity for the whole video), and the ball
alternates between being rigidly attached (orbiting with the rod) and
released into straight-line flight at its exact tangent velocity at the
release instant (Newton's first law - no "outward force" involved).

Run after build_rig.py, before build_cameras.py (FixedCamera's framing
reads the ball's frame-1 position, which must already be correct) and
build_circular_backdrop.py doesn't care about this at all:
  blender --background rotating_rod/scene.blend --python rotating_rod/build_motion.py -- \
      --output rotating_rod/scene.blend

Design notes:
- The rod's rotation theta(t) = omega * t is ONE continuous function
  across the whole timeline, never reset - it's a persistent spinning
  mechanism. The ball separately has "attached" time windows; outside
  those windows it's in free flight from its most recent release.
- This means during an attach window the ball sits at
  pivot + R*(cos theta, sin theta, 0); at the release instant it keeps
  going at the tangent velocity R*omega*(-sin theta, cos theta, 0) it had
  at that exact moment, in a straight line, until the next attach window
  begins (a hard position jump - intentionally left for the edit to cut
  or transition across, not smoothed here).
- A useful side effect, not extra work: RotatingCamera (parented to the
  rig, built in build_cameras.py) already keeps the ball centered only
  while it's actually riding the rod. Once released, the rig keeps
  spinning under the camera while the ball goes straight, so in the
  rotating camera's view the ball will appear to swing outward on its
  own - which is exactly "why does it look like the ball wants to fly
  outward" - with no change needed to the camera setup at all.
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
        "period": "3.0",     # seconds per full rotation, constant for the whole video
        "fps": "30",
        # Attach windows as "start:release" pairs, comma-separated, in
        # seconds. A window with no release (last one) just says "start:".
        "windows": "0.0:7.0,14.0:25.0,38.0:42.0,46.0:",
        "duration": "57.2865",
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
    """Same compatibility shim as build_cameras.py - Blender 4.4+'s layered
    Action system nests fcurves under layers[].strips[].channelbags[]."""
    if hasattr(action, "fcurves"):
        return action.fcurves
    fcurves = []
    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in strip.channelbags:
                fcurves.extend(channelbag.fcurves)
    return fcurves


def parse_windows(spec):
    windows = []
    for chunk in spec.split(","):
        start_s, _, release_s = chunk.partition(":")
        start = float(start_s)
        release = float(release_s) if release_s else None
        windows.append((start, release))
    return windows


def main():
    period = float(ARGS["period"])
    fps = int(ARGS["fps"])
    duration = float(ARGS["duration"])
    windows = parse_windows(ARGS["windows"])
    omega = 2 * math.pi / period

    scene = bpy.context.scene
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = round(duration * fps)

    rig_pivot = bpy.data.objects["RigPivot"]
    ball = bpy.data.objects["Ball"]

    # Rod length/radius from the current rig, before we touch the ball's
    # parenting - same matrix math as build_cameras.py, for the same
    # reason (ball.location alone is stale world-space creation
    # coordinates after build_rig.py's keep-transform parenting).
    ball_local_pos = rig_pivot.matrix_world.inverted() @ ball.matrix_world.translation
    rod_length = ball_local_pos.length
    pivot_world = rig_pivot.location.copy()

    # Rod: continuous constant-rate spin, one clean fcurve, never reset.
    rig_pivot.rotation_mode = "XYZ"
    rig_pivot.rotation_euler[2] = 0.0
    rig_pivot.keyframe_insert(data_path="rotation_euler", index=2, frame=scene.frame_start)
    rig_pivot.rotation_euler[2] = omega * duration
    rig_pivot.keyframe_insert(data_path="rotation_euler", index=2, frame=scene.frame_end)
    for fcurve in get_fcurves(rig_pivot.animation_data.action):
        for kf in fcurve.keyframe_points:
            kf.interpolation = "LINEAR"

    # Ball: unparent (keep its current world position as a starting
    # point), then take over its position entirely with baked keyframes -
    # per-frame samples through attach windows (circular motion isn't
    # linearly interpolatable between sparse keyframes), 2-point straight
    # lines through flight windows (constant velocity *is* linear).
    world_pos = ball.matrix_world.translation.copy()
    ball.parent = None
    ball.matrix_parent_inverse.identity()
    ball.location = world_pos

    def theta(t):
        return omega * t

    def attached_pos(t):
        th = theta(t)
        return pivot_world + Vector((rod_length * math.cos(th), rod_length * math.sin(th), 0.0))

    def tangent_velocity(t):
        th = theta(t)
        return Vector((-rod_length * omega * math.sin(th), rod_length * omega * math.cos(th), 0.0))

    frame_end = scene.frame_end
    xs, ys, zs = [], [], []  # (frame, value) pairs per axis

    flight_start_pos = None
    flight_vel = None
    flight_from_t = None

    for frame in range(scene.frame_start, frame_end + 1):
        t = (frame - 1) / fps

        # Find current regime: inside an attach window, or in flight
        # after the most recent release.
        in_attach = False
        for (start, release) in windows:
            end = release if release is not None else duration + 1.0
            if start <= t < end:
                in_attach = True
                break
            if release is not None and t >= release:
                # past this window's release - candidate flight source;
                # keep scanning in case a later window has already begun
                flight_from_t = release
                flight_start_pos = attached_pos(release)
                flight_vel = tangent_velocity(release)

        if in_attach:
            pos = attached_pos(t)
        else:
            pos = flight_start_pos + flight_vel * (t - flight_from_t)

        xs.append((frame, pos.x))
        ys.append((frame, pos.y))
        zs.append((frame, pos.z))

    action = bpy.data.actions.new("BallMotion")
    ball.animation_data_create()
    ball.animation_data.action = action
    try:
        # Blender 4.4+ layered Action API
        layer = action.layers.new("Layer")
        strip = layer.strips.new(type="KEYFRAME")
        channelbag = strip.channelbags.new(slot=action.slots.new(id_type="OBJECT", name="BallMotion"))
        ball.animation_data.action_slot = action.slots[0]
        fcurve_source = channelbag
    except AttributeError:
        fcurve_source = action

    for axis_idx, samples in enumerate((xs, ys, zs)):
        fcurve = fcurve_source.fcurves.new(data_path="location", index=axis_idx)
        fcurve.keyframe_points.add(len(samples))
        flat = []
        for (frame, value) in samples:
            flat.extend((float(frame), value))
        fcurve.keyframe_points.foreach_set("co", flat)
        for kf in fcurve.keyframe_points:
            kf.interpolation = "LINEAR"
        fcurve.update()

    release_times = [r for (_, r) in windows if r is not None]
    print(f"Motion built: period={period}s (omega={omega:.3f} rad/s), rod_length={rod_length:.2f}, "
          f"windows={windows}, releases at {release_times}s, "
          f"{frame_end} frames baked for Ball.")

    # Force depsgraph evaluation at frame 1 before saving, so the saved
    # file's ball.matrix_world already reflects the new baked animation -
    # downstream stages (build_cameras.py) read it without calling
    # frame_set themselves.
    scene.frame_set(scene.frame_start)

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

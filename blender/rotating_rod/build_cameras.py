"""
build_cameras.py
Adds two cameras to the rig (rod rotation + ball attach/release motion is
built by build_motion.py, which must run first):
  - FixedCamera: a normal world-space camera aimed at the rig, for the
    "outside" shots.
  - RotatingCamera: parented to RigPivot so it rotates WITH the rod. Framed
    on the ball at a fixed local offset, so while the ball is attached it
    appears stationary in this view as the background sweeps past - and
    once released, since the rig keeps spinning under this camera while
    the ball goes straight, the ball appears to swing outward on its own.
    That illusion is exactly the "why does it look like the ball wants to
    fly outward" the split-screen shot needs, and falls out of this
    camera's fixed framing for free once build_motion.py's release is in
    place - no extra work here.

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
        "duration": "57.2865",  # confirmed: matches audio/8f8241d5-aballrotating.mp3
                                 # (the narration track), not the 36s originally assumed
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


def get_or_create_action_fcurve_source(obj, name):
    """One action per object, reused across multiple bake_fcurves() calls -
    each call used to create its OWN fresh action and overwrite
    obj.animation_data.action, silently discarding whatever the previous
    call had baked (e.g. baking rotation after location wiped location).
    Bug caught before ever running it, fixed by sharing one action."""
    if obj.animation_data and obj.animation_data.action:
        action = obj.animation_data.action
    else:
        action = bpy.data.actions.new(name)
        obj.animation_data_create()
        obj.animation_data.action = action
    try:
        if action.layers:
            channelbag = action.layers[0].strips[0].channelbags[0]
        else:
            layer = action.layers.new("Layer")
            strip = layer.strips.new(type="KEYFRAME")
            channelbag = strip.channelbags.new(slot=action.slots.new(id_type="OBJECT", name=name))
            obj.animation_data.action_slot = action.slots[0]
        return channelbag
    except AttributeError:
        return action


def bake_fcurves(obj, name, data_path, samples):
    """samples: list of (frame, v0, v1, ...) matching data_path's
    dimensionality (3 for location/rotation_euler). Bulk-inserts linear
    keyframes - same technique build_motion.py uses for the ball, so long
    bakes stay fast (no per-frame keyframe_insert operator calls)."""
    fcurve_source = get_or_create_action_fcurve_source(obj, name)
    num_components = len(samples[0]) - 1
    for axis_idx in range(num_components):
        fcurve = fcurve_source.fcurves.new(data_path=data_path, index=axis_idx)
        fcurve.keyframe_points.add(len(samples))
        flat = []
        for row in samples:
            flat.extend((float(row[0]), row[1 + axis_idx]))
        fcurve.keyframe_points.foreach_set("co", flat)
        for kf in fcurve.keyframe_points:
            kf.interpolation = "LINEAR"
        fcurve.update()


def bake_location_fcurves(obj, name, samples_xyz):
    bake_fcurves(obj, name, "location", samples_xyz)


def bake_rotation_fcurves(obj, name, samples_xyz):
    obj.rotation_mode = "XYZ"
    bake_fcurves(obj, name, "rotation_euler", samples_xyz)


def main():
    duration = float(ARGS["duration"])
    fps = int(ARGS["fps"])

    scene = bpy.context.scene
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = round(duration * fps)

    rig_pivot = bpy.data.objects["RigPivot"]
    ball = bpy.data.objects["Ball"]
    # ball's real motion (attach/orbit/release/flight) is set up by
    # build_motion.py, which must run before this script - it also
    # force-evaluates frame 1 before saving, so this read is correct.
    # NOTE: ball.location alone is NOT reliable here even post-motion-bake -
    # go through matrix_world as build_motion.py itself does.
    ball_local_pos = rig_pivot.matrix_world.inverted() @ ball.matrix_world.translation

    # Fixed outside camera: looks at the rig from a normal 3/4 elevated
    # angle. NOTE (bug fixed during testing): framing on rig_pivot.location
    # alone put the ball outside frame once the camera was pulled in to fit
    # inside the circular backdrop's wall - the pivot is one END of the
    # rod, not its center, so a tight distance around the pivot doesn't
    # leave room for the rod+ball extending off to one side. Framing on the
    # rod's midpoint, with distance derived from the camera's actual FOV
    # (not a guessed multiplier), fixes this regardless of rod length.
    if "FixedCamera" in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects["FixedCamera"], do_unlink=True)
    cam_data = bpy.data.cameras.new("FixedCamera")
    fixed_cam = bpy.data.objects.new("FixedCamera", cam_data)
    bpy.context.collection.objects.link(fixed_cam)
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920

    ball_radius = ball.dimensions.x / 2.0  # sphere, any axis works
    rod_length = ball_local_pos.length
    # Target the pivot (the orbit's center). Distance (zoom) AND now the
    # viewing angle both vary per frame - see orbit drift note below.
    target = rig_pivot.location.copy()
    base_half_extent = rod_length + ball_radius
    margin = 1.3
    half_fov = min(cam_data.angle_x, cam_data.angle_y) / 2.0
    base_direction = Vector((0.0, -1.0, 0.2)).normalized()

    # Slow orbital drift: user feedback on the first rough cut was that
    # long static holds (11s+ of just watching the rod spin from one fixed
    # angle) read as dead camera work. Rather than cut more, the camera
    # itself slowly circles the rig - gentle and continuous across the
    # whole timeline (not paused during releases; it's slow enough not to
    # fight those beats). total_drift_degrees is deliberately small - this
    # is a subtle drift, not an orbit shot.
    total_drift_degrees = 30.0

    def direction_at(t):
        angle = math.radians(total_drift_degrees) * (t / duration)
        cos_a, sin_a = math.cos(angle), math.sin(angle)
        return Vector((base_direction.x * cos_a - base_direction.y * sin_a,
                        base_direction.x * sin_a + base_direction.y * cos_a,
                        base_direction.z))

    # Dynamic zoom, baked per frame: reads the ball's ALREADY-BAKED motion
    # (build_motion.py) via its fcurves directly (fast - no per-frame
    # depsgraph evaluation) rather than re-deriving attach/release timing
    # here, so this camera logic stays decoupled from the specific release
    # schedule. NOTE (bug found during testing): a static frame-1 distance
    # only fit the attached orbit circle - once released, the ball's speed
    # (tangent velocity = rod_length * omega) carries it out of that tight
    # frame in well under a second, so "shoots straight off" was invisible,
    # just an instant vanish. Widening per frame up to a capped maximum lets
    # a release read as a beat (~2s visible) instead of a blink, while
    # still snapping back to the tight orbit framing once re-attached.
    ball_fcurves = {fc.array_index: fc for fc in get_fcurves(ball.animation_data.action)
                     if fc.data_path == "location"}
    max_half_extent = 15.0  # world units the ball can be from the pivot before capping

    samples = []
    rotations = []
    dist_from_pivot_by_frame = {}  # reused below for RotatingCamera's own dynamic zoom
    for frame in range(scene.frame_start, scene.frame_end + 1):
        t = (frame - 1) / fps
        direction = direction_at(t)
        ball_pos = Vector((ball_fcurves[0].evaluate(frame),
                            ball_fcurves[1].evaluate(frame),
                            ball_fcurves[2].evaluate(frame)))
        dist_from_pivot = (ball_pos - target).length
        dist_from_pivot_by_frame[frame] = dist_from_pivot
        frame_half_extent = min(max(base_half_extent, dist_from_pivot + ball_radius), max_half_extent)
        frame_distance = frame_half_extent * margin / math.tan(half_fov)
        cam_pos = target + direction * frame_distance
        samples.append((frame, cam_pos.x, cam_pos.y, cam_pos.z))
        look_dir = target - cam_pos
        rotations.append((frame, *look_dir.to_track_quat("-Z", "Y").to_euler()))

    bake_location_fcurves(fixed_cam, "FixedCameraZoom", samples)
    bake_rotation_fcurves(fixed_cam, "FixedCameraDrift", rotations)
    scene.camera = fixed_cam

    # Rotating-frame camera: parented to RigPivot, positioned in RigPivot's
    # LOCAL space offset from the ball so it keeps the ball framed while
    # attached, regardless of the pivot's world rotation.
    if "RotatingCamera" in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects["RotatingCamera"], do_unlink=True)
    rot_cam_data = bpy.data.cameras.new("RotatingCamera")
    rot_cam = bpy.data.objects.new("RotatingCamera", rot_cam_data)
    bpy.context.collection.objects.link(rot_cam)
    rot_cam.parent = rig_pivot
    # Local-space direction: behind and above the ball, looking back at it
    # along the rod's local +X axis. The TARGET point and direction never
    # change (that's what "locks" the camera to the rotating frame and is
    # exactly why a released ball visibly drifts in this view instead of
    # staying centered) - only the distance along that direction is
    # dynamic, same fix and same reason as FixedCamera above: a released
    # ball's distance from the pivot axis is rotation-invariant, so the
    # exact per-frame dist_from_pivot values computed for FixedCamera
    # apply here unchanged, just converted to a LOCAL-space offset scale.
    base_local_distance = rod_length * 2.5
    base_reach = rod_length  # what base_local_distance was calibrated to frame
    max_reach = 15.0  # match FixedCamera's cap
    local_direction = Vector((0.0, -1.0, 0.4)).normalized()

    rot_samples = []
    for frame in range(scene.frame_start, scene.frame_end + 1):
        dist_from_pivot = dist_from_pivot_by_frame[frame]
        frame_reach = min(max(base_reach, dist_from_pivot + ball_radius), max_reach)
        scale = frame_reach / base_reach
        frame_local_distance = base_local_distance * scale
        cam_local_pos = ball_local_pos + local_direction * frame_local_distance
        rot_samples.append((frame, cam_local_pos.x, cam_local_pos.y, cam_local_pos.z))

    bake_location_fcurves(rot_cam, "RotatingCameraZoom", rot_samples)
    # Rotation constant, evaluated at the base (attached) distance.
    base_local_offset = ball_local_pos + local_direction * base_local_distance
    local_look_dir = ball_local_pos - base_local_offset
    rot_cam.rotation_euler = local_look_dir.to_track_quat("-Z", "Y").to_euler()

    print(f"Cameras built. FixedCamera base distance {base_half_extent * margin / math.tan(half_fov):.2f} "
          f"(dynamic zoom, max_half_extent={max_half_extent}), "
          f"RotatingCamera base local distance {base_local_distance:.2f} "
          f"(dynamic zoom, max_reach={max_reach}, parented to RigPivot). Timeline: {duration}s.")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

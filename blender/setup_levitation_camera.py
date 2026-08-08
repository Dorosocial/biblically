"""
setup_levitation_camera.py
Step 3: Points the camera at the gap between BottomMagnet and TopMagnet
(measured at TopMagnet's settled/hover frame) and animates a slow, smooth
dolly push-in over the full length of the animation - closer at the end,
further back at the start. The camera only translates along its fixed
viewing direction, so its orientation never needs to change.

Run headless, pointed at the existing blend file:
  blender --background blender/magnet_scene_with_backdrop.blend --python setup_levitation_camera.py -- \
      --output blender/magnet_scene_with_backdrop.blend
"""

import bpy
import sys
import math
from mathutils import Vector


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "margin": "1.35", "push_in_ratio": "0.7"}
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


def world_bbox(objs):
    coords = []
    for obj in objs:
        for corner in obj.bound_box:
            coords.append(obj.matrix_world @ Vector(corner))
    min_v = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
    max_v = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
    return min_v, max_v


def main():
    margin = float(ARGS["margin"])
    push_in_ratio = float(ARGS["push_in_ratio"])

    scene = bpy.context.scene
    # Field of view (and therefore how much distance the framing needs)
    # depends on the render aspect ratio, so lock in the final output
    # resolution before computing camera distances.
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    bottom = bpy.data.objects.get("BottomMagnet")
    top = bpy.data.objects.get("TopMagnet")
    if bottom is None or top is None:
        raise SystemExit("ERROR: BottomMagnet/TopMagnet not found - run setup_levitation.py first")

    # Evaluate the gap and the combined bounding box at TopMagnet's settled
    # (hover) frame, not frame 1 (where it's still high up mid-fall) - this
    # settled extent is what the camera needs to comfortably frame for the
    # back half of the shot.
    settle_frame = scene.frame_end // 2 if scene.frame_end else scene.frame_end
    scene.frame_set(settle_frame)
    bottom_meshes = [o for o in bottom.children_recursive if o.type == "MESH"]
    top_meshes = [o for o in top.children_recursive if o.type == "MESH"]
    bottom_min, bottom_max = world_bbox(bottom_meshes)
    top_min, top_max = world_bbox(top_meshes)
    gap_target = Vector((0.0, 0.0, (bottom_max.z + top_min.z) / 2))
    combined_min, combined_max = world_bbox(bottom_meshes + top_meshes)
    half_height = (combined_max.z - combined_min.z) / 2
    half_width = (combined_max.x - combined_min.x) / 2
    scene.frame_set(scene.frame_start)

    cam = bpy.data.objects.get("Camera")
    if cam is None:
        cam_data = bpy.data.cameras.new("Camera")
        cam = bpy.data.objects.new("Camera", cam_data)
        bpy.context.collection.objects.link(cam)
    scene.camera = cam

    # Derive the closest safe distance from the camera's actual field of
    # view at the FINAL render resolution/aspect ratio (FOV narrows with a
    # wider aspect, so this must be computed after resolution is set, not
    # guessed as a fixed number).
    angle_y = cam.data.angle_y
    angle_x = cam.data.angle_x
    min_distance_for_height = half_height * margin / math.tan(angle_y / 2)
    min_distance_for_width = half_width * margin / math.tan(angle_x / 2)
    distance_end = max(min_distance_for_height, min_distance_for_width)
    distance_start = distance_end / push_in_ratio

    print(f"Combined subject half-height={half_height:.3f}, half-width={half_width:.3f}; "
          f"camera FOV requires distance_end>={distance_end:.2f} (using margin {margin}x)")

    # Mostly-frontal, slightly-elevated viewing direction (matches the
    # earlier studio composition's camera angle).
    direction = Vector((0.0, -1.0, 0.25)).normalized()

    def set_cam_at_distance(distance):
        cam.location = gap_target + direction * distance
        look_dir = gap_target - cam.location
        cam.rotation_euler = look_dir.to_track_quat("-Z", "Y").to_euler()

    set_cam_at_distance(distance_start)
    cam.keyframe_insert(data_path="location", frame=scene.frame_start)

    set_cam_at_distance(distance_end)
    cam.keyframe_insert(data_path="location", frame=scene.frame_end)

    # Orientation is constant (we only move along the view ray), so set it
    # once rather than keyframing it.
    set_cam_at_distance(distance_end)
    fixed_rotation = cam.rotation_euler.copy()
    set_cam_at_distance(distance_start)
    cam.rotation_euler = fixed_rotation

    for fcurve in get_fcurves(cam.animation_data.action):
        if fcurve.data_path == "location":
            for kf in fcurve.keyframe_points:
                kf.interpolation = "BEZIER"
                kf.easing = "EASE_IN_OUT"

    print(f"Step 3 done: camera aimed at gap {tuple(round(v, 3) for v in gap_target)}, "
          f"pushing in from distance {distance_start} (frame {scene.frame_start}) "
          f"to {distance_end} (frame {scene.frame_end}).")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

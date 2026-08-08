"""
compose_studio_scene.py
Arranges the magnet subject on the studio backdrop built by
setup_studio_backdrop.py: orients the cove so its floor faces the camera's
preferred side, lifts the subject to rest on the floor instead of clipping
through it, and places a camera framed on the subject (not the whole set).

Run headless, pointed at the blend file produced by setup_studio_backdrop.py:
  blender --background blender/magnet_scene_with_backdrop.blend --python compose_studio_scene.py -- \
      --output blender/magnet_scene_with_backdrop.blend
"""

import bpy
import sys
import math
from mathutils import Vector


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "subject_y": -5.0}
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


def subject_meshes():
    return [o for o in bpy.data.objects if o.type == "MESH" and o.name != "StudioBackdrop"]


def world_bbox(objs):
    coords = []
    for obj in objs:
        for corner in obj.bound_box:
            coords.append(obj.matrix_world @ Vector(corner))
    min_v = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
    max_v = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
    return min_v, max_v


def main():
    subject_y = float(ARGS["subject_y"])

    backdrop = bpy.data.objects.get("StudioBackdrop")
    if backdrop is None:
        raise SystemExit("StudioBackdrop object not found - run setup_studio_backdrop.py first")

    # The backdrop was built with its floor receding away from the origin
    # toward +Y and the wall at Y=0. The magnet's photogenic side faces -Y,
    # so rotate the whole cove 180 degrees about Z: the floor then extends
    # toward -Y (matching the camera side) and the wall recedes to the
    # background at Y=0.
    backdrop.rotation_euler[2] = math.pi

    # Find the subject's root object (top of the import hierarchy) so
    # moving it carries the whole hierarchy with it.
    subjects = subject_meshes()
    if not subjects:
        raise SystemExit("No subject mesh objects found alongside StudioBackdrop")
    root = subjects[0]
    while root.parent is not None:
        root = root.parent

    # Lift the subject so its lowest point rests on the floor (Z=0) instead
    # of clipping through it, and place it out on the floor's flat area.
    min_v, _ = world_bbox(subjects)
    root.location.z -= min_v.z
    root.location.y += subject_y

    # Re-measure after the move, then frame a camera on the subject alone
    # (not the much larger backdrop) for a normal product-shot composition.
    min_v, max_v = world_bbox(subjects)
    center = (min_v + max_v) / 2
    radius = max((max_v - min_v).length / 2, 0.01)
    # A wider multiplier than a bare-object shot, so the floor/wall context
    # around the subject is visible. The offset is mostly along -Y (facing
    # the subject head-on across the floor, toward the wall) with only a
    # slight elevation - an equal X/Y diagonal offset would put the camera
    # almost level with the floor, grazing across its huge width instead of
    # looking at the subject.
    distance = radius * 9.0

    cam_data = bpy.data.cameras.new("Camera") if not bpy.data.objects.get("Camera") else None
    if cam_data is not None:
        cam_obj = bpy.data.objects.new("Camera", cam_data)
        bpy.context.collection.objects.link(cam_obj)
    else:
        cam_obj = bpy.data.objects["Camera"]
    bpy.context.scene.camera = cam_obj

    cam_obj.location = center + Vector((0, -distance, distance * 0.25))
    direction = center - cam_obj.location
    cam_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    if not bpy.data.objects.get("Light"):
        light_data = bpy.data.lights.new("Light", type="SUN")
        light_data.energy = 2
        light_obj = bpy.data.objects.new("Light", light_data)
        bpy.context.collection.objects.link(light_obj)
        light_obj.location = center + Vector((distance, -distance, distance))

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

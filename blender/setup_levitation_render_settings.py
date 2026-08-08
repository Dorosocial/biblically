"""
setup_levitation_render_settings.py
Step 4: Configures render settings for the levitation scene:
- Engine: EEVEE Next (Blender 5.x's BLENDER_EEVEE identifier) with ray
  tracing enabled.
- Resolution: 1920x1080 (16:9).
- Camera: subtle depth of field.

Requires Blender 4.2+ (BLENDER_EEVEE_NEXT was merged into the
'BLENDER_EEVEE' identifier as the only EEVEE from 4.2 onward; the
'use_raytracing' property does not exist on Blender 4.0's classic EEVEE).

Run headless, pointed at the existing blend file:
  /opt/blender-5.2.0/blender --background blender/magnet_levitation.blend --python setup_levitation_render_settings.py -- \
      --output blender/magnet_levitation.blend
"""

import bpy
import sys


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "fstop": "2.8", "samples": "32"}
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


def main():
    scene = bpy.context.scene
    render = scene.render

    engines = [item.identifier for item in render.bl_rna.properties["engine"].enum_items]
    if "BLENDER_EEVEE" not in engines:
        raise SystemExit(f"ERROR: BLENDER_EEVEE engine not available in this Blender build. "
                          f"Available engines: {engines}")
    render.engine = "BLENDER_EEVEE"

    if not hasattr(scene.eevee, "use_raytracing"):
        raise SystemExit("ERROR: scene.eevee.use_raytracing does not exist - this Blender build's "
                          "EEVEE does not support ray tracing (need Blender 4.2+).")
    scene.eevee.use_raytracing = True

    render.resolution_x = 1920
    render.resolution_y = 1080
    render.resolution_percentage = 100

    # This environment has no GPU (no /dev/dri), so EEVEE Next's ray tracing
    # runs on CPU software rasterization (Mesa llvmpipe) - much slower than
    # a real GPU. 32 samples was visually indistinguishable from the 64
    # default in test renders of this scene (simple geometry, smooth HDRI
    # lighting) but roughly halves render time, which matters a lot when
    # every frame of a 150-frame animation pays that cost.
    scene.eevee.taa_render_samples = int(ARGS["samples"])

    cam = bpy.data.objects.get("Camera")
    if cam is None:
        raise SystemExit("ERROR: no Camera object found - run setup_levitation_camera.py first")

    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = None
    # Focus distance matches the gap between the magnets, computed the same
    # way setup_levitation_camera.py finds it (BottomMagnet top / TopMagnet
    # bottom midpoint at the settled frame).
    bottom = bpy.data.objects.get("BottomMagnet")
    top = bpy.data.objects.get("TopMagnet")
    if bottom and top:
        from mathutils import Vector
        settle_frame = scene.frame_end // 2 if scene.frame_end else scene.frame_end
        scene.frame_set(settle_frame)

        def world_bbox(objs):
            coords = []
            for obj in objs:
                for corner in obj.bound_box:
                    coords.append(obj.matrix_world @ Vector(corner))
            min_v = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
            max_v = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
            return min_v, max_v

        bottom_meshes = [o for o in bottom.children_recursive if o.type == "MESH"]
        top_meshes = [o for o in top.children_recursive if o.type == "MESH"]
        _, bottom_max = world_bbox(bottom_meshes)
        top_min, _ = world_bbox(top_meshes)
        gap_z = (bottom_max.z + top_min.z) / 2
        focus_distance = (cam.location - Vector((0.0, 0.0, gap_z))).length
        cam.data.dof.focus_distance = focus_distance
        scene.frame_set(scene.frame_start)
        print(f"Focus distance set to {focus_distance:.3f} (gap at z={gap_z:.3f})")

    # A high f-stop number = a subtler (less blurry) depth of field, so a
    # moderately high value keeps the effect present but understated -
    # a "premium" look rather than an obviously blurry background.
    cam.data.dof.aperture_fstop = float(ARGS["fstop"])

    print(f"Step 4 done: engine={render.engine}, use_raytracing={scene.eevee.use_raytracing}, "
          f"resolution={render.resolution_x}x{render.resolution_y}, "
          f"DOF enabled with aperture_fstop={cam.data.dof.aperture_fstop}")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

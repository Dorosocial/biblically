"""
build_render_settings.py
Configures EEVEE Next + ray tracing render settings for the rotating-rod
scene. Split out from the scene-building scripts so sample count / quality
can be changed independently (low samples while iterating, higher for the
final render) without re-running the rig/camera/animation setup.

IMPORTANT FINDING: the default trace_max_roughness=0.5 made this scene's
ray tracing ~2.3x more expensive per sample than a similarly-sized scene
without an emissive object (76.6s -> 33.3s/frame at equal sample counts
after setting it to 0.0). trace_max_roughness controls how rough a surface
can be before EEVEE falls back to cheaper light-probe-based reflections
instead of full ray traces; the chrome ball (roughness ~0.04) and rod
(~0.25) don't need it above their own roughness values, and the diffuse
grid floor material was needlessly ray-tracing reflections of the bright
emissive trajectory curve at 0.5. No visible quality loss in test renders.

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/build_render_settings.py -- \
      --output rotating_rod/scene.blend --samples 8
"""

import bpy
import sys


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": None, "samples": "8", "fstop": "4.0"}
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
        raise SystemExit(f"ERROR: BLENDER_EEVEE engine not available. Available: {engines}")
    render.engine = "BLENDER_EEVEE"

    if not hasattr(scene.eevee, "use_raytracing"):
        raise SystemExit("ERROR: scene.eevee.use_raytracing not available - need Blender 4.2+.")
    scene.eevee.use_raytracing = True
    scene.eevee.taa_render_samples = int(ARGS["samples"])
    scene.eevee.ray_tracing_options.trace_max_roughness = 0.0

    render.resolution_x = 1080
    render.resolution_y = 1920
    render.resolution_percentage = 100

    print(f"Render settings: engine={render.engine}, raytracing={scene.eevee.use_raytracing}, "
          f"samples={scene.eevee.taa_render_samples}, trace_max_roughness="
          f"{scene.eevee.ray_tracing_options.trace_max_roughness}, "
          f"res={render.resolution_x}x{render.resolution_y}")

    if ARGS["output"]:
        bpy.ops.wm.save_as_mainfile(filepath=ARGS["output"])
        print(f"Saved: {ARGS['output']}")
    else:
        bpy.ops.wm.save_mainfile()
        print("Saved changes to the existing blend file")


if __name__ == "__main__":
    main()

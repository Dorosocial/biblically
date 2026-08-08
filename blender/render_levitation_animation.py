"""
render_levitation_animation.py
Step 5: Renders the full animation as a PNG image sequence.

NOTE: this Blender build's `image_settings.file_format` enum rejects
'FFMPEG' at assignment time (TypeError) despite
`bpy.app.build_options.codec_ffmpeg` reporting True and the static enum
definition listing it - the runtime dynamic enum for this property excludes
it in this build/environment. Rather than fight that, we render frames as
PNGs and mux them into an MP4 with a standalone `ffmpeg` binary afterward
(see encode_video.sh).

Run headless:
  blender --background blender/magnet_levitation.blend --python render_levitation_animation.py -- \
      --output /path/to/frames/frame_
"""

import bpy
import sys


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"output": "frames/frame_"}
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

    render.image_settings.file_format = "PNG"
    render.image_settings.color_mode = "RGB"
    render.filepath = ARGS["output"]
    render.use_file_extension = True

    print(f"Rendering frames {scene.frame_start}-{scene.frame_end} at "
          f"{render.resolution_x}x{render.resolution_y}, engine={render.engine}, "
          f"raytracing={scene.eevee.use_raytracing}, samples={scene.eevee.taa_render_samples} "
          f"to {render.filepath}####.png")

    bpy.ops.render.render(animation=True)

    print(f"Render complete: {scene.frame_end - scene.frame_start + 1} frames written to "
          f"{render.filepath}####.png")


if __name__ == "__main__":
    main()

"""
render_split_test.py
Renders the 24.5-27.5s window (frames 736-826 at 30fps) from both
FixedCamera and RotatingCamera as PNG sequences, for the split-screen shot
test. Composite into a single side-by-side frame happens afterward with
ffmpeg (see compose_split_screen.sh).

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/render_split_test.py -- \
      --out-dir rotating_rod/split_test_frames --start 736 --end 826
"""

import bpy
import sys
import time


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"out_dir": "split_test_frames", "start": "736", "end": "826"}
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
    out_dir = ARGS["out_dir"].rstrip("/")
    start = int(ARGS["start"])
    end = int(ARGS["end"])

    scene = bpy.context.scene
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.use_file_extension = True

    t_start = time.time()
    for cam_name, subdir in [("FixedCamera", "fixed"), ("RotatingCamera", "rotating")]:
        scene.camera = bpy.data.objects[cam_name]
        for f in range(start, end + 1):
            scene.frame_set(f)
            scene.render.filepath = f"{out_dir}/{subdir}/frame_{f:04d}"
            bpy.ops.render.render(write_still=True)
        print(f"{cam_name}: rendered frames {start}-{end} ({time.time() - t_start:.1f}s elapsed total)")

    print(f"Done. Total time: {time.time() - t_start:.1f}s")


if __name__ == "__main__":
    main()

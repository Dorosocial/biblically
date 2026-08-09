"""
render_rough_cut.py
Renders every frame of the full 57.2865s timeline, cutting between
FixedCamera and RotatingCamera per SHOT_LIST.md's timing table. No
graphics overlays or audio yet - this is a fast draft pass purely to
validate overall pacing/timing before investing in polish or a
full-quality render.

Run headless:
  blender --background rotating_rod/scene.blend --python rotating_rod/render_rough_cut.py -- \
      --out-dir rotating_rod/rough_cut_frames --samples 3 --res-percent 50
"""

import bpy
import sys
import time


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    args = {"out_dir": "rough_cut_frames", "samples": "3", "res_percent": "50",
             "start": None, "end": None, "step": "1"}
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

# (start_seconds, camera_name) - camera holds until the next entry's start
# time. Matches SHOT_LIST.md's table.
SHOT_TIMING = [
    (0.0, "FixedCamera"),      # establish
    (14.0, "FixedCamera"),     # reset + annotated orbit (arrow not yet built)
    (38.0, "FixedCamera"),     # split-screen window - placeholder single-cam for now
    (46.0, "FixedCamera"),     # both-arrows reinforcement
    (53.0, "FixedCamera"),     # closing
]


def camera_for_time(t):
    cam = SHOT_TIMING[0][1]
    for (start, cam_name) in SHOT_TIMING:
        if t >= start:
            cam = cam_name
        else:
            break
    return cam


def main():
    scene = bpy.context.scene
    fps = scene.render.fps
    out_dir = ARGS["out_dir"].rstrip("/")

    scene.render.resolution_percentage = int(ARGS["res_percent"])
    scene.eevee.taa_render_samples = int(ARGS["samples"])
    scene.render.image_settings.file_format = "PNG"

    start_frame = int(ARGS["start"]) if ARGS["start"] else scene.frame_start
    end_frame = int(ARGS["end"]) if ARGS["end"] else scene.frame_end
    step = int(ARGS["step"])

    frames = list(range(start_frame, end_frame + 1, step))
    t0 = time.time()
    for i, frame in enumerate(frames):
        t = (frame - 1) / fps
        cam_name = camera_for_time(t)
        scene.camera = bpy.data.objects[cam_name]
        scene.frame_set(frame)
        scene.render.filepath = f"{out_dir}/frame_{frame:04d}"
        bpy.ops.render.render(write_still=True)
        if i % 10 == 0:
            elapsed = time.time() - t0
            eta = elapsed / (i + 1) * (len(frames) - i - 1)
            print(f"frame {frame} (t={t:.1f}s, {cam_name}): {elapsed:.0f}s elapsed, ETA {eta:.0f}s")

    print(f"Done: frames {start_frame}-{end_frame} in {time.time()-t0:.0f}s")


if __name__ == "__main__":
    main()

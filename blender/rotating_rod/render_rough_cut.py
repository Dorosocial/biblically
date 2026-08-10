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
import subprocess
import os


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
# time. Matches SHOT_LIST.md's table. "SPLIT" means both cameras,
# composited side-by-side (left=FixedCamera, right=RotatingCamera).
SHOT_TIMING = [
    (0.0, "FixedCamera"),      # establish
    (14.0, "FixedCamera"),     # reset + annotated orbit (arrow not yet built)
    (38.0, "SPLIT"),           # split-screen: left=outside, right=rotating frame
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


def render_split_frame(scene, out_path, tmp_dir):
    """Renders FixedCamera and RotatingCamera separately, then crops each
    to its center half-width and hstacks them into a single 1080x1920
    frame at out_path - same technique as the original isolated
    split-screen test (test_renders/split_screen_isolated_test.mp4),
    now wired into the main render path instead of a one-off script."""
    res_x = scene.render.resolution_x * scene.render.resolution_percentage // 100
    res_y = scene.render.resolution_y * scene.render.resolution_percentage // 100
    half_w = res_x // 2

    left_path = f"{tmp_dir}/split_left.png"
    right_path = f"{tmp_dir}/split_right.png"

    # OutwardArrow (build_arrows.py) shows the apparent centrifugal
    # illusion, which only makes sense from inside the rotating frame -
    # there's no real outward force to show from outside. It has its own
    # 42-46s time window baked in already; force it hidden for the
    # FixedCamera pass regardless, then restore whatever that time-window
    # bake says for the RotatingCamera pass.
    outward_arrow = bpy.data.objects.get("OutwardArrow")
    baked_hide_state = outward_arrow.hide_render if outward_arrow else None

    if outward_arrow:
        outward_arrow.hide_render = True
    scene.camera = bpy.data.objects["FixedCamera"]
    scene.render.filepath = left_path[:-4]  # Blender appends .png itself
    bpy.ops.render.render(write_still=True)

    if outward_arrow:
        outward_arrow.hide_render = baked_hide_state
    scene.camera = bpy.data.objects["RotatingCamera"]
    scene.render.filepath = right_path[:-4]
    bpy.ops.render.render(write_still=True)

    crop_x = (res_x - half_w) // 2
    subprocess.run([
        "ffmpeg", "-y", "-i", left_path, "-i", right_path,
        "-filter_complex",
        f"[0:v]crop={half_w}:{res_y}:{crop_x}:0[left];"
        f"[1:v]crop={half_w}:{res_y}:{crop_x}:0[right];"
        f"[left][right]hstack=inputs=2[out]",
        "-map", "[out]", out_path,
    ], check=True, capture_output=True)


def main():
    scene = bpy.context.scene
    fps = scene.render.fps
    out_dir = ARGS["out_dir"].rstrip("/")
    tmp_dir = f"{out_dir}/_tmp_split"
    os.makedirs(tmp_dir, exist_ok=True)

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
        scene.frame_set(frame)
        out_path = f"{out_dir}/frame_{frame:04d}.png"
        if cam_name == "SPLIT":
            render_split_frame(scene, out_path, tmp_dir)
        else:
            scene.camera = bpy.data.objects[cam_name]
            scene.render.filepath = out_path[:-4]
            bpy.ops.render.render(write_still=True)
        if i % 10 == 0:
            elapsed = time.time() - t0
            eta = elapsed / (i + 1) * (len(frames) - i - 1)
            print(f"frame {frame} (t={t:.1f}s, {cam_name}): {elapsed:.0f}s elapsed, ETA {eta:.0f}s")

    print(f"Done: frames {start_frame}-{end_frame} in {time.time()-t0:.0f}s")


if __name__ == "__main__":
    main()

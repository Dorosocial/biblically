#!/usr/bin/env python3
"""
compose_final.py
Assembles rendered PNG frames + mixed audio + the "CENTRIFUGAL FORCE"
text overlay into one final video.

Usage:
  python3 compose_final.py <frames_dir> <fps> <audio_file> <output.mp4>

Text timing matches SHOT_LIST.md's 0:33-0:38 transition row ("This is
where centrifugal force comes in") through the end of the 0:38-0:46
split-screen window - fades in at 33.5s, holds, fades out at 46s.
"""

import subprocess
import sys

TEXT_LINE1 = "CENTRIFUGAL"
TEXT_LINE2 = "FORCE"
FADE_IN_START = 33.5
FADE_IN_END = 34.5
FADE_OUT_START = 45.0
FADE_OUT_END = 46.0
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def main():
    if len(sys.argv) != 5:
        print("Usage: compose_final.py <frames_dir> <fps> <audio_file> <output.mp4>")
        sys.exit(1)
    frames_dir, fps, audio_file, output = sys.argv[1:]

    alpha_expr = (
        f"if(lt(t,{FADE_IN_START}),0,"
        f"if(lt(t,{FADE_IN_END}),(t-{FADE_IN_START})/{FADE_IN_END - FADE_IN_START},"
        f"if(lt(t,{FADE_OUT_START}),1,"
        f"if(lt(t,{FADE_OUT_END}),({FADE_OUT_END}-t)/{FADE_OUT_END - FADE_OUT_START},0))))"
    )
    # fontsize as an expression (w/16) rather than a fixed pixel value, so
    # it scales correctly regardless of render resolution - caught during
    # testing: a fixed 64px, correct for a final 1080-wide render, way
    # overflowed a 432px-wide draft-resolution test frame (text ran off
    # both edges), which would have looked like a real bug at final res
    # if not tested at the resolution actually being composed.
    line1 = (
        f"drawtext=fontfile={FONT}:text='{TEXT_LINE1}':fontsize=w/16:fontcolor=white:"
        f"borderw=3:bordercolor=black@0.6:x=(w-text_w)/2:y=h*0.12:alpha='{alpha_expr}'"
    )
    line2 = (
        f"drawtext=fontfile={FONT}:text='{TEXT_LINE2}':fontsize=w/16:fontcolor=white:"
        f"borderw=3:bordercolor=black@0.6:x=(w-text_w)/2:y=h*0.12+w/13:alpha='{alpha_expr}'"
    )

    cmd = [
        "ffmpeg", "-y",
        "-framerate", fps, "-i", f"{frames_dir}/frame_%04d.png",
        "-i", audio_file,
        "-vf", f"{line1},{line2}",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
        "-c:a", "aac", "-b:a", "128k", "-shortest",
        output,
    ]
    subprocess.run(cmd, check=True)
    print(f"Final video written to {output}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
compose_audio.py
Mixes the narration track with sound effects at the moments the shot list
calls for, into a single audio track ready to mux against a rendered
video. First pass at placement - adjust CUES below as needed once heard
against picture.

Usage: python3 compose_audio.py <output.mp3>
"""

import subprocess
import sys
import os

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "audio")
NARRATION = os.path.join(AUDIO_DIR, "8f8241d5-aballrotating.mp3")

# (time_seconds, filename, gain_db) - gain lets loud SFX sit under the
# narration rather than stepping on it.
CUES = [
    (7.0, "26725b75-whoosh_fast_11786274753897.mp3", -6),      # release 1: "shoots straight off"
    (14.0, "c3471221-soft_whoosh_reset_11786276050789.mp3", -8),  # reset to attached
    (25.0, "3aeefebf-snaprelease.mp3", -6),                    # release 2
    (33.5, "76620494-whoosh_transition_sw_11786275978826.mp3", -6),  # transition into centrifugal force
    (38.3, "b64f616d-scifi_blip_21786275317993.mp3", -10),     # "CENTRIFUGAL FORCE" text beat
    (42.0, "3aeefebf-snaprelease.mp3", -6),                    # release 3 (split-screen)
    (53.0, "c974b909-camera_shutter_click.mp3", -12),          # closing beat
]


def main():
    if len(sys.argv) != 2:
        print("Usage: compose_audio.py <output.mp3>")
        sys.exit(1)
    output = sys.argv[1]

    inputs = ["-i", NARRATION]
    filter_parts = []
    mix_labels = ["[0:a]"]
    for i, (t, fname, gain) in enumerate(CUES):
        inputs += ["-i", os.path.join(AUDIO_DIR, fname)]
        label = f"[sfx{i}]"
        filter_parts.append(
            f"[{i+1}:a]volume={gain}dB,adelay={int(t*1000)}|{int(t*1000)}{label}"
        )
        mix_labels.append(label)

    filter_complex = ";".join(filter_parts) + ";" + "".join(mix_labels) + \
        f"amix=inputs={len(mix_labels)}:duration=first:dropout_transition=0[out]"

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", filter_complex,
        "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "2",
        output,
    ]
    subprocess.run(cmd, check=True)
    print(f"Mixed audio written to {output}")


if __name__ == "__main__":
    main()

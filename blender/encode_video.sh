#!/usr/bin/env bash
# encode_video.sh
# Muxes the PNG frame sequence from render_levitation_animation.py into an
# MP4 (H.264) using a standalone ffmpeg binary. Needed because this
# environment's Blender build rejects 'FFMPEG' as an image_settings.file_format
# value at runtime (see render_levitation_animation.py for details), so
# Blender's own video muxer isn't usable here.
#
# Usage:
#   ./encode_video.sh <frames_dir>/frame_ <output.mp4> [fps]

set -euo pipefail

FRAMES_PREFIX="${1:?Usage: encode_video.sh <frames_dir>/frame_ <output.mp4> [fps]}"
OUTPUT="${2:?Usage: encode_video.sh <frames_dir>/frame_ <output.mp4> [fps]}"
FPS="${3:-30}"

ffmpeg -y -framerate "$FPS" -i "${FRAMES_PREFIX}%04d.png" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  "$OUTPUT"

echo "Encoded: $OUTPUT"

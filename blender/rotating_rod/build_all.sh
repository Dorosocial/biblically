#!/usr/bin/env bash
# build_all.sh
# Rebuilds rotating_rod/scene.blend from scratch, in order, so the full
# pipeline can be reproduced/re-run after editing any one stage. Run from
# the blender/ directory (paths below are relative to it).
#
# Usage: ./rotating_rod/build_all.sh [blender_binary]

set -euo pipefail
BLENDER="${1:-/opt/blender-5.2.0/blender}"
cd "$(dirname "$0")/.."   # -> blender/

SCENE=rotating_rod/scene.blend

"$BLENDER" --background magnet_scene_with_backdrop.blend \
  --python rotating_rod/build_rig.py -- --output "$SCENE"

"$BLENDER" --background "$SCENE" \
  --python rotating_rod/build_motion.py -- --output "$SCENE"

"$BLENDER" --background "$SCENE" \
  --python rotating_rod/build_circular_backdrop.py -- --output "$SCENE" --wall-radius 140

"$BLENDER" --background "$SCENE" \
  --python rotating_rod/build_cameras.py -- --output "$SCENE"

"$BLENDER" --background "$SCENE" \
  --python rotating_rod/build_arrows.py -- --output "$SCENE"

"$BLENDER" --background "$SCENE" \
  --python rotating_rod/build_render_settings.py -- --output "$SCENE" --samples 8

echo "Done. $SCENE rebuilt."

#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/overlay-stills-fixed
mkdir -p "$OUT"

PAIRS=(
  "m-attndecline2-start 1094"
  "m-attndecline2-mid 1223"
  "m-attndecline2-end 1352"
  "m-dotform1b-start 1373"
  "m-dotform1b-mid 1460"
  "m-dotform1b-end 1548"
  "m-splitfocus2-start 5179"
  "m-splitfocus2-mid 5307"
  "m-splitfocus2-end 5435"
  "m-soundripple2-start 5456"
  "m-soundripple2-mid 5508"
  "m-soundripple2-end 5561"
  "m-hourglass2-start 6342"
  "m-hourglass2-mid 6385"
  "m-hourglass2-end 6429"
)

for pair in "${PAIRS[@]}"; do
  name=$(echo "$pair" | cut -d' ' -f1)
  frame=$(echo "$pair" | cut -d' ' -f2)
  echo "Rendering $name @ frame $frame"
  npx remotion still src/index.ts TooMuchBrainrot "$OUT/$name.png" --frame="$frame" >/dev/null 2>"$OUT/$name.log" || (cat "$OUT/$name.log" && exit 1)
done

echo "Done. Stills in $OUT"

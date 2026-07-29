#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/vo-audio
mkdir -p "$OUT"

# name start end   (end exclusive, per schedule.ts VO_CLIPS)
CLIPS=(
  "nl-intro 0 264"
  "nl-10 2243 2517"
  "nl-outro 11658 11736"
)

for c in "${CLIPS[@]}"; do
  name=$(echo "$c" | cut -d' ' -f1)
  start=$(echo "$c" | cut -d' ' -f2)
  end=$(echo "$c" | cut -d' ' -f3)
  last=$((end - 1))
  echo "Rendering $name frames $start-$last"
  npx remotion render src/index.ts TooMuchBrainrot "$OUT/$name.wav" --frames="$start-$last" --codec=wav >"$OUT/$name.render.log" 2>&1
done

echo "Done. Audio in $OUT"

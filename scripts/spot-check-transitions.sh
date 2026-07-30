#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/transition-check
mkdir -p "$OUT"

# transition-name boundary-frame (where the new Sequence begins)
BOUNDARIES=(
  "nl3-to-nl4 948"
  "nl9-to-ex2preview 2243"
  "nl27-to-ex10preview 9584"
  "nl31-to-nl32 10880"
)

for pair in "${BOUNDARIES[@]}"; do
  name=$(echo "$pair" | cut -d' ' -f1)
  boundary=$(echo "$pair" | cut -d' ' -f2)
  for offset in -3 -2 -1 0 1 2 3; do
    frame=$((boundary + offset))
    n="${name}_${boundary}${offset}"
    echo "Rendering $n @ frame $frame"
    npx remotion still src/index.ts TooMuchBrainrot "$OUT/$n.png" --frame="$frame" >/dev/null 2>"$OUT/$n.log" || (cat "$OUT/$n.log" && exit 1)
  done
done
echo "Done."

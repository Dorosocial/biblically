#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/overlay-stills
mkdir -p "$OUT"

PAIRS=(
  "nl-intro-proof 100"
  "img-nl2-start 282"
  "img-nl2-mid 677"
  "img-nl2-end 1073"
  "img-nl3-start 1094"
  "img-nl3-mid 1321"
  "img-nl3-end 1548"
  "img-nl23-start 7299"
  "img-nl23-mid 7520"
  "img-nl23-end 7741"
  "img-nl26-start 9187"
  "img-nl26-mid 9345"
  "img-nl26-end 9504"
  "img-nl32-start 10883"
  "img-nl32-mid 10988"
  "img-nl32-end 11093"
  "img-nl34-start 11412"
  "img-nl34-mid 11526"
  "img-nl34-end 11640"
  "m-attndecline-start 1569"
  "m-attndecline-mid 1600"
  "m-attndecline-end 1631"
  "m-dotform1-start 1652"
  "m-dotform1-mid 1681"
  "m-dotform1-end 1711"
  "m-breathe-start 4165"
  "m-breathe-mid 4344"
  "m-breathe-end 4523"
  "m-splitfocus-start 4544"
  "m-splitfocus-mid 4633"
  "m-splitfocus-end 4723"
  "m-soundripple-start 5582"
  "m-soundripple-mid 5734"
  "m-soundripple-end 5886"
  "m-hourglass-start 6450"
  "m-hourglass-mid 6601"
  "m-hourglass-end 6753"
  "m-tension-start 9525"
  "m-tension-mid 9545"
  "m-tension-end 9566"
  "m-trailpreview-start 9587"
  "m-trailpreview-mid 9713"
  "m-trailpreview-end 9839"
  "m-mirroreddot-start 10145"
  "m-mirroreddot-mid 10199"
  "m-mirroreddot-end 10253"
)

for pair in "${PAIRS[@]}"; do
  name=$(echo "$pair" | cut -d' ' -f1)
  frame=$(echo "$pair" | cut -d' ' -f2)
  echo "Rendering $name @ frame $frame"
  npx remotion still src/index.ts TooMuchBrainrot "$OUT/$name.png" --frame="$frame" >/dev/null 2>"$OUT/$name.log" || (cat "$OUT/$name.log" && exit 1)
done

echo "Done. Stills in $OUT"

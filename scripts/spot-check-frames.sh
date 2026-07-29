#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/stills
mkdir -p "$OUT"

# name frame
PAIRS=(
  "intro-start 50"
  "intro-mid 800"
  "intro-end 1600"
  "ex1-start 1720"
  "ex1-mid 1864"
  "ex1-mid-plus15 1879"
  "ex1-end 2005"
  "ex2-start 2525"
  "ex2-mid 2742"
  "ex2-end 2960"
  "ex3-start 3120"
  "ex3-mid 3335"
  "ex3-end 3552"
  "ex4-start 3810"
  "ex4-mid 3982"
  "ex4-mid-plus15 3997"
  "ex4-end 4155"
  "ex5-start 4735"
  "ex5-mid 4951"
  "ex5-end 5168"
  "ex6-start 5900"
  "ex6-mid 6114"
  "ex6-end 6330"
  "ex7-start 6765"
  "ex7-mid 7026"
  "ex7-mid-plus15 7041"
  "ex7-end 7288"
  "ex8-start 8065"
  "ex8-mid 8283"
  "ex8-end 8500"
  "ex9-start 8742"
  "ex9-mid 8959"
  "ex9-end 9176"
  "ex10-start 9850"
  "ex10-shake 9970"
  "ex10-shake-plus5 9975"
  "ex10-end 10134"
  "ex11-start 10264"
  "ex11-mid 10436"
  "ex11-end 10608"
)

for pair in "${PAIRS[@]}"; do
  name=$(echo "$pair" | cut -d' ' -f1)
  frame=$(echo "$pair" | cut -d' ' -f2)
  echo "Rendering $name @ frame $frame"
  npx remotion still src/index.ts TooMuchBrainrot "$OUT/$name.png" --frame="$frame" >/dev/null 2>"$OUT/$name.log" || (cat "$OUT/$name.log" && exit 1)
done

echo "Done. Stills in $OUT"

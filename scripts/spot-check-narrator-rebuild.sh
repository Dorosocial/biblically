#!/usr/bin/env bash
set -e
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
OUT=/tmp/claude-0/-home-user-biblically/14ac6e58-7d1d-585b-b201-40ac637f68ef/scratchpad/narrator-rebuild-check
mkdir -p "$OUT"

echo "Rendering nl2-thought-start @ 402"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-thought-start.png" --frame=402 >/dev/null 2>"$OUT/nl2-thought-start.log" || (cat "$OUT/nl2-thought-start.log" && exit 1)
echo "Rendering nl2-thought-mid @ 433"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-thought-mid.png" --frame=433 >/dev/null 2>"$OUT/nl2-thought-mid.log" || (cat "$OUT/nl2-thought-mid.log" && exit 1)
echo "Rendering nl2-thought-end @ 464"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-thought-end.png" --frame=464 >/dev/null 2>"$OUT/nl2-thought-end.log" || (cat "$OUT/nl2-thought-end.log" && exit 1)
echo "Rendering nl2-fiveObjects-start @ 553"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-fiveObjects-start.png" --frame=553 >/dev/null 2>"$OUT/nl2-fiveObjects-start.log" || (cat "$OUT/nl2-fiveObjects-start.log" && exit 1)
echo "Rendering nl2-fiveObjects-mid @ 602"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-fiveObjects-mid.png" --frame=602 >/dev/null 2>"$OUT/nl2-fiveObjects-mid.log" || (cat "$OUT/nl2-fiveObjects-mid.log" && exit 1)
echo "Rendering nl2-fiveObjects-end @ 652"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl2-fiveObjects-end.png" --frame=652 >/dev/null 2>"$OUT/nl2-fiveObjects-end.log" || (cat "$OUT/nl2-fiveObjects-end.log" && exit 1)
echo "Rendering nl3-start @ 673"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl3-start.png" --frame=673 >/dev/null 2>"$OUT/nl3-start.log" || (cat "$OUT/nl3-start.log" && exit 1)
echo "Rendering nl3-mid @ 801"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl3-mid.png" --frame=801 >/dev/null 2>"$OUT/nl3-mid.log" || (cat "$OUT/nl3-mid.log" && exit 1)
echo "Rendering nl3-end @ 930"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl3-end.png" --frame=930 >/dev/null 2>"$OUT/nl3-end.log" || (cat "$OUT/nl3-end.log" && exit 1)
echo "Rendering nl4-start @ 951"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl4-start.png" --frame=951 >/dev/null 2>"$OUT/nl4-start.log" || (cat "$OUT/nl4-start.log" && exit 1)
echo "Rendering nl4-mid @ 1012"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl4-mid.png" --frame=1012 >/dev/null 2>"$OUT/nl4-mid.log" || (cat "$OUT/nl4-mid.log" && exit 1)
echo "Rendering nl4-end @ 1073"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl4-end.png" --frame=1073 >/dev/null 2>"$OUT/nl4-end.log" || (cat "$OUT/nl4-end.log" && exit 1)
echo "Rendering nl5-start @ 1094"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl5-start.png" --frame=1094 >/dev/null 2>"$OUT/nl5-start.log" || (cat "$OUT/nl5-start.log" && exit 1)
echo "Rendering nl5-mid @ 1223"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl5-mid.png" --frame=1223 >/dev/null 2>"$OUT/nl5-mid.log" || (cat "$OUT/nl5-mid.log" && exit 1)
echo "Rendering nl5-end @ 1352"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl5-end.png" --frame=1352 >/dev/null 2>"$OUT/nl5-end.log" || (cat "$OUT/nl5-end.log" && exit 1)
echo "Rendering nl6-start @ 1373"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl6-start.png" --frame=1373 >/dev/null 2>"$OUT/nl6-start.log" || (cat "$OUT/nl6-start.log" && exit 1)
echo "Rendering nl6-mid @ 1460"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl6-mid.png" --frame=1460 >/dev/null 2>"$OUT/nl6-mid.log" || (cat "$OUT/nl6-mid.log" && exit 1)
echo "Rendering nl6-end @ 1548"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl6-end.png" --frame=1548 >/dev/null 2>"$OUT/nl6-end.log" || (cat "$OUT/nl6-end.log" && exit 1)
echo "Rendering nl7-start @ 1569"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl7-start.png" --frame=1569 >/dev/null 2>"$OUT/nl7-start.log" || (cat "$OUT/nl7-start.log" && exit 1)
echo "Rendering nl7-mid @ 1600"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl7-mid.png" --frame=1600 >/dev/null 2>"$OUT/nl7-mid.log" || (cat "$OUT/nl7-mid.log" && exit 1)
echo "Rendering nl7-end @ 1631"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl7-end.png" --frame=1631 >/dev/null 2>"$OUT/nl7-end.log" || (cat "$OUT/nl7-end.log" && exit 1)
echo "Rendering nl9-start @ 2017"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl9-start.png" --frame=2017 >/dev/null 2>"$OUT/nl9-start.log" || (cat "$OUT/nl9-start.log" && exit 1)
echo "Rendering nl9-mid @ 2121"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl9-mid.png" --frame=2121 >/dev/null 2>"$OUT/nl9-mid.log" || (cat "$OUT/nl9-mid.log" && exit 1)
echo "Rendering nl9-end @ 2225"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl9-end.png" --frame=2225 >/dev/null 2>"$OUT/nl9-end.log" || (cat "$OUT/nl9-end.log" && exit 1)
echo "Rendering nl12-start @ 3563"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl12-start.png" --frame=3563 >/dev/null 2>"$OUT/nl12-start.log" || (cat "$OUT/nl12-start.log" && exit 1)
echo "Rendering nl12-mid @ 3622"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl12-mid.png" --frame=3622 >/dev/null 2>"$OUT/nl12-mid.log" || (cat "$OUT/nl12-mid.log" && exit 1)
echo "Rendering nl12-end @ 3681"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl12-end.png" --frame=3681 >/dev/null 2>"$OUT/nl12-end.log" || (cat "$OUT/nl12-end.log" && exit 1)
echo "Rendering nl14-start @ 4165"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl14-start.png" --frame=4165 >/dev/null 2>"$OUT/nl14-start.log" || (cat "$OUT/nl14-start.log" && exit 1)
echo "Rendering nl14-mid @ 4183"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl14-mid.png" --frame=4183 >/dev/null 2>"$OUT/nl14-mid.log" || (cat "$OUT/nl14-mid.log" && exit 1)
echo "Rendering nl14-end @ 4201"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl14-end.png" --frame=4201 >/dev/null 2>"$OUT/nl14-end.log" || (cat "$OUT/nl14-end.log" && exit 1)
echo "Rendering nl15-start @ 4222"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl15-start.png" --frame=4222 >/dev/null 2>"$OUT/nl15-start.log" || (cat "$OUT/nl15-start.log" && exit 1)
echo "Rendering nl15-mid @ 4306"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl15-mid.png" --frame=4306 >/dev/null 2>"$OUT/nl15-mid.log" || (cat "$OUT/nl15-mid.log" && exit 1)
echo "Rendering nl15-end @ 4390"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl15-end.png" --frame=4390 >/dev/null 2>"$OUT/nl15-end.log" || (cat "$OUT/nl15-end.log" && exit 1)
echo "Rendering nl16-start @ 4411"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl16-start.png" --frame=4411 >/dev/null 2>"$OUT/nl16-start.log" || (cat "$OUT/nl16-start.log" && exit 1)
echo "Rendering nl16-mid @ 4467"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl16-mid.png" --frame=4467 >/dev/null 2>"$OUT/nl16-mid.log" || (cat "$OUT/nl16-mid.log" && exit 1)
echo "Rendering nl16-end @ 4523"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl16-end.png" --frame=4523 >/dev/null 2>"$OUT/nl16-end.log" || (cat "$OUT/nl16-end.log" && exit 1)
echo "Rendering nl18-start @ 5179"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl18-start.png" --frame=5179 >/dev/null 2>"$OUT/nl18-start.log" || (cat "$OUT/nl18-start.log" && exit 1)
echo "Rendering nl18-mid @ 5307"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl18-mid.png" --frame=5307 >/dev/null 2>"$OUT/nl18-mid.log" || (cat "$OUT/nl18-mid.log" && exit 1)
echo "Rendering nl18-end @ 5435"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl18-end.png" --frame=5435 >/dev/null 2>"$OUT/nl18-end.log" || (cat "$OUT/nl18-end.log" && exit 1)
echo "Rendering nl19-start @ 5456"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl19-start.png" --frame=5456 >/dev/null 2>"$OUT/nl19-start.log" || (cat "$OUT/nl19-start.log" && exit 1)
echo "Rendering nl19-mid @ 5508"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl19-mid.png" --frame=5508 >/dev/null 2>"$OUT/nl19-mid.log" || (cat "$OUT/nl19-mid.log" && exit 1)
echo "Rendering nl19-end @ 5561"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl19-end.png" --frame=5561 >/dev/null 2>"$OUT/nl19-end.log" || (cat "$OUT/nl19-end.log" && exit 1)
echo "Rendering nl21-start @ 6342"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl21-start.png" --frame=6342 >/dev/null 2>"$OUT/nl21-start.log" || (cat "$OUT/nl21-start.log" && exit 1)
echo "Rendering nl21-mid @ 6385"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl21-mid.png" --frame=6385 >/dev/null 2>"$OUT/nl21-mid.log" || (cat "$OUT/nl21-mid.log" && exit 1)
echo "Rendering nl21-end @ 6429"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl21-end.png" --frame=6429 >/dev/null 2>"$OUT/nl21-end.log" || (cat "$OUT/nl21-end.log" && exit 1)
echo "Rendering nl26-filmstrip-start @ 9429"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl26-filmstrip-start.png" --frame=9429 >/dev/null 2>"$OUT/nl26-filmstrip-start.log" || (cat "$OUT/nl26-filmstrip-start.log" && exit 1)
echo "Rendering nl26-filmstrip-mid @ 9466"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl26-filmstrip-mid.png" --frame=9466 >/dev/null 2>"$OUT/nl26-filmstrip-mid.log" || (cat "$OUT/nl26-filmstrip-mid.log" && exit 1)
echo "Rendering nl26-filmstrip-end @ 9504"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl26-filmstrip-end.png" --frame=9504 >/dev/null 2>"$OUT/nl26-filmstrip-end.log" || (cat "$OUT/nl26-filmstrip-end.log" && exit 1)
echo "Rendering nl27-start @ 9525"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl27-start.png" --frame=9525 >/dev/null 2>"$OUT/nl27-start.log" || (cat "$OUT/nl27-start.log" && exit 1)
echo "Rendering nl27-mid @ 9545"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl27-mid.png" --frame=9545 >/dev/null 2>"$OUT/nl27-mid.log" || (cat "$OUT/nl27-mid.log" && exit 1)
echo "Rendering nl27-end @ 9566"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl27-end.png" --frame=9566 >/dev/null 2>"$OUT/nl27-end.log" || (cat "$OUT/nl27-end.log" && exit 1)
echo "Rendering nl30-start @ 10619"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl30-start.png" --frame=10619 >/dev/null 2>"$OUT/nl30-start.log" || (cat "$OUT/nl30-start.log" && exit 1)
echo "Rendering nl30-mid @ 10640"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl30-mid.png" --frame=10640 >/dev/null 2>"$OUT/nl30-mid.log" || (cat "$OUT/nl30-mid.log" && exit 1)
echo "Rendering nl30-end @ 10662"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl30-end.png" --frame=10662 >/dev/null 2>"$OUT/nl30-end.log" || (cat "$OUT/nl30-end.log" && exit 1)
echo "Rendering nl31-start @ 10683"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl31-start.png" --frame=10683 >/dev/null 2>"$OUT/nl31-start.log" || (cat "$OUT/nl31-start.log" && exit 1)
echo "Rendering nl31-mid @ 10772"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl31-mid.png" --frame=10772 >/dev/null 2>"$OUT/nl31-mid.log" || (cat "$OUT/nl31-mid.log" && exit 1)
echo "Rendering nl31-end @ 10862"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl31-end.png" --frame=10862 >/dev/null 2>"$OUT/nl31-end.log" || (cat "$OUT/nl31-end.log" && exit 1)
echo "Rendering nl32-start @ 10883"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl32-start.png" --frame=10883 >/dev/null 2>"$OUT/nl32-start.log" || (cat "$OUT/nl32-start.log" && exit 1)
echo "Rendering nl32-mid @ 10980"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl32-mid.png" --frame=10980 >/dev/null 2>"$OUT/nl32-mid.log" || (cat "$OUT/nl32-mid.log" && exit 1)
echo "Rendering nl32-end @ 11078"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl32-end.png" --frame=11078 >/dev/null 2>"$OUT/nl32-end.log" || (cat "$OUT/nl32-end.log" && exit 1)
echo "Rendering nl33-start @ 11099"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl33-start.png" --frame=11099 >/dev/null 2>"$OUT/nl33-start.log" || (cat "$OUT/nl33-start.log" && exit 1)
echo "Rendering nl33-mid @ 11245"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl33-mid.png" --frame=11245 >/dev/null 2>"$OUT/nl33-mid.log" || (cat "$OUT/nl33-mid.log" && exit 1)
echo "Rendering nl33-end @ 11391"
npx remotion still src/index.ts TooMuchBrainrot "$OUT/nl33-end.png" --frame=11391 >/dev/null 2>"$OUT/nl33-end.log" || (cat "$OUT/nl33-end.log" && exit 1)
echo "Done."

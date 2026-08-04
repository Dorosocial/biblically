import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const OUT_DIR = path.join(root, "out", "stills");
fs.mkdirSync(OUT_DIR, { recursive: true });

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.join(root, "src", "index.ts"),
  onProgress: () => {},
});

console.log("Selecting composition...");
const composition = await selectComposition({
  serveUrl: bundled,
  id: "NaosWireframe",
});

console.log(
  `Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`
);

// Import the TIMELINE from the compiled data via a small on-the-fly require of
// the same source used by the composition, by re-deriving beat/asset frames
// from the JSON files directly (keeps this script dependency-free of ts-node).
const beatTimings = JSON.parse(
  fs.readFileSync(path.join(root, "public/watch-and-pray/data/wp-beat-timings.json"), "utf8")
);

// We ask the already-bundled composition itself for ground truth by re-using
// the same timeline module through a tiny esbuild-free trick: read the
// compiled manifest we dump separately (see scripts/dump-timeline.mjs).
const manifestPath = path.join(root, "out", "timeline-manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("Missing out/timeline-manifest.json - run scripts/dump-timeline.mjs first");
  process.exit(1);
}
const timeline = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

console.log(`Timeline layers: ${timeline.length}`);

const browser = await openBrowser("chrome");

const manifestOut = [];
let count = 0;
const total = timeline.length * 3;

for (const layer of timeline) {
  const points = [
    { tag: "start", frame: Math.min(layer.from + 8, layer.from + layer.duration - 1) },
    { tag: "mid", frame: layer.from + Math.floor(layer.duration / 2) },
    { tag: "end", frame: Math.max(layer.from, layer.from + layer.duration - 3) },
  ];

  for (const p of points) {
    const fname = `beat${String(layer.beat).padStart(2, "0")}_${layer.kind}_${layer.id}_${p.tag}_f${p.frame}.png`;
    const outPath = path.join(OUT_DIR, fname);
    await renderStill({
      composition,
      serveUrl: bundled,
      output: outPath,
      frame: p.frame,
      puppeteerInstance: browser,
    });
    manifestOut.push({ ...layer, tag: p.tag, frame: p.frame, file: fname });
    count += 1;
    if (count % 20 === 0) console.log(`Rendered ${count}/${total}`);
  }
}

await browser.close();

fs.writeFileSync(
  path.join(root, "out", "stills-manifest.json"),
  JSON.stringify(manifestOut, null, 2)
);

console.log(`Done. Rendered ${count} stills into ${OUT_DIR}`);

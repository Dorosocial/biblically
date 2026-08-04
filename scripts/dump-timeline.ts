import fs from "fs";
import path from "path";
import { TIMELINE } from "../src/data/timeline";

const out = TIMELINE.map((l) => {
  if (l.kind === "figure") {
    return { kind: l.kind, id: l.id, beat: l.beat, from: l.from, duration: l.duration, sideBySide: l.sideBySide, variant: l.variant };
  }
  if (l.kind === "overlay") {
    return { kind: l.kind, id: l.id, beat: l.beat, from: l.from, duration: l.duration, parentFigureId: l.parentFigureId, variant: l.variant };
  }
  return { kind: l.kind, id: l.id, beat: l.beat, from: l.from, duration: l.duration, variant: l.variant };
});

const outPath = path.resolve(__dirname, "../out/timeline-manifest.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} layers to ${outPath}`);

// sanity: total items, beats covered, frame coverage continuity
const figureCount = out.filter((l) => l.kind === "figure").length;
const overlayCount = out.filter((l) => l.kind === "overlay").length;
const cutawayCount = out.filter((l) => l.kind === "cutaway").length;
console.log(`figures=${figureCount} overlays=${overlayCount} cutaways=${cutawayCount} total=${out.length}`);

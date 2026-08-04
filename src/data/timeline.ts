import { BEATS } from "./beatTimings";
import { BEAT_MAPPING } from "./beatMapping";
import { IMAGE_ASSETS } from "./imageAssets";
import { BUCKET_B, BucketBItem } from "./bucketBSpecs";
import {
  EntranceVariant,
  IMAGE_ENTRANCE_CYCLE,
  GRAPHIC_ENTRANCE_CYCLE,
} from "../components/entrances";

export type FigureLayer = {
  kind: "figure";
  id: string;
  beat: number;
  file: string;
  from: number;
  duration: number;
  variant: EntranceVariant;
  /** true when Bucket B overlays are attached (renders inset/side-by-side) */
  sideBySide: boolean;
};

export type OverlayLayer = {
  kind: "overlay";
  id: string;
  beat: number;
  parentFigureId: string;
  item: BucketBItem;
  from: number;
  duration: number;
  variant: EntranceVariant;
};

export type CutawayLayer = {
  kind: "cutaway";
  id: string;
  beat: number;
  item: BucketBItem;
  from: number;
  duration: number;
  variant: EntranceVariant;
};

export type Layer = FigureLayer | OverlayLayer | CutawayLayer;

type ClusterFigure = { type: "figure"; figureId: string; overlayIds: string[] };
type ClusterCutaway = { type: "cutaway"; itemId: string };
type Cluster = ClusterFigure | ClusterCutaway;

const isImageId = (id: string) => id.startsWith("a-") || id.startsWith("c-");

const buildClusters = (items: string[]): Cluster[] => {
  const clusters: Cluster[] = [];
  let current: ClusterFigure | null = null;

  for (const id of items) {
    if (isImageId(id)) {
      current = { type: "figure", figureId: id, overlayIds: [] };
      clusters.push(current);
      continue;
    }
    // Bucket B item
    const spec = BUCKET_B[id];
    if (!spec) {
      throw new Error(`unknown bucket B id ${id}`);
    }
    if (spec.mode === "overlay" && current) {
      current.overlayIds.push(id);
    } else {
      // cutaway mode, or an overlay-mode item with no preceding figure to attach to
      clusters.push({ type: "cutaway", itemId: id });
      current = null;
    }
  }

  return clusters;
};

const clusterWeight = (c: Cluster): number => {
  if (c.type === "cutaway") return 1;
  return 1 + 0.55 * c.overlayIds.length;
};

// Global entrance cycles so consecutive on-screen items never repeat style,
// even across a beat boundary.
let imageCycleIndex = 0;
let graphicCycleIndex = 0;
const nextImageVariant = (): EntranceVariant => {
  const v = IMAGE_ENTRANCE_CYCLE[imageCycleIndex % IMAGE_ENTRANCE_CYCLE.length];
  imageCycleIndex += 1;
  return v;
};
const nextGraphicVariant = (): EntranceVariant => {
  const v = GRAPHIC_ENTRANCE_CYCLE[graphicCycleIndex % GRAPHIC_ENTRANCE_CYCLE.length];
  graphicCycleIndex += 1;
  return v;
};

const buildTimeline = (): Layer[] => {
  imageCycleIndex = 0;
  graphicCycleIndex = 0;
  const layers: Layer[] = [];

  for (const beat of BEATS) {
    const items = BEAT_MAPPING[beat.beat];
    if (!items || items.length === 0) {
      throw new Error(`beat ${beat.beat} has no assigned assets`);
    }

    const clusters = buildClusters(items);
    const totalWeight = clusters.reduce((s, c) => s + clusterWeight(c), 0);
    const beatDuration = beat.duration_frames;

    let cursor = beat.start_frame;
    let allocated = 0;

    clusters.forEach((cluster, idx) => {
      const isLast = idx === clusters.length - 1;
      const weight = clusterWeight(cluster);
      const rawFrames = (weight / totalWeight) * beatDuration;
      const frames = isLast
        ? beat.end_frame - cursor // absorb rounding drift on the last cluster
        : Math.round(rawFrames);

      if (cluster.type === "cutaway") {
        const item = BUCKET_B[cluster.itemId];
        layers.push({
          kind: "cutaway",
          id: cluster.itemId,
          beat: beat.beat,
          item,
          from: cursor,
          duration: frames,
          variant: nextGraphicVariant(),
        });
      } else {
        const file = IMAGE_ASSETS[cluster.figureId];
        if (!file) {
          throw new Error(`unknown image id ${cluster.figureId}`);
        }
        const sideBySide = cluster.overlayIds.length > 0;
        layers.push({
          kind: "figure",
          id: cluster.figureId,
          beat: beat.beat,
          file,
          from: cursor,
          duration: frames,
          variant: nextImageVariant(),
          sideBySide,
        });

        if (cluster.overlayIds.length > 0) {
          const leadIn = Math.min(15, Math.floor(frames * 0.15));
          const remaining = frames - leadIn;
          const perOverlay = Math.floor(remaining / cluster.overlayIds.length);
          let overlayCursor = cursor + leadIn;
          cluster.overlayIds.forEach((overlayId, oIdx) => {
            const isLastOverlay = oIdx === cluster.overlayIds.length - 1;
            const overlayFrames = isLastOverlay
              ? cursor + frames - overlayCursor
              : perOverlay;
            layers.push({
              kind: "overlay",
              id: overlayId,
              beat: beat.beat,
              parentFigureId: cluster.figureId,
              item: BUCKET_B[overlayId],
              from: overlayCursor,
              duration: overlayFrames,
              variant: nextGraphicVariant(),
            });
            overlayCursor += overlayFrames;
          });
        }
      }

      cursor += frames;
      allocated += frames;
    });

    if (cursor !== beat.end_frame) {
      throw new Error(
        `beat ${beat.beat} allocation mismatch: cursor ${cursor} !== end ${beat.end_frame}`
      );
    }
  }

  return layers;
};

export const TIMELINE: Layer[] = buildTimeline();

export const FIGURE_LAYERS = TIMELINE.filter((l): l is FigureLayer => l.kind === "figure");
export const OVERLAY_LAYERS = TIMELINE.filter((l): l is OverlayLayer => l.kind === "overlay");
export const CUTAWAY_LAYERS = TIMELINE.filter((l): l is CutawayLayer => l.kind === "cutaway");

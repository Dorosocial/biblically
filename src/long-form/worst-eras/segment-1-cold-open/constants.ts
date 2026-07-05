import { staticFile } from "remotion";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 4650; // 155s at 30fps, real timestamps 0:00-2:35

export const COMPOSITION_ID = "Segment1-ColdOpen-WidowAtZarephath";

// Asset paths, relative to the public dir. remotion.config.ts points the
// public dir at this segment's folder, so these resolve to
// assets/processed/*.png without copying files anywhere. staticFile()
// resolves the path against Remotion's public-dir URL at render/serve time.
const A = "assets/processed";
const asset = (name: string) => staticFile(`${A}/${name}`);

export const IMG = {
  background: asset("we1-background.jpeg"),
  widowGateScene: asset("we1-widow-gate-scene.png"),
  elijahWidowMeeting: asset("we1-elijah-widow-meeting.png"),
  widowResponseScene: asset("we1-widow-response-scene.png"),
  widowAloneJar: asset("we1-widow-alone-jar.png"),
  ghostWidows: asset("we1-ghost-widows.png"),
  miracleJar: asset("we1-miracle-jar.png"),
  flourJarHero: asset("we1-flour-jar-hero.png"),
  sonFigure: asset("we1-son-figure.png"),
  statisticsFade: asset("we1-statistics-fade.png"),
  breadIcon: asset("we1-bread-icon.png"),
  waterVesselIcon: asset("we1-water-vessel-icon.png"),
  oilDropIcon: asset("we1-oil-drop-icon.png"),
  stickBundleIcon: asset("we1-stick-bundle-icon.png"),
  negationHandIcon: asset("we1-negation-hand-icon.png"),
  ladderIcon: asset("we1-ladder-icon.png"),
  widowSmall: asset("we1-widow-small.png"),
  famineLandscape: asset("we1-famine-landscape.png"),
  homeIcon: asset("we1-home-icon.png"),
} as const;

// Visual fingerprint for "Worst Eras" Segment 1 (Cold Open — The Widow at
// Zarephath): plain white background throughout, black-ink silhouette
// illustrations generated directly on that same white (no processing, no
// transparency needed on the 8 full scene images). Anything layered ON TOP
// of a scene — glows, particles, text — is code-drawn so it composites with
// real transparency instead of a white box.
import backgroundImg from './assets/background.jpeg';
import widowGateSceneImg from './assets/widow-gate-scene.png';
import elijahWidowMeetingImg from './assets/elijah-widow-meeting.png';
import widowResponseSceneImg from './assets/widow-response-scene.png';
import widowAloneJarImg from './assets/widow-alone-jar.png';
import famineLandscapeImg from './assets/famine-landscape.png';
import ghostWidowsImg from './assets/ghost-widows.png';
import miracleJarImg from './assets/miracle-jar.png';
// These three are isolated icon-style cutouts (a subject centered on a huge
// mostly-empty white canvas) — cropped to their content bounding box
// (+24px padding) so compositing them at a small size doesn't leave a
// visible rectangular seam where the source canvas's white margin meets
// the persistent background. See assets/processed/ — crop is lossless
// content-only, no background removal (both are the same plain white).
import flourJarHeroImg from './assets/processed/flour-jar-hero.png';
import widowSmallImg from './assets/processed/widow-small.png';
import sonFigureImg from './assets/processed/son-figure.png';
import statisticsFadeImg from './assets/statistics-fade.png';

export const ASSETS = {
	background: backgroundImg,
	widowGateScene: widowGateSceneImg,
	elijahWidowMeeting: elijahWidowMeetingImg,
	widowResponseScene: widowResponseSceneImg,
	widowAloneJar: widowAloneJarImg,
	famineLandscape: famineLandscapeImg,
	ghostWidows: ghostWidowsImg,
	miracleJar: miracleJarImg,
	flourJarHero: flourJarHeroImg,
	widowSmall: widowSmallImg,
	sonFigure: sonFigureImg,
	statisticsFade: statisticsFadeImg,
} as const;

export const COLORS = {
	ink: '#141414',
	inkDim: 'rgba(20, 20, 20, 0.72)',
	// "r, g, b" triples (no alpha) so glow components can interpolate opacity.
	coldGlowRGB: '120, 148, 178',
	warmGlowRGB: '214, 168, 92',
} as const;

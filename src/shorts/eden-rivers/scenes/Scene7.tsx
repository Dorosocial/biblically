import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {SOUTH_ASPECT, SOUTH_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {River} from '../River';
import {ENCIRCLE_CUSH, ENCIRCLE_HAVILAH, SOUTH_VIEWBOX} from '../riverPaths';
import {REGION_OPACITY} from './Scene6';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "region associated in other biblical texts with the Arabian
// Peninsula. The Gihon encircles Cush,"
// CONTINUES from Scene 6 — Pishon still encircling Havilah remains visible.
export const SCENE_7_DURATION = 120; // 4.0s @ 30fps

const ARABIA_FADE_WINDOW = [0, 50] as const;
const ARABIA_LABEL_WINDOW = [10, 55] as const;
export const CUSH_HANDOFF_OPACITY = REGION_OPACITY * 0.5;
const CUSH_FADE_WINDOW = [30, 120] as const; // partial reveal; Scene 8 completes it
const GIHON_DRAW_WINDOW = [30, 115] as const;

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_7_DURATION);
	// Havilah = the Arabian Peninsula per the narration itself — no separate
	// highlight asset exists, so the same region cutout intensifies as it's
	// named, paired with the "ARABIAN PENINSULA" label.
	const arabiaOpacity = interpolate(frame, ARABIA_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const arabiaLabel = interpolate(frame, ARABIA_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cushOpacity = interpolate(frame, CUSH_FADE_WINDOW, [0, CUSH_HANDOFF_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const gihonProgress = interpolate(frame, GIHON_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale} width={340} aspect={SOUTH_ASPECT}>
				<MapImageLayer
					src={ASSETS.highlightHavilah}
					{...SOUTH_LAYOUT.havilah}
					opacity={interpolate(arabiaOpacity, [0, 1], [REGION_OPACITY, REGION_OPACITY + 0.2])}
					glow={arabiaOpacity * 0.4}
				/>
				<River d={ENCIRCLE_HAVILAH} viewBox={SOUTH_VIEWBOX} progress={1} frame={frame} glow={0.5} />
				<Label text="ARABIAN PENINSULA" progress={arabiaLabel} dim style={{left: '2%', top: '96%', fontSize: 18}} />
				<MapImageLayer src={ASSETS.highlightCush} {...SOUTH_LAYOUT.cush} opacity={cushOpacity} />
				<River d={ENCIRCLE_CUSH} viewBox={SOUTH_VIEWBOX} progress={gihonProgress} frame={frame} glow={0.5} />
			</ContentStack>
		</Stage>
	);
};

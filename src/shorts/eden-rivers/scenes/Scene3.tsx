import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "and when you plot all four rivers, they all converge on a single region."
export const SCENE_3_DURATION = 180; // 6.0s @ 30fps

const FADE_DURATION = 50;
const STARTS = {euphrates: 0, pishon: 15, gihon: 30, tigris: 45} as const;
// Establishing reveal — dim, not the "identified" full-bright treatment
// Scene 4 gives Tigris/Euphrates.
const INTRO_OPACITY = DIM_OPACITY + 0.15;

const fadeProgress = (frame: number, start: number) =>
	interpolate(frame, [start, start + FADE_DURATION], [0, INTRO_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_3_DURATION);

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={fadeProgress(frame, STARTS.euphrates)} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={fadeProgress(frame, STARTS.pishon)} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={fadeProgress(frame, STARTS.gihon)} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={fadeProgress(frame, STARTS.tigris)} />
			</ContentStack>
		</AbsoluteFill>
	);
};

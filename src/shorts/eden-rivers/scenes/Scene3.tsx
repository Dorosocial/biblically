import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {River} from '../River';
import {CONTENT_VIEWBOX, MAP_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "and when you plot all four rivers, they all converge on a single region."
// HARD RESET — nothing from Scene 2 carries over.
export const SCENE_3_DURATION = 180; // 6.0s @ 30fps

const DRAW_DURATION = 120;
const STARTS = {euphrates: 0, tigris: 15, pishon: 30, gihon: 45} as const;
const CONVERGE_GLOW_START = 150;

const progressFor = (frame: number, start: number) =>
	interpolate(frame, [start, start + DRAW_DURATION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_3_DURATION);
	const basinGlow = interpolate(frame, [CONVERGE_GLOW_START, SCENE_3_DURATION], [0, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.15} />
				<River d={MAP_RIVERS.euphrates} viewBox={CONTENT_VIEWBOX} progress={progressFor(frame, STARTS.euphrates)} frame={frame} />
				<River d={MAP_RIVERS.tigris} viewBox={CONTENT_VIEWBOX} progress={progressFor(frame, STARTS.tigris)} frame={frame} />
				<River d={MAP_RIVERS.pishon} viewBox={CONTENT_VIEWBOX} progress={progressFor(frame, STARTS.pishon)} frame={frame} />
				<River d={MAP_RIVERS.gihon} viewBox={CONTENT_VIEWBOX} progress={progressFor(frame, STARTS.gihon)} frame={frame} />
				<MapImageLayer src={ASSETS.highlightGulfBasin} {...MAP_LAYOUT.gulfBasin} opacity={basinGlow} glow={basinGlow} />
			</ContentStack>
		</Stage>
	);
};

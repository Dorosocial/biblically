import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {pushIn} from '../motion';
import {River} from '../River';
import {CONTENT_VIEWBOX, VALLEY_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';
import {TextCard} from '../TextCard';

// VO: "basin of the Persian Gulf was dry land, a fertile river valley fed
// by four converging rivers"
// CONTINUES from Scene 11 — the "7,500 YEARS AGO" text settles/fades as
// the valley visual takes over.
export const SCENE_12_DURATION = 240; // 8.0s @ 30fps

const VALLEY_WINDOW = [0, 60] as const;
const TEXT_FADE_OUT_WINDOW = [0, 45] as const;
const RIVER_DRAW_DURATION = 90;
const RIVER_STARTS = {euphrates: 55, tigris: 70, pishon: 85, gihon: 100} as const;

const riverProgress = (frame: number, start: number) =>
	interpolate(frame, [start, start + RIVER_DRAW_DURATION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Scene12: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_12_DURATION);
	const valleyOpacity = interpolate(frame, VALLEY_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textOpacity = interpolate(frame, TEXT_FADE_OUT_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage gap={28}>
			<BibleLayer frame={frame} fps={fps} />
			{textOpacity > 0.01 && <TextCard text="7,500 YEARS AGO" opacity={textOpacity} fontSize={44} />}
			<ContentStack scale={contentScale}>
				<Img src={ASSETS.dryValley} style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: valleyOpacity}} />
				<River d={VALLEY_RIVERS.euphrates} viewBox={CONTENT_VIEWBOX} progress={riverProgress(frame, RIVER_STARTS.euphrates)} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.tigris} viewBox={CONTENT_VIEWBOX} progress={riverProgress(frame, RIVER_STARTS.tigris)} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.pishon} viewBox={CONTENT_VIEWBOX} progress={riverProgress(frame, RIVER_STARTS.pishon)} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.gihon} viewBox={CONTENT_VIEWBOX} progress={riverProgress(frame, RIVER_STARTS.gihon)} frame={frame} glow={0.4} />
			</ContentStack>
		</Stage>
	);
};

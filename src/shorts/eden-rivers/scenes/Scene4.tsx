import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {River} from '../River';
import {CONTENT_VIEWBOX, MAP_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';
import {TextCard} from '../TextCard';

// VO: "Genesis 2:10-14 explicitly mentions the Tigris and Euphrates, and
// today they've been identified"
// HARD RESET — nothing from Scene 3 carries over.
export const SCENE_4_DURATION = 210; // 7.0s @ 30fps

const TEXT_SPRING_CONFIG = {damping: 11, stiffness: 120, mass: 0.8};
const TEXT_SPRING_DURATION = 55;
const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};
const EUPHRATES_WINDOW = [30, 100] as const;
const TIGRIS_WINDOW = [50, 120] as const;

const popProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: POP_SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_4_DURATION);
	const textSpring =
		frame >= TEXT_SPRING_DURATION ? 1 : spring({frame, fps, config: TEXT_SPRING_CONFIG, durationInFrames: TEXT_SPRING_DURATION});
	const textOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const euphratesProgress = interpolate(frame, EUPHRATES_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const tigrisProgress = interpolate(frame, TIGRIS_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const euphratesPop = popProgress(frame, fps, [EUPHRATES_WINDOW[1] - 20, EUPHRATES_WINDOW[1] + 35]);
	const tigrisPop = popProgress(frame, fps, [TIGRIS_WINDOW[1] - 20, TIGRIS_WINDOW[1] + 35]);
	const euphratesGlow = euphratesPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * euphratesPop : euphratesPop * 0.6;
	const tigrisGlow = tigrisPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * tigrisPop : tigrisPop * 0.6;

	return (
		<Stage gap={28}>
			<BibleLayer frame={frame} fps={fps} />
			<TextCard text="GENESIS 2:10-14" opacity={textOpacity} scale={interpolate(textSpring, [0, 1], [0.7, 1])} fontSize={44} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<River d={MAP_RIVERS.pishon} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} opacity={DIM_OPACITY} />
				<River d={MAP_RIVERS.gihon} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} opacity={DIM_OPACITY} />
				<River d={MAP_RIVERS.euphrates} viewBox={CONTENT_VIEWBOX} progress={euphratesProgress} frame={frame} glow={euphratesGlow} />
				<River d={MAP_RIVERS.tigris} viewBox={CONTENT_VIEWBOX} progress={tigrisProgress} frame={frame} glow={tigrisGlow} />
				<Label text="EUPHRATES" progress={euphratesPop} style={{left: '4%', top: '22%'}} />
				<Label text="TIGRIS" progress={tigrisPop} style={{left: '62%', top: '16%'}} />
			</ContentStack>
		</Stage>
	);
};

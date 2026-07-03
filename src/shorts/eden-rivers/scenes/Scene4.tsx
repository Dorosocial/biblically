import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "Genesis 2:10-14 explicitly mentions the Tigris and Euphrates, and
// today they've been identified"
export const SCENE_4_DURATION = 210; // 7.0s @ 30fps

const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};
const EUPHRATES_WINDOW = [0, 55] as const;
const TIGRIS_WINDOW = [20, 75] as const;
const INTRO_OPACITY = DIM_OPACITY + 0.15;

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
	const euphratesPop = popProgress(frame, fps, EUPHRATES_WINDOW);
	const tigrisPop = popProgress(frame, fps, TIGRIS_WINDOW);
	// Gentle continuous glow breathing once each river has popped, so the
	// hold doesn't go fully static.
	const euphratesGlow = euphratesPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * euphratesPop : euphratesPop;
	const tigrisGlow = tigrisPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * tigrisPop : tigrisPop;

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={DIM_OPACITY} />
				<MapImageLayer
					src={ASSETS.riverEuphrates}
					{...MAP_LAYOUT.euphrates}
					opacity={interpolate(euphratesPop, [0, 1], [INTRO_OPACITY, 1])}
					glow={euphratesGlow}
					scale={1 + euphratesPop * 0.1}
				/>
				<MapImageLayer
					src={ASSETS.riverTigris}
					{...MAP_LAYOUT.tigris}
					opacity={interpolate(tigrisPop, [0, 1], [INTRO_OPACITY, 1])}
					glow={tigrisGlow}
					scale={1 + tigrisPop * 0.1}
				/>
				<Label text="EUPHRATES" progress={euphratesPop} style={{left: '10%', top: '30%'}} />
				<Label text="TIGRIS" progress={tigrisPop} style={{left: '54%', top: '32%'}} />
			</ContentStack>
		</AbsoluteFill>
	);
};

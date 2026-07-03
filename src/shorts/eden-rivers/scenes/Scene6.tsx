import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "The Pishon is described as encircling the land of Havilah, which is a"
export const SCENE_6_DURATION = 150; // 5.0s @ 30fps

const PISHON_POP_WINDOW = [0, 55] as const;
const HAVILAH_FADE_WINDOW = [20, 80] as const;
const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};
const REGION_OPACITY = 0.65;

const popProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: POP_SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_6_DURATION);
	const pishonPop = popProgress(frame, fps, PISHON_POP_WINDOW);
	const pishonGlow = pishonPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * pishonPop : pishonPop;
	const havilahOpacity = interpolate(frame, HAVILAH_FADE_WINDOW, [0, REGION_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...MAP_LAYOUT.turkey} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightSyria} {...MAP_LAYOUT.syria} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightIraq} {...MAP_LAYOUT.iraq} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.pinMarker} {...MAP_LAYOUT.pin} scale={pulse(frame, fps, 0.08, 1.25)} />
				<MapImageLayer src={ASSETS.highlightHavilah} {...MAP_LAYOUT.havilah} opacity={havilahOpacity} />
				<MapImageLayer
					src={ASSETS.riverPishon}
					{...MAP_LAYOUT.pishon}
					opacity={interpolate(pishonPop, [0, 1], [DIM_OPACITY, 1])}
					glow={pishonGlow}
					scale={1 + pishonPop * 0.1}
				/>
			</ContentStack>
		</AbsoluteFill>
	);
};

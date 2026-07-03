import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "region associated in other biblical texts with the Arabian
// Peninsula. The Gihon encircles Cush,"
export const SCENE_7_DURATION = 120; // 4.0s @ 30fps

const HAVILAH_LABEL_WINDOW = [0, 40] as const;
const GIHON_POP_WINDOW = [20, 70] as const;
const REGION_OPACITY = 0.65;
const CUSH_FADE_WINDOW = [40, 120] as const; // partial reveal; Scene 8 completes it
export const CUSH_HANDOFF_OPACITY = REGION_OPACITY * 0.6;

const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};

const popProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: POP_SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_7_DURATION);
	const havilahLabel = interpolate(frame, HAVILAH_LABEL_WINDOW, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const gihonPop = popProgress(frame, fps, GIHON_POP_WINDOW);
	const gihonGlow = gihonPop >= 1 ? pulse(frame, fps, 0.15, 0.5) * gihonPop : gihonPop;
	const cushOpacity = interpolate(frame, CUSH_FADE_WINDOW, [0, CUSH_HANDOFF_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...MAP_LAYOUT.turkey} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightSyria} {...MAP_LAYOUT.syria} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightIraq} {...MAP_LAYOUT.iraq} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.pinMarker} {...MAP_LAYOUT.pin} scale={pulse(frame, fps, 0.08, 1.25)} />
				<MapImageLayer src={ASSETS.highlightHavilah} {...MAP_LAYOUT.havilah} opacity={REGION_OPACITY} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={1} glow={0.4} />
				<MapImageLayer src={ASSETS.highlightCush} {...MAP_LAYOUT.cush} opacity={cushOpacity} />
				<MapImageLayer
					src={ASSETS.riverGihon}
					{...MAP_LAYOUT.gihon}
					opacity={interpolate(gihonPop, [0, 1], [DIM_OPACITY, 1])}
					glow={gihonGlow}
					scale={1 + gihonPop * 0.1}
				/>
				<Label text="HAVILAH" progress={havilahLabel} dim style={{left: '24%', top: '92%'}} />
			</ContentStack>
		</AbsoluteFill>
	);
};

import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "to flow through Turkey, Syria, and Iraq before meeting near Basra.
// That intersection is our anchor point."
export const SCENE_5_DURATION = 210; // 7.0s @ 30fps

const FADE_DURATION = 55;
const COUNTRY_STARTS = {turkey: 0, syria: 30, iraq: 60} as const;
const INTRO_OPACITY = DIM_OPACITY + 0.15;

const PIN_DROP_START = 120;
const PIN_DROP_DURATION = 45;
const PIN_DROP_SPRING_CONFIG = {damping: 9, stiffness: 120, mass: 1};
const PULSE_START = PIN_DROP_START + PIN_DROP_DURATION;

const fadeProgress = (frame: number, start: number) =>
	interpolate(frame, [start, start + FADE_DURATION], [0, INTRO_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_5_DURATION);

	const turkeyOpacity = fadeProgress(frame, COUNTRY_STARTS.turkey);
	const syriaOpacity = fadeProgress(frame, COUNTRY_STARTS.syria);
	const iraqOpacity = fadeProgress(frame, COUNTRY_STARTS.iraq);

	const pinLocal = frame - PIN_DROP_START;
	const pinDropProgress =
		pinLocal < 0
			? 0
			: frame >= PIN_DROP_START + PIN_DROP_DURATION
				? 1
				: spring({frame: pinLocal, fps, config: PIN_DROP_SPRING_CONFIG, durationInFrames: PIN_DROP_DURATION});
	const pinOffsetY = interpolate(pinDropProgress, [0, 1], [-220, 0]);
	const pinOpacity = interpolate(Math.min(pinDropProgress, 1), [0, 0.05], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pinPulseLocal = frame - PULSE_START;
	const pinScale = pinPulseLocal < 0 ? 1 : pulse(pinPulseLocal, fps, 0.1, 1.25);

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={1} glow={0.6} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...MAP_LAYOUT.turkey} opacity={turkeyOpacity} />
				<MapImageLayer src={ASSETS.highlightSyria} {...MAP_LAYOUT.syria} opacity={syriaOpacity} />
				<MapImageLayer src={ASSETS.highlightIraq} {...MAP_LAYOUT.iraq} opacity={iraqOpacity} />
				{frame >= PIN_DROP_START && (
					<MapImageLayer
						src={ASSETS.pinMarker}
						{...MAP_LAYOUT.pin}
						opacity={pinOpacity}
						offsetY={pinOffsetY}
						scale={pinScale}
					/>
				)}
			</ContentStack>
		</AbsoluteFill>
	);
};

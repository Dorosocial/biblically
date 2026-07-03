import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {BASIN_ASPECT, BASIN_LAYOUT} from '../mapLayout';
import {pulse} from '../motion';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';
import {TextCard} from '../TextCard';

// VO: "This is the geographical reality."
// HARD RESET — nothing from Scene 9 carries over. Minimal composition:
// just the pin dropping onto the gulf basin highlight, then the headline.
export const SCENE_10_DURATION = 90; // 3.0s @ 30fps

const BG_DIM_WINDOW = [0, 30] as const;
const BASIN_FADE_WINDOW = [0, 20] as const;
const PIN_DROP_DURATION = 35;
const PIN_DROP_SPRING_CONFIG = {damping: 9, stiffness: 130, mass: 1};
const PULSE_START = PIN_DROP_DURATION;
const TEXT_SPRING_START = 30;
const TEXT_SPRING_DURATION = 55;

export const Scene10: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bgDim = interpolate(frame, BG_DIM_WINDOW, [1, 0.82], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const basinOpacity = interpolate(frame, BASIN_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const pinDropProgress =
		frame >= PIN_DROP_DURATION ? 1 : spring({frame, fps, config: PIN_DROP_SPRING_CONFIG, durationInFrames: PIN_DROP_DURATION});
	const pinOffsetY = interpolate(pinDropProgress, [0, 1], [-260, 0]);
	const pinPulseLocal = frame - PULSE_START;
	const pinScale = pinPulseLocal < 0 ? 1 : pulse(pinPulseLocal, fps, 0.12, 1.1);

	const textLocal = frame - TEXT_SPRING_START;
	const textSpring =
		textLocal < 0 ? 0 : spring({frame: textLocal, fps, config: {damping: 11, stiffness: 120, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION});
	const textScale = interpolate(textSpring, [0, 1], [0.7, 1]);
	const textOpacity = interpolate(textLocal, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage gap={44} style={{opacity: bgDim}}>
			<BibleLayer frame={frame} fps={fps} width={220} />
			<ContentStack width={260} aspect={BASIN_ASPECT}>
				<MapImageLayer src={ASSETS.highlightGulfBasin} {...BASIN_LAYOUT.gulfBasin} opacity={basinOpacity} glow={0.5} />
				<MapImageLayer src={ASSETS.pinMarker} {...BASIN_LAYOUT.pin} opacity={basinOpacity} offsetY={pinOffsetY} scale={pinScale} />
			</ContentStack>
			<TextCard
				text="THIS IS THE GEOGRAPHICAL REALITY"
				opacity={textOpacity}
				scale={textScale}
				fontSize={38}
				style={{maxWidth: 640}}
			/>
		</Stage>
	);
};

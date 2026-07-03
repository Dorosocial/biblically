import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {IDENTIFY_ASPECT, IDENTIFY_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {River} from '../River';
import {IDENTIFY_VIEWBOX, MAP_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "to flow through Turkey, Syria, and Iraq before meeting near Basra.
// That intersection is our anchor point."
// HARD RESET — nothing from Scene 4 carries over.
export const SCENE_5_DURATION = 210; // 7.0s @ 30fps

const RIVER_DRAW_WINDOW = [0, 70] as const;
const FADE_DURATION = 55;
const COUNTRY_STARTS = {turkey: 20, syria: 55, iraq: 90} as const;
const LABEL_STARTS = {euphrates: 20, tigris: 35} as const;
const LABEL_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};
const LABEL_SPRING_DURATION = 45;

const PIN_DROP_START = 130;
const PIN_DROP_DURATION = 45;
const PIN_DROP_SPRING_CONFIG = {damping: 9, stiffness: 120, mass: 1};
const PULSE_START = PIN_DROP_START + PIN_DROP_DURATION;

const fadeProgress = (frame: number, start: number) =>
	interpolate(frame, [start, start + FADE_DURATION], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const popProgress = (frame: number, fps: number, start: number) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= start + LABEL_SPRING_DURATION) return 1;
	return spring({frame: local, fps, config: LABEL_SPRING_CONFIG, durationInFrames: LABEL_SPRING_DURATION});
};

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_5_DURATION);
	const riverProgress = interpolate(frame, RIVER_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const turkeyOpacity = fadeProgress(frame, COUNTRY_STARTS.turkey) * 0.7;
	const syriaOpacity = fadeProgress(frame, COUNTRY_STARTS.syria) * 0.7;
	const iraqOpacity = fadeProgress(frame, COUNTRY_STARTS.iraq) * 0.7;
	const euphratesLabel = popProgress(frame, fps, LABEL_STARTS.euphrates);
	const tigrisLabel = popProgress(frame, fps, LABEL_STARTS.tigris);

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
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale} aspect={IDENTIFY_ASPECT}>
				<River d={MAP_RIVERS.euphrates} viewBox={IDENTIFY_VIEWBOX} progress={riverProgress} frame={frame} glow={0.6} />
				<River d={MAP_RIVERS.tigris} viewBox={IDENTIFY_VIEWBOX} progress={riverProgress} frame={frame} glow={0.6} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...IDENTIFY_LAYOUT.turkey} opacity={turkeyOpacity} />
				<MapImageLayer src={ASSETS.highlightSyria} {...IDENTIFY_LAYOUT.syria} opacity={syriaOpacity} />
				<MapImageLayer src={ASSETS.highlightIraq} {...IDENTIFY_LAYOUT.iraq} opacity={iraqOpacity} />
				<Label text="EUPHRATES" progress={euphratesLabel} fontSize={20} style={{left: '0%', top: '18%'}} />
				<Label text="TIGRIS" progress={tigrisLabel} fontSize={20} style={{left: '62%', top: '10%'}} />
				{frame >= PIN_DROP_START && (
					<MapImageLayer src={ASSETS.pinMarker} {...IDENTIFY_LAYOUT.pin} opacity={pinOpacity} offsetY={pinOffsetY} scale={pinScale} />
				)}
			</ContentStack>
		</Stage>
	);
};

import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {PossibilityMarker} from '../PossibilityMarker';
import {pushIn} from '../motion';
import {ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "The second one is the Gulf of Aqaba."
// HARD RESET — the "2" marker from Scene 11 returns, now fully highlighted,
// as map-aqaba.png fades in beneath it.
export const SCENE_18_DURATION = 120; // 4.0s @ 30fps

export const AQABA_WIDTH = 400;
const MARKER_SPRING_DURATION = 40;
const MAP_FADE_WINDOW = [25, 75] as const;

export const Scene18: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const markerSpring = frame >= MARKER_SPRING_DURATION ? 1 : spring({frame, fps, config: {damping: 10, stiffness: 150, mass: 0.85}, durationInFrames: MARKER_SPRING_DURATION});
	const mapOpacity = interpolate(frame, MAP_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentScale = pushIn(frame, SCENE_18_DURATION);

	return (
		<Stage gap={34}>
			<PossibilityMarker label="2" progress={markerSpring} glow={1} size={110} />
			<ImageLayer src={ASSETS.mapAqaba} width={AQABA_WIDTH} opacity={mapOpacity} scale={contentScale} />
		</Stage>
	);
};

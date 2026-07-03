import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {CUSH_HANDOFF_OPACITY} from './Scene7';
import {ASSETS} from '../theme';

// VO: "which in ancient geography refers to the region south and east"
export const SCENE_8_DURATION = 180; // 6.0s @ 30fps

const REGION_OPACITY = 0.65;
const CUSH_FADE_WINDOW = [0, 60] as const;
const CUSH_LABEL_WINDOW = [30, 90] as const;

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_8_DURATION);
	const cushOpacity = interpolate(frame, CUSH_FADE_WINDOW, [CUSH_HANDOFF_OPACITY, REGION_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const cushLabel = interpolate(frame, CUSH_LABEL_WINDOW, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={DIM_OPACITY + 0.1} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={1} glow={0.5} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={1} glow={0.5} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...MAP_LAYOUT.turkey} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightSyria} {...MAP_LAYOUT.syria} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.highlightIraq} {...MAP_LAYOUT.iraq} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.pinMarker} {...MAP_LAYOUT.pin} scale={pulse(frame, fps, 0.08, 1.25)} />
				<MapImageLayer src={ASSETS.highlightHavilah} {...MAP_LAYOUT.havilah} opacity={DIM_OPACITY} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={1} glow={0.5} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={1} glow={0.5} />
				<MapImageLayer src={ASSETS.highlightCush} {...MAP_LAYOUT.cush} opacity={cushOpacity} />
				<Label text="HAVILAH" progress={1} dim style={{left: '24%', top: '92%'}} />
				<Label text="CUSH" progress={cushLabel} dim style={{left: '56%', top: '76%'}} />
			</ContentStack>
		</AbsoluteFill>
	);
};

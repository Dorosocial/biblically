import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {DIM_OPACITY, MAP_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "of Mesopotamia. Both descriptions point toward the same basin: the
// northern Persian Gulf."
export const SCENE_9_DURATION = 210; // 7.0s @ 30fps

const DIM_WINDOW = [0, 60] as const;
const FINAL_DIM = 0.15;
const REGION_OPACITY = 0.65;
const BASIN_RISE_WINDOW = [20, 90] as const;
const PULSE_START = 90;

const dimTo = (frame: number, from: number) =>
	interpolate(frame, DIM_WINDOW, [from, FINAL_DIM], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Scene9: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_9_DURATION);
	const basinRise = interpolate(frame, BASIN_RISE_WINDOW, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pulseLocal = frame - PULSE_START;
	const basinGlow = pulseLocal < 0 ? basinRise : pulse(pulseLocal, fps, 0.15, 0.7);
	const basinScale = interpolate(basinRise, [0, 1], [0.7, 1.15]);

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={dimTo(frame, DIM_OPACITY + 0.1)} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={dimTo(frame, 1)} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={dimTo(frame, 1)} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={dimTo(frame, 1)} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={dimTo(frame, 1)} />
				<MapImageLayer src={ASSETS.highlightTurkey} {...MAP_LAYOUT.turkey} opacity={dimTo(frame, DIM_OPACITY)} />
				<MapImageLayer src={ASSETS.highlightSyria} {...MAP_LAYOUT.syria} opacity={dimTo(frame, DIM_OPACITY)} />
				<MapImageLayer src={ASSETS.highlightIraq} {...MAP_LAYOUT.iraq} opacity={dimTo(frame, DIM_OPACITY)} />
				<MapImageLayer src={ASSETS.highlightHavilah} {...MAP_LAYOUT.havilah} opacity={dimTo(frame, DIM_OPACITY)} />
				<MapImageLayer src={ASSETS.highlightCush} {...MAP_LAYOUT.cush} opacity={dimTo(frame, REGION_OPACITY)} />
				<MapImageLayer src={ASSETS.pinMarker} {...MAP_LAYOUT.pin} opacity={dimTo(frame, 1)} />
				<MapImageLayer
					src={ASSETS.highlightGulfBasin}
					{...MAP_LAYOUT.gulfBasin}
					opacity={Math.min(basinRise * 1.2, 1)}
					glow={basinGlow}
					scale={basinScale}
				/>
			</ContentStack>
		</AbsoluteFill>
	);
};

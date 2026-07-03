import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {SOUTH_ASPECT, SOUTH_LAYOUT} from '../mapLayout';
import {pulse, pushIn} from '../motion';
import {River} from '../River';
import {ENCIRCLE_CUSH, ENCIRCLE_HAVILAH, SOUTH_VIEWBOX} from '../riverPaths';
import {REGION_OPACITY} from './Scene6';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "of Mesopotamia. Both descriptions point toward the same basin: the
// northern Persian Gulf."
// CONTINUES from Scene 8 — all elements remain visible.
export const SCENE_9_DURATION = 210; // 7.0s @ 30fps

const DIM_WINDOW = [0, 60] as const;
const MESO_LABEL_WINDOW = [10, 55] as const;
const BASIN_RISE_WINDOW = [40, 110] as const;
const GULF_LABEL_WINDOW = [90, 135] as const;
const PULSE_START = 110;

const dimTo = (frame: number, from: number, to: number) =>
	interpolate(frame, DIM_WINDOW, [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Scene9: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_9_DURATION);
	const mesoLabel = interpolate(frame, MESO_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const basinRise = interpolate(frame, BASIN_RISE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const gulfLabel = interpolate(frame, GULF_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pulseLocal = frame - PULSE_START;
	const basinGlow = pulseLocal < 0 ? basinRise : pulse(pulseLocal, fps, 0.15, 0.7);
	const basinScale = interpolate(basinRise, [0, 1], [0.7, 1.15]);

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale} width={340} aspect={SOUTH_ASPECT}>
				<MapImageLayer src={ASSETS.highlightHavilah} {...SOUTH_LAYOUT.havilah} opacity={dimTo(frame, REGION_OPACITY + 0.2, 0.2)} />
				<River d={ENCIRCLE_HAVILAH} viewBox={SOUTH_VIEWBOX} progress={1} frame={frame} opacity={dimTo(frame, 1, 0.4)} />
				<MapImageLayer src={ASSETS.highlightCush} {...SOUTH_LAYOUT.cush} opacity={dimTo(frame, REGION_OPACITY, 0.2)} />
				<River d={ENCIRCLE_CUSH} viewBox={SOUTH_VIEWBOX} progress={1} frame={frame} opacity={dimTo(frame, 1, 0.4)} />
				<Label text="MESOPOTAMIA" progress={mesoLabel} dim style={{left: '4%', top: '30%', fontSize: 18}} />
				<MapImageLayer
					src={ASSETS.highlightGulfBasin}
					{...SOUTH_LAYOUT.gulfBasin}
					opacity={Math.min(basinRise * 1.2, 1)}
					glow={basinGlow}
					scale={basinScale}
				/>
				<Label text="NORTHERN PERSIAN GULF" progress={gulfLabel} fontSize={16} style={{left: '46%', top: '78%', width: '54%'}} />
			</ContentStack>
		</Stage>
	);
};

import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DistanceLine} from '../DistanceLine';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapPin} from '../MapPin';
import {MapStack} from '../MapStack';
import {pushIn} from '../motion';
import {River} from '../River';
import {BABYLON_POINT, BABYLON_SVG, BAGHDAD_POINT, BAGHDAD_SVG, MAP_EUPHRATES, MAP_VIEWBOX} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS, ASSET_ASPECT} from '../theme';

// VO: "This location is 85 kilometres south of Baghdad and it's sitting
// right on the Euphrates River in modern Iraq."
// HARD RESET.
export const SCENE_3_DURATION = 180; // 6.0s @ 30fps

export const MAP_WIDTH = 620;
const MAP_FADE_WINDOW = [0, 40] as const;
const PIN_SPRING_WINDOW = [30, 70] as const;
const LINE_DRAW_WINDOW = [60, 110] as const;
const LABEL_WINDOW = [95, 130] as const;
const RIVER_DRAW_WINDOW = [50, 150] as const;

const springProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: {damping: 11, stiffness: 130, mass: 0.9}, durationInFrames: end - start});
};

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_3_DURATION);
	const mapOpacity = interpolate(frame, MAP_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pinProgress = springProgress(frame, fps, PIN_SPRING_WINDOW);
	const lineProgress = interpolate(frame, LINE_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const labelProgress = interpolate(frame, LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const riverProgress = interpolate(frame, RIVER_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const midX = (BAGHDAD_POINT.x + BABYLON_POINT.x) / 2;
	const midY = (BAGHDAD_POINT.y + BABYLON_POINT.y) / 2;

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={ASSET_ASPECT.mapIraq} scale={contentScale}>
				<ImageLayer src={ASSETS.mapIraq} width="100%" opacity={mapOpacity} />
				<River d={MAP_EUPHRATES} viewBox={MAP_VIEWBOX} progress={riverProgress} frame={frame} strokeWidth={2.4} />
				<DistanceLine viewBox={MAP_VIEWBOX} x1={BAGHDAD_SVG.x} y1={BAGHDAD_SVG.y} x2={BABYLON_SVG.x} y2={BABYLON_SVG.y} progress={lineProgress} />
				<MapPin left={`${BAGHDAD_POINT.x}%`} top={`${BAGHDAD_POINT.y}%`} progress={pinProgress} />
				<Label text="BAGHDAD" progress={pinProgress} fontSize={22} style={{left: `${BAGHDAD_POINT.x}%`, top: `${BAGHDAD_POINT.y - 8}%`, transform: 'translate(-50%, -100%)'}} />
				<Label text="85 KM" progress={labelProgress} gold fontSize={24} style={{left: `${midX + 6}%`, top: `${midY}%`, transform: 'translate(0, -50%)'}} />
			</MapStack>
		</Stage>
	);
};

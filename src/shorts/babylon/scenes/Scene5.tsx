import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DistanceLine} from '../DistanceLine';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapPin} from '../MapPin';
import {MapStack} from '../MapStack';
import {pulse, pushIn} from '../motion';
import {River} from '../River';
import {BABYLON_POINT, BABYLON_SVG, BAGHDAD_POINT, BAGHDAD_SVG, MAP_EUPHRATES, MAP_TIGRIS, MAP_VIEWBOX} from '../riverPaths';
import {MAP_WIDTH} from './Scene3';
import {Stage} from '../Stage';
import {ASSETS, ASSET_ASPECT} from '../theme';

// VO: "So, if you could control that land, then you could also control
// the water supply"
// CONTINUES from Scene 4 — map/rivers remain.
export const SCENE_5_DURATION = 150; // 5.0s @ 30fps

const CROWN_SPRING_WINDOW = [0, 60] as const;
const CROWN_WIDTH_PCT = 20; // % of MapStack width

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_5_DURATION);
	const local = frame - CROWN_SPRING_WINDOW[0];
	const crownSpring =
		local < 0
			? 0
			: frame >= CROWN_SPRING_WINDOW[1]
				? 1
				: spring({frame: local, fps, config: {damping: 9, stiffness: 140, mass: 0.9}, durationInFrames: CROWN_SPRING_WINDOW[1] - CROWN_SPRING_WINDOW[0]});
	const crownPulse = frame >= CROWN_SPRING_WINDOW[1] ? pulse(frame, fps, 0.04, 0.4) : 1;

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={ASSET_ASPECT.mapIraq} scale={contentScale}>
				<ImageLayer src={ASSETS.mapIraq} width="100%" />
				<River d={MAP_EUPHRATES} viewBox={MAP_VIEWBOX} progress={1} frame={frame} strokeWidth={2.4} glow={0.3} />
				<River d={MAP_TIGRIS} viewBox={MAP_VIEWBOX} progress={1} frame={frame} strokeWidth={2.4} glow={0.3} />
				<DistanceLine viewBox={MAP_VIEWBOX} x1={BAGHDAD_SVG.x} y1={BAGHDAD_SVG.y} x2={BABYLON_SVG.x} y2={BABYLON_SVG.y} progress={1} />
				<MapPin left={`${BAGHDAD_POINT.x}%`} top={`${BAGHDAD_POINT.y}%`} progress={1} />
				<Label text="BAGHDAD" progress={1} fontSize={22} style={{left: `${BAGHDAD_POINT.x}%`, top: `${BAGHDAD_POINT.y - 8}%`, transform: 'translate(-50%, -100%)'}} />

				<ImageLayer
					src={ASSETS.crown}
					width={`${CROWN_WIDTH_PCT}%`}
					left={`${BABYLON_POINT.x}%`}
					top={`${BABYLON_POINT.y}%`}
					anchor="center"
					opacity={interpolate(crownSpring, [0, 1], [0, 1])}
					scale={crownSpring * crownPulse}
				/>
			</MapStack>
		</Stage>
	);
};

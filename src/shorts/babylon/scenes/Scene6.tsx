import {useCurrentFrame} from 'remotion';
import {DistanceLine} from '../DistanceLine';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapPin} from '../MapPin';
import {MapStack} from '../MapStack';
import {pushIn} from '../motion';
import {River} from '../River';
import {BABYLON_POINT, BABYLON_SVG, BAGHDAD_POINT, BAGHDAD_SVG, MAP_EUPHRATES, MAP_TIGRIS, MAP_VIEWBOX} from '../riverPaths';
import {MAP_WIDTH} from './Scene3';
import {Stage} from '../Stage';
import {ASSETS, ASSET_ASPECT, COLORS} from '../theme';

// VO: "of the entire region."
// CONTINUES from Scene 5 — a radiating glow pulse spreads outward from the
// crown across the wider map.
export const SCENE_6_DURATION = 150; // 5.0s @ 30fps

const RING_COUNT = 3;
const RING_LOOP_FRAMES = 70;
const RING_MAX_RADIUS = 42; // % of MapStack width

const Ring: React.FC<{frame: number; phaseOffset: number}> = ({frame, phaseOffset}) => {
	const local = (frame + phaseOffset) % RING_LOOP_FRAMES;
	const progress = local / RING_LOOP_FRAMES;
	const radius = progress * RING_MAX_RADIUS;
	const opacity = (1 - progress) * 0.55;

	return (
		<div
			style={{
				position: 'absolute',
				left: `${BABYLON_POINT.x}%`,
				top: `${BABYLON_POINT.y}%`,
				width: `${radius * 2}%`,
				height: `${radius * 2}%`,
				borderRadius: '50%',
				transform: 'translate(-50%, -50%)',
				border: `2px solid ${COLORS.gold}`,
				opacity,
			}}
		/>
	);
};

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();

	const contentScale = pushIn(frame, SCENE_6_DURATION);

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={ASSET_ASPECT.mapIraq} scale={contentScale}>
				<ImageLayer src={ASSETS.mapIraq} width="100%" />
				<River d={MAP_EUPHRATES} viewBox={MAP_VIEWBOX} progress={1} frame={frame} strokeWidth={2.4} glow={0.35} />
				<River d={MAP_TIGRIS} viewBox={MAP_VIEWBOX} progress={1} frame={frame} strokeWidth={2.4} glow={0.35} />
				<DistanceLine viewBox={MAP_VIEWBOX} x1={BAGHDAD_SVG.x} y1={BAGHDAD_SVG.y} x2={BABYLON_SVG.x} y2={BABYLON_SVG.y} progress={1} />
				<MapPin left={`${BAGHDAD_POINT.x}%`} top={`${BAGHDAD_POINT.y}%`} progress={1} />
				<Label text="BAGHDAD" progress={1} fontSize={22} style={{left: `${BAGHDAD_POINT.x}%`, top: `${BAGHDAD_POINT.y - 8}%`, transform: 'translate(-50%, -100%)'}} />

				{Array.from({length: RING_COUNT}, (_, i) => (
					<Ring key={i} frame={frame} phaseOffset={(i * RING_LOOP_FRAMES) / RING_COUNT} />
				))}

				<ImageLayer src={ASSETS.crown} width="20%" left={`${BABYLON_POINT.x}%`} top={`${BABYLON_POINT.y}%`} anchor="center" glow={0.5} />
			</MapStack>
		</Stage>
	);
};

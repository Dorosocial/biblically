import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
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
import {TextCard} from '../TextCard';
import {ASSETS, ASSET_ASPECT} from '../theme';

// VO: "Babylon was built at this exact spot for a reason. This plain sits
// right at the point where the Tigris and Euphrates run close to each other."
// CONTINUES from Scene 3 — map, pin, Euphrates remain.
export const SCENE_4_DURATION = 300; // 10.0s @ 30fps

const TIGRIS_DRAW_WINDOW = [0, 140] as const;
const GLOW_WINDOW = [100, 160] as const;
const PULSE_START = 160;
const TEXT_APPEAR_WINDOW = [40, 90] as const;
const TEXT_FADE_WINDOW = [150, 190] as const;

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_4_DURATION);
	const tigrisProgress = interpolate(frame, TIGRIS_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glowRise = interpolate(frame, GLOW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glowPulseLocal = frame - PULSE_START;
	const glow = glowPulseLocal < 0 ? glowRise : pulse(glowPulseLocal, fps, 0.25, 0.6) - 1 + glowRise;

	const textIn = interpolate(frame, TEXT_APPEAR_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textOut = interpolate(frame, TEXT_FADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textOpacity = Math.min(textIn, textOut);

	const midX = (BAGHDAD_POINT.x + BABYLON_POINT.x) / 2;
	const midY = (BAGHDAD_POINT.y + BABYLON_POINT.y) / 2;

	return (
		<Stage gap={26}>
			<MapStack width={MAP_WIDTH} aspect={ASSET_ASPECT.mapIraq} scale={contentScale}>
				<ImageLayer src={ASSETS.mapIraq} width="100%" />
				<River d={MAP_EUPHRATES} viewBox={MAP_VIEWBOX} progress={1} frame={frame} strokeWidth={2.4} glow={glow * 0.6} />
				<River d={MAP_TIGRIS} viewBox={MAP_VIEWBOX} progress={tigrisProgress} frame={frame} strokeWidth={2.4} glow={glow * 0.6} />
				<DistanceLine viewBox={MAP_VIEWBOX} x1={BAGHDAD_SVG.x} y1={BAGHDAD_SVG.y} x2={BABYLON_SVG.x} y2={BABYLON_SVG.y} progress={1} />
				<MapPin left={`${BAGHDAD_POINT.x}%`} top={`${BAGHDAD_POINT.y}%`} progress={1} />
				<Label text="BAGHDAD" progress={1} fontSize={22} style={{left: `${BAGHDAD_POINT.x}%`, top: `${BAGHDAD_POINT.y - 8}%`, transform: 'translate(-50%, -100%)'}} />
				<Label text="85 KM" progress={1} gold fontSize={24} style={{left: `${midX + 6}%`, top: `${midY}%`, transform: 'translate(0, -50%)'}} />

				{glow > 0 && (
					<div
						style={{
							position: 'absolute',
							left: `${BABYLON_POINT.x}%`,
							top: `${BABYLON_POINT.y}%`,
							width: 70,
							height: 70,
							borderRadius: '50%',
							transform: `translate(-50%, -50%) scale(${1 + glow * 0.6})`,
							background: `radial-gradient(circle, rgba(212,175,55,${0.55 * Math.min(glow, 1)}) 0%, rgba(212,175,55,0) 70%)`,
						}}
					/>
				)}
			</MapStack>

			{textOpacity > 0.01 && <TextCard text="WHY HERE?" opacity={textOpacity} fontSize={44} />}
		</Stage>
	);
};

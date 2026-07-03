import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {MAP_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {ASSETS, COLORS} from '../theme';

// VO: "This is the geographical reality."
export const SCENE_10_DURATION = 90; // 3.0s @ 30fps

const DIM_WINDOW = [0, 60] as const; // continues from Scene 9's settled values down to 0
const TEXT_SPRING_START = 20;
const TEXT_SPRING_DURATION = 70;

export const Scene10: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_10_DURATION);
	const dimOpacity = interpolate(frame, DIM_WINDOW, [0.15, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const basinOpacity = interpolate(frame, DIM_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const textLocal = frame - TEXT_SPRING_START;
	const textSpring =
		textLocal < 0
			? 0
			: spring({frame: textLocal, fps, config: {damping: 11, stiffness: 120, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION});
	const textScale = interpolate(textSpring, [0, 1], [0.7, 1]);
	const textOpacity = interpolate(textLocal, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={dimOpacity} />
				<MapImageLayer src={ASSETS.riverEuphrates} {...MAP_LAYOUT.euphrates} opacity={dimOpacity} />
				<MapImageLayer src={ASSETS.riverTigris} {...MAP_LAYOUT.tigris} opacity={dimOpacity} />
				<MapImageLayer src={ASSETS.riverPishon} {...MAP_LAYOUT.pishon} opacity={dimOpacity} />
				<MapImageLayer src={ASSETS.riverGihon} {...MAP_LAYOUT.gihon} opacity={dimOpacity} />
				<MapImageLayer src={ASSETS.highlightGulfBasin} {...MAP_LAYOUT.gulfBasin} opacity={basinOpacity} glow={basinOpacity} />
			</ContentStack>

			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						opacity: textOpacity,
						transform: `scale(${textScale})`,
						background: 'rgba(6, 16, 32, 0.55)',
						padding: '28px 40px',
						borderRadius: 12,
						border: `2px solid ${COLORS.stroke}`,
					}}
				>
					<div style={{color: 'white', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 58, letterSpacing: 3, textAlign: 'center'}}>
						7,500 YEARS AGO
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

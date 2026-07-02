import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, COLORS, LAYOUT} from '../theme';

// VO: "This is the geographical reality. About 7,500 years ago, sea levels
// were significantly lower. The entire northern basin of the Persian Gulf
// was dry land, a fertile river valley"
export const SCENE_7_DURATION = 327; // 10.9s @ 30fps

const MAP_FADE_OUT = [0, 65] as const; // 1515-1580
const TEXT_SPRING_DURATION = 40;
const TEXT_FADE_IN = [0, 20] as const;
const TEXT_FADE_OUT = [100, 165] as const; // 1615-1680
const VALLEY_CROSS_DISSOLVE = [100, 165] as const;

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const mapOpacity = interpolate(frame, MAP_FADE_OUT, [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const textSpringValue =
		frame < TEXT_SPRING_DURATION
			? spring({frame, fps, config: {damping: 11, stiffness: 120, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION})
			: 1;
	const textScale = interpolate(textSpringValue, [0, 1], [0.7, 1]);
	const textFadeIn = interpolate(frame, TEXT_FADE_IN, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const textFadeOut = interpolate(frame, TEXT_FADE_OUT, [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const textOpacity = Math.min(textFadeIn, textFadeOut);

	const valleyOpacity = interpolate(frame, VALLEY_CROSS_DISSOLVE, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center', opacity: mapOpacity}}>
				<MiddleEastMap
					width={880}
					pishon={{progress: 1, pop: 1}}
					gihon={{progress: 1, pop: 1}}
					euphrates={{progress: 1, pop: 1}}
					tigris={{progress: 1, pop: 1}}
					regions={{turkey: 1, syria: 1, iraq: 1, havilah: 1, cush: 1}}
					pin={{dropProgress: 1, pulseScale: 1}}
					dim={1}
					basinGlow={1}
				/>
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center', opacity: valleyOpacity}}>
				<Img src={ASSETS.dryValley} style={{width: 520}} />
			</AbsoluteFill>

			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						opacity: textOpacity,
						transform: `scale(${textScale})`,
						background: 'rgba(6, 16, 32, 0.55)',
						padding: '28px 40px',
						borderRadius: 12,
						border: `2px solid ${COLORS.strokeCyan}`,
					}}
				>
					<div
						style={{
							color: 'white',
							fontFamily: 'sans-serif',
							fontWeight: 700,
							fontSize: 58,
							letterSpacing: 3,
							textAlign: 'center',
						}}
					>
						7,500{' '}
						<span style={{color: COLORS.strokeCyan}}>YEARS</span> AGO
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

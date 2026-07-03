import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {pulse} from '../motion';
import {ASSETS, COLORS} from '../theme';

// VO: "About 7,500 years ago, sea levels were significantly lower. The entire northern"
export const SCENE_11_DURATION = 210; // 7.0s @ 30fps

const DISSOLVE_WINDOW = [120, 210] as const;
export const TEXT_HANDOFF_OPACITY = 0.3;
export const VALLEY_HANDOFF_OPACITY = 0.5;

export const Scene11: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const textPulseScale = pulse(frame, fps, 0.03, 0.35);
	const textOpacity = interpolate(frame, DISSOLVE_WINDOW, [1, TEXT_HANDOFF_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const valleyOpacity = interpolate(frame, DISSOLVE_WINDOW, [0, VALLEY_HANDOFF_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />

			<ContentStack>
				<Img src={ASSETS.dryValley} style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: valleyOpacity}} />
			</ContentStack>

			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						opacity: textOpacity,
						transform: `scale(${textPulseScale})`,
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

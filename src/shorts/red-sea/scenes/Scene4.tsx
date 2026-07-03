import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {Stage} from '../Stage';
import {StrikeThrough} from '../StrikeThrough';
import {TextCard} from '../TextCard';

// VO: "The original Hebrew says Yom Suf, which translates much closer to
// the Sea of Reeds."
// CONTINUES from Scene 3 — the struck-through "RED SEA" fades out, "YAM
// SUPH" springs in, then cross-dissolves into "SEA OF REEDS".
export const SCENE_4_DURATION = 240; // 8.0s @ 30fps

const OLD_TEXT_FADE_WINDOW = [0, 30] as const;
const YAM_SPRING_START = 20;
const YAM_SPRING_DURATION = 45;
const DISSOLVE_WINDOW = [150, 190] as const;

const overlayStyle: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const oldTextOpacity = interpolate(frame, OLD_TEXT_FADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const yamLocal = frame - YAM_SPRING_START;
	const yamSpring =
		yamLocal < 0 ? 0 : yamLocal >= YAM_SPRING_DURATION ? 1 : spring({frame: yamLocal, fps, config: {damping: 11, stiffness: 130, mass: 0.8}, durationInFrames: YAM_SPRING_DURATION});
	const yamScale = interpolate(yamSpring, [0, 1], [0.6, 1]) * breathe(frame, fps, 0.012, 0.22);
	const dissolveOut = interpolate(frame, DISSOLVE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const yamOpacity = Math.min(yamSpring, dissolveOut);

	const reedsOpacity = interpolate(frame, DISSOLVE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const reedsScale = interpolate(reedsOpacity, [0, 1], [0.85, 1]) * breathe(frame, fps, 0.012, 0.22);

	return (
		<Stage>
			{oldTextOpacity > 0.01 && (
				<div style={{position: 'relative'}}>
					<TextCard text="RED SEA" opacity={oldTextOpacity} fontSize={64} />
					<StrikeThrough progress={1} width={420} height={90} />
				</div>
			)}
			<div style={{position: 'relative', width: 560, height: 160}}>
				{yamOpacity > 0.01 && (
					<div style={overlayStyle}>
						<TextCard text="YAM SUPH" opacity={yamOpacity} scale={yamScale} fontSize={64} />
					</div>
				)}
				{reedsOpacity > 0.01 && (
					<div style={overlayStyle}>
						<TextCard text="SEA OF REEDS" opacity={reedsOpacity} scale={reedsScale} fontSize={56} />
					</div>
				)}
			</div>
		</Stage>
	);
};

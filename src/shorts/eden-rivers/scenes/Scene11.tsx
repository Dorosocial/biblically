import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MOUNTAIN_PEAK_COUNT, MountainRange} from '../MountainRange';
import {RiverOverlay} from '../RiverOverlay';
import {ASSETS, COLORS, LAYOUT} from '../theme';

// VO: "So if Eden really existed in that valley, it is now under
// approximately 60 meters of water in the Persian Gulf."
export const SCENE_11_DURATION = 168; // 5.6s @ 30fps

const MARKER_SPRING_DURATION = 49; // 2451-2500
const ZOOM_WINDOW = [49, 168] as const; // 2500-2619

const VALLEY_WIDTH = 520;
const FULL_MOUNTAINS = Array.from({length: MOUNTAIN_PEAK_COUNT}, () => 1);

const labelStyle: React.CSSProperties = {
	color: COLORS.mapLabel,
	fontFamily: 'sans-serif',
	fontSize: 26,
	fontWeight: 700,
	letterSpacing: 2,
	textAlign: 'center',
};

export const Scene11: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const markerSpring =
		frame < MARKER_SPRING_DURATION
			? spring({frame, fps, config: {damping: 10, stiffness: 140, mass: 0.8}, durationInFrames: MARKER_SPRING_DURATION})
			: 1;
	const markerOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const zoomScale = interpolate(frame, ZOOM_WINDOW, [1, 1.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const height = VALLEY_WIDTH * (600 / 334);

	return (
		<AbsoluteFill style={{transform: `scale(${zoomScale})`, transformOrigin: 'center center'}}>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<div style={{position: 'relative', width: VALLEY_WIDTH, height}}>
					<Img src={ASSETS.dryValley} style={{width: VALLEY_WIDTH}} />
					<RiverOverlay width={VALLEY_WIDTH} opacity={1} />
					<div style={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
						<MountainRange edge="top" progress={FULL_MOUNTAINS} />
					</div>
					<div style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
						<MountainRange edge="bottom" progress={FULL_MOUNTAINS} />
					</div>
					<div style={{position: 'absolute', top: 14, left: 0, width: '100%', ...labelStyle}}>TURKEY</div>
					<div style={{position: 'absolute', bottom: 14, left: 0, width: '100%', ...labelStyle}}>
						ARABIAN PENINSULA
					</div>
					<Img src={ASSETS.waterTexture} style={{position: 'absolute', top: 0, left: 0, width: VALLEY_WIDTH}} />

					{/* 60m depth marker + downward arrow, over the flooded basin */}
					<div
						style={{
							position: 'absolute',
							top: '42%',
							left: '50%',
							transform: `translate(-50%, -50%) scale(${markerSpring})`,
							opacity: markerOpacity,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								color: 'white',
								fontFamily: 'sans-serif',
								fontWeight: 700,
								fontSize: 34,
								letterSpacing: 1,
								background: 'rgba(6, 16, 32, 0.55)',
								padding: '6px 16px',
								borderRadius: 8,
								border: `2px solid ${COLORS.strokeCyan}`,
							}}
						>
							~60m
						</div>
						<svg width={24} height={90} viewBox="0 0 24 90">
							<line x1={12} y1={0} x2={12} y2={68} stroke={COLORS.strokeCyan} strokeWidth={3} />
							<path d="M0,60 L12,88 L24,60" fill="none" stroke={COLORS.strokeCyan} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
						</svg>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

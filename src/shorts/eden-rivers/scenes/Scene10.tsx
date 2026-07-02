import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {MOUNTAIN_PEAK_COUNT, MountainRange} from '../MountainRange';
import {RiverOverlay} from '../RiverOverlay';
import {ASSETS, COLORS, LAYOUT} from '../theme';

// VO: "Post-glacial sea level rise flooded that basin completely."
export const SCENE_10_DURATION = 210; // 7.0s @ 30fps

const WATER_RISE_WINDOW = [0, 149] as const; // 2241-2390

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

export const Scene10: React.FC = () => {
	const frame = useCurrentFrame();

	const waterTopInset = interpolate(frame, WATER_RISE_WINDOW, [100, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const height = VALLEY_WIDTH * (600 / 334);

	return (
		<AbsoluteFill>
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

					<Img
						src={ASSETS.waterTexture}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: VALLEY_WIDTH,
							clipPath: `inset(${waterTopInset}% 0 0 0)`,
						}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

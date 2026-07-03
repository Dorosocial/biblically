import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {pushIn} from '../motion';
import {ASSETS, COLORS} from '../theme';
import {TEXT_HANDOFF_OPACITY, VALLEY_HANDOFF_OPACITY} from './Scene11';

// VO: "basin of the Persian Gulf was dry land, a fertile river valley fed
// by four converging rivers"
export const SCENE_12_DURATION = 240; // 8.0s @ 30fps

const VALLEY_WINDOW = [0, 60] as const;
const TEXT_FADE_OUT_WINDOW = [0, 40] as const;
const RIVER_FADE_DURATION = 50;
const RIVER_STARTS = {euphrates: 60, tigris: 80, pishon: 100, gihon: 120} as const;

const riverProgress = (frame: number, start: number) =>
	interpolate(frame, [start, start + RIVER_FADE_DURATION], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const Scene12: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_12_DURATION);
	const valleyOpacity = interpolate(frame, VALLEY_WINDOW, [VALLEY_HANDOFF_OPACITY, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const textOpacity = interpolate(frame, TEXT_FADE_OUT_WINDOW, [TEXT_HANDOFF_OPACITY, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />

			<ContentStack scale={contentScale}>
				<Img src={ASSETS.dryValley} style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: valleyOpacity}} />
				<MapImageLayer src={ASSETS.riverEuphrates} left="24%" top="8%" width="40%" opacity={riverProgress(frame, RIVER_STARTS.euphrates)} />
				<MapImageLayer src={ASSETS.riverTigris} left="46%" top="10%" width="38%" opacity={riverProgress(frame, RIVER_STARTS.tigris)} />
				<MapImageLayer src={ASSETS.riverPishon} left="4%" top="12%" width="46%" opacity={riverProgress(frame, RIVER_STARTS.pishon)} />
				<MapImageLayer src={ASSETS.riverGihon} left="40%" top="14%" width="42%" opacity={riverProgress(frame, RIVER_STARTS.gihon)} />
			</ContentStack>

			{textOpacity > 0 && (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
					<div
						style={{
							opacity: textOpacity,
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
			)}
		</AbsoluteFill>
	);
};

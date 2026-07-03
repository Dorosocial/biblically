import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {MapStack} from '../MapStack';
import {StrikeThrough} from '../StrikeThrough';
import {breathe} from '../motion';
import {MAP_WIDTH} from './Scene5';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "So this wouldn't look like an open sea at all."
// CONTINUES from Scene 15 — map remains, dimmed, as open-sea.png flashes
// in briefly, gets struck through, then fades back down.
export const SCENE_16_DURATION = 90; // 3.0s @ 30fps

const FLASH_WINDOW = [0, 12] as const;
const STRIKE_WINDOW = [12, 45] as const;
const FADE_OUT_WINDOW = [50, 80] as const;

export const Scene16: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = breathe(frame, fps, 0.012, 0.2);
	const flashIn = interpolate(frame, FLASH_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(frame, FADE_OUT_WINDOW, [1, 0.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const openSeaOpacity = Math.min(flashIn, fadeOut);
	const strikeProgress = interpolate(frame, STRIKE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<ImageLayer src={ASSETS.mapSinai} width="100%" opacity={0.3} />
			</MapStack>
			<div style={{position: 'relative', width: 340}}>
				<ImageLayer src={ASSETS.openSea} width="100%" opacity={openSeaOpacity} />
				<StrikeThrough progress={strikeProgress} width={310} height={170} />
			</div>
		</Stage>
	);
};

import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {breathe, pushIn} from '../motion';
import {MapStack} from '../MapStack';
import {Stage} from '../Stage';
import {ASSETS, ASSET_ASPECT} from '../theme';

// VO: "surrounded by walls so wide ancient sources say chariots raced
// along the top."
// CONTINUES from Scene 7 — city-silhouette.png remains as a dimmed
// backdrop; Nebuchadnezzar fades out to make room for city-wall (focal).
export const SCENE_8_DURATION = 240; // 8.0s @ 30fps

const CITY_SILHOUETTE_WIDTH = 540;
const CITY_WALL_WIDTH = 640;
const NEB_FADE_WINDOW = [0, 40] as const;
const WALL_IN_WINDOW = [20, 90] as const;
const CHARIOT_LOOP_FRAMES = 150;
const CHARIOT_WIDTH_PCT = 15;

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_8_DURATION);
	const nebOpacity = interpolate(frame, NEB_FADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const wallOpacity = interpolate(frame, WALL_IN_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const wallScale = interpolate(frame, WALL_IN_WINDOW, [0.85, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const idleScale = breathe(frame, fps, 0.01, 0.16);

	// Continuous left-to-right lap across the full scene, per the "no true
	// stillness" motion rule — never stops moving.
	const loopLocal = frame % CHARIOT_LOOP_FRAMES;
	const loopProgress = loopLocal / CHARIOT_LOOP_FRAMES;
	const chariotLeftPct = interpolate(loopProgress, [0, 1], [-8, 92]);

	return (
		<Stage gap={16}>
			{nebOpacity > 0.01 && <ImageLayer src={ASSETS.nebuchadnezzar} width={260} opacity={nebOpacity} />}
			<ImageLayer src={ASSETS.citySilhouette} width={CITY_SILHOUETTE_WIDTH} opacity={0.35} scale={idleScale} />

			<MapStack width={CITY_WALL_WIDTH} aspect={ASSET_ASPECT.cityWall} scale={wallScale * contentScale}>
				<ImageLayer src={ASSETS.cityWall} width="100%" opacity={wallOpacity} />
				{wallOpacity > 0.4 && (
					<ImageLayer
						src={ASSETS.chariot}
						width={`${CHARIOT_WIDTH_PCT}%`}
						left={`${chariotLeftPct}%`}
						top="18%"
						anchor="center"
						opacity={wallOpacity}
					/>
				)}
			</MapStack>
		</Stage>
	);
};

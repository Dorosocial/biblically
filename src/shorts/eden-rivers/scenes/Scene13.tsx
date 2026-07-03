import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "sitting between the mountains of Turkey and the Arabian Plains."
export const SCENE_13_DURATION = 150; // 5.0s @ 30fps

const TOP_MOUNTAIN_WINDOW = [0, 50] as const;
const BOTTOM_MOUNTAIN_WINDOW = [20, 70] as const;
const TURKEY_LABEL_WINDOW = [50, 90] as const;
const ARABIA_LABEL_WINDOW = [70, 110] as const;
const SPRING_CONFIG = {damping: 11, stiffness: 130, mass: 0.9};

const springProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene13: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_13_DURATION);
	const topProgress = springProgress(frame, fps, TOP_MOUNTAIN_WINDOW);
	const bottomProgress = springProgress(frame, fps, BOTTOM_MOUNTAIN_WINDOW);
	const topOffsetY = interpolate(topProgress, [0, 1], [-140, 0]);
	const bottomOffsetY = interpolate(bottomProgress, [0, 1], [140, 0]);
	const turkeyLabel = interpolate(frame, TURKEY_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const arabiaLabel = interpolate(frame, ARABIA_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.dryValley} left="0%" top="0%" width="100%" blend="normal" />
				<MapImageLayer src={ASSETS.riverEuphrates} left="24%" top="8%" width="40%" />
				<MapImageLayer src={ASSETS.riverTigris} left="46%" top="10%" width="38%" />
				<MapImageLayer src={ASSETS.riverPishon} left="4%" top="12%" width="46%" />
				<MapImageLayer src={ASSETS.riverGihon} left="40%" top="14%" width="42%" />

				<MapImageLayer
					src={ASSETS.mountainRange}
					left="0%"
					top="-4%"
					width="100%"
					opacity={Math.min(topProgress * 3, 1)}
					offsetY={topOffsetY}
					flipY
				/>
				<MapImageLayer
					src={ASSETS.mountainRange}
					left="0%"
					top="88%"
					width="100%"
					opacity={Math.min(bottomProgress * 3, 1)}
					offsetY={bottomOffsetY}
				/>

				<Label text="TURKEY" progress={turkeyLabel} style={{left: '32%', top: '6%', fontSize: 22}} />
				<Label text="ARABIAN PENINSULA" progress={arabiaLabel} style={{left: '16%', top: '92%', fontSize: 22}} />
			</ContentStack>
		</AbsoluteFill>
	);
};

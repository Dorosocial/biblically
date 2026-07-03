import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {MAP_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "Two of those rivers still exist on a modern map,"
export const SCENE_2_DURATION = 90; // 3.0s @ 30fps

const MAP_FADE_IN = [0, 60] as const;

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const mapOpacity = interpolate(frame, MAP_FADE_IN, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const contentScale = pushIn(frame, SCENE_2_DURATION);

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={mapOpacity} />
			</ContentStack>
		</AbsoluteFill>
	);
};

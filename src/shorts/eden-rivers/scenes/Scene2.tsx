import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {MAP_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {River} from '../River';
import {CONTENT_VIEWBOX, MAP_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "Two of those rivers still exist on a modern map,"
// HARD RESET — nothing from Scene 1 carries over.
export const SCENE_2_DURATION = 90; // 3.0s @ 30fps

const MAP_FADE_IN = [0, 45] as const;
const EUPHRATES_WINDOW = [10, 85] as const;
const TIGRIS_WINDOW = [20, 90] as const;

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const mapOpacity = interpolate(frame, MAP_FADE_IN, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentScale = pushIn(frame, SCENE_2_DURATION);
	const euphratesProgress = interpolate(frame, EUPHRATES_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const tigrisProgress = interpolate(frame, TIGRIS_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.mapBase} {...MAP_LAYOUT.base} opacity={mapOpacity} />
				<River d={MAP_RIVERS.euphrates} viewBox={CONTENT_VIEWBOX} progress={euphratesProgress} frame={frame} glow={0.4} />
				<River d={MAP_RIVERS.tigris} viewBox={CONTENT_VIEWBOX} progress={tigrisProgress} frame={frame} glow={0.4} />
			</ContentStack>
		</Stage>
	);
};

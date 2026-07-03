import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {MapImageLayer} from '../MapImageLayer';
import {SOUTH_ASPECT, SOUTH_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {River} from '../River';
import {ENCIRCLE_HAVILAH, SOUTH_VIEWBOX} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "The Pishon is described as encircling the land of Havilah, which is a"
// HARD RESET — nothing from Scene 5 carries over.
export const SCENE_6_DURATION = 150; // 5.0s @ 30fps

const HAVILAH_FADE_WINDOW = [0, 55] as const;
const PISHON_DRAW_WINDOW = [25, 130] as const;
export const REGION_OPACITY = 0.7;

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_6_DURATION);
	const havilahOpacity = interpolate(frame, HAVILAH_FADE_WINDOW, [0, REGION_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pishonProgress = interpolate(frame, PISHON_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale} width={340} aspect={SOUTH_ASPECT}>
				<MapImageLayer src={ASSETS.highlightHavilah} {...SOUTH_LAYOUT.havilah} opacity={havilahOpacity} />
				<River d={ENCIRCLE_HAVILAH} viewBox={SOUTH_VIEWBOX} progress={pishonProgress} frame={frame} glow={0.5} />
			</ContentStack>
		</Stage>
	);
};

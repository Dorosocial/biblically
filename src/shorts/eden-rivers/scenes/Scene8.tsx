import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {SOUTH_ASPECT, SOUTH_LAYOUT} from '../mapLayout';
import {pushIn} from '../motion';
import {River} from '../River';
import {ENCIRCLE_CUSH, ENCIRCLE_HAVILAH, SOUTH_VIEWBOX} from '../riverPaths';
import {CUSH_HANDOFF_OPACITY} from './Scene7';
import {REGION_OPACITY} from './Scene6';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "which in ancient geography refers to the region south and east"
// CONTINUES from Scene 7 — all elements remain visible; Cush highlight and
// label continue developing/settling in.
export const SCENE_8_DURATION = 180; // 6.0s @ 30fps

const CUSH_FADE_WINDOW = [0, 60] as const;
const CUSH_LABEL_WINDOW = [30, 90] as const;

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_8_DURATION);
	const cushOpacity = interpolate(frame, CUSH_FADE_WINDOW, [CUSH_HANDOFF_OPACITY, REGION_OPACITY], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const cushLabel = interpolate(frame, CUSH_LABEL_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale} width={340} aspect={SOUTH_ASPECT}>
				<MapImageLayer src={ASSETS.highlightHavilah} {...SOUTH_LAYOUT.havilah} opacity={REGION_OPACITY + 0.2} />
				<River d={ENCIRCLE_HAVILAH} viewBox={SOUTH_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<Label text="ARABIAN PENINSULA" progress={1} dim style={{left: '2%', top: '96%', fontSize: 18}} />
				<MapImageLayer src={ASSETS.highlightCush} {...SOUTH_LAYOUT.cush} opacity={cushOpacity} />
				<River d={ENCIRCLE_CUSH} viewBox={SOUTH_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<Label text="CUSH" progress={cushLabel} dim style={{left: '58%', top: '4%', fontSize: 20}} />
			</ContentStack>
		</Stage>
	);
};

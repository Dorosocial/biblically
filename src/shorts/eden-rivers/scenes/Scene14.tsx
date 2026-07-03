import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {pushIn} from '../motion';
import {River} from '../River';
import {CONTENT_VIEWBOX, VALLEY_RIVERS} from '../riverPaths';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "Post-glacial sea level rise flooded that basin completely, so if
// Eden really existed in that"
// CONTINUES from Scene 13 — valley/mountains/rivers remain visible; water
// rises from the bottom and floods the whole scene.
export const SCENE_14_DURATION = 210; // 7.0s @ 30fps

const WATER_RISE_WINDOW = [0, 150] as const;

export const Scene14: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_14_DURATION);
	const waterTopInset = interpolate(frame, WATER_RISE_WINDOW, [100, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<Stage>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<Img src={ASSETS.dryValley} style={{position: 'absolute', top: 0, left: 0, width: '100%'}} />
				<River d={VALLEY_RIVERS.euphrates} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.tigris} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.pishon} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<River d={VALLEY_RIVERS.gihon} viewBox={CONTENT_VIEWBOX} progress={1} frame={frame} glow={0.4} />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="-4%" width="100%" flipY />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="88%" width="100%" />
				<Label text="TURKEY" progress={1} style={{left: '32%', top: '6%', fontSize: 22}} />
				<Label text="ARABIAN PLAINS" progress={1} style={{left: '16%', top: '92%', fontSize: 22}} />

				<Img
					src={ASSETS.waterTexture}
					style={{position: 'absolute', top: 0, left: 0, width: '100%', clipPath: `inset(${waterTopInset}% 0 0 0)`}}
				/>
			</ContentStack>
		</Stage>
	);
};

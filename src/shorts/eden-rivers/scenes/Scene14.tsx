import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {pushIn} from '../motion';
import {ASSETS} from '../theme';

// VO: "Post-glacial sea level rise flooded that basin completely, so if
// Eden really existed in that"
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
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack scale={contentScale}>
				<MapImageLayer src={ASSETS.dryValley} left="0%" top="0%" width="100%" blend="normal" />
				<MapImageLayer src={ASSETS.riverEuphrates} left="24%" top="8%" width="40%" />
				<MapImageLayer src={ASSETS.riverTigris} left="46%" top="10%" width="38%" />
				<MapImageLayer src={ASSETS.riverPishon} left="4%" top="12%" width="46%" />
				<MapImageLayer src={ASSETS.riverGihon} left="40%" top="14%" width="42%" />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="-4%" width="100%" flipY />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="88%" width="100%" />
				<Label text="TURKEY" progress={1} style={{left: '32%', top: '6%', fontSize: 22}} />
				<Label text="ARABIAN PENINSULA" progress={1} style={{left: '16%', top: '92%', fontSize: 22}} />

				<Img
					src={ASSETS.waterTexture}
					style={{position: 'absolute', top: 0, left: 0, width: '100%', clipPath: `inset(${waterTopInset}% 0 0 0)`}}
				/>
			</ContentStack>
		</AbsoluteFill>
	);
};

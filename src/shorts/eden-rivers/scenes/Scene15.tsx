import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {ASSETS} from '../theme';

// VO: "valley, it is now under approximately 60 metres of water in the
// Persian Gulf."
export const SCENE_15_DURATION = 150; // 5.0s @ 30fps

const MARKER_SPRING_DURATION = 50;
const ZOOM_WINDOW = [50, 150] as const;

export const Scene15: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const markerSpring =
		frame < MARKER_SPRING_DURATION
			? spring({frame, fps, config: {damping: 10, stiffness: 140, mass: 0.8}, durationInFrames: MARKER_SPRING_DURATION})
			: 1;
	const markerOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const zoomScale = interpolate(frame, ZOOM_WINDOW, [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{transform: `scale(${zoomScale})`, transformOrigin: 'center center'}}>
			<BibleLayer frame={frame} fps={fps} />
			<ContentStack>
				<MapImageLayer src={ASSETS.dryValley} left="0%" top="0%" width="100%" blend="normal" />
				<MapImageLayer src={ASSETS.riverEuphrates} left="24%" top="8%" width="40%" />
				<MapImageLayer src={ASSETS.riverTigris} left="46%" top="10%" width="38%" />
				<MapImageLayer src={ASSETS.riverPishon} left="4%" top="12%" width="46%" />
				<MapImageLayer src={ASSETS.riverGihon} left="40%" top="14%" width="42%" />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="-4%" width="100%" flipY />
				<MapImageLayer src={ASSETS.mountainRange} left="0%" top="88%" width="100%" />
				<Label text="TURKEY" progress={1} style={{left: '32%', top: '6%', fontSize: 22}} />
				<Label text="ARABIAN PENINSULA" progress={1} style={{left: '16%', top: '92%', fontSize: 22}} />
				<MapImageLayer src={ASSETS.waterTexture} left="0%" top="0%" width="100%" blend="normal" />

				<MapImageLayer
					src={ASSETS.depthArrow}
					left="38%"
					top="38%"
					width="24%"
					opacity={markerOpacity}
					scale={markerSpring}
				/>
				<Label
					text="~60m"
					progress={markerSpring}
					fontSize={30}
					style={{left: '38%', top: '30%', width: '24%', background: 'rgba(6,16,32,0.55)', padding: '6px 0', borderRadius: 8}}
				/>
			</ContentStack>
		</AbsoluteFill>
	);
};

import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {ContentStack} from '../ContentStack';
import {Label} from '../Label';
import {MapImageLayer} from '../MapImageLayer';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "valley, it is now under approximately 60 metres of water in the
// Persian Gulf."
// CONTINUES from Scene 14 — the flooded scene remains visible; depth
// marker springs in, then holds as the final freeze frame with a subtle
// zoom-in.
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
			<Stage>
				<BibleLayer frame={frame} fps={fps} />
				<ContentStack>
					<Img src={ASSETS.dryValley} style={{position: 'absolute', top: 0, left: 0, width: '100%'}} />
					<MapImageLayer src={ASSETS.mountainRange} left="0%" top="-4%" width="100%" flipY />
					<MapImageLayer src={ASSETS.mountainRange} left="0%" top="88%" width="100%" />
					<Label text="TURKEY" progress={1} style={{left: '32%', top: '6%', fontSize: 22}} />
					<Label text="ARABIAN PLAINS" progress={1} style={{left: '16%', top: '92%', fontSize: 22}} />
					<Img src={ASSETS.waterTexture} style={{position: 'absolute', top: 0, left: 0, width: '100%'}} />

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
			</Stage>
		</AbsoluteFill>
	);
};

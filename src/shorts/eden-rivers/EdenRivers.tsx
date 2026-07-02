import {AbsoluteFill, Img, Sequence} from 'remotion';
import {Scene1, SCENE_1_DURATION} from './scenes/Scene1';
import {Scene2, SCENE_2_DURATION} from './scenes/Scene2';
import {ASSETS} from './theme';

export const EdenRivers: React.FC = () => {
	return (
		<AbsoluteFill>
			<Img
				src={ASSETS.background}
				style={{width: '100%', height: '100%', objectFit: 'cover'}}
			/>

			<Sequence from={0} durationInFrames={SCENE_1_DURATION} name="Scene 1">
				<Scene1 />
			</Sequence>

			<Sequence from={SCENE_1_DURATION} durationInFrames={SCENE_2_DURATION} name="Scene 2">
				<Scene2 />
			</Sequence>

			{/* Scene 3 goes here: <Sequence from={SCENE_1_DURATION + SCENE_2_DURATION} durationInFrames={...}><Scene3 /></Sequence> */}
		</AbsoluteFill>
	);
};

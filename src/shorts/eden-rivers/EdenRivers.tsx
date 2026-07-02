import {AbsoluteFill, Img, Sequence} from 'remotion';
import {Scene1, SCENE_1_DURATION} from './scenes/Scene1';
import {Scene2, SCENE_2_DURATION} from './scenes/Scene2';
import {Scene3, SCENE_3_DURATION} from './scenes/Scene3';
import {Scene4, SCENE_4_DURATION} from './scenes/Scene4';
import {Scene5, SCENE_5_DURATION} from './scenes/Scene5';
import {Scene6, SCENE_6_DURATION} from './scenes/Scene6';
import {Scene7, SCENE_7_DURATION} from './scenes/Scene7';
import {Scene8, SCENE_8_DURATION} from './scenes/Scene8';
import {Scene9, SCENE_9_DURATION} from './scenes/Scene9';
import {Scene10, SCENE_10_DURATION} from './scenes/Scene10';
import {Scene11, SCENE_11_DURATION} from './scenes/Scene11';
import {ASSETS} from './theme';

const scenes = [
	{Component: Scene1, duration: SCENE_1_DURATION, name: 'Scene 1'},
	{Component: Scene2, duration: SCENE_2_DURATION, name: 'Scene 2'},
	{Component: Scene3, duration: SCENE_3_DURATION, name: 'Scene 3'},
	{Component: Scene4, duration: SCENE_4_DURATION, name: 'Scene 4'},
	{Component: Scene5, duration: SCENE_5_DURATION, name: 'Scene 5'},
	{Component: Scene6, duration: SCENE_6_DURATION, name: 'Scene 6'},
	{Component: Scene7, duration: SCENE_7_DURATION, name: 'Scene 7'},
	{Component: Scene8, duration: SCENE_8_DURATION, name: 'Scene 8'},
	{Component: Scene9, duration: SCENE_9_DURATION, name: 'Scene 9'},
	{Component: Scene10, duration: SCENE_10_DURATION, name: 'Scene 10'},
	{Component: Scene11, duration: SCENE_11_DURATION, name: 'Scene 11'},
] as const;

export const EdenRivers: React.FC = () => {
	let from = 0;

	return (
		<AbsoluteFill>
			<Img src={ASSETS.background} style={{width: '100%', height: '100%', objectFit: 'cover'}} />

			{scenes.map(({Component, duration, name}) => {
				const sequence = (
					<Sequence key={name} from={from} durationInFrames={duration} name={name}>
						<Component />
					</Sequence>
				);
				from += duration;
				return sequence;
			})}
		</AbsoluteFill>
	);
};

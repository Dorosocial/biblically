import {Composition} from 'remotion';
import {FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from './shared/constants';
import {Babylon} from './shorts/babylon/Babylon';
import {EdenRivers} from './shorts/eden-rivers/EdenRivers';
import {RedSea} from './shorts/red-sea/RedSea';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="EdenRivers"
				component={EdenRivers}
				durationInFrames={2610} // 87s @ 30fps
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="Babylon"
				component={Babylon}
				durationInFrames={1860} // 62s @ 30fps
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="RedSea"
				component={RedSea}
				durationInFrames={3180} // 106s @ 30fps
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
		</>
	);
};

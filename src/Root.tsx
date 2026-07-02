import {Composition} from 'remotion';
import {FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from './shared/constants';
import {EdenRivers} from './shorts/eden-rivers/EdenRivers';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="EdenRivers"
				component={EdenRivers}
				durationInFrames={2619} // 87.3s @ 30fps
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
		</>
	);
};

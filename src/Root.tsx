import {Composition} from 'remotion';
import {FPS, LONG_FORM_HEIGHT, LONG_FORM_WIDTH, VIDEO_HEIGHT, VIDEO_WIDTH} from './shared/constants';
import {EdenRivers} from './shorts/eden-rivers/EdenRivers';
import {Segment1ColdOpen, SEGMENT_1_DURATION} from './long-form/worst-eras/segment-1-cold-open/Segment1ColdOpen';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="EdenRivers"
				component={EdenRivers}
				durationInFrames={FPS * 30}
				fps={FPS}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="WorstEras-Segment1-ColdOpen"
				component={Segment1ColdOpen}
				durationInFrames={SEGMENT_1_DURATION}
				fps={FPS}
				width={LONG_FORM_WIDTH}
				height={LONG_FORM_HEIGHT}
			/>
		</>
	);
};

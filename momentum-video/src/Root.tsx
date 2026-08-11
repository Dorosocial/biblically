import {Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {MomentumComparison} from './compositions/MomentumComparison';
import {FPS, WIDTH, HEIGHT} from './constants';
import {INTRO_FRAMES} from './scenes/cues';
import './style.css';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MomentumComparison"
				component={MomentumComparison}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				// Placeholder — overwritten by calculateMetadata using the real
				// narration audio duration. Keep this close so the Studio
				// timeline doesn't flash a wildly wrong length before it resolves.
				durationInFrames={30 * 56}
				calculateMetadata={async () => {
					const durationInSeconds = await getAudioDurationInSeconds(
						staticFile('audio/narration.mp3'),
					);
					// Silent wordless-hook intro plays before the narration track
					// starts (see cues.ts) — total length is that intro plus the
					// real, measured narration duration, not the narration alone.
					return {
						durationInFrames: INTRO_FRAMES + Math.round(durationInSeconds * FPS),
					};
				}}
			/>
		</>
	);
};

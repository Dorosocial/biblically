import React from 'react';
import {Sequence} from 'remotion';
import {IMAGE_WINDOWS, MOTION_WINDOWS} from './overlaySchedule';
import {NarratorImageOverlay} from './NarratorImageOverlay';
import {AttentionDeclineGraph} from './motion/AttentionDeclineGraph';
import {DotFormation} from './motion/DotFormation';
import {BreathingPulse} from './motion/BreathingPulse';
import {SplitFocusCircles} from './motion/SplitFocusCircles';
import {SoundRipple} from './motion/SoundRipple';
import {HourglassPatience} from './motion/HourglassPatience';
import {TensionVignette} from './motion/TensionVignette';
import {MotionTrailPreview} from './motion/MotionTrailPreview';

const IMAGE_DIR = 'neurolam/too-much-brainrot/assets/images/narrator';

const ImageSequence: React.FC<{file: keyof typeof IMAGE_WINDOWS}> = ({file}) => {
	const w = IMAGE_WINDOWS[file];
	return (
		<Sequence from={w.start} durationInFrames={w.end - w.start}>
			<NarratorImageOverlay src={`${IMAGE_DIR}/${file}`} durationInFrames={w.end - w.start} />
		</Sequence>
	);
};

// Purely additive: this is the ONE new layer mounted on top of the existing,
// locked composition. Nothing here reads from or alters exercise visuals,
// distractor placement, VO volume, or the frame map — it only adds new
// Sequences at specific VO-line windows. nl-intro's window is never touched.
export const OverlayLayer: React.FC = () => {
	return (
		<>
			<ImageSequence file="narrator-img-nl2-phone-reach.png" />
			<ImageSequence file="narrator-img-nl3-rebuilding.png" />
			<ImageSequence file="narrator-img-nl23-anticipation.png" />
			<ImageSequence file="narrator-img-nl26-quiet-strength.png" />
			<ImageSequence file="narrator-img-nl32-crossroads.png" />
			<ImageSequence file="narrator-img-nl34-open-path.png" />

			<Sequence
				from={MOTION_WINDOWS.attentionDeclineGraph.start}
				durationInFrames={MOTION_WINDOWS.attentionDeclineGraph.end - MOTION_WINDOWS.attentionDeclineGraph.start}
			>
				<AttentionDeclineGraph
					durationInFrames={MOTION_WINDOWS.attentionDeclineGraph.end - MOTION_WINDOWS.attentionDeclineGraph.start}
				/>
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.dotFormation.start}
				durationInFrames={MOTION_WINDOWS.dotFormation.end - MOTION_WINDOWS.dotFormation.start}
			>
				<DotFormation durationInFrames={MOTION_WINDOWS.dotFormation.end - MOTION_WINDOWS.dotFormation.start} />
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.breathingPulse.start}
				durationInFrames={MOTION_WINDOWS.breathingPulse.end - MOTION_WINDOWS.breathingPulse.start}
			>
				<BreathingPulse
					durationInFrames={MOTION_WINDOWS.breathingPulse.end - MOTION_WINDOWS.breathingPulse.start}
				/>
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.splitFocusCircles.start}
				durationInFrames={MOTION_WINDOWS.splitFocusCircles.end - MOTION_WINDOWS.splitFocusCircles.start}
			>
				<SplitFocusCircles
					durationInFrames={MOTION_WINDOWS.splitFocusCircles.end - MOTION_WINDOWS.splitFocusCircles.start}
				/>
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.soundRipple.start}
				durationInFrames={MOTION_WINDOWS.soundRipple.end - MOTION_WINDOWS.soundRipple.start}
			>
				<SoundRipple />
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.hourglassPatience.start}
				durationInFrames={MOTION_WINDOWS.hourglassPatience.end - MOTION_WINDOWS.hourglassPatience.start}
			>
				<HourglassPatience />
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.tensionVignette.start}
				durationInFrames={MOTION_WINDOWS.tensionVignette.end - MOTION_WINDOWS.tensionVignette.start}
			>
				<TensionVignette />
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.motionTrailPreview.start}
				durationInFrames={MOTION_WINDOWS.motionTrailPreview.end - MOTION_WINDOWS.motionTrailPreview.start}
			>
				<MotionTrailPreview />
			</Sequence>

			<Sequence
				from={MOTION_WINDOWS.mirroredDotFormation.start}
				durationInFrames={MOTION_WINDOWS.mirroredDotFormation.end - MOTION_WINDOWS.mirroredDotFormation.start}
			>
				<DotFormation
					durationInFrames={MOTION_WINDOWS.mirroredDotFormation.end - MOTION_WINDOWS.mirroredDotFormation.start}
					mirrored
				/>
			</Sequence>
		</>
	);
};

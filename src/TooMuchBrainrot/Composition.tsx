import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Background} from './Background';
import {PrimaryDot} from './PrimaryDot';
import {VoiceOverTrack} from './VoiceOverTrack';
import {ExerciseDistractors} from './DistractorMedia';
import {EX10_SHAKE_WINDOW, Exercise, INTRO_SPAN, getExerciseHoldWindow} from './schedule';
import {SecondaryDot} from './elements/SecondaryDot';
import {FlashingShapes} from './elements/FlashingShapes';
import {FakeUIPopup} from './elements/FakeUIPopup';
import {ColorFlashOverlay} from './elements/ColorFlashOverlay';
import {RogueTextFragment} from './elements/RogueTextFragment';
import {GhostDouble} from './elements/GhostDouble';
import {CornerReachShape} from './elements/CornerReachShape';
import {NotificationBadge} from './elements/NotificationBadge';
import {NextVideoThumbnail} from './elements/NextVideoThumbnail';
import {DelayedRevealGraphic} from './elements/DelayedRevealGraphic';
import {ProgressGlow} from './elements/ProgressGlow';
import {ThreePointMarkers} from './elements/ThreePointMarkers';
import {MotionTrail} from './elements/MotionTrail';
import {ScreenShake} from './elements/ScreenShake';

const HoldWindow: React.FC<{exercise: Exercise; children: React.ReactNode}> = ({exercise, children}) => {
	const window = getExerciseHoldWindow(exercise);
	if (!window) {
		return null;
	}

	return (
		<Sequence from={window.start} durationInFrames={window.end - window.start}>
			{children}
		</Sequence>
	);
};

export const TooMuchBrainrot: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill>
			<Background />

			<ScreenShake frame={frame} windowStart={EX10_SHAKE_WINDOW.start} windowDurationInFrames={EX10_SHAKE_WINDOW.durationInFrames}>
				<AbsoluteFill>
					{/* Intro: two ambient distractor videos, no hold window of their own — they run under the intro VO montage. */}
					<Sequence from={INTRO_SPAN.start} durationInFrames={INTRO_SPAN.end - INTRO_SPAN.start}>
						<ExerciseDistractors exercise="intro" durationInFrames={INTRO_SPAN.end - INTRO_SPAN.start} />
					</Sequence>

					{/* ex1 — "Minimal Drift": no media distractors, no extra native elements. The dot's own continuous
					    drift (always mounted below) is what satisfies the no-freeze rule here. */}

					{/* ex2 */}
					<HoldWindow exercise="ex2">
						<ExerciseDistractors exercise="ex2" durationInFrames={getExerciseHoldWindow('ex2')!.end - getExerciseHoldWindow('ex2')!.start} />
						<FlashingShapes />
						<FakeUIPopup />
						<ColorFlashOverlay />
						<RogueTextFragment />
						<GhostDouble />
					</HoldWindow>

					{/* ex3 */}
					<HoldWindow exercise="ex3">
						<ExerciseDistractors exercise="ex3" durationInFrames={getExerciseHoldWindow('ex3')!.end - getExerciseHoldWindow('ex3')!.start} />
					</HoldWindow>

					{/* ex4 — second baseline/minimal window, same treatment as ex1. */}

					{/* ex5 */}
					<HoldWindow exercise="ex5">
						<SecondaryDot corner="topRight" />
					</HoldWindow>

					{/* ex6 */}
					<HoldWindow exercise="ex6">
						<ExerciseDistractors exercise="ex6" durationInFrames={getExerciseHoldWindow('ex6')!.end - getExerciseHoldWindow('ex6')!.start} />
						<NotificationBadge corner="topRight" />
					</HoldWindow>

					{/* ex7 */}
					<HoldWindow exercise="ex7">
						<ProgressGlow durationInFrames={getExerciseHoldWindow('ex7')!.end - getExerciseHoldWindow('ex7')!.start} />
						<DelayedRevealGraphic durationInFrames={getExerciseHoldWindow('ex7')!.end - getExerciseHoldWindow('ex7')!.start} />
					</HoldWindow>

					{/* ex8 */}
					<HoldWindow exercise="ex8">
						<ExerciseDistractors exercise="ex8" durationInFrames={getExerciseHoldWindow('ex8')!.end - getExerciseHoldWindow('ex8')!.start} />
						<ThreePointMarkers />
					</HoldWindow>

					{/* ex9 */}
					<HoldWindow exercise="ex9">
						<ExerciseDistractors exercise="ex9" durationInFrames={getExerciseHoldWindow('ex9')!.end - getExerciseHoldWindow('ex9')!.start} />
						<SecondaryDot corner="bottomLeft" />
						<CornerReachShape corner="topLeft" />
					</HoldWindow>

					{/* ex10 — Speed Remix: also the sole screen-shake moment, applied at the AbsoluteFill wrapping everything. */}
					<HoldWindow exercise="ex10">
						<ExerciseDistractors exercise="ex10" durationInFrames={getExerciseHoldWindow('ex10')!.end - getExerciseHoldWindow('ex10')!.start} />
						<MotionTrail />
					</HoldWindow>

					{/* ex11 */}
					<HoldWindow exercise="ex11">
						<ExerciseDistractors exercise="ex11" durationInFrames={getExerciseHoldWindow('ex11')!.end - getExerciseHoldWindow('ex11')!.start} />
						<CornerReachShape corner="bottomRight" />
						<NotificationBadge corner="topRight" />
						<NextVideoThumbnail />
					</HoldWindow>
				</AbsoluteFill>
			</ScreenShake>

			{/* Always mounted for the full video — the motion floor. */}
			<PrimaryDot />

			<VoiceOverTrack />
		</AbsoluteFill>
	);
};

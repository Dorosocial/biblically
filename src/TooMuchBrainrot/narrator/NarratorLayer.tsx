import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {HEIGHT, WIDTH} from '../constants';
import {
	NARRATOR_EXTENDED_END,
	NARRATOR_WINDOWS,
	NL23_WINDOWS,
	NL26_WINDOWS,
	NL2_WINDOWS,
	NL_OUTRO_WINDOW,
	PREVIEW_WINDOWS,
	Window,
} from './narratorSchedule';
import {NARRATOR_BG} from './palette';
import {MinimalBeat} from './MinimalBeat';
import {SilhouetteImageBeat} from './SilhouetteImageBeat';
import {Nl2ThoughtScene} from './scenes/Nl2ThoughtScene';
import {Nl2FiveObjectsScene} from './scenes/Nl2FiveObjectsScene';
import {Nl3Scene} from './scenes/Nl3Scene';
import {Nl4Scene} from './scenes/Nl4Scene';
import {Nl5Scene} from './scenes/Nl5Scene';
import {Nl6Scene} from './scenes/Nl6Scene';
import {Nl7Scene} from './scenes/Nl7Scene';
import {Nl9Scene} from './scenes/Nl9Scene';
import {Nl12Scene} from './scenes/Nl12Scene';
import {Nl14Scene} from './scenes/Nl14Scene';
import {Nl15Scene} from './scenes/Nl15Scene';
import {Nl16Scene} from './scenes/Nl16Scene';
import {Nl18Scene} from './scenes/Nl18Scene';
import {Nl19Scene} from './scenes/Nl19Scene';
import {Nl21Scene} from './scenes/Nl21Scene';
import {Nl27Scene} from './scenes/Nl27Scene';
import {Nl30Scene} from './scenes/Nl30Scene';
import {Nl31Scene} from './scenes/Nl31Scene';
import {Nl32Scene} from './scenes/Nl32Scene';
import {Nl33Scene} from './scenes/Nl33Scene';
import {FilmstripRecapScene} from './scenes/FilmstripRecapScene';
import {
	Ex1Preview,
	Ex2Preview,
	Ex3Preview,
	Ex4Preview,
	Ex5Preview,
	Ex6Preview,
	Ex7Preview,
	Ex8Preview,
	Ex9Preview,
	Ex10Preview,
	Ex11Preview,
} from './previews/ExercisePreviews';

const OpaqueBg: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: NARRATOR_BG, width: WIDTH, height: HEIGHT}} />
);

// Narrator scenes: background extends to NARRATOR_EXTENDED_END (closing the
// systemic 15f gap after every narrator-owned line), while content still
// animates against its own original, unextended window — so entrance/exit
// timing relative to the spoken words never changes, only the opaque
// background's persistence.
const NarratorBeat: React.FC<{window: Window; extendedEnd: number; children: React.ReactNode}> = ({
	window,
	extendedEnd,
	children,
}) => (
	<Sequence from={window.start} durationInFrames={extendedEnd - window.start}>
		<OpaqueBg />
		{children}
	</Sequence>
);

// Exercise-preview panels: unchanged from the previous build. They never
// have a trailing gap (their clip always transitions straight into its
// exercise's hold, zero gap, by construction), so no extension is needed.
const PreviewBeat: React.FC<{window: Window; children: React.ReactNode}> = ({window, children}) => (
	<Sequence from={window.start} durationInFrames={window.end - window.start}>
		<OpaqueBg />
		{children}
	</Sequence>
);

export const NarratorLayer: React.FC = () => {
	const w = NARRATOR_WINDOWS;
	const p = PREVIEW_WINDOWS;

	return (
		<>
			{/* nl-2: 4 beats, image / built / image / built */}
			<NarratorBeat window={NL2_WINDOWS.standingAlone} extendedEnd={NARRATOR_EXTENDED_END.standingAlone}>
				<SilhouetteImageBeat
					file="narrator-nl2-1-standing-alone.png"
					contentDuration={NL2_WINDOWS.standingAlone.end - NL2_WINDOWS.standingAlone.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL2_WINDOWS.thought} extendedEnd={NARRATOR_EXTENDED_END.thought}>
				<Nl2ThoughtScene />
			</NarratorBeat>
			<NarratorBeat window={NL2_WINDOWS.phoneReach} extendedEnd={NARRATOR_EXTENDED_END.phoneReach}>
				<SilhouetteImageBeat
					file="narrator-nl2-3-phone-reach.png"
					contentDuration={NL2_WINDOWS.phoneReach.end - NL2_WINDOWS.phoneReach.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL2_WINDOWS.fiveObjects} extendedEnd={NARRATOR_EXTENDED_END.fiveObjects}>
				<Nl2FiveObjectsScene />
			</NarratorBeat>

			<NarratorBeat window={w.nl3} extendedEnd={NARRATOR_EXTENDED_END.nl3}>
				<Nl3Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl4} extendedEnd={NARRATOR_EXTENDED_END.nl4}>
				<Nl4Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl5} extendedEnd={NARRATOR_EXTENDED_END.nl5}>
				<Nl5Scene durationInFrames={w.nl5.end - w.nl5.start} />
			</NarratorBeat>
			<NarratorBeat window={w.nl6} extendedEnd={NARRATOR_EXTENDED_END.nl6}>
				<Nl6Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl7} extendedEnd={NARRATOR_EXTENDED_END.nl7}>
				<Nl7Scene durationInFrames={w.nl7.end - w.nl7.start} />
			</NarratorBeat>

			<PreviewBeat window={p.ex1}>
				<Ex1Preview />
			</PreviewBeat>

			<NarratorBeat window={w.nl9} extendedEnd={NARRATOR_EXTENDED_END.nl9}>
				<Nl9Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex2}>
				<Ex2Preview />
			</PreviewBeat>
			<PreviewBeat window={p.ex3}>
				<Ex3Preview durationInFrames={p.ex3.end - p.ex3.start} />
			</PreviewBeat>

			<NarratorBeat window={w.nl12} extendedEnd={NARRATOR_EXTENDED_END.nl12}>
				<Nl12Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex4}>
				<Ex4Preview durationInFrames={p.ex4.end - p.ex4.start} />
			</PreviewBeat>

			<NarratorBeat window={w.nl14} extendedEnd={NARRATOR_EXTENDED_END.nl14}>
				<Nl14Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl15} extendedEnd={NARRATOR_EXTENDED_END.nl15}>
				<Nl15Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl16} extendedEnd={NARRATOR_EXTENDED_END.nl16}>
				<Nl16Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex5}>
				<Ex5Preview />
			</PreviewBeat>

			<NarratorBeat window={w.nl18} extendedEnd={NARRATOR_EXTENDED_END.nl18}>
				<Nl18Scene durationInFrames={w.nl18.end - w.nl18.start} />
			</NarratorBeat>
			<NarratorBeat window={w.nl19} extendedEnd={NARRATOR_EXTENDED_END.nl19}>
				<Nl19Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex6}>
				<Ex6Preview />
			</PreviewBeat>

			<NarratorBeat window={w.nl21} extendedEnd={NARRATOR_EXTENDED_END.nl21}>
				<Nl21Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex7}>
				<Ex7Preview />
			</PreviewBeat>

			{/* nl-23: 3 image beats */}
			<NarratorBeat window={NL23_WINDOWS.headTurn} extendedEnd={NARRATOR_EXTENDED_END.headTurn}>
				<SilhouetteImageBeat
					file="narrator-nl23-1-head-turn.png"
					contentDuration={NL23_WINDOWS.headTurn.end - NL23_WINDOWS.headTurn.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL23_WINDOWS.alertPosture} extendedEnd={NARRATOR_EXTENDED_END.alertPosture}>
				<SilhouetteImageBeat
					file="narrator-nl23-2-alert-posture.png"
					contentDuration={NL23_WINDOWS.alertPosture.end - NL23_WINDOWS.alertPosture.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL23_WINDOWS.leanForward} extendedEnd={NARRATOR_EXTENDED_END.leanForward}>
				<SilhouetteImageBeat
					file="narrator-nl23-3-lean-forward.png"
					contentDuration={NL23_WINDOWS.leanForward.end - NL23_WINDOWS.leanForward.start}
				/>
			</NarratorBeat>

			<PreviewBeat window={p.ex8}>
				<Ex8Preview durationInFrames={p.ex8.end - p.ex8.start} />
			</PreviewBeat>
			<PreviewBeat window={p.ex9}>
				<Ex9Preview />
			</PreviewBeat>

			{/* nl-26: 2 image beats + filmstrip recap tail */}
			<NarratorBeat window={NL26_WINDOWS.seatedStill} extendedEnd={NARRATOR_EXTENDED_END.seatedStill}>
				<SilhouetteImageBeat
					file="narrator-nl26-1-seated-still.png"
					contentDuration={NL26_WINDOWS.seatedStill.end - NL26_WINDOWS.seatedStill.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL26_WINDOWS.centered} extendedEnd={NARRATOR_EXTENDED_END.centered}>
				<SilhouetteImageBeat
					file="narrator-nl26-2-centered.png"
					contentDuration={NL26_WINDOWS.centered.end - NL26_WINDOWS.centered.start}
				/>
			</NarratorBeat>
			<NarratorBeat window={NL26_WINDOWS.filmstripRecap} extendedEnd={NARRATOR_EXTENDED_END.filmstripRecap}>
				<FilmstripRecapScene />
			</NarratorBeat>

			<NarratorBeat window={w.nl27} extendedEnd={NARRATOR_EXTENDED_END.nl27}>
				<Nl27Scene />
			</NarratorBeat>

			<PreviewBeat window={p.ex10}>
				<Ex10Preview />
			</PreviewBeat>

			<PreviewBeat window={p.ex11}>
				<Ex11Preview durationInFrames={p.ex11.end - p.ex11.start} />
			</PreviewBeat>

			<NarratorBeat window={w.nl30} extendedEnd={NARRATOR_EXTENDED_END.nl30}>
				<Nl30Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl31} extendedEnd={NARRATOR_EXTENDED_END.nl31}>
				<Nl31Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl32} extendedEnd={NARRATOR_EXTENDED_END.nl32}>
				<Nl32Scene durationInFrames={w.nl32.end - w.nl32.start} />
			</NarratorBeat>
			<NarratorBeat window={w.nl33} extendedEnd={NARRATOR_EXTENDED_END.nl33}>
				<Nl33Scene />
			</NarratorBeat>
			<NarratorBeat window={w.nl34} extendedEnd={NARRATOR_EXTENDED_END.nl34}>
				<SilhouetteImageBeat
					file="narrator-nl34-1-open-stance.png"
					contentDuration={w.nl34.end - w.nl34.start}
				/>
			</NarratorBeat>

			{/* nl-outro is out of this rebuild's scope — unchanged minimal treatment. */}
			<Sequence from={NL_OUTRO_WINDOW.start} durationInFrames={NL_OUTRO_WINDOW.end - NL_OUTRO_WINDOW.start}>
				<OpaqueBg />
				<MinimalBeat intensity={0.3} />
			</Sequence>
		</>
	);
};

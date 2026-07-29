import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {HEIGHT, WIDTH} from '../constants';
import {NARRATOR_WINDOWS, PREVIEW_WINDOWS, Window} from './narratorSchedule';
import {NARRATOR_BG} from './palette';
import {MinimalBeat} from './MinimalBeat';
import {Nl2Scene} from './scenes/Nl2Scene';
import {Nl3Scene} from './scenes/Nl3Scene';
import {Nl5Scene} from './scenes/Nl5Scene';
import {Nl6Scene} from './scenes/Nl6Scene';
import {Nl1516Scene} from './scenes/Nl1516Scene';
import {Nl18Scene} from './scenes/Nl18Scene';
import {Nl19Scene} from './scenes/Nl19Scene';
import {Nl21Scene} from './scenes/Nl21Scene';
import {Nl23Scene} from './scenes/Nl23Scene';
import {Nl26Scene} from './scenes/Nl26Scene';
import {Nl27Scene} from './scenes/Nl27Scene';
import {Nl32Scene} from './scenes/Nl32Scene';
import {Nl34Scene} from './scenes/Nl34Scene';
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

const Beat: React.FC<{window: Window; children: React.ReactNode}> = ({window, children}) => (
	<Sequence from={window.start} durationInFrames={window.end - window.start}>
		<OpaqueBg />
		{children}
	</Sequence>
);

// Opaque, full-scene narrator layer. Mounted once at the top of the
// composition tree (after everything else), so every window here fully
// occludes the exercise environment beneath it — nl-intro and every
// exercise HOLD window have no Sequence here at all, so they render
// completely untouched.
export const NarratorLayer: React.FC = () => {
	const w = NARRATOR_WINDOWS;
	const p = PREVIEW_WINDOWS;

	return (
		<>
			<Beat window={w.nl2}>
				<Nl2Scene />
			</Beat>
			<Beat window={w.nl3}>
				<Nl3Scene />
			</Beat>
			<Beat window={w.nl4}>
				<MinimalBeat intensity={0.7} />
			</Beat>
			<Beat window={w.nl5}>
				<Nl5Scene durationInFrames={w.nl5.end - w.nl5.start} />
			</Beat>
			<Beat window={w.nl6}>
				<Nl6Scene />
			</Beat>
			<Beat window={w.nl7}>
				<MinimalBeat intensity={0.3} />
			</Beat>

			<Beat window={p.ex1}>
				<Ex1Preview />
			</Beat>

			<Beat window={w.nl9}>
				<MinimalBeat intensity={0.35} />
			</Beat>

			<Beat window={p.ex2}>
				<Ex2Preview />
			</Beat>
			<Beat window={p.ex3}>
				<Ex3Preview durationInFrames={p.ex3.end - p.ex3.start} />
			</Beat>

			<Beat window={w.nl12}>
				<MinimalBeat intensity={0.4} />
			</Beat>

			<Beat window={p.ex4}>
				<Ex4Preview durationInFrames={p.ex4.end - p.ex4.start} />
			</Beat>

			<Beat window={w.nl14}>
				<MinimalBeat intensity={0.3} />
			</Beat>
			<Beat window={w.nl1516}>
				<Nl1516Scene durationInFrames={w.nl1516.end - w.nl1516.start} />
			</Beat>

			<Beat window={p.ex5}>
				<Ex5Preview />
			</Beat>

			<Beat window={w.nl18}>
				<Nl18Scene durationInFrames={w.nl18.end - w.nl18.start} />
			</Beat>
			<Beat window={w.nl19}>
				<Nl19Scene />
			</Beat>

			<Beat window={p.ex6}>
				<Ex6Preview />
			</Beat>

			<Beat window={w.nl21}>
				<Nl21Scene />
			</Beat>

			<Beat window={p.ex7}>
				<Ex7Preview />
			</Beat>

			<Beat window={w.nl23}>
				<Nl23Scene durationInFrames={w.nl23.end - w.nl23.start} />
			</Beat>

			<Beat window={p.ex8}>
				<Ex8Preview durationInFrames={p.ex8.end - p.ex8.start} />
			</Beat>
			<Beat window={p.ex9}>
				<Ex9Preview />
			</Beat>

			<Beat window={w.nl26}>
				<Nl26Scene />
			</Beat>
			<Beat window={w.nl27}>
				<Nl27Scene />
			</Beat>

			<Beat window={p.ex10}>
				<Ex10Preview />
			</Beat>

			<Beat window={p.ex11}>
				<Ex11Preview durationInFrames={p.ex11.end - p.ex11.start} />
			</Beat>

			<Beat window={w.nl30}>
				<MinimalBeat intensity={0.2} />
			</Beat>
			<Beat window={w.nl31}>
				<MinimalBeat intensity={0.25} />
			</Beat>
			<Beat window={w.nl32}>
				<Nl32Scene />
			</Beat>
			<Beat window={w.nl33}>
				<MinimalBeat intensity={0.55} />
			</Beat>
			<Beat window={w.nl34}>
				<Nl34Scene durationInFrames={w.nl34.end - w.nl34.start} />
			</Beat>
			<Beat window={w.nlOutro}>
				<MinimalBeat intensity={0.3} />
			</Beat>
		</>
	);
};

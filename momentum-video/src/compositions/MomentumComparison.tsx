import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Scene} from '../three/Scene';
import {Label, Counter} from '../components/Overlay';
import {LABELS, COUNTERS} from '../scenes/labels';
import {INTRO_FRAMES} from '../scenes/cues';
import {WIDTH, HEIGHT} from '../constants';

// ---------------------------------------------------------------------------
// SFX PLACEHOLDER CUE SHEET — sound effects are NOT included in this project;
// these are the exact frames (30fps) where a mix pass should drop in impact /
// whoosh / freeze stingers. Kept in one place so audio post doesn't have to
// re-derive timing from the visuals.
//
//   frame   0 -  54   : (silent) wordless intro build-up — optional low rumble
//   frame  54 -  75   : TODO SFX — intro collision impact + giant-ball launch whoosh
//   frame 460         : TODO SFX — S8 impact/freeze ("just as much momentum") hit + freeze-ring
//   frame 1052 - 1097 : TODO SFX — S18 slow-motion collision rumble (pitched down)
//   frame 1463         : TODO SFX — S24 impact, tiny ball sends giant ball flying (big hit + whoosh)
//   frame 1726         : TODO SFX — S28 final freeze — hard impact stinger right at the freeze
// ---------------------------------------------------------------------------

export const MomentumComparison: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#05070d'}}>
			<ThreeCanvas
				width={WIDTH}
				height={HEIGHT}
				dpr={1}
				gl={{antialias: false, powerPreference: 'high-performance'}}
			>
				<Scene />
			</ThreeCanvas>

			<AbsoluteFill style={{pointerEvents: 'none'}}>
				{LABELS.map((label, i) => (
					<Label
						key={i}
						text={label.text}
						inFrame={label.inFrame}
						outFrame={label.outFrame}
						x={label.x}
						y={label.y}
						size={label.size}
						color={label.color}
						weight={label.weight}
					/>
				))}
				{COUNTERS.map((counter, i) => (
					<Counter
						key={i}
						inFrame={counter.inFrame}
						outFrame={counter.outFrame}
						from={counter.from}
						to={counter.to}
						x={counter.x}
						y={counter.y}
						prefix={counter.prefix}
						suffix={counter.suffix}
						size={counter.size}
					/>
				))}
			</AbsoluteFill>

			{/* Narration audio, frame-accurate from its own frame 0 — offset by the
			    silent wordless intro so the "do not explain first" hook plays before
			    any narration lands (see cues.ts for the sync-accuracy rationale). */}
			<Sequence from={INTRO_FRAMES} name="narration">
				<Audio src={staticFile('audio/narration.mp3')} />
			</Sequence>
		</AbsoluteFill>
	);
};

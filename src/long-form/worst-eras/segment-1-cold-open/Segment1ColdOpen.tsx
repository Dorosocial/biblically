import {AbsoluteFill, Img, Sequence} from 'remotion';
import {ASSETS} from './theme';
import {ShotA_WidowGate, SHOT_A_DURATION} from './shots/ShotA_WidowGate';
import {ShotB_ElijahMeeting, SHOT_B_DURATION} from './shots/ShotB_ElijahMeeting';
import {ShotC_WidowResponse, SHOT_C_DURATION} from './shots/ShotC_WidowResponse';
import {ShotD_JarComposite, SHOT_D_DURATION} from './shots/ShotD_JarComposite';
import {ShotE_WidowAloneJar, SHOT_E_DURATION} from './shots/ShotE_WidowAloneJar';
import {ShotF_ElijahReturn, SHOT_F_DURATION} from './shots/ShotF_ElijahReturn';
import {ShotG_MiracleJar, SHOT_G_DURATION} from './shots/ShotG_MiracleJar';
import {ShotH_GhostWidows, SHOT_H_DURATION} from './shots/ShotH_GhostWidows';
import {ShotI_FamineLandscape, SHOT_I_DURATION} from './shots/ShotI_FamineLandscape';
import {ShotJ_StatsCrossfade, SHOT_J_DURATION} from './shots/ShotJ_StatsCrossfade';
import {ShotK_FadeOut, SHOT_K_DURATION} from './shots/ShotK_FadeOut';

// "Worst Eras" — Segment 1: Cold Open (The Widow at Zarephath, 1 Kings 17).
// ESTIMATED timing — durations below are placeholders until real voiceover
// audio/timestamps are provided, at which point each shot's duration (and
// the internal beat-boundary constants inside each shot file) gets re-synced.
//
// Beats 1-21 from the spec are grouped into 11 shots wherever the spec calls
// for motion to continue uninterrupted across a beat boundary (e.g. "push-in
// continues", "idle motion continues") — Remotion resets useCurrentFrame() at
// every Sequence boundary, so beats sharing one continuous motion live in a
// single Sequence and switch sub-beat behavior (text/glow/dim fade-ins) via
// local-frame thresholds instead of restarting a new shot.
export const SEGMENT_1_DURATION = 2880; // 96.0s @ 30fps

const shots = [
	{Component: ShotA_WidowGate, duration: SHOT_A_DURATION, name: 'A — Widow at the Gate (beats 1-2)'},
	{Component: ShotB_ElijahMeeting, duration: SHOT_B_DURATION, name: 'B — Elijah Meets the Widow (beats 3-4)'},
	{Component: ShotC_WidowResponse, duration: SHOT_C_DURATION, name: 'C — Widow Responds (beat 5)'},
	{Component: ShotD_JarComposite, duration: SHOT_D_DURATION, name: 'D — Jar/Widow Scale Composite (beats 6-7)'},
	{Component: ShotE_WidowAloneJar, duration: SHOT_E_DURATION, name: 'E — Widow Alone With the Jar (beats 8-10)'},
	{Component: ShotF_ElijahReturn, duration: SHOT_F_DURATION, name: 'F — Elijah Returns (beat 11)'},
	{Component: ShotG_MiracleJar, duration: SHOT_G_DURATION, name: 'G — The Miracle Jar (beats 12-14)'},
	{Component: ShotH_GhostWidows, duration: SHOT_H_DURATION, name: 'H — Ghost Widows + Dust (beats 15-17)'},
	{Component: ShotI_FamineLandscape, duration: SHOT_I_DURATION, name: 'I — Famine Landscape (beats 18-19)'},
	{Component: ShotJ_StatsCrossfade, duration: SHOT_J_DURATION, name: 'J — Statistics Crossfade (beat 20)'},
	{Component: ShotK_FadeOut, duration: SHOT_K_DURATION, name: 'K — Fade to Black (beat 21)'},
] as const;

export const Segment1ColdOpen: React.FC = () => {
	let from = 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#ffffff'}}>
			<Img src={ASSETS.background} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />

			{shots.map(({Component, duration, name}) => {
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

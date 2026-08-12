import React from 'react';
import {Shot, secToFrames} from '../lib/timing';
import {expCountLabel, secondsCount, flavorClimbingCount} from '../lib/counters';
import {commas} from '../lib/format';
import {theme} from '../lib/theme';
import {
	BigGlowNumber,
	TimelineBar,
	SplitCompare,
	CounterReadout,
	StackNumbers,
	CalendarWheel,
	MultiplierBadge,
} from './components';

/**
 * Renders one shot's HTML/CSS overlay content. Pure function of
 * (shot, absolute frame) — the caller (Overlay.tsx) is responsible for
 * fading it in/out via shotEnvelope() at cut boundaries.
 */
export const renderShotOverlay = (shot: Shot, frame: number): React.ReactNode => {
	const startF = secToFrames(shot.start);
	const endF = secToFrames(shot.end);
	const localSec = frame / 30 - shot.start;
	const progress = Math.min(1, Math.max(0, (frame - startF) / Math.max(1, endF - startF)));

	switch (shot.id) {
		case 'billionSecondsForever':
			// SFX placeholder: deep low "forever" drone swell in, ticking clock foley starts
			return <BigGlowNumber value="1,000,000,000" label="SECONDS" startFrame={startF} seed={0} y="24%" size={92} />;

		case 'only31Years':
			// SFX placeholder: whoosh transform as number morphs into timeline bar
			return (
				<>
					<BigGlowNumber value="1 BILLION SECONDS" size={46} label="" startFrame={startF} />
					<TimelineBar label="→ 31.7 YEARS" fillPct={38} startFrame={startF + 8} y={1120} />
				</>
			);

		case 'seriously31Years':
			return (
				<>
					<TimelineBar label="A HUMAN LIFETIME (~80 YEARS)" fillPct={100} startFrame={startF} y={860} color="#3b82f6" glow={0.5} />
					<TimelineBar
						label="JUST 31 YEARS OF IT"
						sublabel="the highlighted stretch below"
						fillPct={39}
						startFrame={startF + 6}
						y={960}
					/>
				</>
			);

		case 'meaningCounting':
			// SFX placeholder: soft metronome tick begins, one click per second
			return <CounterReadout value={String(secondsCount(localSec))} startFrame={startF} y="60%" size={90} />;

		case 'oneEverySecond': {
			const val = expCountLabel(progress, 0, 6);
			// wrapper needs its own position:absolute+inset so the `filter` (which
			// creates a new containing block) doesn't break CounterReadout's `top: %`
			return (
				<div style={{position: 'absolute', inset: 0, filter: 'blur(1.1px)'}}>
					<CounterReadout value={val} startFrame={startF} y="58%" size={96} />
				</div>
			);
		}

		case 'need31_7Years': {
			const val = expCountLabel(progress, 6, 9);
			return (
				<>
					<CounterReadout value={val} startFrame={startF} y="46%" size={84} />
					<CalendarWheel startFrame={startF + 6} progress={progress} />
				</>
			);
		}

		case 'alreadyInsane':
			// PUNCTUATED PAUSE 1 — SFX placeholder: hard stop, low sub-bass hit, then
			// a slow shimmering pad sustain under the held number.
			return <BigGlowNumber value="1 BILLION SECONDS" startFrame={startF} size={78} seed={2} y="44%" />;

		case 'compareBillionYears':
			return (
				<SplitCompare
					leftValue="1,000,000,000"
					leftLabel="SECONDS"
					rightValue="1,000,000,000"
					rightLabel="YEARS"
					startFrame={startF}
				/>
			);

		case 'notJustLongTime':
			return (
				<TimelineBar
					label="1 BILLION YEARS"
					sublabel="isn't just ‘a really long time’"
					fillPct={150}
					startFrame={startF}
					y={980}
					color={theme.glowAmber}
				/>
			);

		case 'thirtyOneMillionTimes':
			return (
				<>
					<TimelineBar label="1 BILLION SECONDS" fillPct={2} startFrame={startF} y={480} color="#7dd3fc" />
					<MultiplierBadge value="31,500,000×" startFrame={startF + 6} />
					<TimelineBar label="1 BILLION YEARS" fillPct={220} startFrame={startF + 4} y={1460} color={theme.glowAmber} />
				</>
			);

		case 'justThinkAboutThat':
			// PUNCTUATED PAUSE 2 — SFX placeholder: everything drops out except a
			// slow heartbeat-like sub pulse, timed to the glow-pulse in the visuals.
			return (
				<>
					<TimelineBar label="1 BILLION SECONDS" fillPct={2} startFrame={startF} y={480} color="#7dd3fc" />
					<TimelineBar label="1 BILLION YEARS" fillPct={220} startFrame={startF} y={1460} color={theme.glowAmber} />
				</>
			);

		case 'spendLifeCounting': {
			const val = commas(flavorClimbingCount(localSec, 4_000_000));
			return <CounterReadout value={val} startFrame={startF} y="60%" size={72} />;
		}

		case 'wouldntComeClose': {
			const val = commas(flavorClimbingCount(localSec, 60_000_000));
			return (
				<>
					<CounterReadout value={val} startFrame={startF} y="30%" size={54} />
					<TimelineBar label="1 BILLION YEARS" fillPct={280} startFrame={startF + 4} y={1500} color={theme.glowAmber} />
				</>
			);
		}

		case 'overBillionYears':
		case 'continentsCanMove':
		case 'mountainsRiseErode':
		case 'speciesAppear':
		case 'evenDisappear':
		case 'earthUnrecognizable':
			// mostly 3D-carried shots (Earth / continents / mountains / species) —
			// intentionally minimal HTML so the scene reads clearly.
			return null;

		case 'numbersHardToImagine':
			return (
				<StackNumbers
					items={['1,000', '1,000,000', '1,000,000,000', '1,000,000,000,000']}
					startFrame={startF}
					revealSpacing={26}
				/>
			);

		case 'secondVsMinute': {
			const secs = Math.min(60, Math.max(1, Math.round(progress * 60)));
			return <CounterReadout value={`${secs}s`} startFrame={startF} y="72%" size={64} />;
		}

		case 'understandOneYear':
			return <CalendarWheel startFrame={startF} progress={progress} />;

		case 'butBillionYears':
			return <BigGlowNumber value="1 BILLION YEARS?" startFrame={startF} size={58} seed={4} />;

		case 'timescaleEnormous':
			return (
				<TimelineBar
					label="THE TIMELINE KEEPS GOING…"
					fillPct={400}
					startFrame={startF}
					y={1200}
					color={theme.glowAmber}
				/>
			);

		case 'brainsNoIntuition':
			// LOOP SEAM — SFX placeholder: the billion-years drone collapses back
			// down to a single soft tick, matched to the stopwatch reappearing,
			// so the audio (not just video) loops with no seam.
			return (
				<SplitCompare
					leftValue="1 SECOND"
					leftLabel="you feel this"
					rightValue="1,000,000,000 YEARS"
					rightLabel="you can't feel this"
					startFrame={startF}
				/>
			);

		default:
			return null;
	}
};

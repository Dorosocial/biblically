// ---------------------------------------------------------------------------
// Timing derived from the Whisper transcription of narration-source.mp3
// (see transcript.json — word-level timestamps). Real audio duration is
// 84.610563s. The shot-list timestamps in the brief were pacing references
// for a ~112s draft; this file holds the REAL beat boundaries, taken
// straight off the transcript, which is what actually drives the cut.
// ---------------------------------------------------------------------------

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Real narration ends at 84.610563s. Round the composition UP so the audio
// is never truncated (ceil, not round/floor).
export const AUDIO_DURATION_SECONDS = 84.610563;
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION_SECONDS * FPS); // 2539

export const toFrame = (seconds: number) => Math.round(seconds * FPS);

export type CameraMove =
  | 'pullback' // fast pull-back = scale/context reveal
  | 'pushin' // macro push-in = discovery/emphasis
  | 'locked' // locked-off = let a contradiction sit
  | 'orbit' // slow orbit = "both are right" / dwelling
  | 'snap' // snap zoom = sudden realization
  | 'pov' // POV shot = perspective shift
  | 'massive-pullback' // the big unifying reveal
  | 'dolly'
  | 'chase'
  | 'drift'
  | 'rotate-with'
  | 'tracking'
  | 'match-cut';

export interface Beat {
  id: number;
  start: number; // seconds
  end: number; // seconds
  cue: string; // narration text for this beat
  shot: string; // camera language tag, for reference/comments
  move: CameraMove;
}

// Word-for-word matches the Whisper transcript segments/words.
export const BEATS: Beat[] = [
  {id: 0, start: 0.0, end: 4.88, cue: 'Imagine you leave Earth and travel through space at almost the speed of light', shot: 'Earth dominates frame, spacecraft launches from surface, two identical clocks briefly both read 0 YEARS.', move: 'pullback'},
  {id: 1, start: 4.88, end: 6.12, cue: 'and come back.', shot: 'Spacecraft arcs away then begins returning. Follow from behind into wide orbital shot.', move: 'pullback'},
  {id: 2, start: 6.54, end: 9.04, cue: 'You look at your clock and only five years have passed,', shot: "Extreme close-up on traveler's clock, numbers rapidly advance and stop at 5 YEARS.", move: 'pushin'},
  {id: 3, start: 9.28, end: 10.62, cue: 'but when you look at Earth,', shot: 'Hard cut, Earth fills screen, giant Earth clock races. Pull back from clock to reveal planet.', move: 'pullback'},
  {id: 4, start: 11.02, end: 12.94, cue: 'you realize 10 years have passed.', shot: 'SPLIT FRAME: TRAVELER - 5 YEARS / EARTH - 10 YEARS. Completely locked-off camera.', move: 'locked'},
  {id: 5, start: 13.54, end: 14.48, cue: "So what's the problem?", shot: 'Both clocks freeze, numbers float in darkness. Slow push toward the numbers.', move: 'pushin'},
  {id: 6, start: 14.9, end: 18.6, cue: 'Because how can two clocks measure different amounts of time?', shot: 'Clocks tick at visibly different rates. Camera slides between them (parallax).', move: 'tracking'},
  {id: 7, start: 19.08, end: 20.5, cue: 'And which time is actually right?', shot: 'Both stop, a "?" appears between them. Dead still, dramatic pause.', move: 'locked'},
  {id: 8, start: 20.88, end: 22.54, cue: "Here's where Einstein's physics gets weird.", shot: 'Clocks dissolve into the glowing spacetime grid; Earth and spacecraft appear as points. Camera dives through the grid.', move: 'pushin'},
  {id: 9, start: 22.82, end: 24.72, cue: 'You see, both clocks are right.', shot: 'Clocks reappear, each with its own glowing frame. Text: BOTH ARE RIGHT. Slow 180° orbit.', move: 'orbit'},
  {id: 10, start: 25.3, end: 28.12, cue: "Time doesn't pass at exactly the same rate for everyone.", shot: 'Two clocks travel separate paths — one with Earth, one racing through space, visibly diverging. Side-tracking camera.', move: 'tracking'},
  {id: 11, start: 28.12, end: 30.86, cue: 'The faster you move relative to someone else,', shot: 'Spacecraft accelerates, speed indicator climbs toward 99.9% c. Chase camera behind spacecraft.', move: 'chase'},
  {id: 12, start: 31.26, end: 34.1, cue: 'the less time can pass on your clock compared with theirs.', shot: 'Traveler clock ticks slowly, Earth clock rapidly advances, synchronized split-screen.', move: 'tracking'},
  {id: 13, start: 34.56, end: 35.54, cue: 'So from your point of view,', shot: 'Interior of spacecraft, traveler figure calmly watches their clock. Slow peaceful push-in.', move: 'pushin'},
  {id: 14, start: 35.76, end: 38.24, cue: 'your five years feel completely normal.', shot: 'Clock counts naturally 1→2→3→4→5 YEARS, nothing strange from inside. Locked macro shot.', move: 'locked'},
  {id: 15, start: 38.56, end: 39.32, cue: 'But when you return,', shot: 'Spacecraft reaches turnaround point, rotates 180°. Camera rotates with it.', move: 'rotate-with'},
  {id: 16, start: 39.66, end: 42.04, cue: 'people on Earth have aged much more than you have.', shot: 'Rapid Earth time-lapse (lighting cycles), traveler unchanged. Rapid pull toward Earth, then time-lapse orbit.', move: 'orbit'},
  {id: 17, start: 42.42, end: 45.26, cue: 'And this is where it sounds impossible.', shot: 'Return to both clocks: 5 YEARS / 10 YEARS. Snap zoom into the difference.', move: 'snap'},
  {id: 18, start: 45.88, end: 46.84, cue: 'If motion is relative,', shot: "Switch to traveler's POV, Earth appears to move away.", move: 'pov'},
  {id: 19, start: 47.5, end: 49.62, cue: "shouldn't Earth look like it's moving away from you too?", shot: "Earth drifts backward, Earth clock appears slower from this perspective.", move: 'drift'},
  {id: 20, start: 49.96, end: 52.4, cue: "So shouldn't Earth's clock run slower?", shot: "Both clocks shown side by side from traveler's frame. Orbit around both.", move: 'orbit'},
  {id: 21, start: 52.82, end: 53.02, cue: 'Yes.', shot: 'Everything freezes, giant YES appears briefly. No movement.', move: 'locked'},
  {id: 22, start: 53.32, end: 56.06, cue: "And that's exactly where the real answer comes in.", shot: 'Spacecraft trajectory becomes a glowing line through the spacetime grid. Huge pull-back.', move: 'pullback'},
  {id: 23, start: 56.26, end: 59.38, cue: "You can't just compare the two clocks while they're moving apart.", shot: 'Two clocks travel separate trajectories, translucent divider shows different locations. Top-down 3D tracking shot.', move: 'tracking'},
  {id: 24, start: 59.76, end: 61.82, cue: 'In this case, the traveler has to turn around,', shot: "Traveler's trajectory bends sharply, Earth path continues straight. Camera rotates around spacecraft as it changes direction.", move: 'rotate-with'},
  {id: 25, start: 62.1, end: 62.48, cue: 'come back,', shot: 'Spacecraft races toward Earth, Earth rapidly grows in background.', move: 'chase'},
  {id: 26, start: 62.86, end: 65.22, cue: 'and then compare the clocks at the same place again.', shot: 'Traveler lands beside Earth, both clocks move into the same frame. Smooth dolly toward both.', move: 'dolly'},
  {id: 27, start: 65.58, end: 69.18, cue: 'And once they do, the clocks can show different elapsed times.', shot: 'Both clocks side-by-side: TRAVELER - 5 YEARS / EARTH - 10 YEARS. Slow macro push-in.', move: 'pushin'},
  {id: 28, start: 69.88, end: 71.46, cue: 'So nothing really broke,', shot: 'Open the clock mechanism, gears moving perfectly normally. Macro orbit through the mechanism.', move: 'orbit'},
  {id: 29, start: 71.8, end: 73.54, cue: 'or no clock malfunctioned.', shot: 'Both mechanisms continue ticking normally. Pull back to reveal both clocks.', move: 'pullback'},
  {id: 30, start: 73.82, end: 77.16, cue: 'The difference rather comes from the paths they took through space time.', shot: 'THE BIG REVEAL: entire journey as two glowing paths through the giant 3D spacetime grid. Massive cinematic pull-back.', move: 'massive-pullback'},
  {id: 31, start: 77.56, end: 79.06, cue: 'Two people can start together,', shot: 'Two stylized human silhouettes stand together on Earth, clocks synchronized at 0. Slow push toward them.', move: 'pushin'},
  {id: 32, start: 79.36, end: 80.2, cue: 'take different journeys,', shot: 'One stays on Earth, one launches into space, paths visibly separate. Camera rises vertically following the diverging paths.', move: 'drift'},
  {id: 33, start: 80.68, end: 84.1, cue: 'and meet again, having experienced different amounts of time.', shot: 'They reunite, look at clocks: 5 YEARS / 10 YEARS. Circular orbit around both, ending on the clocks.', move: 'orbit'},
  // No narration here — trailing ~0.5s of audio. This is the LOOP beat:
  // clocks snap back to 0 YEARS, spacecraft resets to launch pose, match
  // cut to the frame-1 composition so playback restarts invisibly.
  {id: 34, start: 84.1, end: AUDIO_DURATION_SECONDS, cue: '', shot: 'LOOP: clocks reset to 0 YEARS, spacecraft launch pose — match cut back to opening frame.', move: 'match-cut'},
];

export interface BeatWithFrames extends Beat {
  startFrame: number;
  endFrame: number;
}

export const beatFrames: BeatWithFrames[] = BEATS.map((b) => ({
  ...b,
  startFrame: toFrame(b.start),
  endFrame: toFrame(b.end),
}));

export const getBeatAtFrame = (frame: number): BeatWithFrames => {
  for (let i = beatFrames.length - 1; i >= 0; i--) {
    if (frame >= beatFrames[i].startFrame) return beatFrames[i];
  }
  return beatFrames[0];
};

// Named lookups for the three moments that carry retention — kept explicit
// so Root.tsx / preview instructions can point straight at them.
export const KEY_MOMENT_SPLIT_CONTRADICTION_FRAME = toFrame(11.6); // beat 4
export const KEY_MOMENT_BIG_REVEAL_FRAME = toFrame(75.5); // beat 30
export const KEY_MOMENT_LOOP_FRAME = toFrame(84.3); // beat 34

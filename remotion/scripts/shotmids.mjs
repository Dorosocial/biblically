import {SHOTS, secToFrames} from '../src/particle/timing.ts';
for (const s of SHOTS) {
  const mid = Math.round((secToFrames(s.start)+secToFrames(s.end))/2);
  console.log(s.id, mid);
}

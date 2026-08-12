// =============================================================================
// sceneState.ts — the single function that turns `frame` into everything the
// scene needs to render this frame. Pure function of `frame` (deterministic,
// no useEffect/useState/animation loops anywhere) so it renders identically
// no matter how Remotion reaches this frame.
//
// Organized as one case per BEATS entry in timeline.ts, in shot-list order.
// Each case's comment quotes the narration line it covers for traceability,
// and notes where a shot-list idea without matching narration (see the
// CONTENT NOTE in timeline.ts) has been folded in.
// =============================================================================
import {BEATS, type BeatId, FPS} from '../timeline';
import {clamp01, easeIn, easeInOut, easeOut, lerp, lerpV3, prog, pulse, type V3} from './math';
import {addV3, circlePos, inwardDir, outwardDir, rotateY, scaleV3, tangentDir} from './RodBallRig';

// ---------------------------------------------------------------------------
// World constants
// ---------------------------------------------------------------------------
const PIVOT: V3 = [0, 0, 0];
const ROD_LEN = 2.0;
const SPIN_SPEED = 0.09; // rad/frame — a full turn every ~70 frames (~2.3s)
const BALL_SPEED = SPIN_SPEED * ROD_LEN; // linear speed after release, matches tangential speed at release

const CLUSTER_A: V3 = [0, 2.7, 0]; // "outside / fixed frame" mini-diorama (split/overlay beats)
const CLUSTER_B: V3 = [0, -2.7, 0]; // "rotating frame" mini-diorama
const MINI_ROD_LEN = 1.15;

const angleAt = (frame: number) => frame * SPIN_SPEED;

export interface RigInstance {
  pivot: V3;
  ballPosition: V3;
  rodVisible: boolean;
  ballOpacity?: number;
  ballScale?: number;
  rodOpacity?: number;
}

export interface VectorInstance {
  origin: V3;
  direction: V3;
  length: number;
  color: string;
  opacity: number;
}

export interface RingInstance {
  pivot: V3;
  radius: number;
  opacity: number;
  progress?: number;
  rotationOffset?: number;
  color?: string;
}

export interface GridInstance {
  pivot: V3;
  angle: number;
  radius: number;
  opacity: number;
}

export interface SceneState {
  time: number;
  camera: {position: V3; lookAt: V3; fov: number};
  rigs: RigInstance[];
  vectors: VectorInstance[];
  rings: RingInstance[];
  grids: GridInstance[];
  ghostLine?: {from: V3; to: V3; opacity: number};
  freeze: boolean; // true = a genuine static hold this frame (only the 11.5-14s beat may set this)
}

const findBeat = (frame: number): {id: BeatId; start: number; end: number} => {
  for (const b of BEATS) {
    if (frame >= b.start && frame < b.end) return b;
  }
  return BEATS[BEATS.length - 1];
};

const local = (frame: number, start: number, end: number) => {
  const t = prog(frame, start, end);
  return {t, tIn: easeInOut(t)};
};

const VEL_COLOR = '#5ef2a0'; // tangential / velocity — green
const INWARD_COLOR = '#ff9f4d'; // centripetal / inward — orange
const OUTWARD_COLOR = '#e368ff'; // centrifugal / apparent outward — magenta

/** The ball's world position once released, flying the tangent line at `releaseAngle`. */
const flightPos = (releaseAngle: number, elapsedFrames: number): V3 => {
  const releasePoint = circlePos(PIVOT, ROD_LEN, releaseAngle);
  const dir = tangentDir(releaseAngle);
  return addV3(releasePoint, scaleV3(dir, BALL_SPEED * Math.max(0, elapsedFrames)));
};

export const getSceneState = (frame: number): SceneState => {
  const beat = findBeat(frame);
  const time = frame / FPS;
  const base: SceneState = {
    time,
    camera: {position: [0, 3.2, 5.5], lookAt: PIVOT, fov: 55},
    rigs: [],
    vectors: [],
    rings: [],
    grids: [],
    freeze: false,
  };

  switch (beat.id) {
    // -----------------------------------------------------------------------
    // "A ball is attached to a rotating rod, and as the rod spins, the ball
    // is forced to move in a circle." — fast orbiting camera matching the
    // rotation; glowing circular trail shows the orbit.
    // -----------------------------------------------------------------------
    case 'intro': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const camAngle = angle * 0.55 + 2.4;
      base.camera = {
        position: [Math.cos(camAngle) * 4.6, 2.2 - t * 0.6, Math.sin(camAngle) * 4.6],
        lookAt: PIVOT,
        fov: 52,
      };
      base.rigs = [{pivot: PIVOT, ballPosition: circlePos(PIVOT, ROD_LEN, angle), rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: easeOut(clamp01(t / 0.3)), color: '#5fd0ff'}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "But something strange happens when that ball is suddenly released."
    // Close tracking shot beside the ball — both the tangential (velocity)
    // and inward (force) vectors shown together here (the shot-list's
    // "both vectors visible simultaneously" idea, front-loaded since the
    // real narration announces the release very early).
    // -----------------------------------------------------------------------
    case 'approachRelease': {
      const {t} = local(frame, beat.start, beat.end);
      const RELEASE_FRAME = 255; // 8.50s, exactly where Whisper marks "released."
      const angle = angleAt(Math.min(frame, RELEASE_FRAME));
      const attached = frame < RELEASE_FRAME;
      const ballPos = attached ? circlePos(PIVOT, ROD_LEN, angle) : flightPos(angle, frame - RELEASE_FRAME);

      // Camera stays close beside the ball the whole beat, rotating with it
      // while attached, then just riding along once it's released. Offset
      // magnitude tuned so the ball+vectors read clearly without the halo
      // swallowing the whole frame.
      const camLocal: V3 = [1.7, 1.0, 0.9];
      base.camera = attached
        ? {position: addV3(PIVOT, rotateY(camLocal, angle)), lookAt: ballPos, fov: 44}
        : {position: addV3(ballPos, [1.7, 1.0, -1.1]), lookAt: ballPos, fov: 44};

      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: attached}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 1, color: '#5fd0ff'}];
      const vecOp = easeOut(clamp01(t / 0.3));
      if (attached) {
        base.vectors = [
          {origin: ballPos, direction: tangentDir(angle), length: 0.6, color: VEL_COLOR, opacity: vecOp},
          {origin: ballPos, direction: inwardDir(angle), length: 0.5, color: INWARD_COLOR, opacity: vecOp},
        ];
      } else {
        base.vectors = [{origin: ballPos, direction: tangentDir(angle), length: 0.6, color: VEL_COLOR, opacity: 1}];
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "Rather than fly outward, it shoots straight off." — RELEASE REPLAY
    // #1 of 3: the outside/fixed view. Camera releases with the ball, flying
    // alongside it. This is the first leg of the brief's "most important
    // sequence" — the triple replay continues through the next four beats.
    // SOUND DESIGN: the release moment — arm disconnects (frame ~261).
    // -----------------------------------------------------------------------
    case 'releaseOutside': {
      const RELEASE_ANGLE = angleAt(255);
      const elapsed = frame - 255;
      const ballPos = flightPos(RELEASE_ANGLE, elapsed);
      base.camera = {position: addV3(ballPos, [2.4, 1.2, -2.0]), lookAt: ballPos, fov: 46};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: false, ballScale: 1.05}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 0.65, color: '#5fd0ff'}];
      base.vectors = [{origin: ballPos, direction: tangentDir(RELEASE_ANGLE), length: 0.7, color: VEL_COLOR, opacity: 1}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "And that's the part that seems completely out of place." — a genuine
    // freeze under 0.5s (15 frames), then an extreme push-in on the ball as
    // motion resumes. This is the ONLY beat allowed a true static hold.
    // -----------------------------------------------------------------------
    case 'freezeOutOfPlace': {
      const RELEASE_ANGLE = angleAt(255);
      const FREEZE_FRAMES = 14; // < 0.5s @ 30fps
      const freezeUntil = beat.start + FREEZE_FRAMES;
      const isFrozen = frame < freezeUntil;
      base.freeze = isFrozen;
      // Effective elapsed time pauses during the freeze window so motion
      // resumes smoothly from exactly where it paused, no jump.
      const effectiveFrame = isFrozen ? freezeUntil : frame - FREEZE_FRAMES;
      const ballPos = flightPos(RELEASE_ANGLE, effectiveFrame - 255);
      const pushT = easeInOut(clamp01((frame - freezeUntil) / (beat.end - freezeUntil)));
      const camOffset = lerpV3([2.4, 1.2, -2.0], [0.5, 0.24, -0.4], pushT);
      base.camera = {position: addV3(ballPos, camOffset), lookAt: ballPos, fov: lerp(46, 34, pushT)};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: false, ballScale: 1.05}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 0.4, color: '#5fd0ff'}];
      base.vectors = [{origin: ballPos, direction: tangentDir(RELEASE_ANGLE), length: 0.7, color: VEL_COLOR, opacity: 1}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "Because while the ball is attached, the rod is constantly pulling it
    // toward the center," — rewinds to the attached phase to explain the
    // mechanism. ROTATING-FRAME CAMERA (reused technique: computed in the
    // rod's local frame, then rotated by the current angle into world
    // space) — the ball reads as nearly stationary relative to the camera
    // while the world spins. "INWARD FORCE" label; a faint rotating grid
    // marks this as the rotating reference frame.
    // -----------------------------------------------------------------------
    case 'rotatingFrameAttached': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const ballPos = circlePos(PIVOT, ROD_LEN, angle);
      // Camera offset is anchored to the ball's LOCAL position (ROD_LEN,0,0)
      // — not an arbitrary point — so rotating it by the rod's own angle
      // keeps the ball framed consistently all beat long.
      const camLocal: V3 = [ROD_LEN + 1.0, 1.15, 1.6];
      base.camera = {position: addV3(PIVOT, rotateY(camLocal, angle)), lookAt: ballPos, fov: 46};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 1, color: '#5fd0ff'}];
      base.grids = [{pivot: PIVOT, angle, radius: ROD_LEN + 0.5, opacity: easeOut(clamp01(t / 0.4))}];
      base.vectors = [{origin: ballPos, direction: inwardDir(angle), length: 0.7, color: INWARD_COLOR, opacity: easeOut(clamp01(t / 0.35))}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "...and that inward force keeps bending the ball's path again and
    // again until the ball is released." — small tangential tick-vectors
    // accumulate around the ring (the "again and again" bending, built up
    // progressively — folds in the shot-list's velocity-vectors-forming-a-
    // circle idea). At the very end of the line, RELEASE REPLAY #2: the
    // SAME release, now seen through the still-rotating camera, so the ball
    // visibly slides away from its "stationary" spot — the rotating-frame
    // view of the release.
    // -----------------------------------------------------------------------
    case 'bendingPathBuildup': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const RELEASE_FRAME_2 = beat.end - 8; // right at "...is released."
      const attached = frame < RELEASE_FRAME_2;
      const releaseAngle2 = angleAt(RELEASE_FRAME_2);
      const ballPos = attached ? circlePos(PIVOT, ROD_LEN, angle) : flightPos(releaseAngle2, frame - RELEASE_FRAME_2);

      // Camera stays rotating-frame-locked throughout, even past release —
      // it keeps looking at the ROTATING ANCHOR point (where the ball would
      // be if still attached), not the ball itself. That's precisely what
      // makes the release read as "outward drift": the real ball visibly
      // separates from the point the camera keeps tracking.
      const anchor = circlePos(PIVOT, ROD_LEN, angle);
      const camLocal: V3 = [ROD_LEN + 1.0, 1.15, 1.6];
      base.camera = {position: addV3(PIVOT, rotateY(camLocal, angle)), lookAt: anchor, fov: 46};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: attached}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: attached ? 1 : 0.55, color: '#5fd0ff'}];
      base.grids = [{pivot: PIVOT, angle, radius: ROD_LEN + 0.5, opacity: 1}];
      base.vectors = attached
        ? [{origin: ballPos, direction: inwardDir(angle), length: 0.7, color: INWARD_COLOR, opacity: 1}]
        : [{origin: ballPos, direction: tangentDir(releaseAngle2), length: 0.6, color: VEL_COLOR, opacity: 1}];

      // Tick marks: small tangent vectors at 6 fixed angles, appearing one
      // by one as the beat progresses through the attached phase.
      const tickCount = Math.floor(clamp01(t / 0.85) * 6);
      for (let i = 0; i < tickCount; i++) {
        const tickAngle = (i / 6) * Math.PI * 2;
        base.vectors.push({
          origin: circlePos(PIVOT, ROD_LEN, tickAngle),
          direction: tangentDir(tickAngle),
          length: 0.32,
          color: VEL_COLOR,
          opacity: 0.7,
        });
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "But the instant that inward pull disappears, the path stops bending,
    // and the ball keeps moving in the direction it was already traveling,
    // and that's straight." — RELEASE REPLAY #3 of 3: an overlay/split of
    // BOTH reference frames at once, replaying the exact same release
    // simultaneously. Top cluster = outside/fixed (no grid, straight
    // tangent, a faint ghosted "expected outward" line for contrast).
    // Bottom cluster = rotating frame (grid + apparent outward drift).
    // This closes the triple-replay sequence.
    // -----------------------------------------------------------------------
    case 'releaseReplayOverlay': {
      const {tIn} = local(frame, beat.start, beat.end);
      const RELEASE_FRAME = beat.start + 10;
      const releaseAngle = angleAt(RELEASE_FRAME); // fixed — the tangent direction never changes after release
      const frameAngle = angleAt(frame); // keeps advancing — the rotating frame keeps spinning at the same rate
      const elapsed = frame - RELEASE_FRAME;
      const attached = elapsed < 0;
      const miniScale = MINI_ROD_LEN / ROD_LEN;
      // The full-scale flight speed would carry the ball off both mini
      // dioramas within about a second — far too fast to compare the two
      // frames side by side for the ~9s this beat runs. Slowed down for
      // display only; the direction/geometry are what matter here, not
      // matching the full-scale speed exactly.
      const REPLAY_SLOWDOWN = 0.16;

      base.camera = {position: [0, 0.3, lerp(8.2, 7.2, tIn)], lookAt: [0, 0, 0], fov: 60};

      // The rotating frame's own spin is slowed down in lockstep with the
      // flight (a "slow-motion replay" starting exactly at release) so the
      // two stay physically consistent with each other.
      const displayFrameAngle = attached ? frameAngle : releaseAngle + elapsed * SPIN_SPEED * REPLAY_SLOWDOWN;

      // The real physics, computed once in the ORIGINAL (full-scale) pivot's
      // coordinates — both clusters are two different ways of DISPLAYING this
      // one trajectory, not two different physical simulations.
      const worldPos = attached
        ? circlePos(PIVOT, ROD_LEN, frameAngle)
        : addV3(circlePos(PIVOT, ROD_LEN, releaseAngle), scaleV3(tangentDir(releaseAngle), BALL_SPEED * REPLAY_SLOWDOWN * elapsed));

      // Cluster A — outside/fixed frame: the trajectory shown as-is.
      const ballA = addV3(CLUSTER_A, scaleV3(worldPos, miniScale));

      // Cluster B — rotating frame: the SAME trajectory, expressed in
      // coordinates that keep spinning with the (now-vanished) rod. While
      // attached the ball sits still at local (ROD_LEN,0,0) by definition;
      // after release, undoing the frame's own rotation is exactly what
      // reveals the "outward drift" — the ball didn't move outward, the
      // frame rotated out from under it.
      const ballBLocal: V3 = attached ? [ROD_LEN, 0, 0] : rotateY(worldPos, -displayFrameAngle);
      const ballB = addV3(CLUSTER_B, scaleV3(ballBLocal, miniScale));

      base.rigs = [
        {pivot: CLUSTER_A, ballPosition: ballA, rodVisible: attached},
        {pivot: CLUSTER_B, ballPosition: ballB, rodVisible: attached},
      ];
      base.rings = [
        {pivot: CLUSTER_A, radius: MINI_ROD_LEN, opacity: 0.6, color: '#5fd0ff'},
        {pivot: CLUSTER_B, radius: MINI_ROD_LEN, opacity: attached ? 0.6 : 0.2, color: '#5fd0ff'},
      ];
      base.grids = [{pivot: CLUSTER_B, angle: displayFrameAngle, radius: MINI_ROD_LEN + 0.4, opacity: 1}];
      const velDirB = attached ? tangentDir(releaseAngle) : rotateY(tangentDir(releaseAngle), -displayFrameAngle);
      base.vectors = [
        {origin: ballA, direction: tangentDir(releaseAngle), length: 0.5, color: VEL_COLOR, opacity: attached ? 0 : 1},
        {origin: ballB, direction: velDirB, length: 0.5, color: VEL_COLOR, opacity: attached ? 0 : 0.7},
      ];
      // Ghosted "expected outward" line on cluster A only — the wrong
      // intuition, faded in for contrast against the real tangent path.
      if (!attached && elapsed > 6) {
        const ghostFrom = addV3(CLUSTER_A, scaleV3(circlePos(PIVOT, ROD_LEN, releaseAngle), miniScale));
        const ghostDir = outwardDir(releaseAngle);
        base.ghostLine = {
          from: ghostFrom,
          to: addV3(ghostFrom, scaleV3(ghostDir, 1.0)),
          opacity: 0.35 * easeOut(clamp01((elapsed - 6) / 20)),
        };
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "So why does it look like the ball wants to fly outward?" — back to a
    // single rotating-frame view, posing the question with a faint outward
    // hint before the reveal.
    // -----------------------------------------------------------------------
    case 'whyOutward': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const ballPos = circlePos(PIVOT, ROD_LEN, angle);
      const camLocal: V3 = [1.3, 0.9, 1.3];
      base.camera = {position: addV3(PIVOT, rotateY(camLocal, angle)), lookAt: ballPos, fov: 48};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 1, color: '#5fd0ff'}];
      base.grids = [{pivot: PIVOT, angle, radius: ROD_LEN + 0.5, opacity: 1}];
      const hint = 0.15 + 0.1 * pulse(frame, 26);
      base.vectors = [
        {origin: ballPos, direction: inwardDir(angle), length: 0.6, color: INWARD_COLOR, opacity: 0.7},
        {origin: ballPos, direction: outwardDir(angle), length: 0.35, color: OUTWARD_COLOR, opacity: hint},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "This is where centrifugal force comes in." — the large outward
    // arrow appears clearly. Slow orbit around the ball.
    // -----------------------------------------------------------------------
    case 'centrifugalIntro': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const ballPos = circlePos(PIVOT, ROD_LEN, angle);
      const orbitAngle = angle + t * 1.4;
      base.camera = {position: addV3(ballPos, [Math.cos(orbitAngle) * 1.6, 0.7, Math.sin(orbitAngle) * 1.6]), lookAt: ballPos, fov: 44};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 0.8, color: '#5fd0ff'}];
      base.grids = [{pivot: PIVOT, angle, radius: ROD_LEN + 0.5, opacity: 1}];
      const arrowOp = easeOut(clamp01(t / 0.4));
      base.vectors = [
        {origin: ballPos, direction: inwardDir(angle), length: 0.5, color: INWARD_COLOR, opacity: 0.6},
        {origin: ballPos, direction: outwardDir(angle), length: 0.55 + arrowOp * 0.5, color: OUTWARD_COLOR, opacity: arrowOp},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "You see, from the rotating frame, it appears as if the ball is being
    // pushed away from the center," — locked rotating camera (with
    // continuous rotation, never truly static), outward arrow pulsing to
    // sell "being pushed."
    // -----------------------------------------------------------------------
    case 'rotatingPushAway': {
      const angle = angleAt(frame);
      const ballPos = circlePos(PIVOT, ROD_LEN, angle);
      // Outward arrow needs headroom in front of the ball, so the camera
      // offset is anchored past the ball's local position (ROD_LEN,0,0).
      const camLocal: V3 = [ROD_LEN + 1.3, 1.3, 0.3];
      base.camera = {position: addV3(PIVOT, rotateY(camLocal, angle)), lookAt: ballPos, fov: 48};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 0.7, color: '#5fd0ff'}];
      base.grids = [{pivot: PIVOT, angle, radius: ROD_LEN + 0.5, opacity: 1}];
      const push = 0.85 + 0.25 * pulse(frame, 22);
      base.vectors = [
        {origin: ballPos, direction: inwardDir(angle), length: 0.4, color: INWARD_COLOR, opacity: 0.45},
        {origin: ballPos, direction: outwardDir(angle), length: 0.9 * push, color: OUTWARD_COLOR, opacity: 1},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "but from the outside, there's no outward force." — SPLIT-SCREEN: the
    // rotating frame (top, grid + outward arrow) stacked against the
    // outside frame (bottom, no grid, no outward arrow — only the real
    // inward force). Camera pulls back to reveal both at once.
    // -----------------------------------------------------------------------
    case 'splitScreenContrast': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      base.camera = {position: [0, 0, lerp(4.5, 7.2, tIn)], lookAt: [0, 0, 0], fov: lerp(46, 60, tIn)};

      const ballTop = circlePos(CLUSTER_A, MINI_ROD_LEN, angle);
      const ballBottom = circlePos(CLUSTER_B, MINI_ROD_LEN, angle);
      base.rigs = [
        {pivot: CLUSTER_A, ballPosition: ballTop, rodVisible: true},
        {pivot: CLUSTER_B, ballPosition: ballBottom, rodVisible: true},
      ];
      base.rings = [
        {pivot: CLUSTER_A, radius: MINI_ROD_LEN, opacity: 0.9, color: '#5fd0ff'},
        {pivot: CLUSTER_B, radius: MINI_ROD_LEN, opacity: 0.9, color: '#5fd0ff'},
      ];
      // Top = rotating frame (grid + outward). Bottom = outside frame (no grid, no outward).
      base.grids = [{pivot: CLUSTER_A, angle, radius: MINI_ROD_LEN + 0.4, opacity: easeOut(t)}];
      base.vectors = [
        {origin: ballTop, direction: inwardDir(angle), length: 0.3, color: INWARD_COLOR, opacity: 0.4},
        {origin: ballTop, direction: outwardDir(angle), length: 0.55, color: OUTWARD_COLOR, opacity: 1},
        {origin: ballBottom, direction: inwardDir(angle), length: 0.45, color: INWARD_COLOR, opacity: 1},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "There's only the rod pulling inward, while the ball keeps trying to
    // move straight." — resolve back to a single view. Macro vector shot on
    // the attachment point, tangential velocity shown top-down.
    // SOUND DESIGN: final merge back to a single resolved view (frame ~1470).
    // -----------------------------------------------------------------------
    case 'onlyInwardForce': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const angle = angleAt(frame);
      const ballPos = circlePos(PIVOT, ROD_LEN, angle);
      base.camera = {position: lerpV3([0, 4.2, 0.01], [0, 2.2, 2.6], tIn), lookAt: PIVOT, fov: 50};
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: true}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 1, color: '#5fd0ff'}];
      base.vectors = [
        {origin: ballPos, direction: inwardDir(angle), length: 0.75, color: INWARD_COLOR, opacity: 1},
        {origin: ballPos, direction: tangentDir(angle), length: 0.65, color: VEL_COLOR, opacity: 1},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "And that's exactly why a ball is attached to a rotating rod." —
    // final orbit, then a cinematic slow-motion release. The tangent flight
    // curves visually back toward the opening framing for a seamless loop.
    // -----------------------------------------------------------------------
    case 'outroLoop': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const RELEASE_T = 0.55;
      const angle = angleAt(frame);
      const releaseFrame = beat.start + RELEASE_T * (beat.end - beat.start);
      const attached = frame < releaseFrame;
      const releaseAngle = angleAt(releaseFrame);
      const ballPos = attached ? circlePos(PIVOT, ROD_LEN, angle) : flightPos(releaseAngle, (frame - releaseFrame) * 0.5);

      // Camera composition eases back toward the opening shot's framing.
      const camAngle = angle * 0.55 + 2.4;
      base.camera = {
        position: lerpV3(
          [Math.cos(camAngle) * 4.6, 1.6, Math.sin(camAngle) * 4.6],
          [Math.cos(camAngle) * 4.6, 2.2, Math.sin(camAngle) * 4.6],
          tIn,
        ),
        lookAt: attached ? PIVOT : ballPos,
        fov: 52,
      };
      base.rigs = [{pivot: PIVOT, ballPosition: ballPos, rodVisible: attached}];
      base.rings = [{pivot: PIVOT, radius: ROD_LEN, opacity: 1, color: '#5fd0ff'}];
      base.vectors = attached
        ? []
        : [{origin: ballPos, direction: tangentDir(releaseAngle), length: 0.6, color: VEL_COLOR, opacity: 1}];
      return base;
    }

    default:
      return base;
  }
};

import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {BEATS, isInStaticWindow} from '../timing';
import {easeInOutCubic, gentleSine} from './lib/utils';

interface Pose {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

const EPS = 0.001;

/**
 * Camera keyframes across the whole runtime. Consecutive keyframes at
 * (nearly) identical `t` behave as a hard cut; identical poses across a gap
 * (e.g. blackMoment start/end) hold the camera perfectly locked — used for
 * every beat explicitly marked "static" / "camera stops" in the brief.
 */
const KEYFRAMES: Pose[] = [
  // OPENING — completely static framing, very slow micro-push forward.
  {t: 0, pos: [0, 0, 6.4], look: [0, 0, 0], fov: 40},
  {t: BEATS.opening.end, pos: [0, 0, 6.05], look: [0, 0, 0], fov: 40},

  // POSSIBILITIES — eyes remain centered, near-imperceptible sway.
  {t: BEATS.possibilities.start, pos: [0, 0, 6.05], look: [0, 0, 0], fov: 40},
  {t: BEATS.possibilities.end, pos: [0, 0, 5.9], look: [0, 0, 0], fov: 40},

  // BLACK MOMENT — static (locked, duplicate pose).
  {t: BEATS.blackMoment.start, pos: [0, 0, 5.9], look: [0, 0, 0], fov: 40},
  {t: BEATS.blackMoment.end, pos: [0, 0, 5.9], look: [0, 0, 0], fov: 40},

  // HARD CUT to dark-room POV.
  {t: BEATS.hardCutToRoom.end - EPS, pos: [0, 0, 5.9], look: [0, 0, 0], fov: 40},
  {t: BEATS.hardCutToRoom.end, pos: [0, 0, 1.4], look: [0, 0, -3], fov: 58},

  // ROOM REVEAL — slow POV head movement looking around.
  {t: BEATS.roomReveal.end, pos: [0, 0.02, 1.2], look: [-0.05, 0, -3], fov: 58},

  // LIGHTS — quick whip-pans between lamp / screen / window.
  {t: BEATS.lights.lamp.start, pos: [0, 0, 1.2], look: [-1.8, 1.1, -2], fov: 58},
  {t: BEATS.lights.lamp.end - 0.14, pos: [0, 0, 1.2], look: [-1.8, 1.1, -2], fov: 58},
  {t: BEATS.lights.screen.start, pos: [0, 0, 1.2], look: [1.9, 0.1, -3.5], fov: 58},
  {t: BEATS.lights.screen.end - 0.14, pos: [0, 0, 1.2], look: [1.9, 0.1, -3.5], fov: 58},
  {t: BEATS.lights.window.start, pos: [0, 0, 1.2], look: [0, 0.6, -7.9], fov: 58},
  {t: BEATS.lights.window.end, pos: [0, 0, 1.2], look: [0, 0.3, -7.9], fov: 58},

  // FINAL LIGHT GONE — camera stops. Quick reorientation then lock.
  {t: BEATS.finalLightGone.start, pos: [0, 0, 1.2], look: [0, 0, -3], fov: 50},
  {t: BEATS.finalLightGone.end, pos: [0, 0, 1.2], look: [0, 0, -3], fov: 50},

  // PHOTON APPROACH — macro push toward the abstract eyes.
  {t: BEATS.photonApproach.start, pos: [0, 0, 3.2], look: [0, 0, 0], fov: 45},
  {t: BEATS.photonApproach.end, pos: [0, 0, 1.6], look: [0, 0, 0], fov: 38},

  // NEURAL PATHWAY — camera travels along the pathway toward the brain.
  {t: BEATS.neuralPathway.end, pos: [0, 0.9, 0.2], look: [0, 1.1, -1.8], fov: 40},

  // WALLS DISSOLVE — camera pulls backward throughout.
  {t: BEATS.wallsDissolve.end, pos: [0, 0.3, 4.5], look: [0, 0, -1], fov: 48},

  // EMPTY SPACE — weightless forward drift, then freeze ("So...").
  {t: BEATS.emptySpace.freezeFrom, pos: [0, 0.15, 4.0], look: [0, 0, 0], fov: 46},
  {t: BEATS.emptySpace.end, pos: [0, 0.15, 4.0], look: [0, 0, 0], fov: 46},

  // COLOR CYCLE 1 — very slow push toward center.
  {t: BEATS.colorCycle1.end, pos: [0, 0.1, 3.4], look: [0, 0, 0], fov: 44},

  // BEAM ZOOM — extreme rapid zoom into the eye.
  {t: BEATS.beamZoom.start + EPS, pos: [0, 0, 3.4], look: [0, 0, 0], fov: 44},
  {t: BEATS.beamZoom.end, pos: [0, 0, 0.35], look: [0, 0, 0], fov: 28},

  // WAVES — side-on macro tracking shot.
  {t: BEATS.waves.start, pos: [2.6, 0, 0.4], look: [0, 0, 0], fov: 34},
  {t: BEATS.waves.end, pos: [1.4, 0, 0.4], look: [0, 0, 0], fov: 34},

  // PHOTON -> RETINA — follow the photon through the pupil.
  {t: BEATS.photonToRetina.start, pos: [1.2, 0, 0.6], look: [0, 0, -0.2], fov: 34},
  {t: BEATS.photonToRetina.end, pos: [0, 0, 0.15], look: [0, 0, -1], fov: 30},

  // BRAIN SIGNAL building.
  {t: BEATS.brainSignal.end, pos: [0, 0.5, 0.6], look: [0, 1.0, -1.2], fov: 36},

  // COLOR BURST 2 — fast camera flight that pulls back into the flood of
  // orbs, rather than pushing into the brain silhouette (which would just
  // fill the frame with a dark shape instead of the color explosion).
  {t: BEATS.colorBurst2.end, pos: [0, 0.4, 2.6], look: [0, 0.6, -1], fov: 52},

  // DRAIN — rapid pull-back from the eye.
  {t: BEATS.drain.start + EPS, pos: [0, 0.3, 0.5], look: [0, 0, 0], fov: 40},
  {t: BEATS.drain.end, pos: [0, 0.1, 4.2], look: [0, 0, 0], fov: 46},

  // EYE ORBIT, no signal — slow orbit.
  {t: BEATS.eyeOrbitNoSignal.end, pos: [1.1, 0.1, 4.05], look: [0, 0, 0], fov: 46},

  // BLACK TEXT — push toward text.
  {t: BEATS.blackText.start, pos: [0, 0, 5.4], look: [0, 0, 0], fov: 40},
  {t: BEATS.blackText.end, pos: [0, 0, 4.5], look: [0, 0, 0], fov: 40},

  // BLACK TEXT GLITCH — sudden snap backward.
  {t: BEATS.blackTextGlitch.start + EPS, pos: [0, 0, 4.5], look: [0, 0, 0], fov: 40},
  {t: BEATS.blackTextGlitch.end, pos: [0, 0, 7.5], look: [0, 0, 0], fov: 42},

  // FOUR STAGE — smooth horizontal camera movement across the stages.
  {t: BEATS.fourStage.start, pos: [-2.4, 0, 6.5], look: [-2.4, 0, 0], fov: 36},
  {t: BEATS.fourStage.end, pos: [2.4, 0, 6.5], look: [2.4, 0, 0], fov: 36},

  // KEY TRANSITION — rapid, continuous pull backward through every stage.
  {t: BEATS.keyTransition.start, pos: [0, 0, 6.5], look: [0, 0, 0], fov: 36},
  {t: BEATS.keyTransition.end, pos: [0, 0, 16], look: [0, 0, 0], fov: 50},

  // RAINBOW — slow orbit around the spectrum.
  {t: BEATS.rainbow.start, pos: [0, 0, 5.5], look: [0, 0, 0], fov: 40},
  {t: BEATS.rainbow.end, pos: [1.8, 0, 5.2], look: [0, 0, 0], fov: 40},

  // FLYTHROUGH — fast continuous POV fly-through.
  {t: BEATS.flythrough.end, pos: [0, 0.3, -2.5], look: [0, 0.6, -6], fov: 55},

  // RETURN TO SPACE — reset wide, slow push forward, eyes reappear.
  {t: BEATS.returnToSpace.start + EPS, pos: [0, 0, 7.0], look: [0, 0, 0], fov: 42},
  {t: BEATS.returnToSpace.end, pos: [0, 0, 6.2], look: [0, 0, 0], fov: 42},

  // EYES GONE — camera stops completely.
  {t: BEATS.eyesGoneStatic.end, pos: [0, 0, 6.2], look: [0, 0, 0], fov: 42},

  // PHOTON ALONE — slow-motion tracking shot following it.
  {t: BEATS.photonAlone.end, pos: [0.4, 0.1, 5.4], look: [0.3, 0.05, 4.5], fov: 36},

  // PHOTON GONE — no movement, same black as the opening.
  {t: BEATS.photonGone.start, pos: [0, 0, 6.2], look: [0, 0, 0], fov: 40},
  {t: BEATS.photonGone.end, pos: [0, 0, 6.2], look: [0, 0, 0], fov: 40},

  // LOOP TAIL — mirrors the very first frame.
  {t: BEATS.loopTail.end, pos: [0, 0, 6.2], look: [0, 0, 0], fov: 40},
];

const findPose = (seconds: number): Pose => {
  if (seconds <= KEYFRAMES[0].t) return KEYFRAMES[0];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (seconds >= a.t && seconds <= b.t) {
      const span = b.t - a.t;
      const t = span <= EPS ? 1 : easeInOutCubic((seconds - a.t) / span);
      return {
        t: seconds,
        pos: [
          a.pos[0] + (b.pos[0] - a.pos[0]) * t,
          a.pos[1] + (b.pos[1] - a.pos[1]) * t,
          a.pos[2] + (b.pos[2] - a.pos[2]) * t,
        ],
        look: [
          a.look[0] + (b.look[0] - a.look[0]) * t,
          a.look[1] + (b.look[1] - a.look[1]) * t,
          a.look[2] + (b.look[2] - a.look[2]) * t,
        ],
        fov: a.fov + (b.fov - a.fov) * t,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
};

/** Extra sway multiplier by beat — near-zero during fast/explicit-motion beats, larger for POV "natural head movement". */
const driftAmpScale = (seconds: number): number => {
  if (
    (seconds >= BEATS.hardCutToRoom.start && seconds <= BEATS.roomReveal.end) ||
    (seconds >= BEATS.lights.start && seconds <= BEATS.lights.end)
  ) {
    return 0; // handled by explicit whip-pan / head-move keyframes instead
  }
  if (seconds >= BEATS.possibilities.start && seconds <= BEATS.possibilities.end) return 1.6;
  if (
    (seconds >= BEATS.beamZoom.start && seconds <= BEATS.beamZoom.end) ||
    (seconds >= BEATS.drain.start && seconds <= BEATS.drain.end) ||
    (seconds >= BEATS.keyTransition.start && seconds <= BEATS.keyTransition.end) ||
    (seconds >= BEATS.colorBurst2.start && seconds <= BEATS.colorBurst2.end) ||
    (seconds >= BEATS.flythrough.start && seconds <= BEATS.flythrough.end) ||
    (seconds >= BEATS.blackTextGlitch.start && seconds <= BEATS.blackTextGlitch.end)
  ) {
    return 0;
  }
  return 1;
};

/**
 * Mutates the R3F default camera to the pose for the given real-audio
 * second. Runs during render (the pattern @remotion/three's ThreeCanvas
 * expects) so every rendered frame is fully deterministic.
 */
export const CameraRig: React.FC<{seconds: number}> = ({seconds}) => {
  const {camera} = useThree();
  const pose = findPose(seconds);

  let dpx = 0;
  let dpy = 0;
  let dlx = 0;
  let dly = 0;

  if (!isInStaticWindow(seconds)) {
    const amp = driftAmpScale(seconds);
    dpx = gentleSine(seconds, 9.5, 0.035 * amp, 0.3);
    dpy = gentleSine(seconds, 12.1, 0.028 * amp, 1.1);
    dlx = gentleSine(seconds, 10.7, 0.05 * amp, 0.7);
    dly = gentleSine(seconds, 13.4, 0.04 * amp, 2.0);
  }

  camera.position.set(pose.pos[0] + dpx, pose.pos[1] + dpy, pose.pos[2]);
  camera.lookAt(new THREE.Vector3(pose.look[0] + dlx, pose.look[1] + dly, pose.look[2]));

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
  }

  return null;
};

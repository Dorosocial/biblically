import {CUES, INTRO_FRAMES} from './cues';
import {
	Vec3,
	clamp01,
	easeIn,
	easeInOut,
	easeOut,
	lerp,
	lerp3,
	orbit,
	remap,
	remapVec3,
} from './mathUtils';

export type BallState = {
	pos: Vec3;
	frozen?: boolean;
	glow?: number;
	scaleMul?: number;
	visible?: boolean;
	seed?: number;
};

export type ArrowSpec = {
	id: string;
	origin: Vec3;
	direction: Vec3;
	length: number;
	color?: string;
	opacity?: number;
	pulse?: boolean;
};

export type TrailSpec = {
	id: string;
	from: Vec3;
	to: Vec3;
	color?: string;
	opacity?: number;
};

export type GhostRef = {
	id: string;
	pos: Vec3;
	radius: number;
	opacity: number;
	color?: string;
};

export type CameraPose = {
	position: Vec3;
	lookAt: Vec3;
	fov?: number;
};

export type SceneState = {
	giant: BallState;
	tiny: BallState;
	camera: CameraPose;
	trails: TrailSpec[];
	arrows: ArrowSpec[];
	ghosts: GhostRef[];
};

const GIANT_HOME: Vec3 = [-2.1, 0, 0];
const TINY_HOME: Vec3 = [2.1, 0, 0];
const CENTER: Vec3 = [0, 0, 0];

const defaultState = (): SceneState => ({
	giant: {pos: GIANT_HOME, seed: 0},
	tiny: {pos: TINY_HOME, seed: 3, glow: 1},
	camera: {position: [0, 0, 12], lookAt: CENTER, fov: 42},
	trails: [],
	arrows: [],
	ghosts: [],
});

// ---------------------------------------------------------------------------
// INTRO — silent, wordless hook (frames 0..INTRO_FRAMES).
// giant ball -> tiny ball -> collision -> tiny ball wins & sends giant flying.
// ---------------------------------------------------------------------------
const introScene = (frame: number): SceneState => {
	const s = defaultState();
	const b1 = INTRO_FRAMES * 0.24; // giant reveal
	const b2 = INTRO_FRAMES * 0.48; // tiny reveal
	const b3 = INTRO_FRAMES * 0.72; // both launch -> impact
	const b4 = INTRO_FRAMES; // giant flies off

	if (frame < b1) {
		// giant ball alone, dramatic slow reveal
		const t = remap(frame, 0, b1, 0, 1, easeOut);
		s.giant.pos = lerp3([-2.6, 1.4, -1], GIANT_HOME, t);
		s.tiny.visible = false;
		s.camera = {
			position: lerp3([-1, 1.5, 16], [-1, 0.5, 11], t),
			lookAt: GIANT_HOME,
			fov: 38,
		};
	} else if (frame < b2) {
		// tiny ball snaps in, glowing
		const t = remap(frame, b1, b2, 0, 1, easeOut);
		s.giant.pos = GIANT_HOME;
		s.tiny.pos = lerp3([2.6, -1.4, -1], TINY_HOME, t);
		s.tiny.glow = 0.4 + 0.6 * t;
		s.camera = {position: [0.6, 0.3, 10.5], lookAt: [0.3, 0, 0], fov: 40};
	} else if (frame < b3) {
		// both rocket toward center and collide
		const t = remap(frame, b2, b3, 0, 1, easeIn);
		s.giant.pos = lerp3(GIANT_HOME, [-0.55, 0, 0], t);
		s.tiny.pos = lerp3(TINY_HOME, [0.55, 0, 0], t);
		s.tiny.glow = 1.4;
		s.trails =
			t > 0.15
				? [{id: 'intro-trail', from: TINY_HOME, to: s.tiny.pos, color: '#ffd166', opacity: 0.8}]
				: [];
		s.camera = {position: [0, 0.4, 8.5 - t * 1.5], lookAt: [0, 0, 0], fov: 40};
	} else {
		// impact -> giant ball launched off-frame fast (visibly, for the first
		// half of the beat) while tiny ball holds the center as the "winner";
		// camera stays close through the launch, then whip-settles onto tiny.
		const t = remap(frame, b3, b4, 0, 1, (x) => x);
		const launchT = remap(t, 0, 0.55, 0, 1, easeOut);
		const giantOut: Vec3 = [-5.6, 3.2, -2.4];
		s.giant.pos = lerp3([-0.55, 0, 0], giantOut, launchT);
		s.giant.scaleMul = lerp(1, 0.82, launchT);
		s.tiny.pos = [
			0.55 - 0.12 * Math.sin(t * Math.PI),
			Math.sin(frame / 2) * 0.03,
			0,
		];
		s.tiny.glow = 2.2 - t * 1;
		s.trails =
			t < 0.6
				? [
						{
							id: 'intro-launch-trail',
							from: [-0.55, 0, 0],
							to: s.giant.pos,
							color: '#8fb8ff',
							opacity: 0.6,
						},
					]
				: [];
		const settleT = remap(t, 0.45, 1, 0, 1, easeInOut);
		s.camera = {
			position: lerp3([0, 0.4, 7], [0.3, 0.15, 5.4], settleT),
			lookAt: lerp3([-1.4, 0.9, -0.5], [0.5, 0.1, 0], settleT),
			fov: lerp(46, 40, settleT),
		};
	}
	return s;
};

// ---------------------------------------------------------------------------
// Per-cue (S1..S28) choreography. `t` = eased-free local progress 0..1 across
// the cue's [start,end] window (frame still passed for idle/jitter/pulse).
// ---------------------------------------------------------------------------
type ShotFn = (frame: number, start: number, end: number) => SceneState;

const shots: Record<string, ShotFn> = {
	// "This tiny ball can hit harder than this giant one." (audio) — precise
	// momentum framing is carried entirely by on-screen labels here (see
	// labels.ts), never by repeating the audio's "hit harder" phrasing.
	S1: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, start + 24, 0, 1, easeOut);
		s.camera = {
			position: lerp3([0, 0.6, 18], [0, 0.15, 8], t),
			lookAt: CENTER,
			fov: 40,
		};
		s.giant.pos = GIANT_HOME;
		s.tiny.pos = TINY_HOME;
		return s;
	},

	// "It sounds wrong, isn't it?" — tiny launches at extreme speed, giant
	// barely moves; whip-pan follows the tiny ball.
	S2: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		const tinyEnd: Vec3 = [6.2, 0.3, 1.2];
		s.tiny.pos = lerp3(TINY_HOME, tinyEnd, t);
		s.tiny.glow = 1.5;
		s.giant.pos = [GIANT_HOME[0] + t * 0.05, GIANT_HOME[1], GIANT_HOME[2]];
		s.trails = t > 0.1 ? [{id: 's2', from: TINY_HOME, to: s.tiny.pos, opacity: 0.9}] : [];
		s.camera = {
			position: lerp3([-1, 0.2, 10], [3.2, 0.6, 8.5], easeOut(t)),
			lookAt: lerp3(TINY_HOME, tinyEnd, t),
			fov: 44,
		};
		return s;
	},

	// "But watch this closely." — reset, labels HEAVY / FAST, slow downward tilt.
	S3: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.pos = [-2.2, 0.4, 0];
		s.tiny.pos = [2.2, 0.4, 0];
		s.camera = {
			position: lerp3([0, 3.4, 11], [0, 0.6, 9.5], t),
			lookAt: [0, 0.3, 0],
			fov: 40,
		};
		return s;
	},

	// "The big ball is heavier," — mass labels 100x/1x MASS, slow orbit.
	S4: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, (x) => x);
		const angle = lerp(-0.35, 0.35, easeInOut(t));
		s.giant.pos = [-2.2, 0.4, 0];
		s.tiny.pos = [2.2, 0.4, 0];
		s.camera = {position: orbit([0, 0.6, 0], 9.5, angle, 0.4), lookAt: [0, 0.3, 0], fov: 40};
		return s;
	},

	// "and so it barely moves." — giant nudges slowly, tiny velocity arrow,
	// side tracking shot following the giant ball.
	S5: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		const giantEnd: Vec3 = [-1.85, 0.4, 0];
		s.giant.pos = lerp3([-2.2, 0.4, 0], giantEnd, t);
		s.tiny.pos = [2.2, 0.4, 0];
		s.arrows = [
			{
				id: 's5-tiny-v',
				origin: [2.2, 1.1, 0],
				direction: [1, 0, 0],
				length: 1.4,
				color: '#ffd166',
			},
			{
				id: 's5-giant-v',
				origin: [-2.2, 1.1, 0],
				direction: [1, 0, 0],
				length: 0.18,
				color: '#8a93a8',
			},
		];
		s.camera = {
			position: lerp3([-3.4, 0.7, 8.5], [-2.6, 0.7, 8.5], t),
			lookAt: giantEnd,
			fov: 38,
		};
		return s;
	},

	// "But this tiny ball? It's moving ridiculously fast," — bullet trail +
	// climbing speed counter (see labels.ts Counter), high-speed chase cam.
	S6: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		const loops = 2;
		const localT = (t * loops) % 1;
		const dir = Math.floor(t * loops) % 2 === 0 ? 1 : -1;
		const from: Vec3 = dir === 1 ? [-3.4, 0.2, 0] : [3.4, 0.2, 0];
		const to: Vec3 = dir === 1 ? [3.4, 0.2, 0] : [-3.4, 0.2, 0];
		s.tiny.pos = lerp3(from, to, localT);
		s.tiny.glow = 2;
		s.giant.pos = [-1.85, 0.4, -1.2];
		s.giant.scaleMul = 0.94;
		s.trails = [{id: 's6', from, to: s.tiny.pos, opacity: 0.92, color: '#ffe066'}];
		s.camera = {
			position: [s.tiny.pos[0] - dir * 2.4, 0.5, 6.4],
			lookAt: s.tiny.pos,
			fov: 46,
		};
		return s;
	},

	// "and when they collide," — both approach, camera dollies back between
	// them as they close in.
	S7: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		s.giant.pos = lerp3([-1.85, 0.4, -1.2], [-1.1, 0, 0], t);
		s.tiny.pos = lerp3([3.4, 0.2, 0], [1.1, 0, 0], t);
		s.tiny.glow = 1.6;
		s.camera = {position: lerp3([0, 0.3, 5.5], [0, 0.2, 9], t), lookAt: CENTER, fov: 42};
		return s;
	},

	// "the tiny ball can have just as much momentum as the giant one." —
	// impact + freeze, P = P arrows. Explicit freeze-frame beat: balls hold
	// position; only the arrows and tiny ball's glow keep any motion.
	S8: (frame, start, end) => {
		const s = defaultState();
		const impactEnd = start + 18;
		const t = remap(frame, start, impactEnd, 0, 1, easeIn);
		const giantFinal: Vec3 = [-0.85, 0, 0];
		const tinyFinal: Vec3 = [0.85, 0, 0];
		s.giant.pos = lerp3([-1.1, 0, 0], giantFinal, t);
		s.tiny.pos = lerp3([1.1, 0, 0], tinyFinal, t);
		const frozen = frame >= impactEnd;
		s.giant.frozen = frozen;
		s.tiny.frozen = frozen;
		s.tiny.glow = frozen ? 1.8 : 1.6;
		const arrowT = remap(frame, impactEnd, impactEnd + 14, 0, 1, easeOut);
		s.arrows = [
			{
				id: 's8-giant',
				origin: [giantFinal[0] - 0.2, 1.3, 0],
				direction: [-1, 0, 0],
				length: 1.5 * arrowT,
				color: '#8fb8ff',
			},
			{
				id: 's8-tiny',
				origin: [tinyFinal[0] + 0.2, 1.3, 0],
				direction: [1, 0, 0],
				length: 1.5 * arrowT,
				color: '#ffd166',
			},
		];
		s.camera = {position: [0, 0.35, 6.2], lookAt: [0, 0.15, 0], fov: 40};
		return s;
	},

	// "It sounds crazier when you do this." — instant reset, snap cut.
	S9: (frame, start, end) => {
		const s = defaultState();
		s.giant.pos = GIANT_HOME;
		s.tiny.pos = TINY_HOME;
		s.camera = {position: [0, 0.3, 12.5], lookAt: CENTER, fov: 42};
		return s;
	},

	// "Double the tiny ball's speed," — launch, "1x -> 2x", camera accelerates with it.
	S10: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		const tinyEnd: Vec3 = [4.6, 0.15, 0.4];
		s.tiny.pos = lerp3(TINY_HOME, tinyEnd, t);
		s.tiny.glow = 1.5;
		s.giant.pos = GIANT_HOME;
		s.trails = t > 0.12 ? [{id: 's10', from: TINY_HOME, to: s.tiny.pos, opacity: 0.85}] : [];
		s.camera = {
			position: lerp3([-0.5, 0.3, 10.5], [2.6, 0.4, 7.6], easeIn(t)),
			lookAt: s.tiny.pos,
			fov: 42,
		};
		return s;
	},

	// "and its momentum doubles." — meter "1P -> 2P", quick push toward it.
	S11: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeOut);
		s.tiny.pos = [4.6, 0.15, 0.4];
		s.tiny.glow = 1.8;
		s.giant.pos = GIANT_HOME;
		s.arrows = [
			{
				id: 's11-arrow',
				origin: [4.6, 1, 0.4],
				direction: [1, 0, 0],
				length: lerp(1.1, 2.2, t),
				color: '#ffd166',
			},
		];
		s.camera = {
			position: lerp3([2.6, 0.4, 7.6], [4, 0.9, 4.6], t),
			lookAt: [4.6, 0.8, 0.4],
			fov: 36,
		};
		return s;
	},

	// "Try to double it again." — even faster launch, "2x -> 4x", extremely
	// fast tracking shot.
	S12: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		const tinyStart: Vec3 = [-3.6, 0.15, 0];
		const tinyEnd: Vec3 = [5.2, 0.15, -0.4];
		s.tiny.pos = lerp3(tinyStart, tinyEnd, t);
		s.tiny.glow = 2.1;
		s.giant.pos = [-1.85, 0.4, -1.4];
		s.trails = [{id: 's12', from: tinyStart, to: s.tiny.pos, opacity: 0.95, color: '#fff3bf'}];
		s.camera = {position: [s.tiny.pos[0] - 1.6, 0.4, 6], lookAt: s.tiny.pos, fov: 48};
		return s;
	},

	// "and now that little ball is carrying four times the momentum..." — four
	// ghosted momentum-arrow copies stack behind it, camera pulls back.
	S13: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeOut);
		const tinyPos: Vec3 = [lerp(2, 3.4, Math.sin(frame / 14) * 0.5 + 0.5), 0.15, 0];
		s.tiny.pos = tinyPos;
		s.tiny.glow = 2;
		s.giant.pos = [-2.6, 0.4, -1];
		const arrowCount = Math.min(4, Math.floor(t * 4) + 1);
		s.arrows = Array.from({length: arrowCount}).map((_, i) => ({
			id: `s13-arrow-${i}`,
			origin: [tinyPos[0] - i * 0.42, tinyPos[1] + 0.6, tinyPos[2]],
			direction: [1, 0, 0] as Vec3,
			length: 1.3,
			color: '#ffd166',
			opacity: i === arrowCount - 1 ? 1 : 0.35,
		}));
		s.camera = {
			position: lerp3([1.6, 0.5, 6], [0.4, 0.8, 10.5], t),
			lookAt: [0.6, 0.3, 0],
			fov: 42,
		};
		return s;
	},

	// "So, what actually determines momentum?" — everything disappears except
	// the tiny ball, floating in darkness, slow macro push-in.
	S14: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.visible = false;
		s.giant.pos = [-40, 0, -40];
		s.tiny.pos = [0, Math.sin(frame / 20) * 0.08, 0];
		s.tiny.glow = 1.4;
		s.camera = {position: lerp3([0, 0.2, 7], [0, 0.05, 3.4], t), lookAt: [0, 0, 0], fov: 34};
		return s;
	},

	// "It's two things," — "MASS x VELOCITY" appears, camera moves between the two words.
	S15: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.visible = false;
		s.giant.pos = [-40, 0, -40];
		s.tiny.pos = [0, Math.sin(frame / 20) * 0.08, 0];
		s.tiny.glow = 1.4;
		s.camera = {position: lerp3([-0.8, 0.05, 3.2], [0.8, 0.05, 3.2], t), lookAt: [0, 0, 0], fov: 34};
		return s;
	},

	// "mass and speed." — giant grows heavier-looking on one side, tiny
	// accelerates on the other; split-screen tracking.
	S16: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.visible = true;
		s.giant.pos = [-2.4, 0.4, 0];
		s.giant.scaleMul = lerp(0.7, 1.08, t);
		s.tiny.pos = [2.4 + t * 0.4, 0.15, 0];
		s.tiny.glow = 1.2 + t;
		s.camera = {position: lerp3([0, 0.6, 10.5], [0, 0.4, 9], t), lookAt: [0, 0.3, 0], fov: 42};
		return s;
	},

	// "But there's something even more important." — both balls hold, poised
	// just before the next collision; equation fades away; very slow push.
	S17: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.pos = [-1.5, 0.4, 0];
		s.tiny.pos = [1.5, 0.15, 0];
		s.tiny.glow = 1.3;
		s.camera = {
			position: lerp3([0, 0.4, 8], [0, 0.25, 7], t),
			lookAt: [0, 0.25, 0],
			fov: 38,
		};
		return s;
	},

	// "When these two objects collide," — slow-motion collision begins,
	// arrows enter from both sides, 360 deg orbit around impact.
	S18: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.pos = lerp3([-1.5, 0.4, 0], [-0.95, 0.25, 0], t);
		s.tiny.pos = lerp3([1.5, 0.15, 0], [0.95, 0.15, 0], t);
		s.tiny.glow = 1.4;
		s.arrows = [
			{
				id: 's18-giant',
				origin: [-3, 0.9, 0],
				direction: [1, 0, 0],
				length: lerp(0.4, 1.6, t),
				color: '#8fb8ff',
			},
			{
				id: 's18-tiny',
				origin: [3, 0.6, 0],
				direction: [-1, 0, 0],
				length: lerp(0.4, 1.6, t),
				color: '#ffd166',
			},
		];
		const angle = lerp(0, Math.PI * 2, t);
		s.camera = {position: orbit([0, 0.3, 0], 6.4, angle, 0.9), lookAt: [0, 0.2, 0], fov: 40};
		return s;
	},

	// "the momentum doesn't just vanish," — arrows flow through the collision.
	S19: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, (x) => x);
		s.giant.pos = [-0.95, 0.25, 0];
		s.tiny.pos = [0.95, 0.15, 0];
		s.giant.frozen = true;
		s.tiny.frozen = true;
		s.tiny.glow = 1.6;
		s.arrows = [
			{
				id: 's19-through',
				origin: lerp3([-3, 0.7, 0], [3, 0.7, 0], t),
				direction: [1, 0, 0],
				length: 1.7,
				color: '#ffe066',
			},
		];
		s.camera = {
			position: lerp3([-2, 0.7, 4], [2, 0.7, 4], t),
			lookAt: lerp3([-0.5, 0.5, 0], [0.5, 0.5, 0], t),
			fov: 40,
		};
		return s;
	},

	// "it rather moves." — giant slows, tiny accelerates away; side-on tracking.
	S20: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeOut);
		s.giant.pos = lerp3([-0.95, 0.25, 0], [-1.4, 0.25, 0], t);
		s.tiny.pos = lerp3([0.95, 0.15, 0], [3.2, 0.15, 0.6], t);
		s.tiny.glow = 1.8;
		s.arrows = [
			{
				id: 's20-giant',
				origin: [s.giant.pos[0], 0.95, 0],
				direction: [1, 0, 0],
				length: lerp(1.6, 0.5, t),
				color: '#8fb8ff',
			},
			{
				id: 's20-tiny',
				origin: [s.tiny.pos[0], 0.75, s.tiny.pos[2]],
				direction: [1, 0, 0],
				length: lerp(0.3, 1.9, t),
				color: '#ffd166',
			},
		];
		s.camera = {
			position: lerp3([-3, 0.5, 5], [1, 0.5, 6.5], t),
			lookAt: lerp3([-0.5, 0.4, 0], [1, 0.4, 0.3], t),
			fov: 42,
		};
		return s;
	},

	// "One slows down, while the other speeds up." — before/after labels,
	// fast horizontal camera sweep.
	S21: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, (x) => x);
		s.giant.pos = [-1.4, 0.25, 0];
		s.tiny.pos = [3.2, 0.15, 0.6];
		s.tiny.glow = 1.6;
		s.camera = {
			position: orbit([0.5, 0.4, 0], 8, lerp(-0.6, 0.6, easeInOut(t)), 0.6),
			lookAt: [0.5, 0.35, 0],
			fov: 44,
		};
		return s;
	},

	// "and the total momentum stays the same." — arrows combine into one
	// total arrow; slow pull-back revealing the complete system.
	S22: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.pos = [-1.4, 0.25, 0];
		s.tiny.pos = [3.2, 0.15, 0.6];
		s.tiny.glow = 1.6;
		s.arrows = [
			{
				id: 's22-total',
				origin: [0.9, 1.1, 0.3],
				direction: [1, 0, 0],
				length: lerp(1, 2.6, t),
				color: '#ffffff',
			},
		];
		s.camera = {
			position: lerp3([0.5, 0.6, 6], [0.5, 0.5, 10], t),
			lookAt: [0.9, 0.4, 0.2],
			fov: 42,
		};
		return s;
	},

	// "So, a tiny object moving fast enough" — chase past scale-comparison
	// reference balls that get left behind; long-lens chase shot.
	S23: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, (x) => x);
		const tinyPos: Vec3 = [-3 + t * 9, 0.15, 0];
		s.tiny.pos = tinyPos;
		s.tiny.glow = 2;
		s.giant.visible = false;
		s.giant.pos = [-40, 0, -40];
		s.trails = [{id: 's23', from: [tinyPos[0] - 1.6, 0.15, 0], to: tinyPos, opacity: 0.8}];
		s.ghosts = [0.15, 0.42, 0.68, 0.9].map((p, i) => ({
			id: `s23-ghost-${i}`,
			pos: [-3 + p * 9 + 0.6, 0.4, i % 2 === 0 ? -1.4 : 1.4],
			radius: 0.9 + i * 0.15,
			opacity: clamp01(1 - Math.abs(t - p) * 3.2),
			color: '#1a1d27',
		}));
		s.camera = {position: [tinyPos[0] - 2.2, 0.4, 4.4], lookAt: tinyPos, fov: 28};
		return s;
	},

	// "can have more momentum than something hundreds of times heavier." —
	// tiny collides with the huge ball, sends it flying; extreme wide then
	// rapid zoom toward the giant ball.
	S24: (frame, start, end) => {
		const s = defaultState();
		const impactAt = start + (end - start) * 0.42;
		const t1 = remap(frame, start, impactAt, 0, 1, easeIn);
		const tinyStart: Vec3 = [-4.4, 0.15, 0];
		const impactPoint: Vec3 = [0, 0.3, 0];
		s.giant.visible = true;
		if (frame < impactAt) {
			s.tiny.pos = lerp3(tinyStart, impactPoint, t1);
			s.tiny.glow = 2.2;
			s.giant.pos = [0.9, 0.4, 0];
			s.trails = [{id: 's24-in', from: tinyStart, to: s.tiny.pos, opacity: 0.9, color: '#ffe066'}];
			s.camera = {
				position: lerp3([-1, 1.2, 15], [0.2, 0.5, 9], t1),
				lookAt: [0.4, 0.35, 0],
				fov: 46,
			};
		} else {
			const t2 = remap(frame, impactAt, end, 0, 1, easeOut);
			s.tiny.pos = [impactPoint[0] - 0.1 + Math.sin(frame) * 0.02, 0.3, 0];
			s.tiny.glow = 2.4;
			s.giant.pos = lerp3([0.9, 0.4, 0], [7, 6, -8], easeIn(t2));
			s.giant.scaleMul = lerp(1, 0.6, t2);
			s.camera = {
				position: lerp3([0.2, 0.5, 9], [3, 2.4, 3], t2),
				lookAt: lerp3([0.4, 0.35, 0], [5, 4, -6], t2),
				fov: lerp(46, 34, t2),
			};
		}
		return s;
	},

	// "And that's why" — tiny ball sits still center-frame, giant behind it;
	// very slow push-in.
	S25: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, (x) => x);
		s.tiny.pos = [0, 0.15, 1.4];
		s.tiny.glow = 1.3;
		s.giant.pos = [0.3, 0.5, -2.2];
		s.giant.scaleMul = 0.85;
		s.camera = {position: lerp3([0, 0.4, 6], [0, 0.3, 5], t), lookAt: [0.1, 0.3, 0], fov: 36};
		return s;
	},

	// "you should never judge an object's momentum by its size." — side by
	// side, giant shrinks, tiny speed climbs; camera orbits to end behind tiny.
	S26: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeInOut);
		s.giant.pos = [-2, 0.4, 0];
		s.giant.scaleMul = lerp(1, 0.5, t);
		s.tiny.pos = [2, 0.15, 0];
		s.tiny.glow = 1.4 + t;
		const angle = lerp(-0.5, Math.PI - 0.5, t);
		s.camera = {position: orbit([0, 0.3, 0], 8.5, angle, 0.8), lookAt: [0.6, 0.3, 0], fov: 40};
		return s;
	},

	// "Because that tiny ball" — sudden launch straight at camera; fast
	// forward camera rush.
	S27: (frame, start, end) => {
		const s = defaultState();
		const t = remap(frame, start, end, 0, 1, easeIn);
		s.tiny.pos = [0.1, 0.1, lerp(0, 5, t)];
		s.tiny.glow = 2 + t;
		s.giant.pos = [1.4, 0.6, -3];
		s.giant.scaleMul = 0.7;
		s.camera = {position: [0, 0.15, lerp(6, 3.5, t)], lookAt: [0.1, 0.1, 8], fov: lerp(40, 52, t)};
		return s;
	},

	// "might be the dangerous one here." — extreme slow-motion push-in into a
	// hard freeze on the very last frames (end frame).
	S28: (frame, start, end) => {
		const s = defaultState();
		const freezeStart = end - 14;
		const activeEnd = Math.min(frame, freezeStart);
		const t = remap(activeEnd, start, freezeStart, 0, 1, easeOut);
		// Tiny ball keeps rushing toward the lens; the camera pushes forward
		// right behind it so the gap between them closes to almost nothing —
		// that's what reads as "fills the frame" rather than receding.
		const tinyZ = lerp(5, 7.4, t);
		const camZ = lerp(3.5, 6.9, t);
		s.tiny.pos = [0.1, 0.1, tinyZ];
		s.tiny.glow = 3;
		s.tiny.frozen = frame >= freezeStart;
		s.giant.pos = [1.6, 0.7, -3];
		s.giant.scaleMul = 0.7;
		s.giant.frozen = frame >= freezeStart;
		s.arrows = [
			{
				id: 's28-huge',
				origin: [0.1, 0.6, tinyZ - 0.6],
				direction: [0, 0, 1],
				length: 3.4,
				color: '#ffffff',
				pulse: frame < freezeStart,
			},
		];
		s.camera = {
			position: [0, 0.15, camZ],
			lookAt: [0.1, 0.15, tinyZ],
			fov: lerp(52, 64, t),
		};
		return s;
	},
};

const findCueIndex = (frame: number): number => {
	let idx = -1;
	for (let i = 0; i < CUES.length; i++) {
		if (CUES[i].start <= frame) idx = i;
		else break;
	}
	return idx;
};

export const computeScene = (frame: number): SceneState => {
	if (frame < INTRO_FRAMES) {
		return introScene(frame);
	}
	const idx = findCueIndex(frame);
	if (idx === -1) {
		return introScene(INTRO_FRAMES - 1);
	}
	const cue = CUES[idx];
	const fn = shots[cue.id];
	if (!fn) {
		throw new Error(`No shot choreography for cue ${cue.id}`);
	}
	return fn(frame, cue.start, cue.end);
};

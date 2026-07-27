import {createRng, randInt, randRange, choice, Rng} from '../NeurolamBrainrot/rng';
import {DistractorSpec, DistractorType, ParticleSeed} from '../NeurolamBrainrot/types';
import {EXCLUSION_RADIUS, HEIGHT, SCHEDULE_SEED, WIDTH} from './constants';

// Same deterministic-schedule approach as the vertical composition, tuned
// for large/bold/slow-moving distractors on a 1920x1080 canvas: bigger base
// sizes (300-500px+), longer 2-4s durations, higher saturation/lightness
// for maximum contrast against the grid background.

const TEXT_SAMPLES = [
	'!!',
	'?!',
	'NOW',
	'LOOK',
	'WOW',
	'×××',
	'STOP',
	'???',
	'!?!',
	'HEY',
	'NEW',
	'WHOA',
	'⚡',
	'★★★',
];

interface SpecConfig {
	duration: [number, number];
	intensity: [number, number];
	types: DistractorType[];
	sat: [number, number];
	light: [number, number];
	size: [number, number];
}

interface RoundConfig extends SpecConfig {
	key: string;
	start: number;
	end: number;
	interval: [number, number];
}

const ROUND_CONFIGS: RoundConfig[] = [
	{
		key: 'round1',
		start: 300,
		end: 2100,
		interval: [120, 180],
		duration: [70, 120],
		intensity: [0.55, 0.75],
		types: ['circle', 'triangle', 'bar', 'gradient', 'pattern'],
		sat: [75, 95],
		light: [52, 62],
		size: [320, 420],
	},
	{
		key: 'round2',
		start: 2100,
		end: 4200,
		interval: [60, 92],
		duration: [65, 115],
		intensity: [0.65, 0.85],
		types: ['circle', 'triangle', 'bar', 'text', 'particle', 'gradient', 'pattern'],
		sat: [80, 100],
		light: [52, 64],
		size: [340, 460],
	},
	{
		key: 'round3',
		start: 4200,
		end: 6900,
		interval: [15, 30],
		duration: [60, 110],
		intensity: [0.85, 1.0],
		types: [
			'circle',
			'triangle',
			'bar',
			'text',
			'particle',
			'glitch',
			'strobe',
			'gradient',
			'pattern',
		],
		sat: [85, 100],
		light: [54, 66],
		size: [360, 500],
	},
	{
		key: 'round4',
		start: 6900,
		end: 9000,
		interval: [15, 30],
		duration: [60, 110],
		intensity: [0.85, 1.0],
		types: [
			'circle',
			'triangle',
			'bar',
			'text',
			'particle',
			'glitch',
			'strobe',
			'gradient',
			'pattern',
		],
		sat: [85, 100],
		light: [54, 66],
		size: [360, 500],
	},
];

const COOLDOWN_START = 9000;
const COOLDOWN_FADE_DONE = 9800;

const randomPoint = (rng: Rng, margin = 60) => ({
	x: randRange(rng, margin, WIDTH - margin),
	y: randRange(rng, margin, HEIGHT - margin),
});

const pickColor = (rng: Rng, sat: [number, number], light: [number, number]) => {
	const hue = Math.floor(randRange(rng, 0, 360));
	const s = Math.round(randRange(rng, sat[0], sat[1]));
	const l = Math.round(randRange(rng, light[0], light[1]));
	return `hsl(${hue}, ${s}%, ${l}%)`;
};

let uidCounter = 0;

const buildSpec = (rng: Rng, startFrame: number, cfg: SpecConfig): DistractorSpec => {
	uidCounter += 1;
	const type = choice(rng, cfg.types);
	const duration = randInt(rng, cfg.duration[0], cfg.duration[1]);
	const intensity = randRange(rng, cfg.intensity[0], cfg.intensity[1]);
	const size = randRange(rng, cfg.size[0], cfg.size[1]);
	const color = pickColor(rng, cfg.sat, cfg.light);
	const color2 = pickColor(rng, cfg.sat, cfg.light);
	const rotation = randRange(rng, 0, 360);
	const spin = (choice(rng, [-1, 1]) as number) * randRange(rng, 15, 120);

	const motionRoll = rng();
	const fixedOriginTypes: DistractorType[] = ['particle', 'glitch', 'strobe'];
	const motion = fixedOriginTypes.includes(type)
		? 'static'
		: motionRoll < 0.32
		? 'static'
		: motionRoll < 0.78
		? 'linear'
		: 'orbit';

	const a = randomPoint(rng);
	const b = randomPoint(rng);

	const orbitRadius = randRange(
		rng,
		EXCLUSION_RADIUS + 80,
		Math.min(WIDTH, HEIGHT) / 2 - 20
	);
	const orbitAngle = randRange(rng, 0, 360);

	let text: string | undefined;
	if (type === 'text') {
		text = choice(rng, TEXT_SAMPLES);
	}

	let particles: ParticleSeed[] | undefined;
	if (type === 'particle') {
		const count = randInt(rng, 10, 20);
		particles = Array.from({length: count}, () => ({
			angle: randRange(rng, 0, 360),
			maxDist: randRange(rng, 220, 620),
			size: randRange(rng, 10, 26),
			delay: randRange(rng, 0, 0.25),
		}));
	}

	const bandHeight = randRange(rng, 50, 130);
	const aspect = randRange(rng, 3, 7);

	return {
		id: `d-${uidCounter}`,
		type,
		startFrame,
		duration,
		motion,
		color,
		color2,
		size,
		rotation,
		spin,
		intensity,
		fromX: a.x,
		fromY: a.y,
		toX: b.x,
		toY: b.y,
		orbitRadius,
		orbitAngle,
		text,
		particles,
		bandHeight,
		aspect,
	};
};

export const generateSchedule = (): DistractorSpec[] => {
	uidCounter = 0;
	const rng = createRng(SCHEDULE_SEED);
	const specs: DistractorSpec[] = [];

	for (const cfg of ROUND_CONFIGS) {
		let cursor = cfg.start + randInt(rng, Math.round(cfg.interval[0] / 2), cfg.interval[1]);
		while (cursor < cfg.end - 5) {
			specs.push(buildSpec(rng, cursor, cfg));
			cursor += randInt(rng, cfg.interval[0], cfg.interval[1]);
		}
	}

	// Cooldown: distractor frequency, size, and intensity taper smoothly to
	// zero by COOLDOWN_FADE_DONE, then nothing spawns for the rest of the
	// section.
	let cursor = COOLDOWN_START + randInt(rng, 10, 20);
	while (cursor < COOLDOWN_FADE_DONE) {
		const t = (cursor - COOLDOWN_START) / (COOLDOWN_FADE_DONE - COOLDOWN_START);
		const interval: [number, number] = [
			Math.round(20 + t * 340),
			Math.round(32 + t * 380),
		];
		const intensity: [number, number] = [
			Math.max(0.08, 0.8 - t * 0.65),
			Math.max(0.15, 0.95 - t * 0.7),
		];
		const duration: [number, number] = [
			Math.round(50 + (1 - t) * 40),
			Math.round(80 + (1 - t) * 40),
		];
		const size: [number, number] = [
			Math.round(260 + (1 - t) * 140),
			Math.round(340 + (1 - t) * 160),
		];
		specs.push(
			buildSpec(rng, cursor, {
				duration,
				intensity,
				types: ['circle', 'triangle', 'bar', 'gradient', 'pattern'],
				sat: [65, 92],
				light: [48, 60],
				size,
			})
		);
		cursor += randInt(rng, interval[0], interval[1]);
	}

	return specs;
};

export const getActiveDistractors = (
	schedule: DistractorSpec[],
	frame: number
): DistractorSpec[] =>
	schedule.filter((s) => frame >= s.startFrame && frame < s.startFrame + s.duration);

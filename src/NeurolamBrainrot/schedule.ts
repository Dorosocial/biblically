import {createRng, randInt, randRange, choice, Rng} from './rng';
import {DistractorSpec, DistractorType, ParticleSeed} from './types';
import {EXCLUSION_RADIUS, HEIGHT, SCHEDULE_SEED, WIDTH} from './constants';

// Every "random" value below is pulled from a single seeded generator that
// advances deterministically, so the schedule is byte-identical every time
// it's built (studio preview, still frames, final render).

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
		duration: [24, 45],
		intensity: [0.22, 0.42],
		types: ['circle', 'triangle', 'bar'],
		sat: [30, 50],
		light: [32, 48],
		size: [50, 100],
	},
	{
		key: 'round2',
		start: 2100,
		end: 4200,
		interval: [60, 92],
		duration: [20, 40],
		intensity: [0.42, 0.68],
		types: ['circle', 'triangle', 'bar', 'text', 'gradient', 'pattern'],
		sat: [50, 75],
		light: [42, 58],
		size: [55, 130],
	},
	{
		key: 'round3',
		start: 4200,
		end: 6900,
		interval: [15, 30],
		duration: [12, 26],
		intensity: [0.7, 1.0],
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
		sat: [70, 100],
		light: [48, 65],
		size: [65, 175],
	},
	{
		key: 'round4',
		start: 6900,
		end: 9000,
		interval: [15, 30],
		duration: [12, 26],
		intensity: [0.7, 1.0],
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
		sat: [70, 100],
		light: [48, 65],
		size: [65, 175],
	},
];

const COOLDOWN_START = 9000;
const COOLDOWN_FADE_DONE = 9800;

const randomPoint = (rng: Rng, margin = 40) => ({
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
	const spin = (choice(rng, [-1, 1]) as number) * randRange(rng, 20, 260);

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
		EXCLUSION_RADIUS + 60,
		Math.min(WIDTH, HEIGHT) / 2 - 20
	);
	const orbitAngle = randRange(rng, 0, 360);

	let text: string | undefined;
	if (type === 'text') {
		text = choice(rng, TEXT_SAMPLES);
	}

	let particles: ParticleSeed[] | undefined;
	if (type === 'particle') {
		const count = randInt(rng, 8, 16);
		particles = Array.from({length: count}, () => ({
			angle: randRange(rng, 0, 360),
			maxDist: randRange(rng, 120, 420),
			size: randRange(rng, 6, 18),
			delay: randRange(rng, 0, 0.25),
		}));
	}

	const bandHeight = randRange(rng, 30, 90);
	const aspect = randRange(rng, 3.5, 9);

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

	// Cooldown: distractor frequency + intensity taper smoothly to zero by
	// COOLDOWN_FADE_DONE, then nothing spawns for the rest of the section.
	let cursor = COOLDOWN_START + randInt(rng, 10, 20);
	while (cursor < COOLDOWN_FADE_DONE) {
		const t = (cursor - COOLDOWN_START) / (COOLDOWN_FADE_DONE - COOLDOWN_START);
		const interval: [number, number] = [
			Math.round(20 + t * 340),
			Math.round(32 + t * 380),
		];
		const intensity: [number, number] = [
			Math.max(0.05, 0.75 - t * 0.7),
			Math.max(0.1, 0.95 - t * 0.75),
		];
		const duration: [number, number] = [
			Math.round(10 + (1 - t) * 10),
			Math.round(18 + (1 - t) * 12),
		];
		specs.push(
			buildSpec(rng, cursor, {
				duration,
				intensity,
				types: ['circle', 'triangle', 'bar', 'gradient', 'pattern'],
				sat: [55, 90],
				light: [42, 60],
				size: [50, 130],
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

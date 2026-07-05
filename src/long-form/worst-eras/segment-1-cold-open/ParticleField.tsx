import {driftX} from './motion';

type Mote = {top: number; left: number; size: number; phase: number; fallHz: number};

// Fixed layout of dust motes — varied phase/speed per mote so the drift
// reads as organic rather than a single repeating loop.
const MOTES: Mote[] = [
	{top: 18, left: 12, size: 8, phase: 0, fallHz: 0.055},
	{top: 30, left: 32, size: 6, phase: 1.7, fallHz: 0.048},
	{top: 12, left: 55, size: 7, phase: 3.1, fallHz: 0.06},
	{top: 42, left: 74, size: 9, phase: 0.8, fallHz: 0.05},
	{top: 24, left: 88, size: 6, phase: 2.4, fallHz: 0.057},
	{top: 55, left: 20, size: 7, phase: 4.2, fallHz: 0.045},
	{top: 60, left: 63, size: 6, phase: 1.1, fallHz: 0.052},
	{top: 8, left: 68, size: 8, phase: 3.6, fallHz: 0.049},
	{top: 70, left: 40, size: 7, phase: 2.9, fallHz: 0.047},
	{top: 35, left: 8, size: 6, phase: 0.4, fallHz: 0.053},
	{top: 48, left: 92, size: 7, phase: 3.9, fallHz: 0.058},
	{top: 15, left: 80, size: 6, phase: 1.4, fallHz: 0.051},
];

type ParticleFieldProps = {
	frame: number;
	fps: number;
	/** 0-1+ fade-in level for the whole field. */
	intensity: number;
};

// Slow-drifting dust motes, code-drawn as soft radial-gradient dots with real
// transparency — layers over a scene without any baked overlay asset.
export const ParticleField: React.FC<ParticleFieldProps> = ({frame, fps, intensity}) => {
	const clamped = Math.max(0, intensity);
	if (clamped <= 0.001) return null;

	return (
		<>
			{MOTES.map((m, i) => {
				const driftPx = driftX(frame + m.phase * 40, fps, 22, 0.045 + i * 0.002);
				// Slow continuous vertical fall, looping every ~1/fallHz seconds.
				const cycleFrames = fps / m.fallHz;
				const fallProgress = ((frame + m.phase * 60) % cycleFrames) / cycleFrames;
				const topPx = fallProgress * 140 - 20;
				const flicker = 0.55 + 0.3 * Math.sin((frame / fps) * 2 * Math.PI * (0.3 + i * 0.02) + m.phase);

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `calc(${m.left}% + ${driftPx}px)`,
							top: `calc(${m.top}% + ${topPx}px)`,
							width: m.size * 4,
							height: m.size * 4,
							borderRadius: '50%',
							background: `radial-gradient(circle, rgba(120, 120, 114, ${flicker * clamped}) 0%, rgba(120, 120, 114, 0) 72%)`,
						}}
					/>
				);
			})}
		</>
	);
};

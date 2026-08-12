import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timing';
import {theme} from '../lib/theme';

interface Props {
	position?: [number, number, number];
	scale?: number;
	opacity: number;
	/** revolutions per second of the fast (second) hand */
	tickSpeed?: number;
}

const TICKS = 12;

export const Stopwatch: React.FC<Props> = ({position = [0, 0, 0], scale = 1, opacity, tickSpeed = 1}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const secondAngle = -t * tickSpeed * Math.PI * 2;
	const minuteAngle = -t * (tickSpeed / 20) * Math.PI * 2;

	const tickMarks = useMemo(
		() =>
			new Array(TICKS).fill(0).map((_, i) => {
				const a = (i / TICKS) * Math.PI * 2;
				return {
					x: Math.sin(a) * 0.86,
					y: Math.cos(a) * 0.86,
					rot: a,
					major: i % 3 === 0,
				};
			}),
		[]
	);

	if (opacity <= 0.001) return null;

	return (
		<group position={position} scale={scale}>
			{/* crown knob */}
			<mesh position={[0, 1.08, 0]}>
				<boxGeometry args={[0.14, 0.16, 0.14]} />
				<meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} metalness={0.6} roughness={0.3} />
			</mesh>

			{/* outer glowing ring */}
			<mesh rotation={[0, 0, 0]}>
				<torusGeometry args={[0.98, 0.07, 16, 48]} />
				<meshStandardMaterial
					color={theme.glowCyan}
					emissive={theme.glowCyan}
					emissiveIntensity={1.4}
					transparent
					opacity={opacity}
				/>
			</mesh>

			{/* face */}
			<mesh position={[0, 0, -0.03]}>
				<circleGeometry args={[0.92, 48]} />
				<meshStandardMaterial color="#0c1830" transparent opacity={opacity} emissive="#0c1830" emissiveIntensity={0.4} />
			</mesh>

			{tickMarks.map((tk, i) => (
				<mesh key={i} position={[tk.x, tk.y, 0.01]} rotation={[0, 0, -tk.rot]}>
					<boxGeometry args={[tk.major ? 0.05 : 0.03, tk.major ? 0.14 : 0.08, 0.02]} />
					<meshStandardMaterial
						color={theme.glowCyanBright}
						emissive={theme.glowCyanBright}
						emissiveIntensity={tk.major ? 1.2 : 0.6}
						transparent
						opacity={opacity}
					/>
				</mesh>
			))}

			{/* minute hand (slow) */}
			<group rotation={[0, 0, minuteAngle]}>
				<mesh position={[0, 0.24, 0.03]}>
					<boxGeometry args={[0.045, 0.48, 0.02]} />
					<meshStandardMaterial color={theme.glowAmber} emissive={theme.glowAmber} emissiveIntensity={1.1} transparent opacity={opacity} />
				</mesh>
			</group>

			{/* second hand (fast, ticking) */}
			<group rotation={[0, 0, secondAngle]}>
				<mesh position={[0, 0.38, 0.05]}>
					<boxGeometry args={[0.025, 0.76, 0.02]} />
					<meshStandardMaterial
						color={theme.glowCyanBright}
						emissive={theme.glowCyanBright}
						emissiveIntensity={1.8}
						transparent
						opacity={opacity}
					/>
				</mesh>
			</group>

			{/* center pin */}
			<mesh position={[0, 0, 0.06]}>
				<cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
				<meshStandardMaterial color="#e2e8f0" transparent opacity={opacity} />
			</mesh>
		</group>
	);
};

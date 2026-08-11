import React from 'react';
import {alignmentQuaternion} from './geometryUtils';

/**
 * A glowing 3D vector arrow (cylinder shaft + cone head) — used for velocity
 * trails, collision arrows, momentum vectors, force arrows, and the angular
 * momentum axis vector. `direction` does not need to be normalized.
 */
export const Arrow3D: React.FC<{
	readonly origin: [number, number, number];
	readonly direction: [number, number, number];
	readonly length?: number;
	readonly color?: string;
	readonly shaftRadius?: number;
	readonly headSize?: number;
	readonly opacity?: number;
}> = ({
	origin,
	direction,
	length = 1,
	color = '#4fd1ff',
	shaftRadius = 0.035,
	headSize = 0.16,
	opacity = 1,
}) => {
	const quaternion = alignmentQuaternion(direction);
	const shaftLength = Math.max(length - headSize * 1.6, 0.001);

	return (
		<group position={origin} quaternion={quaternion}>
			{/* Shaft */}
			<mesh position={[0, shaftLength / 2, 0]}>
				<cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 12]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={2.2}
					transparent
					opacity={opacity}
					toneMapped={false}
				/>
			</mesh>
			{/* Head */}
			<mesh position={[0, shaftLength + headSize / 2, 0]}>
				<coneGeometry args={[headSize * 0.55, headSize, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={2.6}
					transparent
					opacity={opacity}
					toneMapped={false}
				/>
			</mesh>
		</group>
	);
};

/** A curved arrow approximated with short straight arrow segments along an arc — used for the gyroscopic reaction-direction cue. */
export const CurvedArrow3D: React.FC<{
	readonly center: [number, number, number];
	readonly radius: number;
	readonly startAngle: number;
	readonly endAngle: number;
	readonly axis?: 'y' | 'z';
	readonly color?: string;
	readonly segments?: number;
	readonly progress?: number; // 0..1, how much of the arc is drawn
}> = ({
	center,
	radius,
	startAngle,
	endAngle,
	axis = 'y',
	color = '#c07bff',
	segments = 14,
	progress = 1,
}) => {
	const visibleSegments = Math.max(1, Math.round(segments * progress));
	const points: [number, number, number][] = [];
	for (let i = 0; i <= visibleSegments; i++) {
		const t = i / segments;
		const angle = startAngle + (endAngle - startAngle) * t;
		const point: [number, number, number] =
			axis === 'y'
				? [
						center[0] + Math.cos(angle) * radius,
						center[1],
						center[2] + Math.sin(angle) * radius,
					]
				: [
						center[0] + Math.cos(angle) * radius,
						center[1] + Math.sin(angle) * radius,
						center[2],
					];
		points.push(point);
	}

	return (
		<group>
			{points.slice(0, -1).map((p, i) => {
				const next = points[i + 1];
				const dir: [number, number, number] = [
					next[0] - p[0],
					next[1] - p[1],
					next[2] - p[2],
				];
				const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
				const isLast = i === points.length - 2;
				return (
					<Arrow3D
						key={i}
						origin={p}
						direction={dir}
						length={len * (isLast ? 3.4 : 1.6)}
						headSize={isLast ? 0.22 : 0.001}
						shaftRadius={0.03}
						color={color}
					/>
				);
			})}
		</group>
	);
};

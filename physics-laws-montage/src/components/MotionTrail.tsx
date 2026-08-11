import React from 'react';

/**
 * Fading motion trail — a strip of shrinking, dimming dots behind a moving
 * object. Since every shot's motion is a pure function of the current
 * Remotion frame (no accumulated state), the caller samples that same
 * motion function at a handful of frames in the past and hands us the
 * resulting points, oldest first.
 */
export const MotionTrail: React.FC<{
	readonly points: [number, number, number][];
	readonly color?: string;
	readonly baseRadius?: number;
}> = ({points, color = '#4fd1ff', baseRadius = 0.14}) => {
	return (
		<group>
			{points.map((p, i) => {
				const t = (i + 1) / points.length; // 0 (oldest) .. 1 (newest)
				const opacity = t * 0.55;
				const radius = baseRadius * (0.35 + t * 0.65);
				return (
					<mesh key={i} position={p}>
						<sphereGeometry args={[radius, 12, 12]} />
						<meshStandardMaterial
							color={color}
							emissive={color}
							emissiveIntensity={1.6}
							transparent
							opacity={opacity}
							toneMapped={false}
						/>
					</mesh>
				);
			})}
		</group>
	);
};

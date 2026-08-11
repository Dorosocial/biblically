import React from 'react';

export const SILHOUETTE_COLOR = '#22262d';

/**
 * Stylized humanoid silhouette — capsule body + sphere head, solid dark
 * color, no facial detail. Arms extend forward holding the wheel's axle.
 * `lean` tilts the whole figure (used when the gyroscopic reaction pulls
 * them sideways) and `armRaise` lifts the arms to axle height.
 */
export const PersonSilhouette: React.FC<{
	readonly position?: [number, number, number];
	readonly lean?: number; // radians, tilt around Z (sideways)
	readonly armRaise?: number; // radians, 0 = arms down, ~1.4 = arms forward/up
	readonly facing?: number; // radians around Y
}> = ({position = [0, 0, 0], lean = 0, armRaise = 1.3, facing = 0}) => {
	const material = (
		<meshStandardMaterial color={SILHOUETTE_COLOR} roughness={0.6} metalness={0} />
	);

	return (
		<group position={position} rotation={[0, facing, lean]}>
			{/* Legs */}
			<mesh position={[-0.16, 0.55, 0]}>
				<capsuleGeometry args={[0.11, 1.0, 4, 8]} />
				{material}
			</mesh>
			<mesh position={[0.16, 0.55, 0]}>
				<capsuleGeometry args={[0.11, 1.0, 4, 8]} />
				{material}
			</mesh>

			{/* Torso */}
			<mesh position={[0, 1.55, 0]}>
				<capsuleGeometry args={[0.32, 1.05, 4, 8]} />
				{material}
			</mesh>

			{/* Head */}
			<mesh position={[0, 2.45, 0]}>
				<sphereGeometry args={[0.26, 24, 24]} />
				{material}
			</mesh>

			{/* Arms — rotate forward/up around the shoulder to hold the axle. */}
			<group position={[-0.4, 2.0, 0]} rotation={[armRaise, 0, -0.15]}>
				<mesh position={[0, -0.42, 0]}>
					<capsuleGeometry args={[0.09, 0.75, 4, 8]} />
					{material}
				</mesh>
			</group>
			<group position={[0.4, 2.0, 0]} rotation={[armRaise, 0, 0.15]}>
				<mesh position={[0, -0.42, 0]}>
					<capsuleGeometry args={[0.09, 0.75, 4, 8]} />
					{material}
				</mesh>
			</group>
		</group>
	);
};

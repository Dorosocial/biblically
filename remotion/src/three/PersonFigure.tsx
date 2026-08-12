import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../lib/theme';

interface Props {
	position?: [number, number, number];
	opacity: number;
	/** 0 = just starting to count (youthful), 1 = 31.7 years later (aged) */
	age: number;
}

/**
 * Reused-style stylized humanoid silhouette: capsule body + sphere head,
 * matching the twin-paradox video's figure. Aging is conveyed visually
 * (per the brief) via posture/scale change and a color/glow shift, not a
 * different model.
 */
export const PersonFigure: React.FC<Props> = ({position = [0, 0, 0], opacity, age}) => {
	const overallScale = 0.72 + age * 0.32; // grows from child-sized to full height, proportions preserved
	const hunch = age > 0.7 ? (age - 0.7) * 0.35 : 0; // slight stoop in later years

	const color = useMemo(() => {
		const young = new THREE.Color(theme.personGlowYoung);
		const old = new THREE.Color(theme.personGlowOld);
		return young.clone().lerp(old, age);
	}, [age]);

	if (opacity <= 0.001) return null;

	return (
		<group position={position} rotation={[hunch, 0, 0]}>
			<group scale={[overallScale, overallScale, overallScale]}>
				{/* body */}
				<mesh position={[0, 0.62, 0]}>
					<capsuleGeometry args={[0.22, 0.62, 6, 12]} />
					<meshStandardMaterial
						color={color}
						emissive={color}
						emissiveIntensity={0.9 - age * 0.45}
						transparent
						opacity={opacity}
						roughness={0.4}
					/>
				</mesh>
				{/* head */}
				<mesh position={[0, 1.24, 0]}>
					<sphereGeometry args={[0.19, 20, 20]} />
					<meshStandardMaterial
						color={color}
						emissive={color}
						emissiveIntensity={1.0 - age * 0.45}
						transparent
						opacity={opacity}
						roughness={0.35}
					/>
				</mesh>
			</group>
			{/* ground contact glow */}
			<mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<circleGeometry args={[0.34, 24]} />
				<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={opacity * 0.35} />
			</mesh>
		</group>
	);
};

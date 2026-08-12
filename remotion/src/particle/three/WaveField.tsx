import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../timing';
import {theme} from '../theme';

export interface Lobe {
	pos: [number, number, number];
	weight: number; // 0..1 relative prominence
	size: number;
	side?: -1 | 0 | 1; // for measurement-collapse bias
	phase?: number;
}

interface Props {
	opacity: number;
	spread: number; // 0 = collapsed to the core, 1 = fully extended
	corePos: [number, number, number];
	lobes: Lobe[];
	lobeBias?: number; // -1..1, favors side===-1 or side===1 lobes
}

const connector = (a: THREE.Vector3, b: THREE.Vector3) => {
	const mid = a.clone().add(b).multiplyScalar(0.5);
	const dir = b.clone().sub(a);
	const length = dir.length();
	const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
	return {mid, length, quat};
};

/**
 * A single translucent, glowing, undulating probability field — the
 * wavefunction. It can extend into multiple lobes (through both slits, or
 * scattered as a "cloud" of possibilities) and recombine, but this is
 * always ONE continuous field object, never separate duplicate particles.
 */
export const WaveField: React.FC<Props> = ({opacity, spread, corePos, lobes, lobeBias = 0}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const core = useMemo(() => new THREE.Vector3(...corePos), [corePos]);

	if (opacity <= 0.001 || spread <= 0.001) return null;

	return (
		<group>
			{/* core glow — the field always has a presence at its origin point */}
			<mesh position={corePos} scale={0.35 + spread * 0.25}>
				<sphereGeometry args={[0.4, 20, 20]} />
				<meshBasicMaterial color={theme.waveColorBright} transparent opacity={opacity * 0.22} depthWrite={false} />
			</mesh>

			{lobes.map((lobe, i) => {
				const biasFactor = lobe.side ? THREE.MathUtils.clamp(1 - lobe.side * lobeBias, 0, 1.6) : 1;
				const w = lobe.weight * spread * biasFactor;
				if (w <= 0.02) return null;
				const phase = lobe.phase ?? i * 1.7;
				const pulse = 1 + Math.sin(t * 1.6 + phase) * 0.12;
				const lobeVec = new THREE.Vector3(...lobe.pos);
				const eased = lobeVec.clone().lerp(core, 1 - Math.min(1, spread * 1.3));
				const {mid, length, quat} = connector(core, eased);

				return (
					<React.Fragment key={i}>
						{/* connecting ribbon back to the core, so it reads as one extending field */}
						{length > 0.05 ? (
							<mesh position={mid} quaternion={quat}>
								<cylinderGeometry args={[0.012, lobe.size * 0.12 * w + 0.01, length, 8, 1, true]} />
								<meshBasicMaterial
									color={theme.waveColor}
									transparent
									opacity={opacity * w * 0.22}
									depthWrite={false}
									side={THREE.DoubleSide}
								/>
							</mesh>
						) : null}
						<mesh position={eased} scale={lobe.size * (0.5 + w * 0.7) * pulse}>
							<icosahedronGeometry args={[0.5, 1]} />
							<meshStandardMaterial
								color={theme.waveColorBright}
								emissive={theme.waveColor}
								emissiveIntensity={1.1}
								transparent
								opacity={opacity * w * 0.55}
								roughness={0.3}
								depthWrite={false}
							/>
						</mesh>
					</React.Fragment>
				);
			})}
		</group>
	);
};

import React from 'react';
import {interpolate} from 'remotion';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const ParticleBurst: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const particles = spec.particles ?? [];
	return (
		<>
			{particles.map((p, i) => {
				const localT = Math.min(
					1,
					Math.max(0, (tr.t - p.delay) / Math.max(0.001, 1 - p.delay))
				);
				const dist = interpolate(localT, [0, 1], [0, p.maxDist], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: (x) => 1 - (1 - x) * (1 - x),
				});
				const localOpacity =
					interpolate(localT, [0, 0.2, 0.8, 1], [0, 1, 1, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}) * tr.opacity;
				const rad = (p.angle * Math.PI) / 180;
				const px = tr.x + Math.cos(rad) * dist;
				const py = tr.y + Math.sin(rad) * dist;
				const color = i % 2 === 0 ? spec.color : spec.color2;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: px,
							top: py,
							width: p.size,
							height: p.size,
							borderRadius: '50%',
							transform: 'translate(-50%, -50%)',
							background: color,
							opacity: localOpacity,
							boxShadow: `0 0 ${p.size * 1.5}px ${color}`,
						}}
					/>
				);
			})}
		</>
	);
};

import React from 'react';
import {interpolate} from 'remotion';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const StrobeBurst: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const size = spec.size * 3 * tr.scale;
	const punch = interpolate(tr.t, [0, 0.1, 0.3, 1], [0, 1, 0.6, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width: size,
				height: size,
				transform: 'translate(-50%, -50%)',
				borderRadius: '50%',
				background: `radial-gradient(circle, ${spec.color} 0%, ${spec.color2} 40%, transparent 72%)`,
				opacity: punch * spec.intensity,
				filter: 'blur(6px)',
				mixBlendMode: 'screen',
			}}
		/>
	);
};

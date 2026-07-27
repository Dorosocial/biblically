import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const GradientBurst: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const size = spec.size * 1.8 * tr.scale;
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width: size,
				height: size,
				transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
				borderRadius: '38%',
				background: `conic-gradient(from ${tr.rotation}deg, ${spec.color}, ${spec.color2}, ${spec.color})`,
				opacity: tr.opacity * 0.9,
				filter: 'blur(2px)',
			}}
		/>
	);
};

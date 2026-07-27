import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const FlashTriangle: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const size = spec.size * tr.scale;
	const glow = 14 + spec.intensity * 38;
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width: size,
				height: size,
				transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
				clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
				background: spec.color,
				opacity: tr.opacity,
				filter: `drop-shadow(0 0 ${glow}px ${spec.color})`,
			}}
		/>
	);
};

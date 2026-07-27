import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const FlashCircle: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const size = spec.size * tr.scale;
	const glow = 18 + spec.intensity * 46;
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width: size,
				height: size,
				borderRadius: '50%',
				transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
				background: `radial-gradient(circle at 50% 50%, ${spec.color} 0%, ${spec.color} 55%, transparent 100%)`,
				opacity: tr.opacity,
				boxShadow: `0 0 ${glow}px ${spec.color}`,
			}}
		/>
	);
};

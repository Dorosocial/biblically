import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const FlashBar: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const width = spec.size * (spec.aspect ?? 6) * tr.scale;
	const height = (spec.size / 3.2) * tr.scale;
	const glow = 12 + spec.intensity * 30;
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width,
				height,
				transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
				background: `linear-gradient(90deg, transparent 0%, ${spec.color} 35%, ${spec.color} 65%, transparent 100%)`,
				opacity: tr.opacity,
				boxShadow: `0 0 ${glow}px ${spec.color}`,
			}}
		/>
	);
};

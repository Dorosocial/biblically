import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const PatternFlash: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const size = spec.size * 1.6 * tr.scale;
	const stripeWidth = Math.max(4, spec.size / 10);
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width: size,
				height: size * 0.62,
				transform: `translate(-50%, -50%) rotate(${tr.rotation}deg)`,
				backgroundImage: `repeating-linear-gradient(45deg, ${spec.color} 0, ${spec.color} ${stripeWidth}px, ${spec.color2} ${stripeWidth}px, ${spec.color2} ${stripeWidth * 2}px)`,
				opacity: tr.opacity,
			}}
		/>
	);
};

import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const FlashText: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const fontSize = spec.size * 0.9 * tr.scale;
	const glow = 16 + spec.intensity * 34;
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				transform: `translate(-50%, -50%) rotate(${tr.rotation * 0.15}deg)`,
				fontFamily:
					'"Helvetica Neue", Arial, "Segoe UI", sans-serif',
				fontWeight: 900,
				fontSize,
				color: spec.color,
				opacity: tr.opacity,
				whiteSpace: 'nowrap',
				letterSpacing: '-0.01em',
				textShadow: `0 0 ${glow}px ${spec.color}`,
			}}
		>
			{spec.text}
		</div>
	);
};

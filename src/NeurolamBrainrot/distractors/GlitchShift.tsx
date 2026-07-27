import React from 'react';
import {DistractorSpec} from '../types';
import {ResolvedTransform} from '../transform';

export const GlitchShift: React.FC<{spec: DistractorSpec; tr: ResolvedTransform}> = ({
	spec,
	tr,
}) => {
	const width = spec.size * 2.6 * tr.scale;
	const height = (spec.bandHeight ?? 50) * tr.scale;
	const offset = ((spec.rotation % 40) - 20) * (0.6 + tr.t);
	const bandStyle = (top: number, bg: string, dx: number): React.CSSProperties => ({
		position: 'absolute',
		left: dx,
		top,
		width: '100%',
		height: height / 3,
		background: bg,
		mixBlendMode: 'screen',
	});
	return (
		<div
			style={{
				position: 'absolute',
				left: tr.x,
				top: tr.y,
				width,
				height,
				transform: 'translate(-50%, -50%)',
				opacity: tr.opacity,
				overflow: 'hidden',
			}}
		>
			<div style={bandStyle(0, spec.color, offset)} />
			<div style={bandStyle(height / 3, spec.color2, -offset)} />
			<div style={bandStyle((height / 3) * 2, 'rgba(255,255,255,0.7)', offset * 0.4)} />
		</div>
	);
};

import React from 'react';
import {FIGURE_FILL} from './palette';

// Back view of the same character (same head radius, same fill, same torso
// taper as NarratorFigure) — used only for the closing walk-away shot.
interface Props {
	strideT: number; // 0-1, walk-cycle phase
	opacity?: number;
}

export const NarratorFigureBack: React.FC<Props> = ({strideT, opacity = 1}) => {
	const swing = Math.sin(strideT * Math.PI * 2) * 24;

	return (
		<g opacity={opacity}>
			<g transform={`translate(-22, 228) rotate(${swing})`}>
				<rect x={-16} y={0} width={32} height={160} rx={16} fill={FIGURE_FILL} />
			</g>
			<g transform={`translate(22, 228) rotate(${-swing})`}>
				<rect x={-16} y={0} width={32} height={160} rx={16} fill={FIGURE_FILL} />
			</g>
			<path
				d="M -62 90 Q -70 220 -46 236 L 46 236 Q 70 220 62 90 Q 62 40 0 32 Q -62 40 -62 90 Z"
				fill={FIGURE_FILL}
			/>
			<g transform={`translate(-46, 95) rotate(${swing * 0.5})`}>
				<rect x={-11} y={0} width={22} height={150} rx={11} fill={FIGURE_FILL} />
			</g>
			<g transform={`translate(46, 95) rotate(${-swing * 0.5})`}>
				<rect x={-11} y={0} width={22} height={150} rx={11} fill={FIGURE_FILL} />
			</g>
			<circle cx={0} cy={34} r={40} fill={FIGURE_FILL} />
		</g>
	);
};

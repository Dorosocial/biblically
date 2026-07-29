import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {driftValue} from '../../drift';
import {NarratorFigure} from '../NarratorFigure';
import {SOFT_GRAY} from '../palette';

// Calm, grounded, still — with soft motion-streak lines swirling around but
// never touching the figure. Full-frame scale.
export const Nl26Scene: React.FC = () => {
	const frame = useCurrentFrame();

	const scale = 3.6 + driftValue(frame, 160, 0.03);

	const streaks = [0, 1, 2, 3].map((i) => {
		const angle = (frame / 340) * Math.PI * 2 + (i * Math.PI) / 2;
		const orbitRadius = 260 + driftValue(frame, 90 + i * 17, 24, i);
		return {
			x: CENTER_X + Math.cos(angle) * orbitRadius,
			y: CENTER_Y + Math.sin(angle) * orbitRadius * 0.55,
			opacity: 0.18 + driftValue(frame, 70 + i * 11, 0.12, i * 1.3),
		};
	});

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{streaks.map((s, i) => (
				<line
					key={i}
					x1={s.x - 60}
					y1={s.y}
					x2={s.x + 60}
					y2={s.y}
					stroke={SOFT_GRAY}
					strokeWidth={3}
					strokeLinecap="round"
					opacity={s.opacity}
				/>
			))}
			<g transform={`translate(${CENTER_X}, ${CENTER_Y + 150}) scale(${scale})`}>
				<NarratorFigure armPose="atSide" legPose="standing" />
			</g>
		</svg>
	);
};

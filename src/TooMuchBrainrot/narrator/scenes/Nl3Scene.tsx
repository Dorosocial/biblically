import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {BLUE} from '../palette';

const STEPS = [
	{label: 'MEASURED', x: -420},
	{label: 'TESTED', x: 0},
	{label: 'REBUILT', x: 420},
];

const StepIcon: React.FC<{index: number}> = ({index}) => {
	if (index === 0) {
		// Ruler
		return (
			<svg width={64} height={64} viewBox="0 0 64 64">
				<rect x={6} y={24} width={52} height={16} rx={3} fill={BLUE} />
				<rect x={14} y={24} width={3} height={8} fill="#0A0A0A" />
				<rect x={26} y={24} width={3} height={8} fill="#0A0A0A" />
				<rect x={38} y={24} width={3} height={8} fill="#0A0A0A" />
				<rect x={50} y={24} width={3} height={8} fill="#0A0A0A" />
			</svg>
		);
	}
	if (index === 1) {
		// Checklist
		return (
			<svg width={64} height={64} viewBox="0 0 64 64">
				<rect x={10} y={8} width={44} height={48} rx={4} fill="none" stroke={BLUE} strokeWidth={3} />
				<path d="M18 22 L26 30 L40 14" fill="none" stroke={BLUE} strokeWidth={3} strokeLinecap="round" />
				<rect x={18} y={38} width={28} height={4} fill={BLUE} />
			</svg>
		);
	}
	// Hammer
	return (
		<svg width={64} height={64} viewBox="0 0 64 64">
			<rect x={28} y={20} width={8} height={38} rx={2} fill={BLUE} />
			<rect x={10} y={6} width={36} height={18} rx={3} fill={BLUE} />
		</svg>
	);
};

// "Measured, tested, rebuilt." Three-step horizontal reveal, staggered.
export const Nl3Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const stagger = fps * 0.4;

	return (
		<>
			{STEPS.map((step, i) => {
				const startAt = i * stagger;
				const enter = interpolate(frame, [startAt, startAt + fps * 0.35], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const scale = interpolate(enter, [0, 1], [1.1, 1]);

				return (
					<div
						key={step.label}
						style={{
							position: 'absolute',
							left: CENTER_X + step.x - 100,
							top: CENTER_Y - 70,
							width: 200,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 18,
							opacity: enter,
							transform: `scale(${scale})`,
						}}
					>
						<StepIcon index={i} />
						<BoldLabel color={BLUE} size={30}>
							{step.label}
						</BoldLabel>
					</div>
				);
			})}
		</>
	);
};

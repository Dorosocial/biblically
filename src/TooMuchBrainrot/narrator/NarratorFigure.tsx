import React from 'react';
import {FIGURE_FILL} from './palette';

// A single consistent 2D vector silhouette, reused across every narrator
// scene that features the character. Fixed proportions (head radius, torso
// taper, limb width) live here once so every appearance reads as the same
// figure — only pose (arm/leg angle) and camera framing change per scene.

interface ArmProps {
	/** Degrees, 0 = hanging straight down at the side. */
	angle: number;
	/** Degrees at the elbow, 0 = straight. */
	elbowAngle?: number;
	side: 'left' | 'right';
}

const Arm: React.FC<ArmProps> = ({angle, elbowAngle = 0, side}) => {
	const shoulderX = side === 'left' ? -46 : 46;
	return (
		<g transform={`translate(${shoulderX}, 95) rotate(${angle})`}>
			<rect x={-11} y={0} width={22} height={92} rx={11} fill={FIGURE_FILL} />
			<g transform={`translate(0, 92) rotate(${elbowAngle})`}>
				<rect x={-10} y={0} width={20} height={78} rx={10} fill={FIGURE_FILL} />
			</g>
		</g>
	);
};

interface LegProps {
	angle: number;
	side: 'left' | 'right';
}

const Leg: React.FC<LegProps> = ({angle, side}) => {
	const hipX = side === 'left' ? -30 : 30;
	return (
		<g transform={`translate(${hipX}, 228) rotate(${angle})`}>
			<rect x={-16} y={0} width={32} height={160} rx={16} fill={FIGURE_FILL} />
		</g>
	);
};

export type ArmPose = 'atSide' | 'reachingForward' | 'raisedFork' | 'restingOnKnee';
export type LegPose = 'standing' | 'seated' | 'strideForward' | 'strideBack';

interface Props {
	/** Chest-up only — crops out legs entirely for close framing. */
	bustOnly?: boolean;
	armPose?: ArmPose;
	legPose?: LegPose;
	/** Degrees, subtle head turn. */
	headTurn?: number;
	opacity?: number;
}

const ARM_ANGLES: Record<ArmPose, {angle: number; elbowAngle: number}> = {
	atSide: {angle: 6, elbowAngle: 4},
	reachingForward: {angle: 96, elbowAngle: 34},
	raisedFork: {angle: -150, elbowAngle: -10},
	restingOnKnee: {angle: 60, elbowAngle: 70},
};

const LEG_ANGLES: Record<LegPose, {left: number; right: number}> = {
	standing: {left: 4, right: -4},
	seated: {left: 78, right: 82},
	strideForward: {left: -22, right: 26},
	strideBack: {left: 26, right: -22},
};

export const NarratorFigure: React.FC<Props> = ({
	bustOnly = false,
	armPose = 'atSide',
	legPose = 'standing',
	headTurn = 0,
	opacity = 1,
}) => {
	const arm = ARM_ANGLES[armPose];
	const legs = LEG_ANGLES[legPose];

	return (
		<g opacity={opacity}>
			{!bustOnly && <Leg angle={legs.left} side="left" />}
			{!bustOnly && <Leg angle={legs.right} side="right" />}
			<path
				d="M -62 90 Q -70 220 -46 236 L 46 236 Q 70 220 62 90 Q 62 40 0 32 Q -62 40 -62 90 Z"
				fill={FIGURE_FILL}
			/>
			<Arm angle={arm.angle} elbowAngle={arm.elbowAngle} side="right" />
			<g transform={`translate(0, 34) rotate(${headTurn})`}>
				<circle cx={0} cy={0} r={40} fill={FIGURE_FILL} />
				<rect x={-9} y={30} width={18} height={20} fill={FIGURE_FILL} />
			</g>
		</g>
	);
};

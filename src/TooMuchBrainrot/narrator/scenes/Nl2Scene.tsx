import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y, HEIGHT, WIDTH} from '../../constants';
import {driftValue} from '../../drift';
import {BUST_ANCHOR_Y, BUST_SCALE} from '../layout';
import {NL2_BEATS} from '../narratorSchedule';
import {NarratorFigure} from '../NarratorFigure';
import {CREAM, PALE_GOLD} from '../palette';

const SettledMan: React.FC<{localFrame: number}> = ({localFrame}) => {
	const scale = BUST_SCALE + driftValue(localFrame, 130, 0.04);
	const panX = driftValue(localFrame, 170, 6);
	return (
		<g transform={`translate(${CENTER_X + panX}, ${BUST_ANCHOR_Y}) scale(${scale})`}>
			<NarratorFigure bustOnly armPose="atSide" headTurn={driftValue(localFrame, 220, 3)} />
		</g>
	);
};

const ThoughtSpark: React.FC<{localFrame: number; duration: number}> = ({localFrame, duration}) => {
	const riseProgress = interpolate(localFrame, [0, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Dissolves before completing its path — never reaches full opacity/height.
	const opacity = interpolate(riseProgress, [0, 0.35, 0.75, 1], [0, 0.8, 0.3, 0]);
	const sparkY = CENTER_Y - 260 - riseProgress * 220;

	return (
		<>
			<g transform={`translate(${CENTER_X}, ${BUST_ANCHOR_Y}) scale(${BUST_SCALE})`}>
				<NarratorFigure bustOnly armPose="atSide" />
			</g>
			<circle cx={CENTER_X + 190} cy={sparkY} r={16 + riseProgress * 10} fill={PALE_GOLD} opacity={opacity} />
		</>
	);
};

const PhoneReach: React.FC<{localFrame: number; duration: number}> = ({localFrame, duration}) => {
	const reach = interpolate(localFrame, [0, duration * 0.6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const screenGlow = interpolate(localFrame, [duration * 0.55, duration * 0.85], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<g transform={`translate(${CENTER_X}, ${BUST_ANCHOR_Y}) scale(${BUST_SCALE})`}>
			<NarratorFigure bustOnly armPose="reachingForward" />
			<rect
				x={64 + (1 - reach) * 10}
				y={130 - reach * 6}
				width={30}
				height={52}
				rx={5}
				fill="none"
				stroke={CREAM}
				strokeWidth={2.5}
				opacity={0.4 + reach * 0.6}
			/>
			<rect x={68} y={136} width={22} height={40} rx={2} fill={PALE_GOLD} opacity={screenGlow * 0.7} />
		</g>
	);
};

const FIVE_OBJECTS: {label: string; x: number; y: number}[] = [
	{label: 'book', x: -540, y: -60},
	{label: 'cup', x: -260, y: 130},
	{label: 'phone', x: 0, y: -160},
	{label: 'pen', x: 320, y: 100},
	{label: 'laptop', x: 580, y: -50},
];

const OBJECT_SIZE = 150;

const ObjectGlyph: React.FC<{label: string}> = ({label}) => {
	const size = OBJECT_SIZE;
	if (label === 'cup') {
		return <rect width={size * 0.6} height={size} rx={size * 0.1} fill={CREAM} />;
	}
	if (label === 'phone') {
		return <rect width={size * 0.55} height={size} rx={size * 0.12} fill={CREAM} />;
	}
	if (label === 'pen') {
		return <rect width={size * 0.16} height={size} rx={size * 0.08} fill={CREAM} />;
	}
	if (label === 'laptop') {
		return <rect width={size} height={size * 0.65} rx={size * 0.06} fill={CREAM} />;
	}
	return <rect width={size} height={size * 0.75} rx={size * 0.05} fill={CREAM} />;
};

// Close on a pair of full-frame hands — never settling, sweeping large
// between five large object silhouettes.
const FiveObjectHands: React.FC<{localFrame: number; duration: number}> = ({localFrame, duration}) => {
	const fps = 30;
	const reachEvery = Math.max(duration / FIVE_OBJECTS.length, fps * 0.35);
	const activeIndex = Math.min(Math.floor(localFrame / reachEvery), FIVE_OBJECTS.length - 1);

	return (
		<>
			{FIVE_OBJECTS.map((obj, i) => {
				const localT = localFrame - i * reachEvery;
				const isActive = i === activeIndex;
				const reach = interpolate(localT, [0, reachEvery * 0.5], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const opacity = isActive ? 0.55 + reach * 0.45 : 0.4;
				const scale = isActive ? 1 + reach * 0.18 : 1;

				return (
					<g
						key={obj.label}
						transform={`translate(${CENTER_X + obj.x}, ${CENTER_Y + obj.y}) scale(${scale})`}
						opacity={opacity}
					>
						<ObjectGlyph label={obj.label} />
					</g>
				);
			})}
			{/* A pair of large hands sweeping toward whichever object is currently "active". */}
			{(() => {
				const target = FIVE_OBJECTS[activeIndex];
				const hx = CENTER_X + target.x;
				const hy = CENTER_Y + target.y + OBJECT_SIZE * 0.7;
				return (
					<g transform={`translate(${hx}, ${hy})`}>
						<circle cx={-46} cy={0} r={52} fill={CREAM} opacity={0.85} />
						<circle cx={46} cy={0} r={52} fill={CREAM} opacity={0.85} />
					</g>
				);
			})()}
		</>
	);
};

export const Nl2Scene: React.FC = () => {
	const frame = useCurrentFrame();

	if (frame < NL2_BEATS.thoughtSpark.start) {
		return (
			<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
				<SettledMan localFrame={frame - NL2_BEATS.settledMan.start} />
			</svg>
		);
	}

	if (frame < NL2_BEATS.phoneReach.start) {
		return (
			<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
				<ThoughtSpark
					localFrame={frame - NL2_BEATS.thoughtSpark.start}
					duration={NL2_BEATS.thoughtSpark.end - NL2_BEATS.thoughtSpark.start}
				/>
			</svg>
		);
	}

	if (frame < NL2_BEATS.fiveObjects.start) {
		return (
			<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
				<PhoneReach
					localFrame={frame - NL2_BEATS.phoneReach.start}
					duration={NL2_BEATS.phoneReach.end - NL2_BEATS.phoneReach.start}
				/>
			</svg>
		);
	}

	return (
		<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
			<FiveObjectHands
				localFrame={frame - NL2_BEATS.fiveObjects.start}
				duration={NL2_BEATS.fiveObjects.end - NL2_BEATS.fiveObjects.start}
			/>
		</svg>
	);
};

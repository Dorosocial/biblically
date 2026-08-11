import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, OPENING_BEATS} from '../timing';
import {Backdrop} from '../components/Backdrop';
import {SceneLighting} from '../components/SceneLighting';
import {CameraRig} from '../components/CameraRig';
import {MetallicSphere, WireSupport} from '../components/MetallicSphere';
import {BicycleWheel} from '../components/BicycleWheel';
import {Floor} from '../components/Floor';
import {Label} from '../components/Label';

const CRADLE_CENTER: [number, number, number] = [-1.5, 2.6, -0.6];
const WHEEL_CENTER: [number, number, number] = [0, 2.3, 0.7];
const BALL_CENTER: [number, number, number] = [1.6, 0, 1.0];

const CRADLE_COUNT = 5;
const CRADLE_SPACING = 0.62;
const CRADLE_START_X = -((CRADLE_COUNT - 1) / 2) * CRADLE_SPACING;

/** World position of the swinging (first) cradle ball, for camera targeting. */
const firstBallWorldPos = (swingAngle: number): [number, number, number] => {
	const x = CRADLE_START_X + Math.sin(swingAngle) * 0.9;
	const y = -Math.cos(swingAngle) * 0.9;
	return [CRADLE_CENTER[0] + x, CRADLE_CENTER[1] + 0.9 + y, CRADLE_CENTER[2]];
};

const NewtonsCradle: React.FC<{readonly swingAngle: number}> = ({swingAngle}) => {
	// swingAngle > 0 swings the FIRST ball back; < 0 (unused here) would swing the last.
	const startX = -((CRADLE_COUNT - 1) / 2) * CRADLE_SPACING;
	return (
		<group position={CRADLE_CENTER}>
			{new Array(CRADLE_COUNT).fill(0).map((_, i) => {
				const restX = startX + i * CRADLE_SPACING;
				const isFirst = i === 0;
				const isLast = i === CRADLE_COUNT - 1;
				const angle = isFirst ? swingAngle : isLast ? Math.min(0, -swingAngle * 0.0) : 0;
				const x = restX + Math.sin(angle) * 0.9;
				const y = -Math.cos(angle) * 0.9;
				return (
					<group key={i}>
						<WireSupport from={[restX, 0.9, 0]} to={[x, 0.9 + y, 0]} />
						<MetallicSphere radius={0.28} position={[x, 0.9 + y, 0]} />
					</group>
				);
			})}
		</group>
	);
};

// SFX PLACEHOLDER: sharp metallic "click" on cradle impact (frame ~local 8).

export const OpeningAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {chaosCradle, chaosWheel, chaosBall, freezeAndLabels} = OPENING_BEATS;

	// ---- Chaos beat 1: Newton's cradle impact (extreme close-up) ----
	const cradleSwing = interpolate(
		frame,
		[chaosCradle.from, chaosCradle.from + 10, chaosCradle.to],
		[0.9, 0, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)},
	);

	// ---- Chaos beat 2: wheel twisting sideways mid-spin ----
	const wheelSpin = frame * 0.9;
	const wheelTilt = interpolate(frame, [chaosWheel.from, chaosWheel.to], [0, 1.1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});

	// ---- Chaos beat 3: ball smashing into floor and launching upward ----
	const ballY = interpolate(
		frame,
		[chaosBall.from, chaosBall.from + 12, chaosBall.from + 14, chaosBall.to],
		[2.6, 0.3, 0.3, 2.2],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
	);

	// ---- Freeze pose held for the rest of the act ----
	const frozenCradleSwing = 0;
	const frozenWheelTilt = 1.1;
	const frozenBallY = 0.3;

	const inChaos1 = frame < chaosCradle.to;
	const inChaos2 = frame >= chaosCradle.to && frame < chaosWheel.to;
	const inChaos3 = frame >= chaosWheel.to && frame < chaosBall.to;
	const isFrozen = frame >= chaosBall.to;

	// ---- Camera ----
	let camPos: [number, number, number] = [0, 2, 6];
	let camLookAt: [number, number, number] = [0, 1.6, 0];

	if (inChaos1) {
		const ballPos = firstBallWorldPos(isFrozen ? frozenCradleSwing : cradleSwing);
		camPos = [ballPos[0] + 0.55, ballPos[1] + 0.1, ballPos[2] + 1.0];
		camLookAt = ballPos;
	} else if (inChaos2) {
		camPos = [WHEEL_CENTER[0] + 0.2, WHEEL_CENTER[1] + 0.1, 1.0];
		camLookAt = WHEEL_CENTER;
	} else if (inChaos3) {
		camPos = [BALL_CENTER[0] + 0.9, 0.9, 1.7];
		camLookAt = [BALL_CENTER[0], 0.3, BALL_CENTER[2]];
	} else {
		// Violent whip pull-back revealing the full setup, then a fast orbit.
		const pullBackProgress = interpolate(
			frame,
			[chaosBall.to, chaosBall.to + 9],
			[0, 1],
			{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)},
		);
		const orbitAngle = interpolate(
			frame,
			[chaosBall.to + 9, freezeAndLabels.to],
			[0, Math.PI * 0.85],
			{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)},
		);
		const wideRadius = interpolate(pullBackProgress, [0, 1], [1.2, 8.6]);
		const wideHeight = interpolate(pullBackProgress, [0, 1], [0.5, 3.4]);
		camPos = [Math.sin(orbitAngle) * wideRadius, wideHeight, Math.cos(orbitAngle) * wideRadius + 0.5];
		camLookAt = [0, 1.4, 0.2];
	}

	return (
		<>
			<ThreeCanvas width={WIDTH} height={HEIGHT}>
				<Backdrop />
				<SceneLighting
					focalPosition={inChaos1 ? CRADLE_CENTER : inChaos2 ? WHEEL_CENTER : BALL_CENTER}
					focalColor={inChaos1 ? '#4fd1ff' : inChaos2 ? '#c07bff' : '#ffb347'}
					focalIntensity={3.4}
				/>
				<CameraRig position={camPos} lookAt={camLookAt} fov={isFrozen ? 48 : 34} />

				<NewtonsCradle swingAngle={isFrozen ? frozenCradleSwing : cradleSwing} />

				<BicycleWheel
					position={WHEEL_CENTER}
					rotation={[0, 0.3, isFrozen ? frozenWheelTilt : wheelTilt]}
					spin={wheelSpin}
					radius={1.1}
				/>

				<Floor y={0} />
				<MetallicSphere
					radius={0.42}
					position={[BALL_CENTER[0], isFrozen ? frozenBallY : ballY, BALL_CENTER[2]]}
					emissive="#ffb347"
					emissiveIntensity={isFrozen ? 0.15 : 0}
				/>
			</ThreeCanvas>

			{isFrozen && (
				<>
					<Label
						text="MOTION"
						localFrame={frame}
						inAt={freezeAndLabels.from}
						outAt={freezeAndLabels.from + 22}
						top="18%"
						left="8%"
						color="#4fd1ff"
						fontSize={40}
						align="left"
					/>
					<Label
						text="ENERGY"
						localFrame={frame}
						inAt={freezeAndLabels.from + 22}
						outAt={freezeAndLabels.from + 44}
						top="30%"
						right="8%"
						color="#ffb347"
						fontSize={40}
						align="right"
					/>
					<Label
						text="FORCE"
						localFrame={frame}
						inAt={freezeAndLabels.from + 44}
						outAt={freezeAndLabels.from + 66}
						top="68%"
						left="8%"
						color="#c07bff"
						fontSize={40}
						align="left"
					/>
					<Label
						text="MOMENTUM"
						localFrame={frame}
						inAt={freezeAndLabels.from + 66}
						outAt={freezeAndLabels.from + 91}
						top="80%"
						right="8%"
						color="#5fe3a3"
						fontSize={40}
						align="right"
					/>
				</>
			)}

		</>
	);
};

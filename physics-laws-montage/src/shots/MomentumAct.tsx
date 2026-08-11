import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, MOMENTUM_BEATS} from '../timing';
import {Backdrop} from '../components/Backdrop';
import {SceneLighting} from '../components/SceneLighting';
import {CameraRig} from '../components/CameraRig';
import {MetallicSphere, WireSupport} from '../components/MetallicSphere';
import {Arrow3D} from '../components/Arrow3D';
import {MotionTrail} from '../components/MotionTrail';
import {Label} from '../components/Label';

const ROW_COUNT = 5;
const SPACING = 0.62;
const PIVOT_Y = 3.2;
const LENGTH = 1.0;
const REST_Y = PIVOT_Y - LENGTH;
const START_X = -((ROW_COUNT - 1) / 2) * SPACING;
const rowX = (i: number) => START_X + i * SPACING;

const pendulumPos = (
	pivotX: number,
	angle: number,
	z: number,
): [number, number, number] => [
	pivotX + Math.sin(angle) * LENGTH,
	PIVOT_Y - Math.cos(angle) * LENGTH,
	z,
];

const easeInOut = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

/** Canonical swing-in -> impact -> launch motion, normalized to t in [0,1]. */
const momentumMotion = (t: number) => {
	const clamped = Math.max(0, Math.min(1, t));
	if (clamped < 0.55) {
		const local = clamped / 0.55;
		return {
			heavyAngle: interpolate(easeInOut(local), [0, 1], [-1.05, 0]),
			lastAngle: 0,
			compress: 0,
		};
	}
	const local = (clamped - 0.55) / 0.45;
	const recoilLocal = Math.min(local * 3, 1);
	return {
		heavyAngle: interpolate(easeOut(recoilLocal), [0, 1], [0, -0.16]),
		lastAngle: interpolate(easeOut(local), [0, 1], [0, 1.15]),
		compress: Math.max(0, 1 - local * 8), // brief squash right at impact
	};
};

// SFX PLACEHOLDER: sharp metallic "clack" at t=0.55 (impact instant).

export const MomentumAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {reset, incoming, impactLaunch, slowMoReplay} = MOMENTUM_BEATS;

	let t = 0; // canonical motion progress
	let isReplay = false;
	let replayProgress = 0;

	if (frame < reset.to) {
		t = 0;
	} else if (frame < incoming.to) {
		t = interpolate(frame, [incoming.from, incoming.to], [0, 0.55]);
	} else if (frame < impactLaunch.to) {
		t = interpolate(frame, [impactLaunch.from, impactLaunch.to], [0.55, 1]);
	} else {
		isReplay = true;
		replayProgress = interpolate(frame, [slowMoReplay.from, slowMoReplay.to], [0, 1], {
			extrapolateRight: 'clamp',
		});
		t = replayProgress;
	}

	const {heavyAngle, lastAngle, compress} = momentumMotion(t);

	// Velocity trail for the incoming heavy ball (sampled a few frames back).
	const trailPoints: [number, number, number][] = [0.12, 0.09, 0.06, 0.03].map((dt) => {
		const sampledT = Math.max(0, t - dt);
		const {heavyAngle: a} = momentumMotion(sampledT);
		return pendulumPos(rowX(0), a, -0.18);
	});

	const heavyPos = pendulumPos(rowX(0), heavyAngle, -0.18);
	const lastPos = pendulumPos(rowX(ROW_COUNT - 1), lastAngle, 0);

	// ---- Camera ----
	let camPos: [number, number, number] = [0, 2.4, 6];
	let camLookAt: [number, number, number] = [0, REST_Y, 0];
	let fov = 42;

	if (frame < reset.to) {
		camPos = [0.4, 2.6, 5.4];
		camLookAt = [0, REST_Y, 0];
	} else if (frame < incoming.to) {
		// Low-angle tracking shot following the incoming ball.
		fov = 38;
		camPos = [heavyPos[0] - 0.9, 1.1, 1.9];
		camLookAt = [heavyPos[0] + 0.6, REST_Y, 0];
	} else if (frame < impactLaunch.to) {
		const local = interpolate(frame, [impactLaunch.from, impactLaunch.to], [0, 1]);
		if (local < 0.28) {
			// Camera locked on the row through the compression.
			camPos = [0, 2.2, 3.4];
			camLookAt = [0, REST_Y, 0];
		} else {
			// Rapidly follows the outgoing ball.
			const chaseT = interpolate(local, [0.28, 1], [0, 1], {extrapolateLeft: 'clamp'});
			camPos = [
				interpolate(chaseT, [0, 1], [0, lastPos[0] + 0.3], {easing: Easing.out(Easing.cubic)}),
				interpolate(chaseT, [0, 1], [2.2, 1.5]),
				interpolate(chaseT, [0, 1], [3.4, 2.0]),
			];
			camLookAt = lastPos;
			fov = 40;
		}
	} else {
		// Slow-motion orbit around the collision.
		const orbitAngle = interpolate(replayProgress, [0, 1], [-0.7, 0.7]);
		const radius = 4.4;
		camPos = [Math.sin(orbitAngle) * radius, 2.0, Math.cos(orbitAngle) * radius];
		camLookAt = [0, REST_Y, 0];
		fov = 44;
	}

	const showEnterArrow = isReplay && replayProgress > 0.05 && replayProgress < 0.62;
	const showExitArrow = isReplay && replayProgress > 0.58;

	return (
		<>
			<ThreeCanvas width={WIDTH} height={HEIGHT}>
				<Backdrop />
				<SceneLighting focalPosition={[0, REST_Y, 0]} focalColor="#4fd1ff" focalIntensity={3.2} />
				<CameraRig position={camPos} lookAt={camLookAt} fov={fov} />

				{/* Row of 5 identical metallic spheres. */}
				{new Array(ROW_COUNT).fill(0).map((_, i) => {
					const angle = i === ROW_COUNT - 1 ? lastAngle : 0;
					const squash = i === 0 ? 1 - compress * 0.18 : 1;
					const pos = pendulumPos(rowX(i), angle, 0);
					return (
						<group key={i}>
							<WireSupport from={[rowX(i), PIVOT_Y, 0]} to={pos} />
							<group position={pos} scale={[1 / squash, squash, 1 / squash]}>
								<MetallicSphere radius={0.28} position={[0, 0, 0]} />
							</group>
						</group>
					);
				})}

				{/* The incoming heavy ball. */}
				<WireSupport from={[rowX(0), PIVOT_Y, -0.18]} to={heavyPos} />
				<MetallicSphere radius={0.36} position={heavyPos} />

				{isReplay && <MotionTrail points={trailPoints} color="#4fd1ff" baseRadius={0.1} />}

				{showEnterArrow && (
					<Arrow3D
						origin={[rowX(0) - 1.6, REST_Y, 0]}
						direction={[1, 0, 0]}
						length={1.3}
						color="#4fd1ff"
					/>
				)}
				{showExitArrow && (
					<Arrow3D
						origin={[rowX(ROW_COUNT - 1) + 0.4, REST_Y, 0]}
						direction={[1, 0, 0]}
						length={1.3}
						color="#4fd1ff"
					/>
				)}
			</ThreeCanvas>

			{frame >= reset.from && frame < reset.to + 6 && (
				<Label text="Watch This" localFrame={frame} inAt={reset.from} top="10%" color="#ffffff" fontSize={38} />
			)}
			{isReplay && (
				<Label
					text="Momentum"
					localFrame={frame}
					inAt={slowMoReplay.from + 4}
					top="10%"
					color="#4fd1ff"
					fontSize={46}
				/>
			)}
		</>
	);
};

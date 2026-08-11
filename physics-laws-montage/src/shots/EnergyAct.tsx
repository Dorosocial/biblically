import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, ENERGY_BEATS} from '../timing';
import {Backdrop} from '../components/Backdrop';
import {SceneLighting} from '../components/SceneLighting';
import {CameraRig} from '../components/CameraRig';
import {MetallicSphere} from '../components/MetallicSphere';
import {Floor} from '../components/Floor';
import {Arrow3D} from '../components/Arrow3D';
import {EnergyBar} from '../components/EnergyBar';
import {Label} from '../components/Label';

const BALL_X = 0;
const BALL_Z = 0;
const BALL_RADIUS = 0.5;
const START_HEIGHT = 6.2;
const REBOUND_HEIGHT = START_HEIGHT * 0.92;

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeIn = Easing.in(Easing.quad);
const easeOut = Easing.out(Easing.quad);

/** Faint vertical ghost line marking the ball's original drop height. */
const GhostTrajectory: React.FC<{readonly opacity: number}> = ({opacity}) => {
	if (opacity <= 0) return null;
	return (
		<group>
			<mesh position={[BALL_X, START_HEIGHT / 2 + BALL_RADIUS, BALL_Z]}>
				<cylinderGeometry args={[0.012, 0.012, START_HEIGHT, 8]} />
				<meshStandardMaterial
					color="#ffffff"
					emissive="#ffffff"
					emissiveIntensity={0.8}
					transparent
					opacity={opacity * 0.35}
					toneMapped={false}
				/>
			</mesh>
			<mesh position={[BALL_X, START_HEIGHT + BALL_RADIUS, BALL_Z]} rotation={[-Math.PI / 2, 0, 0]}>
				<ringGeometry args={[0.32, 0.4, 24]} />
				<meshStandardMaterial
					color="#ffffff"
					emissive="#ffffff"
					emissiveIntensity={1.2}
					transparent
					opacity={opacity * 0.7}
					toneMapped={false}
					side={2}
				/>
			</mesh>
		</group>
	);
};

// SFX PLACEHOLDER: heavy floor "impact/thud" on first bounce (start of impactFreeze).
// SFX PLACEHOLDER: softer secondary "thud" during transferMacro's rebound.

export const EnergyAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {
		intro,
		fall,
		impactFreeze,
		launchGhost,
		peakFreezeText,
		reverse,
		potentialHold,
		kineticFall,
		transferMacro,
	} = ENERGY_BEATS;

	let height = START_HEIGHT;
	let squash = 1;
	let showGhost = 0;
	let showDownArrow = false;
	let potentialFill = 1;
	let kineticFill = 0;

	if (frame < intro.to) {
		height = START_HEIGHT;
	} else if (frame < fall.to) {
		const p = interpolate(frame, [fall.from, fall.to], [0, 1], clampOpts);
		height = interpolate(easeIn(p), [0, 1], [START_HEIGHT, 0]);
		showDownArrow = true;
		potentialFill = 1 - p;
		kineticFill = p;
	} else if (frame < impactFreeze.to) {
		height = 0;
		const p = interpolate(frame, [impactFreeze.from, impactFreeze.from + 6], [0, 1], clampOpts);
		squash = interpolate(p, [0, 1], [1, 0.55], {...clampOpts, easing: Easing.out(Easing.cubic)});
		potentialFill = 0;
		kineticFill = 1;
	} else if (frame < launchGhost.to) {
		const p = interpolate(frame, [launchGhost.from, launchGhost.to], [0, 1], clampOpts);
		height = interpolate(easeOut(p), [0, 1], [0, REBOUND_HEIGHT]);
		squash = interpolate(p, [0, 0.15], [0.55, 1], clampOpts);
		showGhost = interpolate(p, [0.1, 0.4], [0, 1], clampOpts);
		potentialFill = p;
		kineticFill = 1 - p;
	} else if (frame < peakFreezeText.to) {
		height = REBOUND_HEIGHT;
		showGhost = 1;
		potentialFill = 1;
		kineticFill = 0;
	} else if (frame < reverse.to) {
		const p = interpolate(frame, [reverse.from, reverse.to], [0, 1], clampOpts);
		height = interpolate(p, [0, 1], [REBOUND_HEIGHT, 0]);
		showGhost = 1 - p;
		potentialFill = 1 - p;
		kineticFill = p;
	} else if (frame < potentialHold.to) {
		const p = interpolate(frame, [potentialHold.from, potentialHold.from + 20], [0, 1], clampOpts);
		height = interpolate(easeOut(p), [0, 1], [0, START_HEIGHT]);
		potentialFill = p;
		kineticFill = 1 - p;
	} else if (frame < kineticFall.to) {
		const p = interpolate(frame, [kineticFall.from, kineticFall.to], [0, 1], clampOpts);
		height = interpolate(easeIn(p), [0, 1], [START_HEIGHT, 0]);
		potentialFill = 1 - p;
		kineticFill = p;
		showDownArrow = true;
	} else {
		// Extreme slow-motion macro bounce: small deformation + tiny rebound.
		const p = interpolate(frame, [transferMacro.from, transferMacro.to], [0, 1], clampOpts);
		height = interpolate(p, [0, 0.4, 1], [0, 0, 0.9], {...clampOpts, easing: Easing.out(Easing.cubic)});
		squash = interpolate(p, [0, 0.25, 0.5, 1], [1, 0.5, 0.7, 0.95], clampOpts);
		potentialFill = interpolate(p, [0, 1], [0, 0.15], clampOpts);
		kineticFill = interpolate(p, [0, 0.4, 1], [1, 1, 0.3], clampOpts);
	}

	const ballY = height + BALL_RADIUS * squash;

	// ---- Camera ----
	let camPos: [number, number, number] = [1.6, 4.5, 7.5];
	let camLookAt: [number, number, number] = [BALL_X, START_HEIGHT / 2, BALL_Z];
	let fov = 42;

	if (frame < intro.to) {
		// Rapid vertical pull-back revealing the height.
		const p = interpolate(frame, [intro.from, intro.to], [0, 1], clampOpts);
		camPos = [
			interpolate(p, [0, 1], [0.3, 1.8]),
			interpolate(p, [0, 1], [START_HEIGHT + 0.5, 3.2]),
			interpolate(p, [0, 1], [1.0, 8.5]),
		];
		camLookAt = [BALL_X, interpolate(p, [0, 1], [START_HEIGHT, START_HEIGHT * 0.78]), BALL_Z];
		fov = interpolate(p, [0, 1], [26, 46]);
	} else if (frame < fall.to) {
		// Camera drops alongside the ball.
		camPos = [2.2, ballY + 1.4, 6.0];
		camLookAt = [BALL_X, ballY, BALL_Z];
	} else if (frame < impactFreeze.to) {
		// Extreme low-angle close-up at the collision point.
		camPos = [1.7, 0.4, 2.3];
		camLookAt = [BALL_X, 0.15, BALL_Z];
		fov = 36;
	} else if (frame < launchGhost.to) {
		// Camera tilts upward following the ball.
		camPos = [2.4, 1.6, 5.2];
		camLookAt = [BALL_X, ballY, BALL_Z];
	} else if (frame < peakFreezeText.to) {
		// Camera completely stops.
		camPos = [2.4, REBOUND_HEIGHT * 0.55, 6.4];
		camLookAt = [BALL_X, REBOUND_HEIGHT * 0.75, BALL_Z];
	} else if (frame < reverse.to) {
		// Slow reverse pull-back.
		const p = interpolate(frame, [reverse.from, reverse.to], [0, 1], clampOpts);
		camPos = [interpolate(p, [0, 1], [2.4, 3.4]), interpolate(p, [0, 1], [3.4, 4.6]), interpolate(p, [0, 1], [6.4, 8.0])];
		camLookAt = [BALL_X, height / 2 + 1, BALL_Z];
	} else if (frame < potentialHold.to) {
		// Slow push toward the ball, held high — wide enough to keep the
		// floor-level energy bars in frame together with the ball.
		const p = interpolate(frame, [potentialHold.from, potentialHold.to], [0, 1], clampOpts);
		camPos = [interpolate(p, [0, 1], [1.0, 0.6]), interpolate(p, [0, 1], [3.6, 3.3]), interpolate(p, [0, 1], [10.5, 9.0])];
		camLookAt = [BALL_X, 3.3, BALL_Z];
		fov = 50;
	} else if (frame < kineticFall.to) {
		// Camera follows downward with the ball, still wide enough for the bars.
		camPos = [0.6, 3.6, 9.2];
		camLookAt = [BALL_X, 3.2, BALL_Z];
		fov = 50;
	} else {
		// Extreme slow-motion macro shot of the bounce.
		camPos = [0.55, 0.35, 0.9];
		camLookAt = [BALL_X, ballY - 0.1, BALL_Z];
		fov = 28;
	}

	const showEnergyBars = frame >= potentialHold.from - 10;
	const showPeakText = frame >= peakFreezeText.from && frame < reverse.from;

	return (
		<>
			<ThreeCanvas width={WIDTH} height={HEIGHT}>
				<Backdrop center={[0, START_HEIGHT / 2, 0]} />
				<SceneLighting
					focalPosition={[BALL_X, ballY, BALL_Z]}
					focalColor="#ffb347"
					focalIntensity={2.8}
				/>
				<CameraRig position={camPos} lookAt={camLookAt} fov={fov} />

				<Floor y={0} />
				<MetallicSphere
					radius={BALL_RADIUS}
					position={[BALL_X, height + BALL_RADIUS * squash, BALL_Z]}
					emissive="#ffb347"
					emissiveIntensity={0.12}
				/>

				<GhostTrajectory opacity={showGhost} />

				{showDownArrow && (
					<Arrow3D
						origin={[BALL_X + 0.9, ballY + 1.1, BALL_Z]}
						direction={[0, -1, 0]}
						length={Math.min(1.6, 0.4 + (START_HEIGHT - height) * 0.12)}
						color="#ffb347"
					/>
				)}

				{showEnergyBars && (
					<>
						<EnergyBar
							position={[-1.5, 0, 0.6]}
							fill={potentialFill}
							color="#ffb347"
							label="POTENTIAL"
						/>
						<EnergyBar
							position={[1.5, 0, 0.6]}
							fill={kineticFill}
							color="#ff6a6a"
							label="KINETIC"
						/>
					</>
				)}
			</ThreeCanvas>

			{showPeakText && (
				<Label
					text="Where Did The Energy Come From?"
					localFrame={frame}
					inAt={peakFreezeText.from}
					top="14%"
					color="#ffffff"
					fontSize={34}
				/>
			)}
			{frame >= potentialHold.from && frame < potentialHold.from + 10 && (
				<Label text="Potential Energy ↑" localFrame={frame} inAt={potentialHold.from} top="10%" color="#ffb347" fontSize={34} />
			)}
			{frame >= kineticFall.from && frame < kineticFall.from + 10 && (
				<Label text="Kinetic Energy" localFrame={frame} inAt={kineticFall.from} top="10%" color="#ff6a6a" fontSize={34} />
			)}
		</>
	);
};

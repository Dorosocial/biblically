import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, ANGULAR_BEATS} from '../timing';
import {Backdrop} from '../components/Backdrop';
import {SceneLighting} from '../components/SceneLighting';
import {CameraRig} from '../components/CameraRig';
import {BicycleWheel, axleDirection} from '../components/BicycleWheel';
import {PersonSilhouette} from '../components/PersonSilhouette';
import {Arrow3D, CurvedArrow3D} from '../components/Arrow3D';
import {Label} from '../components/Label';

const WHEEL_BASE_POS: [number, number, number] = [0, 1.85, 0.55];
const PERSON_BASE_POS: [number, number, number] = [0, 0, 1.55];

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// SFX PLACEHOLDER: low mechanical "twist/strain" whoosh as the axle direction changes.
// SFX PLACEHOLDER: soft "thud" of feet shuffling as the person is pulled sideways.

export const AngularMomentumAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {pushIn, axisChange, sidewaysPull, freezeVectorLabel} = ANGULAR_BEATS;

	const spin = frame * 1.1;

	// Axle yaw: starts pointing along world X (Math.PI/2), twists toward Z as the
	// person forces it to change direction.
	const axleYaw = interpolate(
		frame,
		[axisChange.from, axisChange.to],
		[Math.PI / 2, Math.PI / 2 - 0.95],
		{...clampOpts, easing: Easing.inOut(Easing.cubic)},
	);
	const wheelRotation: [number, number, number] = [0, axleYaw, 0];

	// Person pulled sideways once the axle fights back.
	const sidewaysX = interpolate(frame, [sidewaysPull.from, sidewaysPull.to], [0, 1.15], {
		...clampOpts,
		easing: Easing.out(Easing.cubic),
	});
	const lean = interpolate(frame, [sidewaysPull.from, sidewaysPull.to], [0, -0.32], {
		...clampOpts,
		easing: Easing.out(Easing.cubic),
	});
	const armRaise = interpolate(frame, [pushIn.to, axisChange.to], [0.2, 1.35], {
		...clampOpts,
		easing: Easing.inOut(Easing.cubic),
	});

	const personPos: [number, number, number] = [
		PERSON_BASE_POS[0] + sidewaysX,
		PERSON_BASE_POS[1],
		PERSON_BASE_POS[2],
	];
	const wheelPos: [number, number, number] = [
		WHEEL_BASE_POS[0] + sidewaysX,
		WHEEL_BASE_POS[1],
		WHEEL_BASE_POS[2],
	];

	const isFrozen = frame >= freezeVectorLabel.from;
	const axleDir = axleDirection(wheelRotation);

	// ---- Camera ----
	let camPos: [number, number, number] = [0, 1.9, 5];
	let camLookAt: [number, number, number] = WHEEL_BASE_POS;
	let fov = 40;

	if (frame < pushIn.to) {
		// Fast push-in toward the spinning rim.
		const p = interpolate(frame, [pushIn.from, pushIn.to], [0, 1], clampOpts);
		camPos = [
			interpolate(p, [0, 1], [1.6, 0.35]),
			interpolate(p, [0, 1], [2.6, 1.85]),
			interpolate(p, [0, 1], [4.2, 1.7]),
		];
		camLookAt = WHEEL_BASE_POS;
		fov = interpolate(p, [0, 1], [46, 32]);
	} else if (frame < axisChange.to) {
		// Camera follows the axle rotation in 3D — orbits to track the axle tip.
		const tip: [number, number, number] = [
			wheelPos[0] + axleDir.x * 2.2,
			wheelPos[1] + axleDir.y * 2.2,
			wheelPos[2] + axleDir.z * 2.2,
		];
		camPos = [tip[0] + 0.6, tip[1] + 0.9, tip[2] + 2.4];
		camLookAt = wheelPos;
		fov = 36;
	} else if (frame < sidewaysPull.to) {
		// Sideways tracking shot matching the person's movement.
		camPos = [personPos[0] + 0.3, 2.0, 4.6];
		camLookAt = [personPos[0], 1.6, 0.6];
		fov = 44;
	} else {
		// Slow 180deg orbit around the frozen wheel.
		const orbitP = interpolate(frame, [freezeVectorLabel.from, freezeVectorLabel.to], [0, 1], clampOpts);
		const angle = interpolate(orbitP, [0, 1], [-0.2, Math.PI - 0.2]);
		const radius = 3.6;
		camPos = [
			wheelPos[0] + Math.sin(angle) * radius,
			1.9,
			wheelPos[2] + Math.cos(angle) * radius,
		];
		camLookAt = wheelPos;
		fov = 40;
	}

	return (
		<>
			<ThreeCanvas width={WIDTH} height={HEIGHT}>
				<Backdrop center={[personPos[0], 2, 0]} />
				<SceneLighting focalPosition={wheelPos} focalColor="#c07bff" focalIntensity={2.2} />
				<CameraRig position={camPos} lookAt={camLookAt} fov={fov} />

				<PersonSilhouette position={personPos} lean={lean} armRaise={armRaise} facing={0.05} />

				<BicycleWheel position={wheelPos} rotation={wheelRotation} spin={spin} radius={1.15} />

				{frame >= sidewaysPull.from && frame < freezeVectorLabel.from + 20 && (
					<CurvedArrow3D
						center={[personPos[0] - 0.3, 1.4, personPos[2] + 0.3]}
						radius={1.0}
						startAngle={Math.PI * 0.15}
						endAngle={Math.PI * 0.95}
						axis="y"
						color="#c07bff"
						progress={interpolate(frame, [sidewaysPull.from, sidewaysPull.from + 30], [0, 1], clampOpts)}
					/>
				)}

				{isFrozen && (
					<Arrow3D
						origin={[wheelPos[0] - axleDir.x * 1.4, wheelPos[1] - axleDir.y * 1.4, wheelPos[2] - axleDir.z * 1.4]}
						direction={[axleDir.x, axleDir.y, axleDir.z]}
						length={2.8}
						color="#f4d35e"
						shaftRadius={0.045}
						headSize={0.22}
					/>
				)}
			</ThreeCanvas>

			{frame < pushIn.to + 8 && (
				<Label text="Now Watch This" localFrame={frame} inAt={0} top="10%" color="#ffffff" fontSize={36} />
			)}
			{isFrozen && (
				<Label
					text="Angular Momentum"
					localFrame={frame}
					inAt={freezeVectorLabel.from + 4}
					top="10%"
					color="#c07bff"
					fontSize={44}
				/>
			)}
		</>
	);
};

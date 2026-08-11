import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, NEWTON_BEATS} from '../timing';
import {Backdrop} from '../components/Backdrop';
import {SceneLighting} from '../components/SceneLighting';
import {CameraRig} from '../components/CameraRig';
import {MetallicSphere} from '../components/MetallicSphere';
import {Floor} from '../components/Floor';
import {Arrow3D} from '../components/Arrow3D';
import {Label} from '../components/Label';

const BALL_RADIUS = 0.46;
const BALL_REST_X = 0;
const STRIKER_START_X = -3.3;
const IMPACT_X = -0.85;
const BALL_FINAL_X = 2.6;

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// SFX PLACEHOLDER: sharp "clack" the instant the striker sphere hits the resting ball.

export const NewtonFirstLawAct: React.FC = () => {
	const frame = useCurrentFrame();
	const {smashCutAtRest, forceStrike, ballMoves, freezeDiagram} = NEWTON_BEATS;

	// Striker approaches during the first ~65% of forceStrike, impact locked at ~65%.
	const strikeApproachEnd = forceStrike.from + Math.round((forceStrike.to - forceStrike.from) * 0.65);
	const impactFrame = strikeApproachEnd;

	let strikerX = STRIKER_START_X;
	let ballX = BALL_REST_X;
	let showForceArrow = false;

	if (frame < forceStrike.from) {
		strikerX = STRIKER_START_X;
		ballX = BALL_REST_X;
	} else if (frame < strikeApproachEnd) {
		const p = interpolate(frame, [forceStrike.from, strikeApproachEnd], [0, 1], {
			...clampOpts,
			easing: Easing.in(Easing.quad),
		});
		strikerX = interpolate(p, [0, 1], [STRIKER_START_X, IMPACT_X]);
		ballX = BALL_REST_X;
	} else if (frame < ballMoves.to) {
		strikerX = IMPACT_X;
		showForceArrow = frame < impactFrame + 14;
		const p = interpolate(frame, [strikeApproachEnd, ballMoves.to], [0, 1], {
			...clampOpts,
			easing: Easing.out(Easing.cubic),
		});
		ballX = interpolate(p, [0, 1], [BALL_REST_X, BALL_FINAL_X]);
	} else {
		strikerX = IMPACT_X;
		ballX = BALL_FINAL_X;
	}

	const isDiagram = frame >= freezeDiagram.from;

	// ---- Camera ----
	let camPos: [number, number, number] = [0, 1.8, 4.2];
	let camLookAt: [number, number, number] = [BALL_REST_X, BALL_RADIUS, 0];
	let fov = 40;

	if (frame < smashCutAtRest.to) {
		// Locked symmetrical shot, very slow push-in.
		const p = interpolate(frame, [smashCutAtRest.from, smashCutAtRest.to], [0, 1], clampOpts);
		camPos = [0, interpolate(p, [0, 1], [1.7, 1.45]), interpolate(p, [0, 1], [4.6, 3.6])];
		camLookAt = [BALL_REST_X, BALL_RADIUS, 0];
	} else if (frame < ballMoves.to) {
		// Side-on high-speed camera following the collision / fast tracking on the moving ball.
		const trackX = frame < strikeApproachEnd ? strikerX : ballX;
		camPos = [trackX + 0.2, 1.1, 2.6];
		camLookAt = [trackX + 0.6, BALL_RADIUS, 0];
		fov = 44;
	} else {
		// Slow pull-back revealing the complete before/after diagram.
		const p = interpolate(frame, [freezeDiagram.from, freezeDiagram.to], [0, 1], clampOpts);
		camPos = [
			interpolate(p, [0, 1], [ballX + 0.2, 0.4]),
			interpolate(p, [0, 1], [1.2, 2.3]),
			interpolate(p, [0, 1], [2.6, 6.2]),
		];
		camLookAt = [0.6, 0.6, 0];
		fov = interpolate(p, [0, 1], [42, 46]);
	}

	return (
		<>
			<ThreeCanvas width={WIDTH} height={HEIGHT}>
				<Backdrop />
				<SceneLighting focalPosition={[ballX, BALL_RADIUS, 0]} focalColor="#5fe3a3" focalIntensity={1.8} />
				<CameraRig position={camPos} lookAt={camLookAt} fov={fov} />

				<Floor y={0} />
				<MetallicSphere radius={BALL_RADIUS} position={[ballX, BALL_RADIUS, 0]} />
				<MetallicSphere radius={BALL_RADIUS * 0.8} position={[strikerX, BALL_RADIUS * 0.8, 0]} color="#9aa0ab" />

				{showForceArrow && (
					<Arrow3D
						origin={[IMPACT_X - 1.1, BALL_RADIUS, 0]}
						direction={[1, 0, 0]}
						length={1.0}
						color="#5fe3a3"
					/>
				)}
			</ThreeCanvas>

			{frame >= smashCutAtRest.from + 14 && frame < forceStrike.from && (
				<Label text="At Rest" localFrame={frame} inAt={smashCutAtRest.from + 14} top="14%" color="#ffffff" fontSize={34} />
			)}

			{isDiagram && (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						paddingBottom: '10%',
						gap: 18,
						opacity: interpolate(frame, [freezeDiagram.from, freezeDiagram.from + 10], [0, 1], clampOpts),
					}}
				>
					<div
						style={{
							alignSelf: 'flex-start',
							marginLeft: '8%',
							fontFamily: '"Helvetica Neue", Arial, sans-serif',
							fontWeight: 800,
							fontSize: 26,
							letterSpacing: 1,
							color: '#5fe3a3',
							textShadow: '0 2px 14px rgba(0,0,0,0.8)',
						}}
					>
						NO NET FORCE → SAME MOTION
					</div>
					<div
						style={{
							alignSelf: 'flex-end',
							marginRight: '8%',
							fontFamily: '"Helvetica Neue", Arial, sans-serif',
							fontWeight: 800,
							fontSize: 26,
							letterSpacing: 1,
							color: '#ff6a6a',
							textShadow: '0 2px 14px rgba(0,0,0,0.8)',
						}}
					>
						FORCE → CHANGE IN MOTION
					</div>
					<div
						style={{
							alignSelf: 'center',
							fontFamily: '"Helvetica Neue", Arial, sans-serif',
							fontWeight: 900,
							fontSize: 40,
							letterSpacing: 2,
							color: '#ffffff',
							textShadow: '0 2px 18px rgba(0,0,0,0.85)',
							marginTop: 8,
						}}
					>
						NEWTON&apos;S FIRST LAW
					</div>
				</div>
			)}
		</>
	);
};

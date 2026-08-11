import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Backdrop, LightingRig} from './Lighting';
import {GiantBall, TinyBall} from './Balls';
import {CameraRig} from './CameraRig';
import {MotionTrail} from './MotionTrail';
import {MomentumArrow} from './MomentumArrow';
import {computeScene} from '../scenes/sceneState';

export const Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const state = computeScene(frame);

	// A spotlight quietly follows whichever ball currently has the glow
	// (i.e. the "hero" of the beat) for extra per-shot emphasis.
	const emphasis: [number, number, number] = [
		state.tiny.pos[0] + 1.5,
		state.tiny.pos[1] + 3,
		state.tiny.pos[2] + 3,
	];

	return (
		<>
			<LightingRig emphasis={emphasis} />
			<Backdrop />
			<CameraRig pose={state.camera} />

			{state.giant.visible !== false ? (
				<GiantBall
					position={state.giant.pos}
					rotationSeed={state.giant.seed ?? 0}
					frozen={state.giant.frozen}
					scaleMul={state.giant.scaleMul}
				/>
			) : null}

			{state.tiny.visible !== false ? (
				<TinyBall
					position={state.tiny.pos}
					rotationSeed={state.tiny.seed ?? 3}
					frozen={state.tiny.frozen}
					glow={state.tiny.glow}
					scaleMul={state.tiny.scaleMul}
				/>
			) : null}

			{state.trails.map((trail) => (
				<MotionTrail
					key={trail.id}
					from={trail.from}
					to={trail.to}
					color={trail.color}
					opacity={trail.opacity}
				/>
			))}

			{state.arrows.map((arrow) => (
				<MomentumArrow
					key={arrow.id}
					origin={arrow.origin}
					direction={arrow.direction}
					length={arrow.length}
					color={arrow.color}
					opacity={arrow.opacity}
					pulse={arrow.pulse}
					seed={frame}
				/>
			))}

			{state.ghosts.map((ghost) => (
				<mesh key={ghost.id} position={ghost.pos}>
					<sphereGeometry args={[ghost.radius, 24, 24]} />
					<meshStandardMaterial
						color={ghost.color ?? '#1a1d27'}
						metalness={0.8}
						roughness={0.4}
						transparent
						opacity={ghost.opacity}
					/>
				</mesh>
			))}
		</>
	);
};

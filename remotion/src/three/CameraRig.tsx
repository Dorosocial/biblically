import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {getSceneState} from '../lib/sceneState';

/**
 * Drives the single persistent camera for the whole film from the
 * frame-indexed SceneState keyframe track (see lib/sceneState.ts). Mutating
 * the camera imperatively (rather than re-mounting <PerspectiveCamera/>)
 * keeps the camera instance stable across the whole 66.8s take.
 */
export const CameraRig: React.FC = () => {
	const {camera} = useThree();
	const frame = useCurrentFrame();
	const scene = getSceneState(frame);

	useLayoutEffect(() => {
		camera.position.set(scene.camPos[0], scene.camPos[1], scene.camPos[2]);
		camera.lookAt(scene.camLook[0], scene.camLook[1], scene.camLook[2]);
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.fov = scene.camFov;
			camera.near = 0.1;
			camera.far = 300;
			camera.updateProjectionMatrix();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [camera, frame]);

	return null;
};

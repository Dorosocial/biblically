// Imperatively drives the R3F camera from sceneState's per-frame camera
// description. Runs in a layout effect so the camera is positioned before
// @remotion/three's FrameRenderer captures the frame — same pattern Remotion
// documents for driving three.js objects from `useCurrentFrame()`.
import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {V3} from './math';

export const CameraRig: React.FC<{
	position: V3;
	lookAt: V3;
	fov?: number;
}> = ({position, lookAt, fov = 55}) => {
	const {camera} = useThree();

	useLayoutEffect(() => {
		camera.position.set(...position);
		camera.up.set(0, 1, 0);
		camera.lookAt(new THREE.Vector3(...lookAt));
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.fov = fov;
			camera.updateProjectionMatrix();
		}
	}, [camera, position[0], position[1], position[2], lookAt[0], lookAt[1], lookAt[2], fov]);

	return null;
};

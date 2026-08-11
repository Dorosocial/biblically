import React, {useLayoutEffect, useRef} from 'react';
import {PerspectiveCamera} from '@react-three/drei';
import * as THREE from 'three';
import {WIDTH, HEIGHT} from '../constants';

export type CameraPose = {
	position: [number, number, number];
	lookAt: [number, number, number];
	fov?: number;
};

const ASPECT = WIDTH / HEIGHT; // 9:16 portrait, ~0.5625

// Every `fov` authored in scenes/sceneState.ts is chosen by eye against how
// much *horizontal* room a shot needs (objects are staged with x-offsets),
// which is the natural way to think about framing. But three's
// PerspectiveCamera.fov is the *vertical* field of view, and on a 9:16
// portrait canvas the horizontal FOV is always much narrower than the
// vertical one (horizontalFov = 2*atan(tan(verticalFov/2) * aspect)) — so a
// value tuned by eye for "how wide" would clip everything horizontally if
// passed straight through. Converting the other way here keeps every shot's
// authored fov meaning "roughly this much horizontal coverage".
const horizontalToVerticalFov = (hFovDeg: number) => {
	const hFovRad = (hFovDeg * Math.PI) / 180;
	const vFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / ASPECT);
	return (vFovRad * 180) / Math.PI;
};

// Deterministic per-frame camera: position/lookAt are fully computed upstream
// (in the shot timeline) from the current frame, so this component just
// applies them. No physics/inertia here — every camera move is authored.
export const CameraRig: React.FC<{pose: CameraPose}> = ({pose}) => {
	const ref = useRef<THREE.PerspectiveCamera>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		ref.current.lookAt(new THREE.Vector3(...pose.lookAt));
		ref.current.updateProjectionMatrix();
	});

	return (
		<PerspectiveCamera
			ref={ref}
			makeDefault
			position={pose.position}
			fov={horizontalToVerticalFov(pose.fov ?? 42)}
			near={0.1}
			far={200}
		/>
	);
};

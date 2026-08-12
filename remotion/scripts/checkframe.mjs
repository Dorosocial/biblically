import * as THREE from 'three';
import {getSceneState} from '../src/particle/sceneState.ts';

const frame = Number(process.argv[2] || 1650);
const s = getSceneState(frame);
const cam = new THREE.PerspectiveCamera(s.camFov, 1080 / 1920, 0.05, 300);
cam.position.set(...s.camPos);
cam.lookAt(...s.camLook);
cam.updateProjectionMatrix();
cam.updateMatrixWorld();

const check = (name, pos) => {
	const v = new THREE.Vector3(...pos).project(cam);
	const visible = Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z <= 1;
	console.log(name, 'ndc=', v.x.toFixed(2), v.y.toFixed(2), v.z.toFixed(2), visible ? 'VISIBLE' : 'OFFSCREEN');
};
check('ball', s.ballPos);
check('ghost', [1.6, 0, 3]);
console.log('camPos', s.camPos, 'camLook', s.camLook, 'fov', s.camFov);

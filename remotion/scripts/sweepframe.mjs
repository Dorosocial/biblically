import * as THREE from 'three';
import {getSceneState} from '../src/particle/sceneState.ts';
import {SHOTS, secToFrames} from '../src/particle/timing.ts';

const project = (cam, pos) => new THREE.Vector3(...pos).project(cam);
const visible = (v) => Math.abs(v.x) <= 1.05 && Math.abs(v.y) <= 1.05 && v.z <= 1;

for (const shot of SHOTS) {
	const startF = secToFrames(shot.start);
	const endF = secToFrames(shot.end);
	const mid = Math.round((startF + endF) / 2);
	for (const frame of [startF + 2, mid, endF - 2]) {
		const s = getSceneState(frame);
		const cam = new THREE.PerspectiveCamera(s.camFov, 1080 / 1920, 0.05, 300);
		cam.position.set(...s.camPos);
		cam.lookAt(...s.camLook);
		cam.updateProjectionMatrix();
		cam.updateMatrixWorld();

		const issues = [];
		if (s.particleOpacity > 0.3) {
			const v = project(cam, s.particlePos);
			if (!visible(v)) issues.push(`particle offscreen ndc=(${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)})`);
		}
		if (s.ballOpacity > 0.3) {
			const v = project(cam, s.ballPos);
			if (!visible(v)) issues.push(`ball offscreen ndc=(${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)})`);
		}
		if (s.ghostOpacity > 0.3) {
			const v = project(cam, [1.6, 0, 3]);
			if (!visible(v)) issues.push(`ghost offscreen ndc=(${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)})`);
		}
		if (issues.length) {
			console.log(`${shot.id} @f${frame} (${(frame / 30).toFixed(2)}s):`, issues.join('; '));
		}
	}
}
console.log('sweep done');

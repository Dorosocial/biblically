import * as THREE from 'three';
import {getCameraState} from '../camera/cameraTimeline';
import {WIDTH, HEIGHT} from '../timing';

/**
 * Projects a world-space point to 2D screen pixels using the SAME camera
 * state the R3F scene uses for this frame — so HTML label overlays can
 * track 3D objects (the "PROTON" tag beside the dot, the scale marker,
 * etc.) precisely instead of guessing a fixed screen position.
 */
export const projectToScreen = (
  frame: number,
  point: [number, number, number],
): {x: number; y: number; behindCamera: boolean} => {
  const camState = getCameraState(frame);
  const camera = new THREE.PerspectiveCamera(camState.fov, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.copy(camState.position);
  camera.up.set(0, 1, 0);
  camera.lookAt(camState.lookAt);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();

  const p = new THREE.Vector3(...point).project(camera);
  return {
    x: (p.x * 0.5 + 0.5) * WIDTH,
    y: (1 - (p.y * 0.5 + 0.5)) * HEIGHT,
    behindCamera: p.z > 1,
  };
};

import React from 'react';
import {useThree} from '@react-three/fiber';
import {getCameraState} from './cameraTimeline';

/** Same imperative useThree-mutation pattern as every other video's
 * CameraRig — a declarative <PerspectiveCamera> doesn't reliably register
 * before a standalone/still frame capture during `remotion render`. */
export const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const state = getCameraState(frame);

  camera.position.set(state.position.x, state.position.y, state.position.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(state.lookAt.x, state.lookAt.y, state.lookAt.z);

  if ('fov' in camera) {
    const cam = camera as any;
    cam.fov = state.fov;
    cam.aspect = size.width / size.height;
    // World scale here ranges from a sub-unit point of light out to a
    // massive-zoom-out distance of ~100 — near/far set with margin either side.
    cam.near = 0.01;
    cam.far = 500;
    cam.updateProjectionMatrix();
  }

  return null;
};

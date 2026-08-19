import React from 'react';
import {useThree} from '@react-three/fiber';
import {getCameraState} from './cameraTimeline';

/**
 * Drives the scene's default camera directly, recomputed from `frame`
 * every render (imperative `useThree` mutation, not a declarative
 * `<PerspectiveCamera makeDefault>` — that doesn't reliably register
 * before a standalone/still frame capture during `remotion render`).
 */
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
    // Shots E/F push the camera to within centimeters of the glass — the
    // default near plane (0.1) would clip that away to nothing, so it's
    // set explicitly small here rather than relying on the r3f default.
    cam.near = 0.001;
    cam.far = 100;
    cam.updateProjectionMatrix();
  }

  return null;
};

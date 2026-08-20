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
    // World scale here ranges from the horizon (radius 1) out to the
    // starfield shell (radius ~45) — near=0.02/far=300 covers the closest
    // planned shot (the final horizon push-in, which deliberately stops
    // short of the surface, see cameraTimeline.ts) with margin either way.
    cam.near = 0.02;
    cam.far = 300;
    cam.updateProjectionMatrix();
  }

  return null;
};

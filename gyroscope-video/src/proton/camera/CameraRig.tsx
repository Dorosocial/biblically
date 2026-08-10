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
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const state = getCameraState(frame);

  camera.position.set(state.position.x, state.position.y, state.position.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(state.lookAt.x, state.lookAt.y, state.lookAt.z);

  if ('fov' in camera) {
    (camera as any).fov = state.fov;
    (camera as any).aspect = size.width / size.height;
    (camera as any).updateProjectionMatrix();
  }

  return null;
};

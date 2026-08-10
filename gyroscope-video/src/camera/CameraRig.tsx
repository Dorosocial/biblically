import React from 'react';
import {useThree} from '@react-three/fiber';
import {getCameraState} from './cameraTimeline';

/**
 * Drives the scene's default camera directly. Position/lookAt/fov are
 * recomputed from `frame` every render and applied synchronously to the
 * camera object here (rather than relying on a second declarative
 * <PerspectiveCamera makeDefault> being registered via an effect) — this
 * keeps it robust for standalone/still frame captures during
 * `remotion render`, where there's no guarantee of an extra effect tick
 * before the frame is grabbed.
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

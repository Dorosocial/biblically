import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {PerspectiveCamera} from '@react-three/drei';

export interface CameraPose {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

// Drives the default camera's position/fov via drei's PerspectiveCamera, and
// applies lookAt imperatively every render (every Remotion frame) so the
// camera always faces the pose's target — R3F/Remotion re-renders this
// component fresh for every exported frame, so a plain effect is enough,
// no need for useFrame ticking.
export const CameraRig: React.FC<{pose: CameraPose}> = ({pose}) => {
  const {camera} = useThree();

  useLayoutEffect(() => {
    camera.lookAt(...pose.lookAt);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={pose.position}
      fov={pose.fov}
      near={0.1}
      far={500}
    />
  );
};

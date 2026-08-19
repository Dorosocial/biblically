import React from 'react';
import {getSceneState} from '../physics';
import {Phone} from './Phone';
import {Hand} from './Hand';
import {Lighting} from './Lighting';
import {CameraRig} from '../camera/CameraRig';

export const Scene: React.FC<{frame: number}> = ({frame}) => {
  const s = getSceneState(frame);

  return (
    <>
      <Lighting focus={s.focusPoint} focusColor={s.focusColor} focusIntensity={s.focusIntensity} fillIntensity={s.fillIntensity} />
      <CameraRig frame={frame} />

      <Phone state={s.phone} glintIntensity={s.glintIntensity} />
      <Hand state={s.hand} curl={s.handCurl} press={s.handPress} />
    </>
  );
};

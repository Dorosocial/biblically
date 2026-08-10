import React from 'react';
import * as THREE from 'three';
import {CUE} from '../timing';
import {
  WHEEL_RADIUS,
  heroDir,
  heroSpinAngle,
  comparisonState,
  fallGhosts,
  getArrows,
  momentumSweepArc,
  spinArcVisible,
  rimTrailPoints,
  precessionConeTrail,
  sidewaysSweepTrail,
} from '../physics';
import {Wheel} from './Wheel';
import {Arrow} from './Arrow';
import {SpinArc} from './SpinArc';
import {TrailLine} from './TrailLine';
import {Lighting} from './Lighting';
import {CameraRig} from '../camera/CameraRig';

/** Small arrowhead cone dropped at the end of a polyline, so trail-style curves read as arrows. */
const TipCone: React.FC<{points: THREE.Vector3[]; color: string; opacity: number}> = ({points, color, opacity}) => {
  if (points.length < 2) return null;
  const tip = points[points.length - 1];
  const prev = points[points.length - 2];
  const tangent = tip.clone().sub(prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  return (
    <mesh position={tip} quaternion={quat}>
      <coneGeometry args={[0.06, 0.16, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

export const Scene: React.FC<{frame: number}> = ({frame}) => {
  const heroVisible = !(frame >= CUE.whatIfFaster && frame < CUE.anotherCase);
  const dir = heroDir(frame);
  const spin = heroSpinAngle(frame);
  const cmp = comparisonState(frame);
  const arrows = getArrows(frame);
  const ghosts = fallGhosts(frame);
  const sweepArc = momentumSweepArc(frame);

  return (
    <>
      <Lighting />
      <CameraRig frame={frame} />

      {heroVisible && <Wheel dir={dir} spinAngle={spin} radius={WHEEL_RADIUS} />}

      {cmp.slow.visible && (
        <Wheel position={cmp.slow.position} dir={cmp.slow.dir} spinAngle={cmp.slow.spinAngle} radius={cmp.slow.radius} />
      )}
      {cmp.fast.visible && (
        <Wheel
          position={cmp.fast.position}
          dir={cmp.fast.dir}
          spinAngle={cmp.fast.spinAngle}
          radius={cmp.fast.radius}
          color="#fff2d2"
        />
      )}

      {/* Ghost wheels: translucent "naive expectation" copies, never the real object. */}
      {ghosts.map((g) => (
        <Wheel key={g.key} dir={g.dir} spinAngle={0} radius={WHEEL_RADIUS} ghost opacity={g.opacity} color="#93a6c4" />
      ))}

      {/* All straight vector arrows (push force, angular momentum, torque, ghosts). */}
      {arrows.map((a) => (
        <Arrow
          key={a.key}
          origin={a.origin}
          dir={a.dir}
          length={a.length}
          radius={a.radius}
          color={a.color}
          opacity={a.opacity}
          emissive={a.emissive}
          emissiveIntensity={a.emissiveIntensity}
        />
      ))}

      {/* Curved arrow showing the angular-momentum vector sweeping to its new direction. */}
      {sweepArc && (
        <>
          {/* SFX PLACEHOLDER: vector sweep — sweeping whoosh tracking this curve */}
          <TrailLine points={sweepArc} color="#ffcf5c" opacity={0.85} lineWidth={3} />
          <TipCone points={sweepArc} color="#ffcf5c" opacity={0.85} />
        </>
      )}

      {/* Glowing angular-velocity arc hugging the rim. */}
      {spinArcVisible(frame) && heroVisible && (
        <SpinArc axleDir={dir} spinAngle={spin} radius={WHEEL_RADIUS} />
      )}

      {/* Faint ambient spin trail, early shots only. */}
      {frame < CUE.tryTilt && (
        <TrailLine points={rimTrailPoints(frame)} color="#9fd3ff" opacity={0.25} lineWidth={2} />
      )}

      {/* Bright trajectory trail behind the KEY sideways-sweep shot. */}
      {frame >= CUE.turnsSideways && frame < CUE.whatIfFaster && (
        <TrailLine points={sidewaysSweepTrail(frame)} color="#ffe27a" opacity={0.9} lineWidth={4} />
      )}

      {/* Cone-shaped precession trail, building from the moment precession begins. */}
      {frame >= CUE.pushesBack && (
        // SFX PLACEHOLDER: precession reveal — cinematic swell resolves as this cone fully reveals in the final shot
        <TrailLine points={precessionConeTrail(frame)} color="#7fd0ff" opacity={0.5} lineWidth={2} />
      )}
    </>
  );
};

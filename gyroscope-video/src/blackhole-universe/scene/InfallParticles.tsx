import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from '../../shared/random';

/**
 * A handful of bright points spiraling inward toward the origin, standing
 * in for "stars/gas curving around it, visibly lit trails" (beat 8) — each
 * particle's radius shrinks and angle winds up as `progress` advances from
 * 0 to 1, computed directly from `progress` (not accumulated over frames),
 * so it stays a pure function like everything else in this project. A
 * short trailing arc (a handful of slightly-lagged points, decreasing
 * opacity) sells the "trail" without needing actual line geometry per
 * particle.
 */
export const InfallParticles: React.FC<{
  progress: number; // 0 = particles at outer radius, 1 = fully spiraled into the horizon
  opacity?: number;
  count?: number;
  seed?: number;
  color?: string;
}> = ({progress, opacity = 1, count = 10, seed = 77, color = '#fff1cf'}) => {
  const seeds = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({length: count}, () => ({
      angle0: rand() * Math.PI * 2,
      spinSpeed: 2.5 + rand() * 2.5,
      rStart: 5 + rand() * 3,
      tilt: (rand() - 0.5) * 0.6,
      phase: rand() * 0.4, // stagger so they don't all arrive at once
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  if (opacity <= 0.001) return null;

  const TRAIL_STEPS = 4;

  return (
    <group>
      {seeds.map((p, i) => {
        const localT = THREE.MathUtils.clamp(progress - p.phase, 0, 1);
        return Array.from({length: TRAIL_STEPS}).map((_, trailI) => {
          const trailT = Math.max(0, localT - trailI * 0.03);
          const r = THREE.MathUtils.lerp(p.rStart, 0.35, trailT);
          const angle = p.angle0 + trailT * p.spinSpeed * Math.PI * 2;
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          const y = p.tilt * r * 0.3;
          const fade = 1 - trailI / TRAIL_STEPS;
          return (
            <mesh key={`${i}-${trailI}`} position={[x, y, z]}>
              <sphereGeometry args={[0.06, 12, 8]} />
              {/* BUG FOUND + FIXED: this material used to sit at ~0.3-0.7
                  opacity by design ("fade in as it falls"), but additive
                  blending against a pure-black background LITERALLY ADDS
                  color*opacity to nothing — a bright warm color at
                  mid-opacity doesn't look like a dim warm glow, it looks
                  like a flat, desaturated grey-brown pebble (confirmed by
                  direct still-frame inspection: the particles read as inert
                  rocks, not "visibly lit trails"). Fixed by keeping the
                  material itself near-full brightness/opacity at all times
                  and using `fade` (the trail falloff) as the only opacity
                  driver — the "fade in as it falls" idea is instead carried
                  by TRAIL LENGTH (localT) implicitly, via how far into its
                  spiral each particle already is. */}
              <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity * fade}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        });
      })}
    </group>
  );
};

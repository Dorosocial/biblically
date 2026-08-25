import React from 'react';

/** A simple procedural hand — a palm box plus four finger capsules curling
 * over the top — standing in for "a giant hand lifts the paper" (beat 63,
 * the 2D-creature analogy). Deliberately abstract/silhouette-readable
 * rather than anatomically detailed. */
export const Hand: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1}) => {
  if (opacity <= 0.001) return null;
  const mat = <meshStandardMaterial color="#d9c3a8" roughness={0.6} transparent opacity={opacity} />;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* palm */}
      <mesh>
        <boxGeometry args={[1.2, 0.35, 1.0]} />
        {mat}
      </mesh>
      {/* fingers, curling down toward whatever's being pinched below */}
      {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
        <mesh key={i} position={[x, -0.35, 0.55]} rotation={[0.9, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
          {mat}
        </mesh>
      ))}
      {/* thumb, opposing */}
      <mesh position={[-0.7, -0.15, -0.1]} rotation={[0.3, 0, 1.1]}>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        {mat}
      </mesh>
    </group>
  );
};

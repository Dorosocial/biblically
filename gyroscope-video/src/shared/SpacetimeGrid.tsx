import React, {useMemo} from 'react';
import {Line} from '@react-three/drei';

/**
 * Reusable "fabric of spacetime" grid — a wireframe plane that dips toward
 * a mass point, the standard rubber-sheet gravity-well visual. Built fresh
 * each render as plain line-strips (a pure function of its props, no
 * mutated/cached geometry), since `warpStrength` and `wellPosition` change
 * every frame during a dive/approach shot.
 */
const warpY = (
  x: number,
  z: number,
  warpStrength: number,
  well: [number, number],
  wellRadius: number,
  wellDepth: number,
): number => {
  const dx = x - well[0];
  const dz = z - well[1];
  const d2 = dx * dx + dz * dz;
  return (-warpStrength * wellDepth) / (1 + d2 / (wellRadius * wellRadius));
};

export const SpacetimeGrid: React.FC<{
  size?: number;
  divisions?: number;
  warpStrength?: number; // 0 = flat sheet, 1 = full dip
  wellPosition?: [number, number]; // x,z of the mass causing the dip
  wellRadius?: number; // falloff radius of the dip
  wellDepth?: number; // dip depth at full warpStrength
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  color?: string;
  lineWidth?: number;
}> = ({
  size = 20,
  divisions = 22,
  warpStrength = 0,
  wellPosition = [0, 0],
  wellRadius = 3,
  wellDepth = 3,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  opacity = 1,
  color = '#3d6fbf',
  lineWidth = 1,
}) => {
  const half = size / 2;
  const {rows, cols} = useMemo(() => {
    const rowsOut: [number, number, number][][] = [];
    for (let iz = 0; iz <= divisions; iz++) {
      const z = -half + (iz / divisions) * size;
      const row: [number, number, number][] = [];
      for (let ix = 0; ix <= divisions; ix++) {
        const x = -half + (ix / divisions) * size;
        row.push([x, warpY(x, z, warpStrength, wellPosition, wellRadius, wellDepth), z]);
      }
      rowsOut.push(row);
    }
    const colsOut: [number, number, number][][] = [];
    for (let ix = 0; ix <= divisions; ix++) {
      const x = -half + (ix / divisions) * size;
      const col: [number, number, number][] = [];
      for (let iz = 0; iz <= divisions; iz++) {
        const z = -half + (iz / divisions) * size;
        col.push([x, warpY(x, z, warpStrength, wellPosition, wellRadius, wellDepth), z]);
      }
      colsOut.push(col);
    }
    return {rows: rowsOut, cols: colsOut};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, divisions, warpStrength, wellPosition[0], wellPosition[1], wellRadius, wellDepth, half]);

  if (opacity <= 0.001) return null;

  return (
    <group position={position} rotation={rotation}>
      {rows.map((row, i) => (
        <Line key={`r${i}`} points={row} color={color} transparent opacity={opacity * 0.75} lineWidth={lineWidth} />
      ))}
      {cols.map((col, i) => (
        <Line key={`c${i}`} points={col} color={color} transparent opacity={opacity * 0.75} lineWidth={lineWidth} />
      ))}
    </group>
  );
};

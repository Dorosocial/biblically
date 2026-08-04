import React from "react";
import { Composition } from "remotion";
import { NaosWireframe } from "./NaosWireframe";
import { DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT } from "./data/beatTimings";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="NaosWireframe"
        component={NaosWireframe}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

import React from "react";
import { Composition } from "remotion";
import { Segment1ColdOpen } from "./long-form/worst-eras/segment-1-cold-open/Segment1ColdOpen";
import {
  COMPOSITION_ID,
  DURATION_IN_FRAMES,
  FPS,
  HEIGHT,
  WIDTH,
} from "./long-form/worst-eras/segment-1-cold-open/constants";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID}
        component={Segment1ColdOpen}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

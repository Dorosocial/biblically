import { Composition } from "remotion";
import { WomanBendingScene } from "./WomanBendingScene";

const FPS = 30;
const DURATION_IN_SECONDS = 5;

export const MyComposition = () => {
  return (
    <Composition
      id="WomanBending"
      component={WomanBendingScene}
      durationInFrames={DURATION_IN_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

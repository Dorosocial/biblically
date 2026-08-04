import raw from "../../public/watch-and-pray/data/wp-beat-timings.json";

export interface Beat {
  beat: number;
  label: string;
  text: string;
  start_seconds: number;
  end_seconds: number;
  start_frame: number;
  end_frame: number;
  duration_frames: number;
}

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 11274;
export const AUDIO_SRC = "watch-and-pray/assets/audio/wp-full-narration.mp3";

export const BEATS: Beat[] = raw.beats as Beat[];

if (raw.fps !== FPS) {
  throw new Error(`beat timings fps ${raw.fps} does not match composition fps ${FPS}`);
}
if (raw.audioDurationFrames !== DURATION_IN_FRAMES) {
  throw new Error(
    `beat timings audioDurationFrames ${raw.audioDurationFrames} does not match DURATION_IN_FRAMES ${DURATION_IN_FRAMES}`
  );
}

export const getBeat = (beatNumber: number): Beat => {
  const b = BEATS.find((x) => x.beat === beatNumber);
  if (!b) {
    throw new Error(`no beat ${beatNumber}`);
  }
  return b;
};

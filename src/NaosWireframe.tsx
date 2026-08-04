import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE } from "./data/timeline";
import { AUDIO_SRC } from "./data/beatTimings";
import { WireframeImage } from "./components/WireframeImage";
import { WireframeGraphic } from "./components/graphics/WireframeGraphic";

export const NaosWireframe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {TIMELINE.map((layer) => {
        if (layer.kind === "figure") {
          return (
            <Sequence
              key={`${layer.beat}-${layer.id}-${layer.from}`}
              from={layer.from}
              durationInFrames={layer.duration}
              layout="none"
            >
              <WireframeImage
                file={layer.file}
                variant={layer.variant}
                seed={`${layer.id}-${layer.from}`}
                sideBySide={layer.sideBySide}
              />
            </Sequence>
          );
        }

        if (layer.kind === "overlay") {
          return (
            <Sequence
              key={`${layer.beat}-${layer.id}-${layer.from}`}
              from={layer.from}
              durationInFrames={layer.duration}
              layout="none"
            >
              <WireframeGraphic
                item={layer.item}
                variant={layer.variant}
                seed={`${layer.id}-${layer.from}`}
                mode="overlay"
              />
            </Sequence>
          );
        }

        // cutaway
        return (
          <Sequence
            key={`${layer.beat}-${layer.id}-${layer.from}`}
            from={layer.from}
            durationInFrames={layer.duration}
            layout="none"
          >
            <WireframeGraphic
              item={layer.item}
              variant={layer.variant}
              seed={`${layer.id}-${layer.from}`}
              mode="cutaway"
            />
          </Sequence>
        );
      })}

      <Audio src={staticFile(AUDIO_SRC)} />
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BACKGROUND = "#C9A896";
const FIGURE = "#4A1F1F";
const GOLD = "#C9A227";

// Local figure is authored in a 660x900 viewBox, then scaled/positioned onto
// the 1080x1920 canvas. She is bent forward from the hip, head lowered,
// one arm reaching down with a bent elbow -- a robed woman bending toward
// the ground.

// Flared skirt/legs, from the hip band down to a wide hem.
const SKIRT_PATH =
  "M270,400 " +
  "C258,500 245,590 238,670 " +
  "C230,755 216,818 195,860 " +
  "L405,860 " +
  "C384,818 370,755 362,670 " +
  "C355,590 342,500 330,400 " +
  "Z";

// Torso bent forward from the hip: flat-ish front (chest, facing the
// ground) and a single smooth arched back edge that curves up and over.
const TORSO_PATH =
  "M301.6,525 " +
  "C400,522 470,512 545.3,484.4 " +
  "L544.3,458.4 " +
  "C470,410 380,400 298.4,435.1 " +
  "Z";

// Arm reaching down from the shoulder with a bent elbow toward the ground.
const ARM_PATH = "M470,500 Q540,660 480,820";

const HEAD_CX = 564.8;
const HEAD_CY = 470.7;
const HEAD_R = 44;

const GOLD_LINE = { x1: 240, y1: 600, x2: 370, y2: 760 };

const GrainOverlay: React.FC<{ frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
}) => {
  const seed = useMemo(() => ((frame % 6) * 17 + 3) % 97, [frame]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="filmNoise" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 0"
          />
        </filter>
        <pattern
          id="halftoneDots"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(24)"
        >
          <circle cx="1.6" cy="1.6" r="1.15" fill="#1a1010" />
        </pattern>
        <pattern
          id="halftoneDotsSparse"
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-16)"
        >
          <circle cx="3" cy="3" r="1.4" fill="#fff6ec" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" filter="url(#filmNoise)" opacity={0.22} />
      <rect width="100%" height="100%" fill="url(#halftoneDots)" opacity={0.07} />
      <rect width="100%" height="100%" fill="url(#halftoneDotsSparse)" opacity={0.045} />
    </svg>
  );
};

export const WomanBendingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames - 1], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bounding box of the actual silhouette content within the local
  // viewBox (not the full viewBox), used to center and ground the figure.
  const contentMinX = 195;
  const contentMaxX = 608.8;
  const contentBottomY = 860;
  const contentCenterX = (contentMinX + contentMaxX) / 2;
  const bottomMargin = 220;

  const figureScale = 1.8;
  const figureX = width / 2 - contentCenterX * figureScale;
  const figureY = height - bottomMargin - contentBottomY * figureScale;

  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <g transform={`translate(${figureX}, ${figureY}) scale(${figureScale})`}>
            <path
              d={ARM_PATH}
              stroke={FIGURE}
              strokeWidth={30}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d={SKIRT_PATH} fill={FIGURE} />
            <path d={TORSO_PATH} fill={FIGURE} />
            <circle cx={HEAD_CX} cy={HEAD_CY} r={HEAD_R} fill={FIGURE} />
            <line
              x1={GOLD_LINE.x1}
              y1={GOLD_LINE.y1}
              x2={GOLD_LINE.x2}
              y2={GOLD_LINE.y2}
              stroke={GOLD}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.92}
            />
          </g>
        </svg>
      </AbsoluteFill>

      <GrainOverlay frame={frame} width={width} height={height} />
    </AbsoluteFill>
  );
};

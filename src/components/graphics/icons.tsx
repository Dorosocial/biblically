import React from "react";

// Shared stroke styling so every icon matches the thin-white-line wireframe aesthetic.
export const STROKE = "#ffffff";
export const STROKE_WIDTH = 2.5;

export const iconProps = {
  fill: "none",
  stroke: STROKE,
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IconKind =
  | "ear"
  | "cloud"
  | "x"
  | "questionMark"
  | "speechBubble"
  | "temple"
  | "calendar"
  | "calendarOneDay"
  | "clock"
  | "compass"
  | "heart"
  | "smiley"
  | "hourglass"
  | "book"
  | "magnifyingGlass"
  | "cross"
  | "sun"
  | "veil"
  | "veilTorn"
  | "arrowUp"
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "checkmark"
  | "dot"
  | "pulsingRings"
  | "paperAirplane"
  | "mountain"
  | "city"
  | "wavyLine"
  | "star"
  | "box"
  | "nestedBox"
  | "brokenBox"
  | "lightBeam"
  | "dottedLine"
  | "rope";

// Every icon is drawn in a 100x100 local viewBox and scaled via the wrapping <g>/<svg>.
const paths: Record<IconKind, React.ReactNode> = {
  ear: (
    <path d="M55 20 C75 20 82 40 78 58 C75 72 62 78 55 72 C50 68 52 60 48 58 C40 54 38 42 45 32 C48 27 51 22 55 20 Z M55 45 C60 45 62 52 57 56" />
  ),
  cloud: (
    <path d="M25 62 C15 62 12 50 22 47 C20 36 32 28 42 33 C46 24 62 24 66 34 C78 32 84 44 78 52 C86 54 85 65 75 65 Z" />
  ),
  x: (
    <>
      <line x1="25" y1="25" x2="75" y2="75" />
      <line x1="75" y1="25" x2="25" y2="75" />
    </>
  ),
  questionMark: (
    <>
      <path d="M32 38 C32 22 68 22 68 38 C68 52 50 50 50 65" />
      <circle cx="50" cy="82" r="2.5" fill={STROKE} stroke="none" />
    </>
  ),
  speechBubble: (
    <path d="M15 20 H85 A5 5 0 0 1 90 25 V60 A5 5 0 0 1 85 65 H45 L30 80 V65 H15 A5 5 0 0 1 10 60 V25 A5 5 0 0 1 15 20 Z" />
  ),
  temple: (
    <>
      <line x1="15" y1="35" x2="15" y2="80" />
      <line x1="30" y1="35" x2="30" y2="80" />
      <line x1="50" y1="35" x2="50" y2="80" />
      <line x1="70" y1="35" x2="70" y2="80" />
      <line x1="85" y1="35" x2="85" y2="80" />
      <line x1="10" y1="80" x2="90" y2="80" />
      <path d="M8 35 L50 12 L92 35 Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="15" y="22" width="70" height="63" rx="3" />
      <line x1="15" y1="38" x2="85" y2="38" />
      <line x1="30" y1="14" x2="30" y2="26" />
      <line x1="70" y1="14" x2="70" y2="26" />
      <line x1="30" y1="50" x2="42" y2="50" />
      <line x1="58" y1="50" x2="70" y2="50" />
      <line x1="30" y1="65" x2="42" y2="65" />
      <line x1="58" y1="65" x2="70" y2="65" />
    </>
  ),
  calendarOneDay: (
    <>
      <rect x="15" y="22" width="70" height="63" rx="3" />
      <line x1="15" y1="38" x2="85" y2="38" />
      <line x1="30" y1="14" x2="30" y2="26" />
      <line x1="70" y1="14" x2="70" y2="26" />
      <circle cx="50" cy="62" r="12" />
    </>
  ),
  clock: (
    <>
      <circle cx="50" cy="50" r="35" />
      <line x1="50" y1="50" x2="50" y2="28" />
      <line x1="50" y1="50" x2="65" y2="58" />
    </>
  ),
  compass: (
    <>
      <circle cx="50" cy="50" r="35" />
      <path d="M50 25 L58 50 L50 75 L42 50 Z" />
      <line x1="50" y1="15" x2="50" y2="21" />
      <line x1="50" y1="79" x2="50" y2="85" />
    </>
  ),
  heart: (
    <path d="M50 82 C20 60 10 40 22 27 C32 17 46 22 50 34 C54 22 68 17 78 27 C90 40 80 60 50 82 Z" />
  ),
  smiley: (
    <>
      <circle cx="50" cy="50" r="35" />
      <circle cx="38" cy="42" r="3" fill={STROKE} stroke="none" />
      <circle cx="62" cy="42" r="3" fill={STROKE} stroke="none" />
      <path d="M35 62 C42 72 58 72 65 62" />
    </>
  ),
  hourglass: (
    <path d="M25 15 H75 M25 85 H75 M25 15 C25 40 45 45 50 50 C45 55 25 60 25 85 M75 15 C75 40 55 45 50 50 C55 55 75 60 75 85" />
  ),
  book: (
    <path d="M50 22 C42 15 25 15 15 20 V72 C25 67 42 67 50 74 C58 67 75 67 85 72 V20 C75 15 58 15 50 22 Z M50 22 V74" />
  ),
  magnifyingGlass: (
    <>
      <circle cx="42" cy="42" r="24" />
      <line x1="60" y1="60" x2="82" y2="82" />
    </>
  ),
  cross: <path d="M50 12 V88 M25 38 H75" />,
  sun: (
    <>
      <circle cx="50" cy="50" r="16" />
      <line x1="50" y1="18" x2="50" y2="8" />
      <line x1="50" y1="92" x2="50" y2="82" />
      <line x1="18" y1="50" x2="8" y2="50" />
      <line x1="92" y1="50" x2="82" y2="50" />
      <line x1="27" y1="27" x2="20" y2="20" />
      <line x1="73" y1="27" x2="80" y2="20" />
      <line x1="27" y1="73" x2="20" y2="80" />
      <line x1="73" y1="73" x2="80" y2="80" />
    </>
  ),
  veil: (
    <>
      <line x1="15" y1="10" x2="15" y2="90" />
      <line x1="85" y1="10" x2="85" y2="90" />
      <path d="M15 10 C30 20 20 30 35 40 C22 50 32 60 20 70 C33 78 25 85 15 90" />
      <path d="M85 10 C70 20 80 30 65 40 C78 50 68 60 80 70 C67 78 75 85 85 90" />
      <line x1="15" y1="10" x2="85" y2="10" />
    </>
  ),
  veilTorn: (
    <>
      <line x1="15" y1="10" x2="15" y2="90" />
      <line x1="85" y1="10" x2="85" y2="90" />
      <line x1="15" y1="10" x2="85" y2="10" />
      <path d="M50 10 L44 30 L54 45 L42 62 L52 80 L47 90" />
      <path d="M50 10 L56 32 L46 48 L58 64 L48 82 L53 90" />
    </>
  ),
  arrowUp: <path d="M50 85 V20 M30 40 L50 18 L70 40" />,
  arrowDown: <path d="M50 15 V80 M30 60 L50 82 L70 60" />,
  arrowLeft: <path d="M85 50 H20 M40 30 L18 50 L40 70" />,
  arrowRight: <path d="M15 50 H80 M60 30 L82 50 L60 70" />,
  checkmark: <path d="M20 52 L42 72 L82 25" />,
  dot: <circle cx="50" cy="50" r="9" fill={STROKE} stroke="none" />,
  pulsingRings: (
    <>
      <circle cx="50" cy="50" r="8" fill={STROKE} stroke="none" />
      <circle cx="50" cy="50" r="22" />
      <circle cx="50" cy="50" r="36" />
    </>
  ),
  paperAirplane: <path d="M12 55 L88 20 L60 88 L50 58 L12 55 Z M50 58 L88 20" />,
  mountain: <path d="M10 82 L40 25 L58 52 L72 32 L92 82 Z" />,
  city: (
    <>
      <rect x="15" y="35" width="20" height="47" />
      <rect x="42" y="20" width="20" height="62" />
      <rect x="68" y="45" width="18" height="37" />
      <line x1="10" y1="82" x2="90" y2="82" />
    </>
  ),
  wavyLine: <path d="M8 50 C20 35 30 65 42 50 C54 35 64 65 76 50 C84 42 88 45 92 50" />,
  star: (
    <path d="M50 15 L58 40 L84 40 L63 56 L71 82 L50 66 L29 82 L37 56 L16 40 L42 40 Z" />
  ),
  box: <rect x="18" y="18" width="64" height="64" />,
  nestedBox: (
    <>
      <rect x="10" y="10" width="80" height="80" />
      <rect x="32" y="32" width="36" height="36" />
    </>
  ),
  brokenBox: (
    <>
      <path d="M18 18 H55 M75 18 H82 V38" />
      <path d="M18 18 V82 H82 V62" />
      <path d="M82 82 H62" />
    </>
  ),
  lightBeam: (
    <>
      <line x1="50" y1="10" x2="20" y2="90" />
      <line x1="50" y1="10" x2="50" y2="92" />
      <line x1="50" y1="10" x2="80" y2="90" />
    </>
  ),
  dottedLine: (
    <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="6 8" />
  ),
  rope: <path d="M15 20 C40 30 20 45 45 50 C70 55 50 70 75 82" />,
};

export const WireframeIconGlyph: React.FC<{
  kind: IconKind;
  size: number;
  opacity?: number;
  extraStroke?: number;
}> = ({ kind, size, opacity = 1, extraStroke = 0 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity, overflow: "visible" }}
    >
      <g
        fill="none"
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH + extraStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[kind]}
      </g>
    </svg>
  );
};

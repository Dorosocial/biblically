import { IconKind } from "../components/graphics/icons";

export type GraphicElement =
  | { kind: "icon"; icon: IconKind; x: number; y: number; size: number; delayFrames?: number }
  | { kind: "text"; text: string; x: number; y: number; fontSize: number; delayFrames?: number }
  | { kind: "underline"; x: number; y: number; width: number; delayFrames?: number };

export type CompositeMode = "overlay" | "cutaway";

export interface BucketBItem {
  id: string;
  sourceFilename: string;
  description: string;
  mode: CompositeMode;
  elements: GraphicElement[];
}

// Elements are positioned in a 0-100 percent local canvas; icon "size" is in
// px against a 1920-wide cutaway canvas (overlays render at 55% scale, see
// WireframeGraphic).
export const BUCKET_B: Record<string, BucketBItem> = {
  "b-03": {
    id: "b-03", sourceFilename: "wf-b-03-calendar-praying-icons.png",
    description: "grid calendar, each day box containing a tiny outlined praying-figure icon",
    mode: "overlay",
    elements: [{ kind: "icon", icon: "calendar", x: 50, y: 50, size: 140 }],
  },
  "b-09": {
    id: "b-09", sourceFilename: "wf-b-09-ear-icon-distant.png",
    description: "outlined ear shape, far from center, with a question mark nearby",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "ear", x: 35, y: 45, size: 90 },
      { kind: "icon", icon: "questionMark", x: 65, y: 62, size: 50, delayFrames: 10 },
    ],
  },
  "b-10": {
    id: "b-10", sourceFilename: "wf-b-10-x-over-distant-god.png",
    description: "distant cloud shape with a large X drawn over it, question mark beside",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "cloud", x: 40, y: 40, size: 100 },
      { kind: "icon", icon: "x", x: 40, y: 40, size: 110, delayFrames: 12 },
      { kind: "icon", icon: "questionMark", x: 72, y: 58, size: 45, delayFrames: 20 },
    ],
  },
  "b-13": {
    id: "b-13", sourceFilename: "wf-b-13-speech-bubble-quote.png",
    description: "outlined speech bubble containing the text 'Do you not know...?'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "speechBubble", x: 50, y: 45, size: 220 },
      { kind: "text", text: "DO YOU NOT KNOW...?", x: 50, y: 42, fontSize: 22, delayFrames: 14 },
    ],
  },
  "b-21": {
    id: "b-21", sourceFilename: "wf-b-21-small-to-big-temple.png",
    description: "small temple outline, arrow growing into a much larger temple outline, labeled 'bigger than it sounds'",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "temple", x: 20, y: 55, size: 110 },
      { kind: "icon", icon: "arrowRight", x: 48, y: 55, size: 90, delayFrames: 10 },
      { kind: "icon", icon: "temple", x: 78, y: 50, size: 220, delayFrames: 20 },
      { kind: "text", text: "BIGGER THAN IT SOUNDS", x: 50, y: 88, fontSize: 28, delayFrames: 32 },
    ],
  },
  "b-22": {
    id: "b-22", sourceFilename: "wf-b-22-jerusalem-temple-greek.png",
    description: "large building outline labeled JERUSALEM TEMPLE, two speech bubbles above with Greek lettering",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "temple", x: 50, y: 58, size: 260 },
      { kind: "text", text: "JERUSALEM TEMPLE", x: 50, y: 90, fontSize: 30, delayFrames: 10 },
      { kind: "icon", icon: "speechBubble", x: 26, y: 20, size: 90, delayFrames: 14 },
      { kind: "icon", icon: "speechBubble", x: 74, y: 20, size: 90, delayFrames: 20 },
    ],
  },
  "b-23": {
    id: "b-23", sourceFilename: "wf-b-23-hieron-word-complex.png",
    description: "the word HIERON, arrow pointing to an outline of a whole temple complex",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "HIERON", x: 26, y: 50, fontSize: 80 },
      { kind: "icon", icon: "arrowRight", x: 54, y: 52, size: 80, delayFrames: 12 },
      { kind: "icon", icon: "temple", x: 78, y: 54, size: 170, delayFrames: 22 },
    ],
  },
  "b-24": {
    id: "b-24", sourceFilename: "wf-b-24-whole-complex-rooms.png",
    description: "large rectangle divided into many small box compartments, labeled 'whole complex'",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "box", x: 30, y: 32, size: 60 },
      { kind: "icon", icon: "box", x: 50, y: 32, size: 60, delayFrames: 4 },
      { kind: "icon", icon: "box", x: 70, y: 32, size: 60, delayFrames: 8 },
      { kind: "icon", icon: "box", x: 30, y: 60, size: 60, delayFrames: 12 },
      { kind: "icon", icon: "box", x: 50, y: 60, size: 60, delayFrames: 16 },
      { kind: "icon", icon: "box", x: 70, y: 60, size: 60, delayFrames: 20 },
      { kind: "text", text: "WHOLE COMPLEX", x: 50, y: 90, fontSize: 26, delayFrames: 28 },
    ],
  },
  "b-26": {
    id: "b-26", sourceFilename: "wf-b-26-hieron-crossed-out.png",
    description: "the word HIERON with a large X drawn across it",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "HIERON", x: 50, y: 50, fontSize: 100 },
      { kind: "icon", icon: "x", x: 50, y: 48, size: 260, delayFrames: 14 },
    ],
  },
  "b-27": {
    id: "b-27", sourceFilename: "wf-b-27-naos-word.png",
    description: "the word NAOS, large and bold, centered",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "NAOS", x: 50, y: 50, fontSize: 130 },
      { kind: "underline", x: 50, y: 62, width: 38, delayFrames: 14 },
    ],
  },
  "b-28": {
    id: "b-28", sourceFilename: "wf-b-28-inner-sanctuary-box.png",
    description: "small box nested inside a larger building outline, labeled 'inner sanctuary'",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "nestedBox", x: 50, y: 46, size: 240 },
      { kind: "text", text: "INNER SANCTUARY", x: 50, y: 88, fontSize: 26, delayFrames: 14 },
    ],
  },
  "b-29": {
    id: "b-29", sourceFilename: "wf-b-29-holy-of-holies-glow.png",
    description: "box labeled HOLY OF HOLIES, star/sparkle marks around it",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 44, size: 180 },
      { kind: "text", text: "HOLY OF HOLIES", x: 50, y: 80, fontSize: 30 },
      { kind: "icon", icon: "star", x: 22, y: 22, size: 40, delayFrames: 10 },
      { kind: "icon", icon: "star", x: 78, y: 26, size: 34, delayFrames: 14 },
      { kind: "icon", icon: "star", x: 70, y: 65, size: 30, delayFrames: 18 },
    ],
  },
  "b-30": {
    id: "b-30", sourceFilename: "wf-b-30-tiny-room-stars.png",
    description: "tiny room outline with small star-shaped line marks floating around it",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 50, size: 90 },
      { kind: "icon", icon: "star", x: 28, y: 28, size: 26, delayFrames: 8 },
      { kind: "icon", icon: "star", x: 74, y: 30, size: 22, delayFrames: 12 },
      { kind: "icon", icon: "star", x: 68, y: 72, size: 24, delayFrames: 16 },
    ],
  },
  "b-33": {
    id: "b-33", sourceFilename: "wf-b-33-calendar-one-day.png",
    description: "calendar grid with a single day circled, labeled '1x a year'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "calendarOneDay", x: 50, y: 45, size: 140 },
      { kind: "text", text: "1x A YEAR", x: 50, y: 84, fontSize: 22, delayFrames: 12 },
    ],
  },
  "b-38": {
    id: "b-38", sourceFilename: "wf-b-38-empty-box-arrow.png",
    description: "empty box outline centered, an arrow pointing to it, labeled 'that room'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 48, size: 120 },
      { kind: "icon", icon: "arrowDown", x: 50, y: 14, size: 60, delayFrames: 8 },
      { kind: "text", text: "THAT ROOM", x: 50, y: 84, fontSize: 22, delayFrames: 14 },
    ],
  },
  "b-41": {
    id: "b-41", sourceFilename: "wf-b-41-room-most-sacred.png",
    description: "small room box outline surrounded by star/sparkle marks, labeled 'most sacred'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 46, size: 110 },
      { kind: "icon", icon: "star", x: 24, y: 20, size: 26, delayFrames: 8 },
      { kind: "icon", icon: "star", x: 76, y: 24, size: 24, delayFrames: 12 },
      { kind: "text", text: "MOST SACRED", x: 50, y: 84, fontSize: 22, delayFrames: 16 },
    ],
  },
  "b-42": {
    id: "b-42", sourceFilename: "wf-b-42-glowing-dot-presence.png",
    description: "pulsing outlined circle inside the room box, labeled \"God's presence\"",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 46, size: 130 },
      { kind: "icon", icon: "pulsingRings", x: 50, y: 46, size: 60, delayFrames: 8 },
      { kind: "text", text: "GOD'S PRESENCE", x: 50, y: 86, fontSize: 22, delayFrames: 16 },
    ],
  },
  "b-51": {
    id: "b-51", sourceFilename: "wf-b-51-mountain-city-question.png",
    description: "triangle mountain outline on one side, rectangle city outline on the other, large question mark between",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "mountain", x: 26, y: 56, size: 200 },
      { kind: "icon", icon: "city", x: 74, y: 56, size: 200, delayFrames: 8 },
      { kind: "icon", icon: "questionMark", x: 50, y: 32, size: 80, delayFrames: 18 },
    ],
  },
  "b-52": {
    id: "b-52", sourceFilename: "wf-b-52-opposite-arrows.png",
    description: "two arrows pointing in opposite directions, each with a small question mark",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "arrowLeft", x: 28, y: 50, size: 100 },
      { kind: "icon", icon: "arrowRight", x: 72, y: 50, size: 100, delayFrames: 6 },
      { kind: "icon", icon: "questionMark", x: 28, y: 20, size: 34, delayFrames: 14 },
      { kind: "icon", icon: "questionMark", x: 72, y: 20, size: 34, delayFrames: 16 },
    ],
  },
  "b-54": {
    id: "b-54", sourceFilename: "wf-b-54-clock-now.png",
    description: "outlined clock face, an arrow pointing to it labeled NOW",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "clock", x: 50, y: 40, size: 130 },
      { kind: "icon", icon: "arrowDown", x: 50, y: 74, size: 40, delayFrames: 10 },
      { kind: "text", text: "NOW", x: 50, y: 92, fontSize: 28, delayFrames: 16 },
    ],
  },
  "b-56": {
    id: "b-56", sourceFilename: "wf-b-56-mountain-city-crossed.png",
    description: "mountain and city outlines, both crossed out with X's",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "mountain", x: 26, y: 56, size: 200 },
      { kind: "icon", icon: "city", x: 74, y: 56, size: 200 },
      { kind: "icon", icon: "x", x: 26, y: 56, size: 210, delayFrames: 10 },
      { kind: "icon", icon: "x", x: 74, y: 56, size: 210, delayFrames: 14 },
    ],
  },
  "b-57": {
    id: "b-57", sourceFilename: "wf-b-57-breath-squiggle.png",
    description: "single wavy line floating in empty space, labeled 'spirit'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "wavyLine", x: 50, y: 48, size: 220 },
      { kind: "text", text: "SPIRIT", x: 50, y: 74, fontSize: 24, delayFrames: 12 },
    ],
  },
  "b-58": {
    id: "b-58", sourceFilename: "wf-b-58-pneuma-word.png",
    description: "the word PNEUMA, large, centered",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "PNEUMA", x: 50, y: 50, fontSize: 118 },
      { kind: "underline", x: 50, y: 62, width: 42, delayFrames: 14 },
    ],
  },
  "b-59": {
    id: "b-59", sourceFilename: "wf-b-59-ruach-word.png",
    description: "the word RUACH, large, centered",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "RUACH", x: 50, y: 50, fontSize: 118 },
      { kind: "underline", x: 50, y: 62, width: 36, delayFrames: 14 },
    ],
  },
  "b-60": {
    id: "b-60", sourceFilename: "wf-b-60-heart-smiley-crossed.png",
    description: "small heart outline and a smiley-face outline, both crossed out with X's",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "heart", x: 32, y: 50, size: 90 },
      { kind: "icon", icon: "smiley", x: 68, y: 50, size: 90, delayFrames: 6 },
      { kind: "icon", icon: "x", x: 32, y: 50, size: 100, delayFrames: 14 },
      { kind: "icon", icon: "x", x: 68, y: 50, size: 100, delayFrames: 18 },
    ],
  },
  "b-62": {
    id: "b-62", sourceFilename: "wf-b-62-breath-from-cloud.png",
    description: "wavy 'breath' marks flowing out of a simple cloud outline labeled GOD",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "cloud", x: 50, y: 32, size: 120 },
      { kind: "text", text: "GOD", x: 50, y: 32, fontSize: 20, delayFrames: 6 },
      { kind: "icon", icon: "wavyLine", x: 50, y: 68, size: 180, delayFrames: 14 },
    ],
  },
  "b-63": {
    id: "b-63", sourceFilename: "wf-b-63-dot-pulsing-rings.png",
    description: "small outlined dot with pulsing concentric ring lines around it",
    mode: "overlay",
    elements: [{ kind: "icon", icon: "pulsingRings", x: 50, y: 50, size: 150 }],
  },
  "b-64": {
    id: "b-64", sourceFilename: "wf-b-64-water-wind-lines.png",
    description: "wavy water lines at the bottom of frame, wind/breath squiggle lines hovering just above",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "wavyLine", x: 50, y: 78, size: 260 },
      { kind: "icon", icon: "wavyLine", x: 50, y: 36, size: 220, delayFrames: 10 },
    ],
  },
  "b-65": {
    id: "b-65", sourceFilename: "wf-b-65-genesis-breath.png",
    description: "mostly empty dark frame, a single wavy breath line, labeled GENESIS 1",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "wavyLine", x: 50, y: 50, size: 200 },
      { kind: "text", text: "GENESIS 1", x: 50, y: 78, fontSize: 26, delayFrames: 14 },
    ],
  },
  "b-67": {
    id: "b-67", sourceFilename: "wf-b-67-building-crossed.png",
    description: "simple building outline with a large X over it",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "temple", x: 50, y: 50, size: 220 },
      { kind: "icon", icon: "x", x: 50, y: 50, size: 240, delayFrames: 14 },
    ],
  },
  "b-70": {
    id: "b-70", sourceFilename: "wf-b-70-matthew-citation.png",
    description: "outlined open book shape, labeled MATTHEW 27:51",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "book", x: 50, y: 40, size: 170 },
      { kind: "text", text: "MATTHEW 27:51", x: 50, y: 82, fontSize: 30, delayFrames: 14 },
    ],
  },
  "b-71": {
    id: "b-71", sourceFilename: "wf-b-71-cross-cloud-sun.png",
    description: "simple cross outline, a dark cloud shape and small sun shape sketched nearby",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "cross", x: 50, y: 54, size: 200 },
      { kind: "icon", icon: "cloud", x: 22, y: 26, size: 90, delayFrames: 10 },
      { kind: "icon", icon: "sun", x: 78, y: 24, size: 70, delayFrames: 14 },
    ],
  },
  "b-72": {
    id: "b-72", sourceFilename: "wf-b-72-veil-tearing.png",
    description: "hanging curtain/veil outline with a jagged tear line ripping down the middle",
    mode: "cutaway",
    elements: [{ kind: "icon", icon: "veilTorn", x: 50, y: 50, size: 280 }],
  },
  "b-73": {
    id: "b-73", sourceFilename: "wf-b-73-tear-arrow-down.png",
    description: "arrow starting at the top of the torn veil, pointing straight down to the bottom",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "veilTorn", x: 50, y: 50, size: 280 },
      { kind: "icon", icon: "arrowDown", x: 50, y: 14, size: 60, delayFrames: 10 },
    ],
  },
  "b-74": {
    id: "b-74", sourceFilename: "wf-b-74-veil-barrier-wall.png",
    description: "veil drawn as a dividing wall between two spaces, labeled 'barrier'",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "veil", x: 50, y: 46, size: 260 },
      { kind: "text", text: "BARRIER", x: 50, y: 88, fontSize: 28, delayFrames: 14 },
    ],
  },
  "b-75": {
    id: "b-75", sourceFilename: "wf-b-75-two-rooms-veil.png",
    description: "two room box outlines side by side, separated by the torn veil, labeled OUTER COURTS and HOLY OF HOLIES",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "box", x: 24, y: 46, size: 150 },
      { kind: "icon", icon: "veilTorn", x: 50, y: 46, size: 140, delayFrames: 8 },
      { kind: "icon", icon: "box", x: 76, y: 46, size: 150, delayFrames: 14 },
      { kind: "text", text: "OUTER COURTS", x: 24, y: 84, fontSize: 18, delayFrames: 18 },
      { kind: "text", text: "HOLY OF HOLIES", x: 76, y: 84, fontSize: 18, delayFrames: 22 },
    ],
  },
  "b-76": {
    id: "b-76", sourceFilename: "wf-b-76-x-crossed-upward-arrow.png",
    description: "X at the base of the veil with a crossed-out upward arrow",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "arrowUp", x: 50, y: 55, size: 100 },
      { kind: "icon", icon: "x", x: 50, y: 55, size: 110, delayFrames: 10 },
    ],
  },
  "b-78": {
    id: "b-78", sourceFilename: "wf-b-78-downward-arrow-check.png",
    description: "downward arrow from the top of the veil to bottom, with a checkmark",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "arrowDown", x: 36, y: 50, size: 100 },
      { kind: "icon", icon: "checkmark", x: 68, y: 50, size: 70, delayFrames: 10 },
    ],
  },
  "b-79": {
    id: "b-79", sourceFilename: "wf-b-79-light-pulling-veil.png",
    description: "beam-of-light shape coming from behind the veil, pulling it open",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "veilTorn", x: 50, y: 50, size: 260 },
      { kind: "icon", icon: "lightBeam", x: 50, y: 50, size: 180, delayFrames: 10 },
    ],
  },
  "b-80": {
    id: "b-80", sourceFilename: "wf-b-80-dot-in-tear-gap.png",
    description: "small outlined glowing dot revealed in the gap of the torn veil",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "veilTorn", x: 50, y: 50, size: 260 },
      { kind: "icon", icon: "dot", x: 50, y: 50, size: 50, delayFrames: 14 },
    ],
  },
  "b-81": {
    id: "b-81", sourceFilename: "wf-b-81-dot-expanding-outward.png",
    description: "the dot expanding outward past a broken box outline",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "brokenBox", x: 50, y: 50, size: 220 },
      { kind: "icon", icon: "pulsingRings", x: 50, y: 50, size: 160, delayFrames: 12 },
    ],
  },
  "b-83": {
    id: "b-83", sourceFilename: "wf-b-83-paper-airplane-x.png",
    description: "paper airplane outline flying toward a tiny distant cloud, an X drawn over it",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "paperAirplane", x: 36, y: 52, size: 110 },
      { kind: "icon", icon: "cloud", x: 76, y: 32, size: 70, delayFrames: 8 },
      { kind: "icon", icon: "x", x: 76, y: 32, size: 80, delayFrames: 16 },
    ],
  },
  "b-84": {
    id: "b-84", sourceFilename: "wf-b-84-airplane-question.png",
    description: "paper airplane mid-air, a question mark above it",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "paperAirplane", x: 50, y: 55, size: 120 },
      { kind: "icon", icon: "questionMark", x: 50, y: 18, size: 50, delayFrames: 10 },
    ],
  },
  "b-86": {
    id: "b-86", sourceFilename: "wf-b-86-dot-always-here.png",
    description: "small outlined dot sitting still inside a simple room box, labeled ALWAYS HERE",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 46, size: 120 },
      { kind: "icon", icon: "dot", x: 50, y: 46, size: 34, delayFrames: 8 },
      { kind: "text", text: "ALWAYS HERE", x: 50, y: 84, fontSize: 22, delayFrames: 16 },
    ],
  },
  "b-90": {
    id: "b-90", sourceFilename: "wf-b-90-room-glowing-full.png",
    description: "small room box outline, fully filled with a pulsing glow effect",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "box", x: 50, y: 50, size: 220 },
      { kind: "icon", icon: "pulsingRings", x: 50, y: 50, size: 140, delayFrames: 8 },
      { kind: "icon", icon: "pulsingRings", x: 50, y: 50, size: 200, delayFrames: 14 },
    ],
  },
  "b-93": {
    id: "b-93", sourceFilename: "wf-b-93-book-highlighted-word.png",
    description: "outlined open book with one word highlighted in a small box",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "book", x: 50, y: 45, size: 150 },
      { kind: "icon", icon: "box", x: 50, y: 48, size: 50, delayFrames: 12 },
    ],
  },
  "b-94": {
    id: "b-94", sourceFilename: "wf-b-94-magnifying-glass-word.png",
    description: "magnifying glass held over the highlighted word",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "book", x: 40, y: 48, size: 130 },
      { kind: "icon", icon: "magnifyingGlass", x: 60, y: 55, size: 90, delayFrames: 10 },
    ],
  },
  "b-95": {
    id: "b-95", sourceFilename: "wf-b-95-kavanah-word.png",
    description: "the word KAVANAH, large and bold, centered",
    mode: "cutaway",
    elements: [
      { kind: "text", text: "KAVANAH", x: 50, y: 50, fontSize: 106 },
      { kind: "underline", x: 50, y: 62, width: 44, delayFrames: 14 },
    ],
  },
  "b-96": {
    id: "b-96", sourceFilename: "wf-b-96-compass-direction.png",
    description: "outlined compass icon with a directional arrow, labeled 'direction'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "compass", x: 50, y: 44, size: 140 },
      { kind: "text", text: "DIRECTION", x: 50, y: 82, fontSize: 22, delayFrames: 12 },
    ],
  },
  "b-97": {
    id: "b-97", sourceFilename: "wf-b-97-heart-arrow-to-dot.png",
    description: "heart outline with a curved arrow turning to point toward a glowing dot",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "heart", x: 26, y: 50, size: 90 },
      { kind: "icon", icon: "arrowRight", x: 52, y: 50, size: 70, delayFrames: 8 },
      { kind: "icon", icon: "dot", x: 78, y: 50, size: 34, delayFrames: 16 },
    ],
  },
  "b-100": {
    id: "b-100", sourceFilename: "wf-b-100-speech-checkmarks.png",
    description: "outlined speech bubble full of checkmark shapes, labeled 'right words'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "speechBubble", x: 50, y: 44, size: 220 },
      { kind: "icon", icon: "checkmark", x: 38, y: 36, size: 34, delayFrames: 10 },
      { kind: "icon", icon: "checkmark", x: 56, y: 40, size: 34, delayFrames: 14 },
      { kind: "icon", icon: "checkmark", x: 44, y: 50, size: 34, delayFrames: 18 },
      { kind: "text", text: "RIGHT WORDS", x: 50, y: 86, fontSize: 22, delayFrames: 24 },
    ],
  },
  "b-106": {
    id: "b-106", sourceFilename: "wf-b-106-two-bubbles-compare.png",
    description: "two speech bubbles — one pointing at an empty sky (crossed out), one pointing at a nearby glowing dot",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "speechBubble", x: 26, y: 40, size: 170 },
      { kind: "icon", icon: "cloud", x: 26, y: 16, size: 60, delayFrames: 8 },
      { kind: "icon", icon: "x", x: 26, y: 16, size: 70, delayFrames: 14 },
      { kind: "icon", icon: "speechBubble", x: 74, y: 40, size: 170, delayFrames: 10 },
      { kind: "icon", icon: "dot", x: 74, y: 76, size: 34, delayFrames: 20 },
    ],
  },
  "b-108": {
    id: "b-108", sourceFilename: "wf-b-108-veil-checkmark.png",
    description: "torn veil outline again, a checkmark beside it",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "veilTorn", x: 36, y: 50, size: 160 },
      { kind: "icon", icon: "checkmark", x: 72, y: 50, size: 60, delayFrames: 12 },
    ],
  },
  "b-111": {
    id: "b-111", sourceFilename: "wf-b-111-curtain-x-light.png",
    description: "torn curtain outline with an X over it, light lines shining freely through the gap",
    mode: "cutaway",
    elements: [
      { kind: "icon", icon: "veil", x: 50, y: 50, size: 260 },
      { kind: "icon", icon: "x", x: 50, y: 50, size: 270, delayFrames: 10 },
      { kind: "icon", icon: "lightBeam", x: 50, y: 50, size: 200, delayFrames: 18 },
    ],
  },
  "b-113": {
    id: "b-113", sourceFilename: "wf-b-113-clock-arrow-now.png",
    description: "simple clock icon outline with an arrow pointing to the word NOW",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "clock", x: 40, y: 50, size: 120 },
      { kind: "icon", icon: "arrowRight", x: 66, y: 50, size: 60, delayFrames: 8 },
      { kind: "text", text: "NOW", x: 88, y: 50, fontSize: 26, delayFrames: 14 },
    ],
  },
  "b-114": {
    id: "b-114", sourceFilename: "wf-b-114-hourglass-moment.png",
    description: "small hourglass icon outline, labeled 'this moment'",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "hourglass", x: 50, y: 44, size: 130 },
      { kind: "text", text: "THIS MOMENT", x: 50, y: 84, fontSize: 22, delayFrames: 12 },
    ],
  },
  "b-116": {
    id: "b-116", sourceFilename: "wf-b-116-question-mark-alone.png",
    description: "one large question mark, centered alone on the black background",
    mode: "cutaway",
    elements: [{ kind: "icon", icon: "questionMark", x: 50, y: 50, size: 260 }],
  },
  "b-121": {
    id: "b-121", sourceFilename: "wf-b-121-dotted-line-x.png",
    description: "dotted line stretching to a distant cloud, a large X drawn across the whole line",
    mode: "overlay",
    elements: [
      { kind: "icon", icon: "dottedLine", x: 50, y: 50, size: 280 },
      { kind: "icon", icon: "cloud", x: 88, y: 50, size: 60, delayFrames: 10 },
      { kind: "icon", icon: "x", x: 50, y: 50, size: 280, delayFrames: 18 },
    ],
  },
};

export const BUCKET_B_IDS = Object.keys(BUCKET_B);

/**
 * Deliberate color choice: a deep indigo-charcoal backdrop (not pure black).
 * It reads as "space / deep time" without crushing shadow detail on the
 * Earth and terrain shots, and it gives the glowing cyan/amber numbers and
 * timeline bars the strongest possible contrast pop (pure black flattens
 * glow blooms; navy-charcoal keeps a hint of atmosphere behind them).
 */
export const theme = {
	backdrop: '#070b16',
	backdropDeep: '#040611',
	fogColor: '#0a1226',

	glowCyan: '#7dd3fc',
	glowCyanBright: '#e0f7ff',
	glowAmber: '#fbbf24',
	glowAmberBright: '#ffe6a8',
	glowRose: '#fb7185',

	textPrimary: '#f5f8ff',
	textDim: '#9fb2d6',

	earthOcean: '#123a63',
	earthOceanDeep: '#0a2340',
	earthLandModern: '#2f6b3f',
	earthLandPrehistoric: '#7a5230',
	earthIce: '#eaf6ff',

	personGlowYoung: '#8fe3ff',
	personGlowOld: '#c9b38a',

	mountainRock: '#5b5a63',
	mountainRockLit: '#8b8a93',
} as const;

export const fontStack = "'Helvetica Neue', Arial, 'Segoe UI', sans-serif";

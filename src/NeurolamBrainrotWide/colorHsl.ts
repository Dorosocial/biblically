export const hsl = (h: number, s: number, l: number): string =>
	`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;

export const hsla = (h: number, s: number, l: number, a: number): string =>
	`hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`;

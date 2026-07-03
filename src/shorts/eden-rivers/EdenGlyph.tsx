// A small code-drawn oasis icon (water + two palms) for Scene 1's "Eden"
// beat — no source photo exists for this, so it's built to match the
// fingerprint directly: white offset-style stroke, full color fill, no
// halftone.
type EdenGlyphProps = {
	frame: number;
	fps: number;
	size?: number;
};

export const EdenGlyph: React.FC<EdenGlyphProps> = ({frame, fps, size = 200}) => {
	const sway = Math.sin((frame / fps) * 2 * Math.PI * 0.3) * 4;

	return (
		<svg width={size} height={size} viewBox="0 0 220 220">
			<ellipse cx="110" cy="172" rx="88" ry="24" fill="#C9A15A" stroke="#FFFFFF" strokeWidth="4" />
			<ellipse cx="110" cy="162" rx="52" ry="18" fill="#2E86C1" stroke="#FFFFFF" strokeWidth="4" />
			<g transform={`rotate(${sway} 58 92)`}>
				<rect x="53" y="92" width="10" height="68" rx="5" fill="#8B5E34" stroke="#FFFFFF" strokeWidth="3" />
				<path d="M58,92 C18,74 8,44 13,22 C33,42 53,58 58,92 Z" fill="#2F9E44" stroke="#FFFFFF" strokeWidth="3" />
				<path d="M58,92 C98,74 108,44 103,22 C83,42 63,58 58,92 Z" fill="#37B24D" stroke="#FFFFFF" strokeWidth="3" />
				<path d="M58,92 C40,64 40,34 55,14 C64,34 63,58 58,92 Z" fill="#40C057" stroke="#FFFFFF" strokeWidth="3" />
			</g>
			<g transform={`rotate(${-sway * 0.8} 160 104)`}>
				<rect x="155" y="104" width="9" height="58" rx="4.5" fill="#8B5E34" stroke="#FFFFFF" strokeWidth="3" />
				<path d="M159,104 C127,88 120,60 124,42 C141,58 156,70 159,104 Z" fill="#2F9E44" stroke="#FFFFFF" strokeWidth="3" />
				<path d="M159,104 C191,88 198,60 194,42 C177,58 162,70 159,104 Z" fill="#37B24D" stroke="#FFFFFF" strokeWidth="3" />
			</g>
		</svg>
	);
};

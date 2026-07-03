import {COLORS} from './theme';
import type {CSSProperties} from 'react';

type TextCardProps = {
	text: string;
	opacity: number;
	scale?: number;
	fontSize?: number;
	style?: CSSProperties;
};

// The bold bordered text card used for verse references and headline beats
// (Scenes 4, 10, 11, 12) — a flex child of Stage so it centers as part of
// the scene's group composition instead of floating as a separate overlay.
export const TextCard: React.FC<TextCardProps> = ({text, opacity, scale = 1, fontSize = 52, style}) => (
	<div
		style={{
			opacity,
			transform: `scale(${scale})`,
			background: 'rgba(6, 16, 32, 0.55)',
			padding: '26px 38px',
			borderRadius: 12,
			border: `2px solid ${COLORS.stroke}`,
			...style,
		}}
	>
		<div
			style={{
				color: 'white',
				fontFamily: 'sans-serif',
				fontWeight: 700,
				fontSize,
				letterSpacing: 2.5,
				textAlign: 'center',
				lineHeight: 1.2,
			}}
		>
			{text}
		</div>
	</div>
);

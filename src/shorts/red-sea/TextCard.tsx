import {COLORS} from './theme';
import type {CSSProperties} from 'react';

type TextCardProps = {
	text: string;
	opacity: number;
	scale?: number;
	fontSize?: number;
	style?: CSSProperties;
};

// Bold headline text over the teal grid background — a translucent dark-teal
// card (keeps the grid visible through it) with a silver border, matching
// the silver-stroke fingerprint. A flex child of Stage so it centers with
// the rest of the scene's group.
export const TextCard: React.FC<TextCardProps> = ({text, opacity, scale = 1, fontSize = 76, style}) => (
	<div
		style={{
			opacity,
			transform: `scale(${scale})`,
			background: COLORS.cardFill,
			padding: '40px 64px',
			borderRadius: 20,
			border: `3px solid ${COLORS.silver}`,
			...style,
		}}
	>
		<div
			style={{
				color: COLORS.text,
				fontFamily: 'sans-serif',
				fontWeight: 800,
				fontSize,
				letterSpacing: 2,
				lineHeight: 1.15,
				textAlign: 'center',
				textShadow: '0 2px 8px rgba(0,0,0,0.5)',
			}}
		>
			{text}
		</div>
	</div>
);

import {COLORS} from './theme';
import type {CSSProperties} from 'react';

type TextCardProps = {
	text: string;
	opacity: number;
	scale?: number;
	fontSize?: number;
	style?: CSSProperties;
};

// Bold headline text for a white background — dark ink text with a gold
// underline rule, no boxed card (a box would fight the plain-white
// fingerprint). A flex child of Stage so it centers with the rest of the
// scene's group.
export const TextCard: React.FC<TextCardProps> = ({text, opacity, scale = 1, fontSize = 52, style}) => (
	<div style={{opacity, transform: `scale(${scale})`, textAlign: 'center', ...style}}>
		<div
			style={{
				color: COLORS.ink,
				fontFamily: 'sans-serif',
				fontWeight: 800,
				fontSize,
				letterSpacing: 2,
				lineHeight: 1.15,
			}}
		>
			{text}
		</div>
		<div style={{height: 4, width: '60%', margin: '10px auto 0', background: COLORS.gold, borderRadius: 2}} />
	</div>
);

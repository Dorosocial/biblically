import React from 'react';
import {FONT_STACK} from './palette';

interface Props {
	children: React.ReactNode;
	color: string;
	size?: number;
	opacity?: number;
	style?: React.CSSProperties;
}

// Shared bold sans-serif label style for the narrator section's text overlays.
export const BoldLabel: React.FC<Props> = ({children, color, size = 44, opacity = 1, style}) => (
	<div
		style={{
			fontFamily: FONT_STACK,
			fontWeight: 800,
			fontSize: size,
			letterSpacing: 3,
			textTransform: 'uppercase',
			color,
			opacity,
			...style,
		}}
	>
		{children}
	</div>
);

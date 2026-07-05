type TextCaptionProps = {
	text: string;
	opacity: number;
};

// A bottom-of-frame citation card, code-drawn text over real transparency.
// The scene illustration beneath varies shot to shot, so a translucent white
// backdrop pill (not just bare ink) guarantees legibility regardless of what
// artwork sits at that point in the frame.
export const TextCaption: React.FC<TextCaptionProps> = ({text, opacity}) => (
	<div
		style={{
			position: 'absolute',
			bottom: '7%',
			left: 0,
			right: 0,
			display: 'flex',
			justifyContent: 'center',
			opacity,
		}}
	>
		<span
			style={{
				display: 'inline-block',
				fontFamily: 'Georgia, serif',
				fontWeight: 700,
				fontSize: 40,
				letterSpacing: 7,
				textTransform: 'uppercase',
				color: '#141414',
				background: 'rgba(255, 255, 255, 0.82)',
				borderTop: '2px solid #141414',
				padding: '16px 36px 12px',
			}}
		>
			{text}
		</span>
	</div>
);

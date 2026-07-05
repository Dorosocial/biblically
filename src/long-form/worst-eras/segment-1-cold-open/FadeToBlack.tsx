type FadeToBlackProps = {
	/** 0-1 opacity of the black overlay. */
	opacity: number;
};

export const FadeToBlack: React.FC<FadeToBlackProps> = ({opacity}) => (
	<div style={{position: 'absolute', inset: 0, background: '#000000', opacity}} />
);

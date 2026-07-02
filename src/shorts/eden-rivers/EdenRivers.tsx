import {AbsoluteFill} from 'remotion';

export const EdenRivers: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0b1a12'}}>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					color: 'white',
					fontFamily: 'sans-serif',
					fontSize: 60,
					textAlign: 'center',
					padding: 40,
				}}
			>
				Eden Rivers
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

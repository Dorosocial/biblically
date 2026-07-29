import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

interface Props {
	corner: 'topRight' | 'bottomRight';
}

export const NotificationBadge: React.FC<Props> = ({corner}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pulse = (Math.sin((frame / (fps * 0.85)) * Math.PI * 2) + 1) / 2;
	const scale = 0.9 + pulse * 0.28;

	return (
		<div
			style={{
				position: 'absolute',
				right: 70,
				top: corner === 'topRight' ? 70 : undefined,
				bottom: corner === 'bottomRight' ? 70 : undefined,
				width: 46,
				height: 46,
				borderRadius: '50%',
				backgroundColor: '#FF3B5C',
				transform: `scale(${scale})`,
				boxShadow: `0 0 ${10 + pulse * 14}px rgba(255,59,92,0.8)`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'white',
				fontFamily: 'sans-serif',
				fontWeight: 700,
				fontSize: 20,
			}}
		>
			1
		</div>
	);
};

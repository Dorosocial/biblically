import {AbsoluteFill} from 'remotion';
import type {CSSProperties} from 'react';

type StageProps = {
	gap?: number;
	style?: CSSProperties;
	children: React.ReactNode;
};

// Every scene composes its elements as children of Stage instead of pinning
// them to fixed top offsets — flexbox centers the whole group (Bible + map,
// or just a text card) as one unit within the frame, so nothing ends up
// stacked awkwardly below a top-anchored element.
export const Stage: React.FC<StageProps> = ({gap = 40, style, children}) => (
	<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap, ...style}}>
		{children}
	</AbsoluteFill>
);

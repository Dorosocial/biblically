import {AbsoluteFill} from 'remotion';
import type {CSSProperties} from 'react';

type StageProps = {
	gap?: number;
	style?: CSSProperties;
	children: React.ReactNode;
};

// Every scene composes its elements as children of Stage — flexbox centers
// the whole group both vertically and horizontally as one unit, per the
// "everything centered as a group" layout rule.
export const Stage: React.FC<StageProps> = ({gap = 36, style, children}) => (
	<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap, ...style}}>
		{children}
	</AbsoluteFill>
);

import {AbsoluteFill} from 'remotion';
import {IMAGE_ASPECT, LAYOUT} from './theme';

type ContentStackProps = {
	/** Continuous push-in scale for the "no true stillness" motion rule. */
	scale?: number;
	children: React.ReactNode;
};

// The relatively-positioned container every map/valley/water layer stack
// sits inside, below the Bible.
export const ContentStack: React.FC<ContentStackProps> = ({scale = 1, children}) => (
	<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
		<div
			style={{
				position: 'relative',
				width: LAYOUT.contentWidth,
				height: LAYOUT.contentWidth * IMAGE_ASPECT,
				transform: `scale(${scale})`,
			}}
		>
			{children}
		</div>
	</AbsoluteFill>
);

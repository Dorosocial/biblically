import {IMAGE_ASPECT, LAYOUT} from './theme';

type ContentStackProps = {
	/** Continuous push-in scale for the "no true stillness" motion rule. */
	scale?: number;
	width?: number;
	/** height/width ratio. Defaults to the full 334x600 map canvas; scenes
	 * that only use a sub-region of that canvas should pass a tighter ratio
	 * (see mapLayout.ts) so the visible content fills its box instead of
	 * leaving it lopsided within an oversized, mostly-empty container. */
	aspect?: number;
	children: React.ReactNode;
};

// The relatively-positioned container every map/valley/water layer stack
// sits inside — a flex child of Stage, so it centers as part of the whole
// scene composition rather than being pinned to a fixed offset.
export const ContentStack: React.FC<ContentStackProps> = ({scale = 1, width = LAYOUT.contentWidth, aspect = IMAGE_ASPECT, children}) => (
	<div
		style={{
			position: 'relative',
			width,
			height: width * aspect,
			transform: `scale(${scale})`,
		}}
	>
		{children}
	</div>
);

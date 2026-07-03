type MapStackProps = {
	width: number;
	aspect: number;
	scale?: number;
	scaleX?: number;
	children: React.ReactNode;
};

// A relatively-positioned container for scenes that overlay several
// elements on top of a base image (map + highlight + label) — a flex child
// of Stage, so the whole group still centers together.
export const MapStack: React.FC<MapStackProps> = ({width, aspect, scale = 1, scaleX, children}) => (
	<div style={{position: 'relative', width, height: width * aspect, transform: `scale(${scaleX ?? scale}, ${scale})`}}>
		{children}
	</div>
);

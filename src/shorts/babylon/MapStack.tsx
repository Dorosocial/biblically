type MapStackProps = {
	width: number;
	aspect: number;
	scale?: number;
	children: React.ReactNode;
};

// A relatively-positioned container for scenes that overlay several
// elements on top of a base image (map + pin + distance line + rivers) —
// a flex child of Stage, so the whole group still centers together.
export const MapStack: React.FC<MapStackProps> = ({width, aspect, scale = 1, children}) => (
	<div style={{position: 'relative', width, height: width * aspect, transform: `scale(${scale})`}}>{children}</div>
);

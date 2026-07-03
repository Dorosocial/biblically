import {AbsoluteFill, Img} from 'remotion';
import {breathe, driftY} from './motion';
import {ASSETS, LAYOUT} from './theme';

type BibleLayerProps = {
	frame: number;
	fps: number;
	/** Extra scale multiplier for the entrance spring (Scene 1 only). Defaults to settled (1). */
	entranceScale?: number;
};

// The Bible cutout is pinned at the top of every scene. It's never fully
// static — a slow breathing scale + drift keeps it alive through every
// scene's hold, per the "no true stillness" motion rule.
export const BibleLayer: React.FC<BibleLayerProps> = ({frame, fps, entranceScale = 1}) => {
	const idleScale = breathe(frame, fps);
	const idleY = driftY(frame, fps);

	return (
		<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
			<Img
				src={ASSETS.bible}
				style={{
					width: LAYOUT.bibleWidth,
					transform: `translateY(${idleY}px) scale(${entranceScale * idleScale})`,
				}}
			/>
		</AbsoluteFill>
	);
};

import {Img} from 'remotion';
import {breathe, driftY} from './motion';
import {ASSETS, LAYOUT} from './theme';

type BibleLayerProps = {
	frame: number;
	fps: number;
	/** Extra scale multiplier for the entrance spring (Scene 1 only). Defaults to settled (1). */
	entranceScale?: number;
	width?: number;
};

// A flex child inside Stage (alongside ContentStack/text) so the whole
// scene composition centers as one group. Never fully static — a slow
// breathing scale + drift keeps it alive through every scene's hold, per
// the "no true stillness" motion rule.
export const BibleLayer: React.FC<BibleLayerProps> = ({frame, fps, entranceScale = 1, width = LAYOUT.bibleWidth}) => {
	const idleScale = breathe(frame, fps);
	const idleY = driftY(frame, fps);

	return (
		<Img
			src={ASSETS.bible}
			style={{
				width,
				transform: `translateY(${idleY}px) scale(${entranceScale * idleScale})`,
			}}
		/>
	);
};

import {interpolate} from 'remotion';
import {COLORS} from './theme';

// Stylized schematic map, not accurate cartographic data — a simplified
// landmass silhouette (Middle East / Fertile Crescent) with all four of
// Eden's named rivers (Genesis 2:10-14) traced as clean line-art. Pishon
// and Gihon trail off into the interior (their real-world identity is
// disputed), while Tigris and Euphrates run all the way to the Gulf and
// can be highlighted as "the two that still exist on a modern map."
type RiverPop = {
	/** 0-1 draw-in progress, via stroke-dashoffset. */
	progress: number;
	/** 0-1+ highlight progress (color shift + scale bounce + label reveal). Omit for rivers that never highlight. */
	pop?: number;
};

type MiddleEastMapProps = {
	width: number;
	pishon: number;
	gihon: number;
	tigris: RiverPop;
	euphrates: RiverPop;
};

const PISHON_PATH =
	'M340,120 C280,160 220,230 210,320 C205,390 240,450 290,500';
const GIHON_PATH =
	'M360,125 C300,190 250,270 230,360 C220,420 245,470 270,505';
const EUPHRATES_PATH =
	'M300,130 C280,220 320,280 300,350 C285,410 330,460 400,490 C460,515 540,500 590,462';
const TIGRIS_PATH =
	'M380,140 C400,220 370,280 395,350 C410,410 385,460 430,495 C470,520 530,510 585,465';

const scaleAround = (cx: number, cy: number, scale: number) =>
	`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;

const DrawnPath: React.FC<{
	d: string;
	progress: number;
	stroke: string;
	strokeWidth: number;
}> = ({d, progress, stroke, strokeWidth}) => (
	<path
		d={d}
		fill="none"
		stroke={stroke}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		pathLength={1}
		strokeDasharray={1}
		strokeDashoffset={1 - progress}
	/>
);

export const MiddleEastMap: React.FC<MiddleEastMapProps> = ({
	width,
	pishon,
	gihon,
	tigris,
	euphrates,
}) => {
	const height = width * (640 / 800);

	const tigrisPop = tigris.pop ?? 0;
	const euphratesPop = euphrates.pop ?? 0;

	// White -> cyan by fading out the red channel (green/blue are 255 in both).
	const tigrisRed = interpolate(tigrisPop, [0, 1], [255, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const euphratesRed = interpolate(euphratesPop, [0, 1], [255, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const tigrisScale = interpolate(tigrisPop, [0, 1], [1, 1.15]);
	const euphratesScale = interpolate(euphratesPop, [0, 1], [1, 1.15]);
	const tigrisLabelOpacity = interpolate(tigrisPop, [0, 0.35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const euphratesLabelOpacity = interpolate(euphratesPop, [0, 0.35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{width, height}}>
			<svg width="100%" height="100%" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet">
				{/* Simplified coastline / landmass outline. Gulf notch sits
				    lower-right so the rivers can flow north-to-southeast
				    into it without doubling back. */}
				<path
					d="M170,70 C320,42 480,42 590,80 C630,100 645,140 620,180
					   C660,230 665,280 640,320 C690,350 700,400 670,450
					   C640,430 610,440 600,480 C615,510 645,500 665,470
					   C690,520 680,560 630,590 C540,620 430,625 350,600
					   C280,615 210,590 175,540 C130,480 115,420 120,350
					   C100,290 105,230 125,175 C138,125 152,95 170,70 Z"
					fill="none"
					stroke={COLORS.mapLine}
					strokeWidth={3}
					strokeLinejoin="round"
				/>

				{/* Pishon and Gihon: draw in but never highlight — their
				    real-world course is unknown, so they trail off into
				    the interior instead of reaching the coast. */}
				<DrawnPath d={PISHON_PATH} progress={pishon} stroke={COLORS.mapLine} strokeWidth={3} />
				<DrawnPath d={GIHON_PATH} progress={gihon} stroke={COLORS.mapLine} strokeWidth={3} />

				{/* Euphrates */}
				<g transform={scaleAround(445, 400, euphratesScale)}>
					<DrawnPath
						d={EUPHRATES_PATH}
						progress={euphrates.progress}
						stroke={`rgb(${euphratesRed}, 255, 255)`}
						strokeWidth={4}
					/>
				</g>
				<text
					x={175}
					y={430}
					fill={COLORS.mapLabel}
					fontSize={24}
					fontFamily="sans-serif"
					letterSpacing={2}
					opacity={euphratesLabelOpacity}
					style={{transform: `scale(${euphratesScale})`, transformOrigin: '175px 430px'}}
				>
					EUPHRATES
				</text>

				{/* Tigris */}
				<g transform={scaleAround(480, 400, tigrisScale)}>
					<DrawnPath
						d={TIGRIS_PATH}
						progress={tigris.progress}
						stroke={`rgb(${tigrisRed}, 255, 255)`}
						strokeWidth={4}
					/>
				</g>
				<text
					x={430}
					y={430}
					fill={COLORS.mapLabel}
					fontSize={24}
					fontFamily="sans-serif"
					letterSpacing={2}
					opacity={tigrisLabelOpacity}
					style={{transform: `scale(${tigrisScale})`, transformOrigin: '430px 430px'}}
				>
					TIGRIS
				</text>
			</svg>
		</div>
	);
};

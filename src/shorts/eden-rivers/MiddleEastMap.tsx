import {interpolate} from 'remotion';
import {COLORS} from './theme';

// Stylized schematic map, not accurate cartographic data — a simplified
// landmass silhouette (Middle East / Fertile Crescent) with all four of
// Eden's named rivers (Genesis 2:10-14) traced as clean line-art. Pishon
// and Gihon trail off into the interior (their real-world identity is
// disputed), while Tigris and Euphrates run all the way to the Gulf and
// can be highlighted as "the two that still exist on a modern map."
// Turkey/Syria/Iraq are similarly simplified zones, not accurate borders.
type RiverPop = {
	/** 0-1 draw-in progress, via stroke-dashoffset. */
	progress: number;
	/** 0-1+ highlight progress (color shift + scale bounce + label reveal). Omit for rivers that never highlight. */
	pop?: number;
};

type CountryHighlights = {
	/** 0-1+ pop progress (fill/stroke fade in, slight scale pop). */
	turkey: number;
	syria: number;
	iraq: number;
};

type Pin = {
	/** 0-1+ drop-in progress (spring, may overshoot past its landing point). */
	dropProgress: number;
	/** Continuous scale multiplier for the idle pulse; 1 = resting size. */
	pulseScale: number;
};

type MiddleEastMapProps = {
	width: number;
	pishon: number;
	gihon: number;
	tigris: RiverPop;
	euphrates: RiverPop;
	countries?: CountryHighlights;
	pin?: Pin;
};

const PISHON_PATH = 'M340,120 C280,160 220,230 210,320 C205,390 240,450 290,500';
const GIHON_PATH = 'M360,125 C300,190 250,270 230,360 C220,420 245,470 270,505';
const EUPHRATES_PATH =
	'M300,130 C280,220 320,280 300,350 C285,410 330,460 400,490 C460,515 540,500 590,462';
const TIGRIS_PATH =
	'M380,140 C400,220 370,280 395,350 C410,410 385,460 430,495 C470,520 530,510 585,465';

// Basra sits at the Tigris/Euphrates confluence near the Gulf notch.
const BASRA_X = 594;
const BASRA_Y = 470;

const TURKEY_PATH =
	'M215,68 C320,44 480,44 580,70 C605,90 610,120 598,150 C520,178 400,188 300,182 C245,178 205,158 198,130 C193,105 200,84 215,68 Z';
const SYRIA_PATH =
	'M148,190 C215,178 300,185 328,215 C338,255 330,305 308,345 C268,362 195,358 160,328 C133,298 128,245 148,190 Z';
const IRAQ_PATH =
	'M330,210 C420,190 520,192 592,218 C645,248 668,300 652,340 C688,368 700,412 674,455 C650,494 610,504 585,470 C562,500 522,510 492,490 C452,510 402,505 372,480 C342,452 330,402 335,352 C318,302 316,252 330,210 Z';

const PIN_PATH =
	'M-13,-18 A13,13 0 1,1 13,-18 C13,-9 6,-3 0,0 C-6,-3 -13,-9 -13,-18 Z';

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

const CountryZone: React.FC<{
	d: string;
	progress: number;
	cx: number;
	cy: number;
	label: string;
	labelX: number;
	labelY: number;
}> = ({d, progress, cx, cy, label, labelX, labelY}) => {
	const clamped = Math.min(Math.max(progress, 0), 1);
	const fillOpacity = interpolate(clamped, [0, 1], [0, 0.2]);
	const strokeOpacity = interpolate(clamped, [0, 1], [0, 0.9]);
	const scale = interpolate(progress, [0, 1], [0.9, 1]);
	const labelOpacity = interpolate(clamped, [0, 0.4], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<g transform={scaleAround(cx, cy, scale)}>
			<path
				d={d}
				fill={COLORS.strokeCyan}
				fillOpacity={fillOpacity}
				stroke={COLORS.strokeCyan}
				strokeOpacity={strokeOpacity}
				strokeWidth={2.5}
				strokeLinejoin="round"
			/>
			<text
				x={labelX}
				y={labelY}
				fill={COLORS.mapLabel}
				fontSize={18}
				fontFamily="sans-serif"
				letterSpacing={1.5}
				opacity={labelOpacity}
			>
				{label}
			</text>
		</g>
	);
};

export const MiddleEastMap: React.FC<MiddleEastMapProps> = ({
	width,
	pishon,
	gihon,
	tigris,
	euphrates,
	countries,
	pin,
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

	const pinDropOffsetY = pin ? interpolate(pin.dropProgress, [0, 1], [-260, 0]) : 0;
	const pinOpacity = pin
		? interpolate(Math.min(pin.dropProgress, 1), [0, 0.05], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

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

				{/* Country highlights (Scene 2) */}
				{countries && (
					<>
						<CountryZone
							d={TURKEY_PATH}
							progress={countries.turkey}
							cx={390}
							cy={125}
							label="TURKEY"
							labelX={330}
							labelY={118}
						/>
						<CountryZone
							d={SYRIA_PATH}
							progress={countries.syria}
							cx={230}
							cy={270}
							label="SYRIA"
							labelX={178}
							labelY={272}
						/>
						<CountryZone
							d={IRAQ_PATH}
							progress={countries.iraq}
							cx={500}
							cy={350}
							label="IRAQ"
							labelX={440}
							labelY={250}
						/>
					</>
				)}

				{/* Basra location pin (Scene 2) */}
				{pin && (
					<g
						transform={`translate(${BASRA_X}, ${BASRA_Y + pinDropOffsetY}) scale(${pin.pulseScale})`}
						opacity={pinOpacity}
					>
						<path d={PIN_PATH} fill={COLORS.strokeCyan} stroke="white" strokeWidth={1.5} strokeLinejoin="round" />
					</g>
				)}
			</svg>
		</div>
	);
};

import {interpolate} from 'remotion';
import {COLORS} from './theme';

// Stylized schematic map, not accurate cartographic data — a simplified
// landmass silhouette (Middle East / Fertile Crescent) with all four of
// Eden's named rivers (Genesis 2:10-14) traced as clean line-art. Pishon
// and Gihon trail off into the interior (their real-world identity is
// disputed), while Tigris and Euphrates run all the way to the Gulf.
// Turkey/Syria/Iraq/Havilah/Cush are similarly simplified zones, not
// accurate borders.
export type RiverPop = {
	/** 0-1 draw-in progress, via stroke-dashoffset. */
	progress: number;
	/** 0-1+ highlight progress (color shift + scale bounce + label reveal). Omit to stay dim/unlabeled. */
	pop?: number;
};

type RegionHighlights = {
	/** 0-1+ pop progress (fill/stroke fade in, slight scale pop). Omit to hide a region entirely. */
	turkey?: number;
	syria?: number;
	iraq?: number;
	havilah?: number;
	cush?: number;
};

export type Pin = {
	/** 0-1+ drop-in progress (spring, may overshoot past its landing point). */
	dropProgress: number;
	/** Continuous scale multiplier for the idle pulse; 1 = resting size. */
	pulseScale: number;
};

type MiddleEastMapProps = {
	width: number;
	pishon: RiverPop;
	gihon: RiverPop;
	tigris: RiverPop;
	euphrates: RiverPop;
	regions?: RegionHighlights;
	pin?: Pin;
	/** 0-1: fades the whole map down to ~30% opacity. 0 = full opacity. */
	dim?: number;
	/** 0-1+: glow that blooms over the northern Gulf basin as a focal point. */
	basinGlow?: number;
};

// Pishon and Gihon now sweep the long way around (through Havilah / Cush
// respectively) but still converge on the same Gulf confluence point as
// Tigris and Euphrates, so all four visibly meet at one spot (Scene 2).
export const PISHON_PATH =
	'M340,120 C260,170 185,250 170,350 C160,430 190,505 270,555 C350,600 470,600 555,555 C610,525 615,490 594,468';
export const GIHON_PATH =
	'M400,140 C430,220 460,300 480,380 C500,440 530,480 560,510 C590,530 610,510 600,480 C598,475 596,472 594,468';
export const EUPHRATES_PATH =
	'M300,130 C280,220 320,280 300,350 C285,410 330,460 400,490 C460,515 540,500 590,462';
export const TIGRIS_PATH =
	'M380,140 C400,220 370,280 395,350 C410,410 385,460 430,495 C470,520 530,510 585,465';

// Basra sits at the Tigris/Euphrates confluence near the Gulf notch.
export const BASRA_X = 594;
export const BASRA_Y = 470;
// Northern Persian Gulf basin, just offshore from Basra.
export const BASIN_X = 655;
export const BASIN_Y = 375;

export const MAP_VIEWBOX = '0 0 800 640';
export const MAP_ASPECT = 640 / 800;

const COASTLINE_PATH =
	'M170,70 C320,42 480,42 590,80 C630,100 645,140 620,180 C660,230 665,280 640,320 C690,350 700,400 670,450 C640,430 610,440 600,480 C615,510 645,500 665,470 C690,520 680,560 630,590 C540,620 430,625 350,600 C280,615 210,590 175,540 C130,480 115,420 120,350 C100,290 105,230 125,175 C138,125 152,95 170,70 Z';

const TURKEY_PATH =
	'M215,68 C320,44 480,44 580,70 C605,90 610,120 598,150 C520,178 400,188 300,182 C245,178 205,158 198,130 C193,105 200,84 215,68 Z';
const SYRIA_PATH =
	'M148,190 C215,178 300,185 328,215 C338,255 330,305 308,345 C268,362 195,358 160,328 C133,298 128,245 148,190 Z';
const IRAQ_PATH =
	'M330,210 C420,190 520,192 592,218 C645,248 668,300 652,340 C688,368 700,412 674,455 C650,494 610,504 585,470 C562,500 522,510 492,490 C452,510 402,505 372,480 C342,452 330,402 335,352 C318,302 316,252 330,210 Z';
// Havilah ~ Arabian Peninsula: the landmass's southern taper.
const HAVILAH_PATH =
	'M230,540 C280,510 360,495 440,500 C520,505 580,520 610,555 C600,585 540,605 460,608 C380,610 300,600 250,580 C225,565 220,552 230,540 Z';
// Cush: "south and east of Mesopotamia" — placed southeast, along the Gulf coast.
const CUSH_PATH =
	'M540,440 C590,420 640,430 665,460 C685,490 680,530 655,555 C620,575 570,570 545,545 C525,520 522,470 540,440 Z';

const PIN_PATH = 'M-13,-18 A13,13 0 1,1 13,-18 C13,-9 6,-3 0,0 C-6,-3 -13,-9 -13,-18 Z';

export const scaleAround = (cx: number, cy: number, scale: number) =>
	`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;

export const DrawnPath: React.FC<{
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

const River: React.FC<{
	d: string;
	river: RiverPop;
	anchorX: number;
	anchorY: number;
	label: string;
	labelX: number;
	labelY: number;
}> = ({d, river, anchorX, anchorY, label, labelX, labelY}) => {
	const pop = river.pop ?? 0;
	// White -> cyan by fading out the red channel (green/blue are 255 in both).
	const red = interpolate(pop, [0, 1], [255, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = interpolate(pop, [0, 1], [1, 1.15]);
	const labelOpacity = interpolate(pop, [0, 0.35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const strokeWidth = interpolate(pop, [0, 1], [3, 4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<>
			<g transform={scaleAround(anchorX, anchorY, scale)}>
				<DrawnPath d={d} progress={river.progress} stroke={`rgb(${red}, 255, 255)`} strokeWidth={strokeWidth} />
			</g>
			<text
				x={labelX}
				y={labelY}
				fill={COLORS.mapLabel}
				fontSize={24}
				fontFamily="sans-serif"
				letterSpacing={2}
				opacity={labelOpacity}
				style={{transform: `scale(${scale})`, transformOrigin: `${labelX}px ${labelY}px`}}
			>
				{label}
			</text>
		</>
	);
};

const RegionZone: React.FC<{
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
	regions,
	pin,
	dim = 0,
	basinGlow = 0,
}) => {
	const height = width * MAP_ASPECT;

	const pinDropOffsetY = pin ? interpolate(pin.dropProgress, [0, 1], [-260, 0]) : 0;
	const pinOpacity = pin
		? interpolate(Math.min(pin.dropProgress, 1), [0, 0.05], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	const mapOpacity = interpolate(dim, [0, 1], [1, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glowScale = interpolate(basinGlow, [0, 1], [0.6, 1.4]);
	const glowOpacity = interpolate(Math.min(basinGlow, 1), [0, 1], [0, 0.8]);

	return (
		<div style={{width, height}}>
			<svg width="100%" height="100%" viewBox={MAP_VIEWBOX} preserveAspectRatio="xMidYMid meet">
				<g opacity={mapOpacity}>
					{/* Simplified coastline / landmass outline. Gulf notch sits
					    lower-right so the rivers can flow north-to-southeast
					    into it without doubling back. */}
					<path d={COASTLINE_PATH} fill="none" stroke={COLORS.mapLine} strokeWidth={3} strokeLinejoin="round" />

					<River d={PISHON_PATH} river={pishon} anchorX={280} anchorY={480} label="PISHON" labelX={165} labelY={470} />
					<River d={GIHON_PATH} river={gihon} anchorX={500} anchorY={420} label="GIHON" labelX={500} labelY={355} />
					<River
						d={EUPHRATES_PATH}
						river={euphrates}
						anchorX={445}
						anchorY={400}
						label="EUPHRATES"
						labelX={175}
						labelY={430}
					/>
					<River d={TIGRIS_PATH} river={tigris} anchorX={480} anchorY={400} label="TIGRIS" labelX={430} labelY={430} />

					{regions?.turkey !== undefined && (
						<RegionZone d={TURKEY_PATH} progress={regions.turkey} cx={390} cy={125} label="TURKEY" labelX={330} labelY={118} />
					)}
					{regions?.syria !== undefined && (
						<RegionZone d={SYRIA_PATH} progress={regions.syria} cx={230} cy={270} label="SYRIA" labelX={178} labelY={272} />
					)}
					{regions?.iraq !== undefined && (
						<RegionZone d={IRAQ_PATH} progress={regions.iraq} cx={500} cy={350} label="IRAQ" labelX={440} labelY={250} />
					)}
					{regions?.havilah !== undefined && (
						<RegionZone
							d={HAVILAH_PATH}
							progress={regions.havilah}
							cx={420}
							cy={555}
							label="HAVILAH"
							labelX={340}
							labelY={558}
						/>
					)}
					{regions?.cush !== undefined && (
						<RegionZone d={CUSH_PATH} progress={regions.cush} cx={600} cy={495} label="CUSH" labelX={555} labelY={498} />
					)}

					{pin && (
						<g
							transform={`translate(${BASRA_X}, ${BASRA_Y + pinDropOffsetY}) scale(${pin.pulseScale})`}
							opacity={pinOpacity}
						>
							<path d={PIN_PATH} fill={COLORS.strokeCyan} stroke="white" strokeWidth={1.5} strokeLinejoin="round" />
						</g>
					)}
				</g>

				{basinGlow > 0 && (
					<g transform={scaleAround(BASIN_X, BASIN_Y, glowScale)} opacity={glowOpacity}>
						<circle cx={BASIN_X} cy={BASIN_Y} r={90} fill={COLORS.strokeCyan} opacity={0.15} />
						<circle cx={BASIN_X} cy={BASIN_Y} r={55} fill={COLORS.strokeCyan} opacity={0.28} />
						<circle cx={BASIN_X} cy={BASIN_Y} r={26} fill={COLORS.strokeCyan} opacity={0.55} />
					</g>
				)}
			</svg>
		</div>
	);
};

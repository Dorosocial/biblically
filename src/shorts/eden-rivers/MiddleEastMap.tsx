import {COLORS} from './theme';

// Stylized schematic map, not accurate cartographic data — a simplified
// landmass silhouette (Middle East / Fertile Crescent) with the Tigris and
// Euphrates traced as clean line-art, per the video's "line-art map, no
// photographic map images" fingerprint.
type MiddleEastMapProps = {
	width: number;
};

export const MiddleEastMap: React.FC<MiddleEastMapProps> = ({width}) => {
	const height = width * (640 / 800);

	return (
		<div style={{width, height}}>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 800 640"
				preserveAspectRatio="xMidYMid meet"
			>
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

				{/* Euphrates: highlands (north) flowing southeast to the Gulf */}
				<path
					d="M300,130 C280,220 320,280 300,350 C285,410 330,460 400,490
					   C460,515 540,500 590,462"
					fill="none"
					stroke="white"
					strokeWidth={4}
					strokeLinecap="round"
				/>
				<circle cx={300} cy={130} r={5} fill="white" />
				<text
					x={185}
					y={430}
					fill={COLORS.mapLabel}
					fontSize={22}
					fontFamily="sans-serif"
					letterSpacing={2}
				>
					EUPHRATES
				</text>

				{/* Tigris: parallels the Euphrates, converging near the Gulf */}
				<path
					d="M380,140 C400,220 370,280 395,350 C410,410 385,460 430,495
					   C470,520 530,510 585,465"
					fill="none"
					stroke="white"
					strokeWidth={4}
					strokeLinecap="round"
				/>
				<circle cx={380} cy={140} r={5} fill="white" />
				<text
					x={430}
					y={430}
					fill={COLORS.mapLabel}
					fontSize={22}
					fontFamily="sans-serif"
					letterSpacing={2}
				>
					TIGRIS
				</text>
			</svg>
		</div>
	);
};

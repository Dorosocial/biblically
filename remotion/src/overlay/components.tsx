import React from 'react';
import {useCurrentFrame} from 'remotion';
import {climbIn, pulse, glowPulse, slideIn} from '../lib/animations';
import {theme, fontStack} from '../lib/theme';

const glowText = (color: string, strength: number) =>
	`0 0 ${18 * strength}px ${color}, 0 0 ${44 * strength}px ${color}, 0 0 ${90 * strength}px ${color}66`;

export const BigGlowNumber: React.FC<{
	value: string;
	label?: string;
	startFrame: number;
	color?: string;
	size?: number;
	seed?: number;
	y?: number | string;
}> = ({value, label, startFrame, color = theme.glowCyanBright, size = 108, seed = 0, y = '36%'}) => {
	const frame = useCurrentFrame();
	const {opacity, translateY, scale} = climbIn(frame, startFrame, 20);
	const p = pulse(frame, seed, 1.4, 0.03);
	const g = glowPulse(frame, seed, 1.4);

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: y,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				opacity,
				transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale * p})`,
				width: '90%',
			}}
		>
			<div
				style={{
					fontFamily: fontStack,
					fontWeight: 800,
					fontSize: size,
					letterSpacing: -1,
					color,
					textShadow: glowText(color, g),
					textAlign: 'center',
					lineHeight: 1.05,
				}}
			>
				{value}
			</div>
			{label ? (
				<div
					style={{
						marginTop: 14,
						fontFamily: fontStack,
						fontWeight: 600,
						fontSize: 30,
						letterSpacing: 6,
						color: theme.textDim,
						textTransform: 'uppercase',
					}}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};

export const CaptionTag: React.FC<{text: string; startFrame: number; y?: number}> = ({text, startFrame, y}) => {
	const frame = useCurrentFrame();
	const {opacity, translateY} = climbIn(frame, startFrame, 14);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y,
				display: 'flex',
				justifyContent: 'center',
				opacity,
				transform: `translateY(${translateY}px)`,
			}}
		>
			<div
				style={{
					fontFamily: fontStack,
					fontWeight: 600,
					fontSize: 30,
					color: theme.textPrimary,
					background: 'rgba(7,11,22,0.55)',
					padding: '10px 26px',
					borderRadius: 999,
					border: `1px solid ${theme.glowCyan}55`,
				}}
			>
				{text}
			</div>
		</div>
	);
};

export const TimelineBar: React.FC<{
	label: string;
	sublabel?: string;
	fillPct: number; // 0..100, can exceed 100 to "stretch beyond the edges"
	startFrame: number;
	color?: string;
	y: number;
	glow?: number;
}> = ({label, sublabel, fillPct, startFrame, color = theme.glowCyan, y, glow = 1}) => {
	const frame = useCurrentFrame();
	const {opacity, translateY} = climbIn(frame, startFrame, 18);
	const local = frame - startFrame;
	const grownPct = Math.min(fillPct, Math.max(0, fillPct * Math.min(1, local / 20)));
	const g = glowPulse(frame, y, 1.2);

	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				right: 60,
				top: y,
				opacity,
				transform: `translateY(${translateY}px)`,
			}}
		>
			<div style={{fontFamily: fontStack, color: theme.textPrimary, fontWeight: 700, fontSize: 30, marginBottom: 10}}>{label}</div>
			<div
				style={{
					position: 'relative',
					height: 34,
					borderRadius: 17,
					background: 'rgba(255,255,255,0.08)',
					overflow: 'hidden',
					border: `1px solid ${color}44`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						bottom: 0,
						width: `${Math.min(grownPct, 100)}%`,
						background: `linear-gradient(90deg, ${color}bb, ${color})`,
						boxShadow: `0 0 ${18 * glow * g}px ${color}`,
					}}
				/>
			</div>
			{sublabel ? (
				<div style={{fontFamily: fontStack, color: theme.textDim, fontWeight: 500, fontSize: 22, marginTop: 8}}>{sublabel}</div>
			) : null}
		</div>
	);
};

export const SplitCompare: React.FC<{
	leftValue: string;
	leftLabel: string;
	rightValue: string;
	rightLabel: string;
	startFrame: number;
}> = ({leftValue, leftLabel, rightValue, rightLabel, startFrame}) => {
	const frame = useCurrentFrame();
	const left = slideIn(frame, startFrame, -80);
	const right = slideIn(frame, startFrame + 4, 80);
	const g = glowPulse(frame, 0, 1.3);

	const col = (value: string, label: string, color: string, anim: {opacity: number; translateX: number}) => (
		<div
			style={{
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity: anim.opacity,
				transform: `translateX(${anim.translateX}px)`,
			}}
		>
			<div
				style={{
					fontFamily: fontStack,
					fontWeight: 800,
					fontSize: 58,
					color,
					textShadow: glowText(color, g),
					textAlign: 'center',
				}}
			>
				{value}
			</div>
			<div style={{marginTop: 10, fontFamily: fontStack, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: theme.textDim}}>
				{label}
			</div>
		</div>
	);

	return (
		<div style={{position: 'absolute', left: 40, right: 40, top: '42%', display: 'flex', alignItems: 'center'}}>
			{col(leftValue, leftLabel, theme.glowCyanBright, left)}
			<div style={{width: 2, height: 90, background: theme.textDim, opacity: 0.4}} />
			{col(rightValue, rightLabel, theme.glowAmberBright, right)}
		</div>
	);
};

export const CounterReadout: React.FC<{value: string; startFrame: number; y?: number | string; size?: number}> = ({
	value,
	startFrame,
	y = '54%',
	size = 78,
}) => {
	const frame = useCurrentFrame();
	const {opacity, scale} = climbIn(frame, startFrame, 12);
	const g = glowPulse(frame, 5, 3.2);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y,
				display: 'flex',
				justifyContent: 'center',
				opacity,
				transform: `scale(${scale})`,
			}}
		>
			<div
				style={{
					fontFamily: fontStack,
					fontWeight: 800,
					fontSize: size,
					color: theme.glowCyanBright,
					textShadow: glowText(theme.glowCyanBright, g),
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{value}
			</div>
		</div>
	);
};

export const StackNumbers: React.FC<{items: string[]; startFrame: number; revealSpacing?: number}> = ({
	items,
	startFrame,
	revealSpacing = 22,
}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: '30%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 22,
			}}
		>
			{items.map((it, i) => {
				const sf = startFrame + i * revealSpacing;
				const {opacity, translateY, scale} = climbIn(frame, sf, 16);
				const g = glowPulse(frame, i, 1.6);
				const isLast = i === items.length - 1;
				const color = isLast ? theme.glowAmberBright : theme.glowCyan;
				return (
					<div
						key={it}
						style={{
							opacity,
							transform: `translateY(${translateY}px) scale(${scale})`,
							fontFamily: fontStack,
							fontWeight: 800,
							fontSize: isLast ? 66 : 46,
							color,
							textShadow: glowText(color, g * (isLast ? 1.3 : 0.8)),
						}}
					>
						{it}
					</div>
				);
			})}
		</div>
	);
};

const SEASONS = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

export const CalendarWheel: React.FC<{startFrame: number; progress: number}> = ({startFrame, progress}) => {
	const frame = useCurrentFrame();
	const {opacity, scale} = climbIn(frame, startFrame, 16);
	const angle = progress * 360;
	const seasonIdx = Math.min(SEASONS.length - 1, Math.floor(progress * SEASONS.length));

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: '58%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity,
				transform: `scale(${scale})`,
			}}
		>
			<div
				style={{
					width: 220,
					height: 220,
					borderRadius: '50%',
					border: `3px solid ${theme.glowAmber}`,
					position: 'relative',
					boxShadow: `0 0 40px ${theme.glowAmber}55`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 4,
						height: 96,
						background: theme.glowCyanBright,
						transformOrigin: '50% 0%',
						transform: `translate(-50%, 0) rotate(${angle}deg)`,
						boxShadow: `0 0 14px ${theme.glowCyanBright}`,
					}}
				/>
				{SEASONS.map((s, i) => (
					<div
						key={s}
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: `rotate(${i * 90}deg) translate(0, -128px) rotate(${-i * 90}deg) translate(-50%, -50%)`,
							fontFamily: fontStack,
							fontSize: 16,
							fontWeight: 700,
							color: theme.textDim,
							letterSpacing: 2,
						}}
					>
						{s}
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 20,
					fontFamily: fontStack,
					fontWeight: 700,
					fontSize: 28,
					letterSpacing: 4,
					color: theme.glowAmberBright,
				}}
			>
				{SEASONS[seasonIdx]}
			</div>
		</div>
	);
};

export const MultiplierBadge: React.FC<{value: string; startFrame: number}> = ({value, startFrame}) => {
	const frame = useCurrentFrame();
	const {opacity, translateY, scale} = climbIn(frame, startFrame, 18);
	const g = glowPulse(frame, 9, 2.1);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: '38%',
				display: 'flex',
				justifyContent: 'center',
				opacity,
				transform: `translateY(${translateY}px) scale(${scale})`,
			}}
		>
			<div
				style={{
					fontFamily: fontStack,
					fontWeight: 900,
					fontSize: 92,
					color: theme.glowRose,
					textShadow: glowText(theme.glowRose, g),
				}}
			>
				{value}
			</div>
		</div>
	);
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS, HEIGHT, WIDTH} from '../constants';

const SHAPES: {kind: 'circle' | 'triangle' | 'bar'; x: number; y: number; period: number; phase: number}[] = [
	{kind: 'circle', x: WIDTH * 0.14, y: HEIGHT * 0.2, period: FPS * 0.9, phase: 0},
	{kind: 'triangle', x: WIDTH * 0.86, y: HEIGHT * 0.18, period: FPS * 1.1, phase: 1.4},
	{kind: 'bar', x: WIDTH * 0.15, y: HEIGHT * 0.82, period: FPS * 0.75, phase: 2.8},
];

const ShapeGlyph: React.FC<{kind: 'circle' | 'triangle' | 'bar'; size: number; color: string}> = ({
	kind,
	size,
	color,
}) => {
	if (kind === 'circle') {
		return <div style={{width: size, height: size, borderRadius: '50%', backgroundColor: color}} />;
	}

	if (kind === 'bar') {
		return <div style={{width: size * 2, height: size * 0.4, backgroundColor: color}} />;
	}

	return (
		<div
			style={{
				width: 0,
				height: 0,
				borderLeft: `${size / 2}px solid transparent`,
				borderRight: `${size / 2}px solid transparent`,
				borderBottom: `${size}px solid ${color}`,
			}}
		/>
	);
};

// Continuous pulse rather than a hard on/off flash, so there's never a frame
// where the shape sits fully static — opacity and scale ride the same sine.
export const FlashingShapes: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<>
			{SHAPES.map((shape, i) => {
				const pulse = (Math.sin((frame / shape.period) * Math.PI * 2 + shape.phase) + 1) / 2;
				const opacity = 0.15 + pulse * 0.75;
				const scale = 0.8 + pulse * 0.5;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: shape.x,
							top: shape.y,
							opacity,
							transform: `scale(${scale})`,
						}}
					>
						<ShapeGlyph kind={shape.kind} size={46} color="#FFD23F" />
					</div>
				);
			})}
		</>
	);
};

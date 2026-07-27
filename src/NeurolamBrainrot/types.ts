export type DistractorType =
	| 'circle'
	| 'triangle'
	| 'bar'
	| 'text'
	| 'particle'
	| 'glitch'
	| 'strobe'
	| 'gradient'
	| 'pattern';

export type MotionKind = 'static' | 'linear' | 'orbit';

export interface ParticleSeed {
	angle: number;
	maxDist: number;
	size: number;
	delay: number; // 0..1 fraction of duration
}

export interface DistractorSpec {
	id: string;
	type: DistractorType;
	startFrame: number;
	duration: number;
	motion: MotionKind;
	color: string;
	color2: string;
	size: number;
	rotation: number;
	spin: number;
	intensity: number;
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	orbitRadius: number;
	orbitAngle: number;
	text?: string;
	particles?: ParticleSeed[];
	bandHeight?: number;
	aspect?: number;
}

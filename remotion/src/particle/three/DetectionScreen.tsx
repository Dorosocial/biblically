import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../theme';

interface Props {
	opacity: number;
	interferenceAmount: number; // 0..1 overall band visibility
	collapseMix: number; // 0 = interference stripes, 1 = two-band collapsed
	position?: [number, number, number];
}

const W = 128;
const H = 220;

const hexToRgb = (hex: string): [number, number, number] => {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Flat detection screen behind the barrier. Its texture is redrawn each
 * frame from two scalars: how visible the banding is at all
 * (interferenceAmount), and whether it reads as multi-band interference
 * stripes or a collapsed two-band distribution (collapseMix).
 */
export const DetectionScreen: React.FC<Props> = ({opacity, interferenceAmount, collapseMix, position = [0, 0, -4]}) => {
	const texture = useMemo(() => {
		const canvas = document.createElement('canvas');
		canvas.width = W;
		canvas.height = H;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('2d context unavailable');

		const dark = hexToRgb(theme.bandDark);
		const bright = hexToRgb(theme.bandBright);
		const img = ctx.createImageData(W, H);

		for (let x = 0; x < W; x++) {
			const u = x / (W - 1);
			const envelope = Math.exp(-8 * (u - 0.5) * (u - 0.5));
			const interference = Math.pow(Math.cos(Math.PI * 6 * (u - 0.5)), 2) * envelope;
			const twoBand = Math.exp(-120 * (u - 0.35) * (u - 0.35)) + Math.exp(-120 * (u - 0.65) * (u - 0.65));
			const mixed = interference * (1 - collapseMix) + Math.min(1, twoBand) * collapseMix;
			const brightness = mixed * interferenceAmount;

			const r = dark[0] + (bright[0] - dark[0]) * brightness;
			const g = dark[1] + (bright[1] - dark[1]) * brightness;
			const b = dark[2] + (bright[2] - dark[2]) * brightness;

			for (let y = 0; y < H; y++) {
				const idx = (y * W + x) * 4;
				img.data[idx] = r;
				img.data[idx + 1] = g;
				img.data[idx + 2] = b;
				img.data[idx + 3] = 255;
			}
		}
		ctx.putImageData(img, 0, 0);
		const tex = new THREE.CanvasTexture(canvas);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [interferenceAmount, collapseMix]);

	if (opacity <= 0.001) return null;

	return (
		<group position={position}>
			<mesh>
				<planeGeometry args={[2.6, 3.4]} />
				<meshStandardMaterial map={texture} transparent opacity={opacity} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.35} />
			</mesh>
			{/* frame */}
			<mesh position={[0, 0, -0.03]}>
				<boxGeometry args={[2.8, 3.6, 0.06]} />
				<meshStandardMaterial color={theme.screenColor} transparent opacity={opacity} roughness={0.7} />
			</mesh>
		</group>
	);
};

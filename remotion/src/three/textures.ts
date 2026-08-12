import * as THREE from 'three';

let oceanTextureCache: THREE.CanvasTexture | null = null;

/**
 * Procedurally generated ocean/cloud speckle texture for the Earth sphere.
 * Built fresh here (canvas-drawn) rather than reusing an external
 * earth_daymap.jpg, since no prior video's assets are available in this
 * repo — continents are layered on top as separate drifting meshes.
 */
export const getOceanTexture = (): THREE.CanvasTexture => {
	if (oceanTextureCache) return oceanTextureCache;
	const size = 512;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('2d context unavailable');

	const grad = ctx.createLinearGradient(0, 0, 0, size);
	grad.addColorStop(0, '#1c5c8f');
	grad.addColorStop(0.5, '#123a63');
	grad.addColorStop(1, '#0a2340');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, size, size);

	// subtle cloud/current speckle
	let seed = 42;
	const rand = () => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return (seed % 10000) / 10000;
	};
	for (let i = 0; i < 260; i++) {
		const x = rand() * size;
		const y = rand() * size;
		const r = 4 + rand() * 22;
		ctx.beginPath();
		ctx.fillStyle = `rgba(255,255,255,${0.02 + rand() * 0.05})`;
		ctx.ellipse(x, y, r, r * 0.4, rand() * Math.PI, 0, Math.PI * 2);
		ctx.fill();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.colorSpace = THREE.SRGBColorSpace;
	oceanTextureCache = texture;
	return texture;
};

// The detection screen: a flat panel behind the barrier whose shader can
// smoothly cross-fade between three pattern states: interference bands,
// a simple two-band distribution (post-measurement), and pulsing
// multi-outcome glow regions (pre-measurement superposition of outcomes).
import React, {useMemo} from 'react';
import {makeScreenMaterial} from './shaders';
import type {V3} from './math';

export const DetectionScreen: React.FC<{
	position: V3;
	width?: number;
	height?: number;
	interferenceAmt?: number;
	twoBandAmt?: number;
	multiAmt?: number;
	panelGlow?: number;
	time?: number;
	color?: string;
}> = ({
	position,
	width = 2.6,
	height = 3.6,
	interferenceAmt = 0,
	twoBandAmt = 0,
	multiAmt = 0,
	panelGlow = 1,
	time = 0,
	color = '#8fe0ff',
}) => {
	const material = useMemo(() => makeScreenMaterial(color), [color]);
	material.uniforms.uInterferenceAmt.value = interferenceAmt;
	material.uniforms.uTwoBandAmt.value = twoBandAmt;
	material.uniforms.uMultiAmt.value = multiAmt;
	material.uniforms.uPanelGlow.value = panelGlow;
	material.uniforms.uTime.value = time;

	return (
		<mesh position={position} material={material}>
			<planeGeometry args={[width, height]} />
		</mesh>
	);
};

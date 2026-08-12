import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SHOTS} from '../timing';
import {shotEnvelope} from '../envelope';
import {renderShotOverlay} from './ShotOverlay';

export const Overlay: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{SHOTS.map((shot) => {
				const opacity = shotEnvelope(frame, shot);
				if (opacity <= 0.001) return null;
				const content = renderShotOverlay(shot, frame);
				if (!content) return null;
				return (
					<AbsoluteFill key={shot.id} style={{opacity}}>
						{content}
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};

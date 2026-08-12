import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SHOTS} from '../lib/timing';
import {shotEnvelope} from '../lib/envelope';
import {renderShotOverlay} from './ShotOverlay';

/**
 * Stacks every shot's HTML overlay content, each faded by its own
 * shotEnvelope(). Only shots within ~0.3s of the current frame ever
 * contribute non-zero opacity, so in practice this is "current shot" plus
 * a short crossfade with its neighbor across each cut.
 */
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

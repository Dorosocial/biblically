import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {generateSchedule, getActiveDistractors} from './schedule';
import {Distractor} from './Distractor';
import {HEIGHT, WIDTH} from './constants';

// Rendered *beneath* the exclusion occluder + center dot. Distractors may
// move anywhere across the full frame, including straight through the
// center — the occluder above this layer guarantees the exclusion zone
// itself never shows any of it.
export const DistractorLayer: React.FC = () => {
	const frame = useCurrentFrame();
	const schedule = useMemo(() => generateSchedule(), []);
	const active = getActiveDistractors(schedule, frame);

	return (
		<div style={{position: 'absolute', width: WIDTH, height: HEIGHT, overflow: 'hidden'}}>
			{active.map((spec) => (
				<Distractor key={spec.id} spec={spec} frame={frame} />
			))}
		</div>
	);
};

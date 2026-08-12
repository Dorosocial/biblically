import React from 'react';
import {useCurrentFrame} from 'remotion';
import {getSceneState} from '../lib/sceneState';
import {CameraRig} from './CameraRig';
import {Lighting} from './Lighting';
import {AmbientField} from './AmbientField';
import {Stopwatch} from './Stopwatch';
import {PersonFigure} from './PersonFigure';
import {EarthGlobe} from './EarthGlobe';
import {Mountains} from './Mountains';
import {SpeciesMarkers} from './SpeciesMarkers';

/**
 * All persistent 3D content for the whole 66.8s film, driven entirely off
 * the single frame-indexed SceneState track so nothing pops or re-mounts
 * between shots.
 */
export const Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = getSceneState(frame);

	return (
		<>
			<CameraRig />
			<Lighting />
			<AmbientField intensity={s.particlesIntensity} />

			<Stopwatch position={[0, -1.35, 0]} scale={0.72} opacity={s.stopwatchOpacity} tickSpeed={1.1} />

			<PersonFigure position={[-0.55, -0.95, 0]} opacity={s.personOpacity} age={s.personAge} />

			<EarthGlobe
				position={[0, 0, 0]}
				opacity={s.earthOpacity}
				continentDrift={s.continentDrift}
				iceAmount={s.iceAmount}
				rotationSpeed={1}
			/>

			<Mountains position={[0, -1.4, 0]} opacity={s.mountainsOpacity} height={s.mountainHeight} size={7} />

			<SpeciesMarkers position={[0, -1.4, 0]} amount={s.speciesAmount * s.speciesOpacity} />
		</>
	);
};

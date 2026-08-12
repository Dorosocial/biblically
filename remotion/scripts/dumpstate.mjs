import {getSceneState} from '../src/particle/sceneState.ts';
const f = Number(process.argv[2]);
console.log(f, (f/30).toFixed(2)+'s', getSceneState(f));

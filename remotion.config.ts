import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Remotion's default full-range (JPEG) color tagging on yuv420p causes some
// players (especially mobile/native ones) to fail or mis-render. Force
// standard limited-range color so exports are broadly compatible.
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');

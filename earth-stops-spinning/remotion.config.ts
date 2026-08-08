import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
// The sandboxed render environment proxies outbound HTTPS (including
// Google Fonts, fetched at render time by @remotion/google-fonts) through
// a CA the headless browser doesn't trust by default.
Config.setChromiumIgnoreCertificateErrors(true);

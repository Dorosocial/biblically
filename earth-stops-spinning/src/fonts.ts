import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: spaceGroteskFamily } = loadSpaceGrotesk('normal', {
  weights: ['500', '600', '700'],
});

const { fontFamily: interFamily } = loadInter('normal', {
  weights: ['400', '500', '600'],
});

export const headlineFontFamily = spaceGroteskFamily;
export const captionFontFamily = interFamily;

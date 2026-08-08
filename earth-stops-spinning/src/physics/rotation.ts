/**
 * Real, derived physics constants for Earth's rotation.
 *
 * Nothing in this file is a fitted or eyeballed number — every exported
 * constant is either a measured physical quantity (radius, day length,
 * speed of sound) or is *computed* from those quantities. Components must
 * import from here rather than hardcoding values like "464.6" or "1672"
 * directly, so the whole video stays internally consistent and auditable.
 */

/** Mean equatorial radius of Earth, in meters. */
export const EARTH_RADIUS_M = 6_371_000;

/**
 * Length of a sidereal day, in seconds — the time for Earth to complete
 * one full 360° rotation relative to the distant stars (not the Sun).
 * This is the correct period to use for rotational *speed*, since the
 * solar day (86,400s) is stretched by Earth's orbital motion.
 */
export const SIDEREAL_DAY_S = 86_164;

/** Earth's angular velocity, in radians per second: ω = 2π / T. */
export const OMEGA = (2 * Math.PI) / SIDEREAL_DAY_S;

/** Speed of sound in dry air at sea level, ~20°C, in meters per second. */
export const SPEED_OF_SOUND_MPS = 343;

/**
 * Only used for animation *timing*, never for any physics calculation or
 * on-screen readout. Real Earth rotation (one revolution per ~86,164s) is
 * imperceptible over a 70s video, so scenes that show the ground visibly
 * turning compress time by this factor purely for pacing/legibility.
 * Every velocity, distance, and Mach number displayed on screen still
 * comes straight out of the real-physics functions below.
 */
export const VISUAL_SPEEDUP_FACTOR = 2400;

/**
 * Tangential (rotational) speed of a point on Earth's surface at a given
 * latitude, in meters per second.
 *
 * v = ω * R * cos(latitude)
 *
 * The radius of the circle a point sweeps out shrinks by cos(latitude) as
 * you move away from the equator toward the poles, since the point moves
 * on a "slice" of the sphere rather than the full equatorial circle.
 */
export function tangentialVelocity(latitudeDeg: number): number {
  const latitudeRad = (latitudeDeg * Math.PI) / 180;
  return OMEGA * EARTH_RADIUS_M * Math.cos(latitudeRad);
}

/** Mach number: ratio of a speed to the speed of sound. */
export function machNumber(speedMps: number): number {
  return speedMps / SPEED_OF_SOUND_MPS;
}

/** Convert meters/second to kilometers/hour. */
export function msToKmh(mps: number): number {
  return mps * 3.6;
}

/** Convenience: the real equatorial rotational speed, in m/s (~464.6). */
export const EQUATOR_VELOCITY_MPS = tangentialVelocity(0);

/** Convenience: the real equatorial rotational speed, in km/h (~1672.6). */
export const EQUATOR_VELOCITY_KMH = msToKmh(EQUATOR_VELOCITY_MPS);

/** Convenience: Mach number of the equatorial rotational speed (~1.35). */
export const EQUATOR_MACH = machNumber(EQUATOR_VELOCITY_MPS);

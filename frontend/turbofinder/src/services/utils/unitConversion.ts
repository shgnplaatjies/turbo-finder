const CONVERSION_FACTOR_G_TO_OZ = 0.03527;
const CONVERSION_FACTOR_KM_TO_MI = 0.62137;

export const gramsToOunces = (grams: number): number =>
  grams / CONVERSION_FACTOR_G_TO_OZ;

export const kilometersToMiles = (kilometers: number): number =>
  kilometers / CONVERSION_FACTOR_KM_TO_MI;

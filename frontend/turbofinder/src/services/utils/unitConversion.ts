const CONVERSION_FACTOR_G_TO_OZ = 28.3495;
const CONVERSION_FACTOR_KM_TO_MI = 1.60934;

export const ouncesToGrams = (ounces: number): number =>
  ounces * CONVERSION_FACTOR_G_TO_OZ;

export const gramsToOunces = (grams: number): number =>
  grams / CONVERSION_FACTOR_G_TO_OZ;

export const milesToKilometers = (miles: number): number =>
  miles * CONVERSION_FACTOR_KM_TO_MI;

export const kilometersToMiles = (kilometers: number): number =>
  kilometers / CONVERSION_FACTOR_KM_TO_MI;

// Helper functions for data processing on stats page

// Calculate weekly progress values
export function calculateProgress(current: number, goal: number): number {
  // Avoid division by zero
  if (goal === 0) {
    return 0;
  }

  // Force float division
  // Then truncate
  const progress = Math.trunc(((current * 1.0) / goal) * 100);
  return progress;
}

export function metersToKilometers(value: number): number {
  const updatedValue = (value * 1.0) / 1000;
  const updatedValueRounded =
    // Fancy rounding algorithm
    Math.round((updatedValue + Number.EPSILON) * 10) / 10;

  return updatedValueRounded;
}

export function secondsToHours(value: number): number {
  const updatedValue = (value * 1.0) / 3600;
  const updatedValueRounded =
    // Fancy rounding algorithm
    Math.round((updatedValue + Number.EPSILON) * 10) / 10;

  return updatedValueRounded;
}

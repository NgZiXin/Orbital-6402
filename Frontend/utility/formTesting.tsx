// Helper functions for form field validation

// Checks if height is float & between 1 - 5
export function heightTest(value: string) {
  const floatValue: number = parseFloat(value);
  if (isNaN(floatValue)) {
    return false;
  }

  return floatValue >= 1 && floatValue <= 5;
}

// Checks if weight is float and more than 30
export function weightTest(value: string) {
  const floatValue: number = parseFloat(value);
  if (isNaN(floatValue)) {
    return false;
  }

  return floatValue >= 30;
}

// Checks if age is at least 13 years old, based on birthday
export function birthdayTest(value: Date) {
  const currentDate: Date = new Date();
  let ageDiff: number = currentDate.getFullYear() - value.getFullYear();
  const monthDiff: number = currentDate.getMonth() - value.getMonth();

  // If the current month is before the birth month or in the same month but birth day is ahead of current day
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < value.getDate())
  ) {
    ageDiff--;
  }

  return ageDiff >= 13;
}

// Checks for valid SG postal code
export function postalCodeTest(value: string): boolean {
  // First two digits: 01 - 82, excluding 74
  // Last four digits any
  // Not exactly an accurate check for valid SG postal code!
  const regex = /^(0[1-9]|[1-6][0-9]|7[0-3]|7[5-9]|8[0-2])\d{4}$/;
  return regex.test(value);
}

// Helper functions for data processing on profile page

// Converts bday from YYYY-MM-DD to DD-MM-YYYY
export function processBirthday(birthday: string): string {
  const [year, month, day] = birthday.split("-");
  const updatedBirthday = `${day}-${month}-${year}`;
  return updatedBirthday;
}

// Ensures height is 2dp
export function processHeight(height: string): string {
  const heightValue = parseFloat(height);
  const heightValueRounded =
    // Fancy rounding algorithm
    Math.round((heightValue + Number.EPSILON) * 100) / 100;
  return heightValueRounded.toString();
}

// Ensures weight is integer
export function processWeight(weight: string): string {
  const weightValue = parseFloat(weight);
  const weightValueRounded = Math.trunc(weightValue);
  return weightValueRounded.toString();
}

// Calculate age
export function processAge(birthday: string): number {
  const birthDate = new Date(birthday);
  const currentDate = new Date();

  let userAge = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  // If current month is before birth month OR
  // In the same month but birth day is ahead of current day
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    userAge--;
  }

  return userAge;
}

// Calculate BMI
export function processBMI(height: string, weight: string): number {
  const userWeight = Number(weight);
  const userHeight = Number(height);

  // Formula: BMI = Weight (kg) / Height (m) square
  const userBMI = (userWeight * 1.0) / userHeight ** 2;
  const userBMIRounded = Math.round((userBMI + Number.EPSILON) * 100) / 100;
  return userBMIRounded;
}

// Calculate Max HR
export function processMaxHR(age: number): number {
  return 220 - age;
}

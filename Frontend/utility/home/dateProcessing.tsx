// Helper functions for date processing on stats page

// Convert Date object to DD/MM/YYYY string
function dateToString(value: Date): string {
  let day: number = value.getDate();

  // Months are zero-indexed for Date objects
  // Thus, we need to add 1
  let month: number = value.getMonth() + 1;
  let year: number = value.getFullYear();

  let formattedDate: string = `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${year}`;

  return formattedDate;
}

// Input: Updated week start & week end dates
// Output: Updated week start & week end dates formatted
export function getDates(start: Date, end: Date): [string, string] {
  const weekStartDate: string = dateToString(start);
  const weekEndDate: string = dateToString(end);
  return [weekStartDate, weekEndDate];
}

// Input: Today date
// Output: Initial week start & week end dates
export function getInitialDates(todayDate: Date): [string, string] {
  // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = todayDate.getDay();

  // Calculate the start date of the week (Monday)
  // If today is Sunday (dayOfWeek = 0), we go back 6 days to the previous Monday
  // Otherwise, we go back to this Monday
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() - ((dayOfWeek + 6) % 7));
  const weekStartDate = dateToString(startOfWeek);

  // Calculate the end date of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const weekEndDate = dateToString(endOfWeek);

  return [weekStartDate, weekEndDate];
}

// Convert DD/MM/YYYY string to Date object
export function stringToDate(value: string): Date {
  const [day, month, year]: number[] = value.split("/").map(Number);

  // Date objects treat months as zero indexed
  // Thus, we need to subtract 1
  const dateObj = new Date(year, month - 1, day);
  return dateObj;
}

export function dateComparison(firstDate: string, secondDate: string): number {
  const result: number =
    new Date(firstDate).getTime() - new Date(secondDate).getTime();
  return result;
}

export function oneDayEarlier(date: string): string {
  const parsedDate: Date = new Date(date);
  const oneDayEarlier: Date = new Date(
    parsedDate.getTime() - 24 * 60 * 60 * 1000
  );
  return oneDayEarlier.toISOString().split("T")[0];
}

export function oneDayLater(date: string): string {
  const parsedDate: Date = new Date(date);
  const oneDayLater: Date = new Date(
    parsedDate.getTime() + 24 * 60 * 60 * 1000
  );
  return oneDayLater.toISOString().split("T")[0];
}

export function monthsBetween(
  startDateStr: string,
  endDateStr: string
): number {
  // Parse the input date strings to Date objects
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Calculate the difference in years and months
  let yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  let monthsDiff = endDate.getMonth() - startDate.getMonth();

  // Calculate total months
  const totalMonths = yearsDiff * 12 + monthsDiff;

  // Adjust for days of the month if necessary
  const startDateDay = startDate.getDate();
  const endDateDay = endDate.getDate();

  // If the end date day is less than the start date day, subtract one month
  if (endDateDay < startDateDay) {
    return totalMonths - 1;
  }

  return totalMonths;
}

export function getDayOfWeek(dateString: string): string {
  // Define an array with the days of the week
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Get the day of the week as a number (0-6)
  const dayOfWeek = date.getDay();

  // Return the corresponding day of the week
  return daysOfWeek[dayOfWeek];
}

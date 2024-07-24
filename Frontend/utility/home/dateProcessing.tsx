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

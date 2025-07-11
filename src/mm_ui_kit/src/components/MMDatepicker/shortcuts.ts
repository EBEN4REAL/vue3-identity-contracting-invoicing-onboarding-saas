import { TypeShortcut } from "./types";

const shortcuts: TypeShortcut[] = [
  {
    text: "Today",
    onClick: () => [new Date(), new Date()],
  },
  {
    text: "Yesterday",
    onClick: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return [date, date];
    },
  },
  {
    text: "This week",
    onClick: () => {
      const today = new Date();
      const currentDate = new Date(today.getTime()); // Current date without modifying today
      const startOfCurrentWeek = new Date(currentDate);
      const endOfCurrentWeek = new Date(currentDate);

      // Find the current Monday
      const dayOfWeek = currentDate.getDay();
      const diff =
        currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday
      startOfCurrentWeek.setDate(diff); // Set to current Monday

      // Set start of current week to Monday
      startOfCurrentWeek.setHours(0, 0, 0, 0);

      // Find the next Sunday
      endOfCurrentWeek.setDate(diff + 6); // Set to current Sunday
      endOfCurrentWeek.setHours(23, 59, 59, 999); // End of Sunday

      return [startOfCurrentWeek, endOfCurrentWeek];
    },
  },
  {
    text: "Last week",
    onClick: () => {
      const today = new Date();
      const currentDate = new Date(today.getTime()); // Current date without modifying today
      const startOfLastWeek = new Date(currentDate);
      const endOfLastWeek = new Date(currentDate);

      // Find the previous Monday
      const dayOfWeek = currentDate.getDay();
      const diff =
        currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday
      startOfLastWeek.setDate(diff - 7); // Go back a week

      // Set start of last week to Monday
      startOfLastWeek.setHours(0, 0, 0, 0);

      // Find the next Sunday
      endOfLastWeek.setDate(diff - 1); // Back to last Monday
      endOfLastWeek.setHours(23, 59, 59, 999); // End of Sunday

      return [startOfLastWeek, endOfLastWeek];
    },
  },
  {
    text: "This month",
    onClick: () => {
      const today = new Date();
      const startOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      const endOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      );
      return [startOfThisMonth, endOfThisMonth];
    },
  },
  {
    text: "Last month",
    onClick: () => {
      const today = new Date();
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return [startOfLastMonth, endOfLastMonth];
    },
  },
  {
    text: "This year",
    onClick: () => {
      const today = new Date();
      const startOfThisYear = new Date(today.getFullYear(), 0, 1);
      const endOfThisYear = new Date(today.getFullYear(), 11, 31);
      return [startOfThisYear, endOfThisYear];
    },
  },
  {
    text: "Last year",
    onClick: () => {
      const today = new Date();
      const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
      return [startOfLastYear, endOfLastYear];
    },
  },
  {
    text: "All time",
    onClick: () => [new Date(1900, 0, 1), new Date()],
  },
];

export default shortcuts;

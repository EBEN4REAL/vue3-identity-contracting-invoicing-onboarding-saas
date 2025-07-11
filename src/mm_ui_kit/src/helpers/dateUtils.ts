import dayjs from "dayjs";

export const isMatchingDateTime = (str: string): boolean => {
  const dateFormat = "MMMM DD, YYYY HH:mm";
  const parsedDate = dayjs(str, dateFormat, true);
  return parsedDate.isValid() && parsedDate.format(dateFormat) === str;
};

export const convertDateTimeToISO = (datetime: string) => {
  const date = new Date(datetime);
  return date.toISOString();
};

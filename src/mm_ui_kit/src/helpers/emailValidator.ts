export const emailValidator = (value: []) => {
  //email validator separated by comma
  const emailListRegex =
    /^[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:,[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/;
  return (
    value.length == 0 ||
    (value.length > 0 && emailListRegex.test(value.join(",")))
  );
};

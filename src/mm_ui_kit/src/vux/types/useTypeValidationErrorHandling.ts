// Utility function to handle error logging and raising
export function typeValidationError(
  expectedType: string,
  model: unknown,
  fieldName?: string,
): Error {
  console.error(`Error: Expected type '${expectedType}'`);
  if (fieldName) {
    console.error(`Field Name: ${fieldName}`);
  }
  try {
    console.error(`Model: ${JSON.stringify(model)}`);
  } catch {
    console.error(`Model (raw):`, model);
  }
  return new Error(
    `Expected type '${expectedType}'${fieldName ? ` for field '${fieldName}'` : ""}`,
  );
}

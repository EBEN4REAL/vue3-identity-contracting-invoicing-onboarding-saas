export const isValidUUID = (uuid: string): boolean => {
  // UUID validation function format 8-4-4-4-12 chars
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

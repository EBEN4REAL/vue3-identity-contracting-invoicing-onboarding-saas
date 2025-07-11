export const copyToClipboard = (data: string) => {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API not available");
  }

  try {
    navigator.clipboard.writeText(data);
  } catch (err) {
    throw new Error(`Failed to copy text: ${err}`);
  }
};

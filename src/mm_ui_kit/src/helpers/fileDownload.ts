export function downloadBlob(
  data: ArrayBuffer | Blob,
  filename: string,
  mimeType: string = "application/pdf",
): void {
  // Create a Blob if the input is an ArrayBuffer
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: mimeType });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 1000);
}

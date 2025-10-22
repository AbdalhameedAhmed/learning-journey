export async function downloadReport(url: string, fileName: string) {
  const response = await fetch(url);
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

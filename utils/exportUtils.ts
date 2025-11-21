import { TableData } from "../types";

export const downloadCSV = (data: TableData) => {
  const csvContent = [
    data.headers.join(","),
    ...data.rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${data.title.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyTableToClipboard = async (tableId: string): Promise<boolean> => {
  // This simulates the "Insert" functionality by copying HTML to clipboard, 
  // which Word handles perfectly when pasted.
  const tableElement = document.getElementById(tableId);
  if (!tableElement) return false;

  try {
    const type = "text/html";
    const blob = new Blob([tableElement.outerHTML], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
    return true;
  } catch (err) {
    console.error("Clipboard write failed", err);
    return false;
  }
};

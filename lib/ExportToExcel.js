import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportBorrowsToExcel = (data) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 }, // Borrow ID
    { wch: 20 }, // Username
    { wch: 35 }, // Book Name
    { wch: 25 }, // Author
    { wch: 15 }, // Borrow Date
    { wch: 15 }, // Due Date
    { wch: 15 }, // Return Date
    { wch: 12 }, // Status
    { wch: 15 }, // Fine
  ];
  worksheet["!cols"] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrows");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create blob and save
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Generate filename with current date
  const date = new Date();
  const filename = `Borrows_Report_${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.xlsx`;

  saveAs(blob, filename);
};

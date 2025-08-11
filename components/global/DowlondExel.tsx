"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadExcelFile = ({ users }: { users: any }) => {
  const exportToExcel = () => {
    const rows: Array<Record<string, any>> = [];
    console.log(users, "this is users");
    users.forEach((user: any) => {
      //   user.orders?.forEach((order:any) => {

      rows.push({
        "User ID": user.id,
        "User Name": `${user.name}${user.last_name ? " " + user.last_name : ""}`,
        "User Email": user.email,
        "User Number": user.phone ? user.phone : "N/A",
        "Has Lead": user.hasLead ? "Yes" : "No",
      });
      //   });
    });

    if (rows.length === 0) {
      alert("No order data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "user_order_report.xlsx");
  };

  return (
    // <div className="p-4">
    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      disabled={users?.length === 0}
    >
      {users?.length === 0 ? "Loading..." : "Download Report"}
    </button>
    // </div>
  );
};

export default DownloadExcelFile;

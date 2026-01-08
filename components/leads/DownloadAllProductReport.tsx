import React from "react";
import { useGetAllLeadFollowUpQuery } from "@/store/api/lead/leadFollowApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadAllProductReport = () => {
  // Fetch all leads with large limit
  const { data, isLoading, error } = useGetAllLeadFollowUpQuery({
    page: 1,
    limit: 1000000, // fetch all leads
  });

  const handleDownload = () => {
    if (!data || !data.data || data.data.length === 0) {
      alert("No data to download");
      return;
    }

    // Transform data for Excel
    const formattedData = data.data.map((lead: any) => ({
      FirstName: lead.firstName,
      LastName: lead.lastName,
      Email: lead.email,
      Product: lead.interest,
    //   LeadStatus: lead.leadStatus,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "leads_report.xlsx");
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isLoading || !data || !data.data || data.data.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Loading..." : "Download Excel"}
      </button>
      {error && <p className="text-red-500 mt-2">Error fetching leads</p>}
    </div>
  );
};

export default DownloadAllProductReport;

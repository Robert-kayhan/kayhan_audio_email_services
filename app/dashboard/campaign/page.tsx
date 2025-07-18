"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { useGetAllCampaignQuery } from "@/store/api/campaignApi";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";
import { useDeleteCampaignMutation } from "@/store/api/campaignApi";
import { tracingChannel } from "diagnostics_channel";
// Define Campaign type
type Campaign = {
  id: number;
  campaignName: string;
  subject: string;
  status: string;
  createdAt: string;
};

// Table columns
const columns: Column<any>[] = [
  { header: "Name", accessor: "campaignName", sortable: true },
  { header: "Subject", accessor: "campaignSubject", sortable: true },
  { header: "senderName", accessor: "senderName" },
  { header: "Created At", accessor: "createdAt" },
];

export default function CampaignsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading, refetch } = useGetAllCampaignQuery({
    page: currentPage,
    limit,
  });

  const campaigns: Campaign[] = data?.campaigns || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [deleteCampaign] = useDeleteCampaignMutation();

  const handleDelete = async (row: Campaign) => {
    try {
      await deleteCampaign(row.id);
      toast.success(`Deleted "${row.campaignName}" successfully`);
      refetch()
    } catch (error) {
      console.log(error);
      toast.error(`Failed to delete "${row.campaignName}"`);
    }
  };

  // Handle loading & error
  if (isLoading) return <div className="p-4">Loading campaigns...</div>;
  // if (isError) return <div className="p-4 text-red-500">Failed to load campaigns.</div>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Campaigns</h2>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* Create Button */}
          <Link
            href="/dashboard/campaign/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Create
          </Link>
        </div>
      </div>

      {/* Table */}
      {campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No campaigns found.
        </div>
      ) : (
        <>
          <CustomTable<Campaign>
            columns={columns}
            data={campaigns}
            // onEdit={handleEdit}
            onDelete={handleDelete}
            showActions
            pageSize={limit}
          />

          <Pagination
            currentPage={currentPage}
            totalRecords={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={campaigns.length}
          />
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";

// Mock campaign type and data
type Campaign = {
  id: number;
  name: string;
  subject: string;
  status: string;
  createdAt: string;
};

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Welcome Campaign",
    subject: "Welcome to our service!",
    status: "Sent",
    createdAt: "2025-06-28",
  },
  {
    id: 2,
    name: "Summer Sale",
    subject: "Get 30% off on all items",
    status: "Draft",
    createdAt: "2025-06-25",
  },
  {
    id: 3,
    name: "Product Launch",
    subject: "Announcing our new feature",
    status: "Scheduled",
    createdAt: "2025-06-20",
  },
];

const columns: Column<Campaign>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Subject", accessor: "subject", sortable: true },
  { header: "Status", accessor: "status" },
  { header: "Created At", accessor: "createdAt" },
];

export default function CampaignsPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const campaigns = mockCampaigns;
  const totalItems = campaigns.length;
  const totalPages = 1;
  const showPagination = [1];

  const handleEdit = (row: Campaign) => {
    setCampaign(row);
    setUpdateModal(true);
    toast.success(`Editing "${row.name}" (static mode)`);
  };

  const handleDelete = async (row: Campaign) => {
    toast.success(`Deleted "${row.name}" (mock only)`);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Campaigns</h2>

        <div className="flex items-center gap-3">
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* Create Dropdown */}
          <div className="relative inline-block text-left">
            <Link href="/dashboard/campaign/create"
              // onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      {campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No campaigns found.</div>
      ) : (
        <>
          <CustomTable<Campaign>
            columns={columns}
            data={campaigns}
            onEdit={handleEdit}
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

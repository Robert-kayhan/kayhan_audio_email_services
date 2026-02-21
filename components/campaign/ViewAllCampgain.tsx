"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { useGetAllCampaignQuery, useDeleteCampaignMutation } from "@/store/api/campaignApi";

type Campaign = {
  id: number;
  campaignName: string;
  subject: string;
  status: string;
  createdAt: string;
};

const columns: Column<any>[] = [
  { header: "id", accessor: "id" },
  {
    header: "Name",
    accessor: "campaignName",
    sortable: true,
    render: (val, row) => (
      <Link href={`/dashboard/campaign/${row.id}`} className="hover:underline">
        {val}
      </Link>
    ),
  },
  { header: "Subject", accessor: "campaignSubject", sortable: true },
  { header: "senderName", accessor: "senderName" },
  { header: "Created At", accessor: "createdAt" },
];

export default function CampaignsPage({ templateType }: any) {
  const pathname = usePathname();

  // ✅ Decide base route from current URL
  const isWholesale = pathname?.startsWith("/wholesale");
  const base = isWholesale ? "/wholesale" : "/dashboard";

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading, refetch } = useGetAllCampaignQuery({
    page: currentPage,
    limit,
    templateType,
  });

  const campaigns: Campaign[] = data?.campaigns || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [deleteCampaign] = useDeleteCampaignMutation();

  const handleDelete = async (row: Campaign) => {
    try {
      await deleteCampaign(row.id).unwrap?.(); // if RTK Query supports unwrap
      toast.success(`Deleted "${row.campaignName}" successfully`);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(`Failed to delete "${row.campaignName}"`);
    }
  };

  // ✅ Create dropdown
  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenCreateMenu(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (isLoading) return <div className="p-4">Loading campaigns...</div>;

  return (
    <div className="p-4">
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
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* ✅ Create button with 2 options */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpenCreateMenu((s) => !s)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create <span className="text-xs">▼</span>
            </button>

            {openCreateMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 dark:bg-gray-900 dark:border-gray-700">
                <Link
                  href={`${base}/campaign/create/manual`}
                  onClick={() => setOpenCreateMenu(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Create Manual Campaign
                </Link>

                <Link
                  href={`${base}/campaign/create`}
                  onClick={() => setOpenCreateMenu(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Create Automatic Campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No campaigns found.</div>
      ) : (
        <>
          <CustomTable<Campaign>
            columns={columns}
            data={campaigns}
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
"use client";

import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { useGetAllLeadFollowUpQuery } from "@/store/api/lead/leadFollowApi";
import Link from "next/link";

type LeadFollowUp = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadStatus: string;
  saleStatus: string;
  createdAt: string;
  createdBy: string;
};

const leadStatusOptions = [
  "all",
  "Today's  Follow up",
  "New",
  "First Follow up",
  "Second Follow up",
  "Third Follow up",
  "Sale done",
  "Sale not done",
] as const;

const LeadFollowUpPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [leadStatus, setLeadStatus] = useState<"all" | string>("all");
  const { data, isLoading, isError, refetch } = useGetAllLeadFollowUpQuery({
    page,
    limit,
    ...(leadStatus !== "all" && { leadStatus }),
  });
  console.log(data, "this is data");
  // Reset page to 1 when leadStatus changes
  useEffect(() => {
    setPage(1);
    refetch();
  }, [leadStatus]);

  const leads: LeadFollowUp[] = data?.data || [];
  const totalPages = data?.totalPages ?? 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const columns: Column<LeadFollowUp>[] = [
    {
      header: "ID",
      accessor: "id",
      sortable: true,
      render: (_, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="text-green-600 hover:underline"
        >
          {row.id}
        </Link>
      ),
    },
    {
      header: "Name",
      accessor: "firstName",
      render: (_, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (val, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {val}
        </Link>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (val, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {val}
        </Link>
      ),
    },
    {
      header: "Status",
      accessor: "leadStatus",
      render: (val, row: any) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {row.status}
        </Link>
      ),
    },
    {
      header: "Sale status",
      accessor: "saleStatus",
      render: (val, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {val}
        </Link>
      ),
    },

    {
      header: "Created On", 
      accessor: "createdAt",
      render: (val, row) => {
        // Format date for readability
        const formattedDate = new Date(val).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Link
            href={`/dashboard/lead-folow-up/${row.id}`}
            className="hover:underline text-blue-600"
          >
            {formattedDate}
          </Link>
        );
      },
    },
    {
      header: "createdBy",
      accessor: "createdBy",
      render: (val, row) => (
        <Link
          href={`/dashboard/lead-folow-up/${row.id}`}
          className="hover:underline"
        >
          {val}
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Lead Follow-Ups</h1>
        <Link
          href="/dashboard/lead-folow-up/create"
          className="border-black dark:border-white border px-3  py-2 rounded-xl"
        >
          {" "}
          Create
        </Link>
      </div>

      {/* Lead Status Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {leadStatusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setLeadStatus(status)}
            className={`px-4 py-2 rounded-md text-sm ${
              leadStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to fetch data</p>
      ) : (
        <>
          <CustomTable<LeadFollowUp>
            columns={columns}
            data={leads}
            // rowKey="id"
            pageSize={limit}
            showActions={false}
          />

          <Pagination
            currentPage={page}
            totalRecords={data?.total ?? leads.length}
            totalPages={totalPages}
            setCurrentPage={setPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={leads.length}
          />
        </>
      )}
    </div>
  );
};

export default LeadFollowUpPage;

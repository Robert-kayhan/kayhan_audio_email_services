"use client";
import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { useGetAllUserWithLeadQuery } from "@/store/api/UserApi";

type User = {
  id: number;
  name: string;
  email: string;
  hasLead?: boolean;
  orders?: number[];
};

const UsersOrderPage = () => {
  const [filter, setFilter] = useState<"all" | "with-orders" | "without-orders">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Determine API filter param
  const hasLeadOnly = filter === "with-orders" ? true : filter === "without-orders" ? false : undefined;

  const { data, isLoading, isError } = useGetAllUserWithLeadQuery({
    page,
    limit,
    ...(hasLeadOnly !== undefined && { hasLeadOnly }),
  });

  const users: User[] = data?.data || [];

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const columns: Column<User>[] = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    {
      header: "Has Lead / Orders",
      accessor: "hasLead",
      render: (_, row: any) =>
        row.hasLead || row.orders?.length > 0 ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        ),
    },
  ];

  const totalPages = data?.totalPages ?? 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Orders Table</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["all", "with-orders", "without-orders"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded ${
              filter === type ? "bg-blue-500 text-white" : "bg-black text-white"
            }`}
          >
            {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
          <CustomTable<User>
            columns={columns}
            data={users}
            rowKey="id"
            pageSize={limit}
            showActions={false}
          />

          <Pagination
            currentPage={page}
            totalRecords={data?.total ?? users.length}
            totalPages={totalPages}
            setCurrentPage={setPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={users.length}
          />
        </>
      )}
    </div>
  );
};

export default UsersOrderPage;

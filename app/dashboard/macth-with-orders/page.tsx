"use client";
import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { useGetAllUserWithLeadQuery } from "@/store/api/UserApi";
import DownloadExcelFile from "@/components/global/DowlondExel";

type User = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  hasLead?: boolean;
  orders?: number[];
  role?: string | number;
  status?: string | number;

  existsInMainApi?: boolean;
  existsInAPI1?: boolean;
  existsInAPI2?: boolean;
};

const UsersOrderPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20000);

  const { data, isLoading, isError } = useGetAllUserWithLeadQuery({ page, limit });
  const mainUsers: User[] = data?.data || [];

  const [externalUsersAPI1, setExternalUsersAPI1] = useState<User[]>([]);
  const [externalUsersAPI2, setExternalUsersAPI2] = useState<User[]>([]);

  // Fetch external APIs once
  useEffect(() => {
    async function fetchExternalUsers() {
      try {
        const res1 = await fetch("https://api.kayhanaudio.com.au/v1/users/all");
        const usersAPI1 = await res1.json();

        const res2 = await fetch("https://mailerapi.kayhanaudio.com.au/api/users?limit=20000");
        const json2 = await res2.json();
        const usersAPI2 = json2.data || [];

        setExternalUsersAPI1(usersAPI1);
        setExternalUsersAPI2(usersAPI2);
      } catch (error) {
        console.error("Failed to fetch external users:", error);
      }
    }
    fetchExternalUsers();
  }, []);

  // Merge all users by email
  const mergedUsersMap = new Map<string, User>();

  // Helper to add or merge user data into the map
  function mergeUser(user: User, source: "main" | "api1" | "api2") {
    if (!user.email) return;

    const email = user.email.toLowerCase();
    const existing = mergedUsersMap.get(email) || {};

    mergedUsersMap.set(email, {
      ...existing,
      ...user, // spread latest data (you can customize priority if needed)
      email,
      existsInMainApi: existing.existsInMainApi || source === "main",
      existsInAPI1: existing.existsInAPI1 || source === "api1",
      existsInAPI2: existing.existsInAPI2 || source === "api2",
    });
  }

  mainUsers.forEach((u) => mergeUser(u, "main"));
  externalUsersAPI1.forEach((u) => mergeUser(u, "api1"));
  externalUsersAPI2.forEach((u) => mergeUser(u, "api2"));

  // Convert map back to array
  const mergedUsers = Array.from(mergedUsersMap.values());

  // Table columns
  const columns: Column<User>[] = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone" },
    {
      header: "Has Lead / Orders",
      accessor: "hasLead",
      render: (_, row:any) =>
        row.hasLead || row.orders?.length > 0 ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        ),
    },
    {
      header: "Exists in Main API",
      accessor: "existsInMainApi",
      render: (_, row) =>
        row.existsInMainApi ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-red-500">No</span>
        ),
    },
    {
      header: "Exists in API 1",
      accessor: "existsInAPI1",
      render: (_, row) =>
        row.existsInAPI1 ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-red-500">No</span>
        ),
    },
    {
      header: "Exists in API 2",
      accessor: "existsInAPI2",
      render: (_, row) =>
        row.existsInAPI2 ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-red-500">No</span>
        ),
    },
  ];

  const totalPages = Math.ceil(mergedUsers.length / limit);
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users from All APIs</h1>

      <div className="flex gap-4 mb-6">
        <DownloadExcelFile users={mergedUsers} />
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to fetch main users</p>
      ) : (
        <>
          <CustomTable<User>
            columns={columns}
            data={mergedUsers.slice((page - 1) * limit, page * limit)}
            pageSize={limit}
            showActions={false}
          />

          <Pagination
            currentPage={page}
            totalRecords={mergedUsers.length}
            totalPages={totalPages}
            setCurrentPage={setPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={mergedUsers.length}
          />
        </>
      )}
    </div>
  );
};

export default UsersOrderPage;

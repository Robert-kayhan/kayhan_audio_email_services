"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // or use react-router if not using Next.js
import { useGetAllUserQuery } from "@/store/api/UserApi";
import { useGetLeadGroupQuery, useUpdateLeadGroupMutation } from "@/store/api/leadAPi";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { CheckSquare, Square } from "lucide-react";
import { User } from "@/util/interface";

const UpdateLeadGroupPage = () => {
  const params = useParams();
  const groupId = Number(params?.id); 
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading, refetch } = useGetAllUserQuery({
    page: currentPage,
    limit,
  });

  const { data: groupData, isLoading: loadingGroup } = useGetLeadGroupQuery({id : groupId});

  console.log(groupData)
  const [updateLeadGroup, { isLoading: updating }] = useUpdateLeadGroupMutation();

  // Fill form from fetched group data
  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.groupName || "");
      setSelectedUserIds(groupData.users?.map((u: User) => u.id) || []);
    }
  }, [groupData]);

  const isUserSelected = (id: number) => selectedUserIds.includes(id);

  const toggleUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUserIds.length === 0) {  
      alert("Enter group name and select at least one user");
      return;
    }

    try {
      await updateLeadGroup({
        id: groupId,
       data : {
         groupName,
        userIds: selectedUserIds,
       }
      }).unwrap();

      alert("Group updated successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  const users: User[] = data?.data || [];
  const pagination = data?.pagination || {};
  const totalItems = pagination.totalItems || 0;
  const totalPages = pagination.totalPages || 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const columns: Column<any>[] = [
    {
      header: "",
      accessor: "id",
      render: (_, row: any) => (
        <button onClick={() => toggleUser(row.id)} className="flex items-center">
          {isUserSelected(row.id) ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400" size={18} />
          )}
        </button>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Update Lead Group</h1>
      </div>

      {loadingGroup ? (
        <p>Loading group data...</p>
      ) : (
        <>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full mb-6 px-4 py-2 rounded-md border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <select
              className="text-sm px-3 py-1 float-end my-1 rounded-md bg-black border text-white focus:outline-none"
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

            <CustomTable columns={columns} data={users} pageSize={limit}  />
          </div>

          <Pagination
            currentPage={currentPage}
            totalRecords={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={users.length}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              {updating ? "Updating..." : "Update Group"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateLeadGroupPage;

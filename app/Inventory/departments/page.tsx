"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
// import { useGetChannelsQuery, useDeleteChannelMutation } from "@/store/api/Inventory/channelAPi";
import toast from "react-hot-toast";
import CreateModel from "@/components/Inventory/department/CreateDepartmentModel";
import { useGetDepartmentQuery ,useDeleteDepartmentMutation} from "@/store/api/Inventory/DepartmentAPi";
type Channel = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const columns: Column<Channel>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Description", accessor: "description", sortable: true },
  { header: "Created At", accessor: "createdAt" },
];

const ChannelPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [channelData, setChannelData] = useState<{
    id?: number;
    name: string;
    description: string;
  }>({ name: "", description: "" });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useGetDepartmentQuery({
    page: currentPage,
    limit,
    search,
  });

  const [deleteDepartment] = useDeleteDepartmentMutation();

  const handleEdit = (row: Channel) => {
    setChannelData({
      id: row.id,
      name: row.name,
      description: row.description,
    });
    setShowModal(true); // open modal in edit mode
  };

  const handleDelete = async (row: Channel) => {
    try {
      await deleteDepartment(row.id).unwrap();
      toast.success("Channel deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete channel");
      console.error(error);
    }
  };

  const channels = data?.data ?? [];
  const pagination = data?.meta ?? { total: 0, page: 1, lastPage: 1 };
  const totalPages = pagination.lastPage;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Department</h2>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search name or description"
            className="px-3 py-1 rounded-md bg-black text-white border border-gray-700 focus:outline-none text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearchInput("")}
              className="text-red-400 text-sm hover:underline"
            >
              Clear
            </button>
          )}

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

          <button
            onClick={() => {
              setChannelData({ name: "", description: "" }); // reset for create
              setShowModal(true);
            }}
            className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-800"
          >
            Create
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading channels...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">Failed to fetch channels.</div>
      ) : channels.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No Channels found.</div>
      ) : (
        <CustomTable
          columns={columns}
          data={channels}
          pageSize={limit}
          showActions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalRecords={pagination.total}
        totalPages={pagination.lastPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        showPagination={showPagination}
        tableDataLength={channels.length}
      />

      {/* Modal */}
      <CreateModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        categoryId={channelData.id} // pass id for edit
        name={channelData.name}
        description={channelData.description}
        onSave={() => refetch()} // refresh table after save
      />
    </div>
  );
};

export default ChannelPage;

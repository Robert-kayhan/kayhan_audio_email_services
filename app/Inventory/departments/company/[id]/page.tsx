"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import CreateModel from "@/components/Inventory/department/CreateCarModel";
import {
  useGetCarModelsQuery,
  useDeleteCarModelMutation,
} from "@/store/api/Inventory/carModelAPi";
import { useParams } from "next/navigation";
type CarModelType = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const columns: Column<CarModelType>[] = [
  { header: "ID", accessor: "id", sortable: true },
  { header: "Name", accessor: "name", sortable: true },
  { header: "Description", accessor: "description", sortable: true },
//   {
//   header: "Children",
//   accessor: "children",
//   render: (row: any) => {
//     if (!row.children || row.children.length === 0) return "—";
//     return row.children.map((child: any) => child.name).join(", ");
//   },
// }, ZKD+FPkdvpeCVU~2
  { header: "Created At", accessor: "createdAt" },
];

const CarModelPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState<{
    id?: number;
    name: string;
    description: string;
  }>({ name: "", description: "" });

  // debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetCarModelsQuery({
    page: currentPage,
    limit,
    search,
    company_id: id,
  });
  console.log(data);

  console.log(id);
  const [deleteCarModel] = useDeleteCarModelMutation();

  const handleEdit = (row: CarModelType) => {
    setSelectedModel({
      id: row.id,
      name: row.name,
      description: row.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (row: CarModelType) => {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return;
    try {
      await deleteCarModel(row.id).unwrap();
      toast.success("Car model deleted successfully");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car model");
    }
  };

  const carModels = data?.data ?? [];
  const pagination = data?.meta ?? { total: 0, page: 1, lastPage: 1 };
  const totalPages = pagination.lastPage;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Car Models</h2>

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
              setSelectedModel({ name: "", description: "" }); // reset modal for create
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
        <div className="text-center py-8 text-gray-500">
          Loading car models...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch car models.
        </div>
      ) : carModels.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No car models found.
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={carModels}
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
        tableDataLength={carModels.length}
      />

      {/* Modal */}
      <CreateModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        company_id={id} // dynamically from URL
        modelId={selectedModel?.id} // pass id for edit if exists
        name={selectedModel?.name}
        description={selectedModel?.description}
        onSave={() => refetch()}
      />
    </div>
  );
};

export default CarModelPage;

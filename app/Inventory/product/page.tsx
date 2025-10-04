"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";
import { useGetProductQuery } from "@/store/api/Inventory/productApi";

// 📦 Product Type
type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  car_model_id?: number | null;
  company_id?: number | null;
  channel_id?: number | null;
  department_id?: number | null;
  createdAt: string;
  updatedAt: string;
  weight?: number;
  height?: number;
  width?: number;
  retail_price?: number;
  wholesale_price?: number;
  factory_price?: number;
  sku_number?: string;
};

// 🧾 Table Columns
// 🧾 Table Columns
const columns: Column<Product & {
  Company?: { name: string };
  Department?: { name: string };
  CarModel?: { name: string };
}>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "SKU", accessor: "sku_number" },
  { header: "Retail Price", accessor: "retail_price" },
  { header: "Wholesale Price", accessor: "wholesale_price" },
  { header: "Stock", accessor: "stock" },
  // {
  //   header: "Company",
  //   accessor: "Company",
  //   render: (row) => row.Company?.name || "-",
  // },
  // {
  //   header: "Department",
  //   accessor: "department_id",
  //   render: (row) => row.Department?.name || "-",
  // },
  // {
  //   header: "Car Model",
  //   accessor: "car_model_id",
  //   render: (row) => row.CarModel?.name || "-",
  // },
  {
    header: "Created At",
    accessor: "createdAt",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];


export default function ProductTablePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // 🔍 Search state and debounce
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // Fetch Products
  const { data, isLoading, isError, refetch } = useGetProductQuery(
    { page: currentPage, limit, search },
    { refetchOnFocus: true, refetchOnMountOrArgChange: true }
  );
  console.log(data)
  const products: Product[] = data?.data ?? [];
  const pagination = {
    totalItems: data?.pagination?.total ?? 0,
    currentPage: data?.pagination?.page ?? 1,
    totalPages: data?.pagination ? Math.ceil(data.pagination.total / limit) : 1,
  };

  const showPagination = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Products</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* 🔍 Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by name or SKU"
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
          </div>

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
          <div className="relative inline-block text-left">
            <Link
              href="/Inventory/product/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create
              <ChevronDown className="rotate-[265deg]" size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading products...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch products.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No products found.</div>
      ) : (
        <>
          <CustomTable
            pageSize={limit}
            columns={columns}
            data={products}
            showActions
            customActions={[
              {
                label: "Edit",
                onClick: (row) =>
                  (window.location.href = `/dashboard/products/edit/${row.id}`),
                className: "text-blue-600 hover:underline",
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={products.length}
          />
        </>
      )}
    </div>
  );
}

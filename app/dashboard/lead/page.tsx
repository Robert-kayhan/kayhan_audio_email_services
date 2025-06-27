"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/gloabl/Table";
import { ChevronDown } from "lucide-react";
import UploadExcelModal from "@/components/leads/UploadExcelModal";
import Link from "next/link";
import UserFormModal from "@/components/leads/UserFormModal";

type User = {
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
};

const columns: Column<User>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
  { header: "Role", accessor: "role" },
  { header: "Phone", accessor: "phone" },
  { header: "Status", accessor: "status" },
];

const data: User[] = [
  {
    name: "Alice",
    email: "alice@example.com",
    role: "Admin",
    phone: "123-456-7890",
    status: "Active",
  },
  {
    name: "Bob",
    email: "bob@example.com",
    role: "User",
    phone: "987-654-3210",
    status: "Inactive",
  },
  {
    name: "Charlie",
    email: "charlie@example.com",
    role: "Editor",
    phone: "555-123-4567",
    status: "Pending",
  },
];

export default function TablePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [usershowModal, setusershowModal] = useState(false); 

  const handleEdit = (row: User) => alert("Edit: " + JSON.stringify(row));
  const handleDelete = (row: User) => alert("Delete: " + JSON.stringify(row));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center px-3 py-2">
        <h2 className="text-2xl font-serif font-bold">Leads</h2>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Create
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded shadow z-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
              <button 
                onClick={() => setusershowModal(true)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Create Single Lead
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setShowModal(true); // open UploadExcelModal
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Create Multiple Leads
              </button>
            </div>
          )}
        </div>
      </div>

      <CustomTable<User>
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions
        pageSize={5}
      />

      {/* Upload Excel Modal */}
      <UploadExcelModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <UserFormModal isOpen={usershowModal} onClose={() => setusershowModal(false)} />
    </div>
  );
}

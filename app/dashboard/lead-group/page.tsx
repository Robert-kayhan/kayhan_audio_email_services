"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import CustomTable, { Column } from "@/components/gloabl/Table";
import Pagination from "@/components/gloabl/Pagination";
import CreateGroupModal from "@/components/leads/CreateGroupModel";
import AssignUsersModal from "@/components/leads/EditGroupModel";

type LeadGroup = {
  id: number;
  groupName: string;
  totalLeads: number;
  createdAt: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

const columns: Column<LeadGroup>[] = [
  { header: "Group Name", accessor: "groupName", sortable: true },
  { header: "Total Leads", accessor: "totalLeads" },
  { header: "Created At", accessor: "createdAt" },
];

const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "David Kim", email: "david@example.com" },
  { id: 4, name: "Sara Lee", email: "sara@example.com" },
];

const initialLeadGroups: LeadGroup[] = [
  { id: 1, groupName: "Retail Clients", totalLeads: 30, createdAt: "2025-06-01" },
  { id: 2, groupName: "Wholesale Partners", totalLeads: 10, createdAt: "2025-06-10" },
  { id: 3, groupName: "Test Leads", totalLeads: 5, createdAt: "2025-06-29" },
];

export default function LeadGroupPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [leadGroups, setLeadGroups] = useState(initialLeadGroups);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<LeadGroup | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [groupNameInput, setGroupNameInput] = useState("");

  const totalItems = leadGroups.length;
  const totalPages = Math.ceil(totalItems / limit);
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = (row: LeadGroup) => {
    setSelectedGroup(row);
    setSelectedUsers([]); // Reset selection on open
    setShowUserModal(true);
  };

  const handleDelete = (row: LeadGroup) => {
    toast.success(`Deleted "${row.groupName}" (mock)`);
    setLeadGroups((prev) => prev.filter((g) => g.id !== row.id));
  };

  const handleAssignUsers = () => {
    toast.success(
      `Assigned ${selectedUsers.length} user(s) to "${selectedGroup?.groupName}"`
    );
    setShowUserModal(false);
  };

  const handleCreateGroup = () => {
    const name = groupNameInput.trim();
    if (!name) {
      toast.error("Group name is required");
      return;
    }

    const newGroup: LeadGroup = {
      id: Date.now(),
      groupName: name,
      totalLeads: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLeadGroups((prev) => [...prev, newGroup]);
    toast.success("Lead group created");
    setGroupNameInput("");
    setShowCreateGroupModal(false);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Lead Groups</h2>

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

          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
          >
            Create Lead Group
          </button>
        </div>
      </div>

      {/* Table */}
      {leadGroups.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No lead groups found.</div>
      ) : (
        <>
          <CustomTable<LeadGroup>
            columns={columns}
            data={leadGroups}
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
            tableDataLength={leadGroups.length}
          />
        </>
      )}

      {/* Modals */}
      <AssignUsersModal
        isOpen={showUserModal}
        users={mockUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        groupName={selectedGroup?.groupName || ""}
        onClose={() => setShowUserModal(false)}
        onAssign={handleAssignUsers}
      />

      {/* <CreateGroupModal
        isOpen={showCreateGroupModal}
        groupName={groupNameInput}
        onGroupNameChange={setGroupNameInput}
        onClose={() => {
          setGroupNameInput("");
          setShowCreateGroupModal(false);
        }}
        onCreate={handleCreateGroup}
      /> */}
    </div>
  );
}

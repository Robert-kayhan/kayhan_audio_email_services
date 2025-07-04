"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch:any
}
import { useCreateSingleUserMutation } from "@/store/api/UserApi";
import toast from "react-hot-toast";
const UserFormModal: React.FC<Props> = ({ isOpen, onClose,refetch }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [createSingleUser] = useCreateSingleUserMutation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { firstname, lastname, email, phone, address } = formData;

  // Basic validation
  if (!firstname.trim()) return toast.error("First name is required");
  if (!lastname.trim()) return toast.error("Last name is required");
  if (!email.trim()) return toast.error("Email is required");
  if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email format");
  if (!phone.trim()) return toast.error("Phone number is required");
  if (!/^\d{10,15}$/.test(phone)) return toast.error("Invalid phone number");
  if (!address.trim()) return toast.error("Address is required");

  try {
    const res = await createSingleUser(formData).unwrap();
    toast.success(res.message || "User created successfully");
    refetch()
    onClose();
  } catch (error) {
    toast.error(
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "Something went wrong"
    );
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e1e2f] text-gray-900 dark:text-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl relative transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">Create New User</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              name="firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              name="lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Address</label>
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition font-medium"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

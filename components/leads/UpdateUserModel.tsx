"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpdateUserMutation } from "@/store/api/UserApi";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  refetch: any; // should contain id, firstname, lastname, etc.
}

const UserForUpdate: React.FC<Props> = ({ isOpen, onClose, user, refetch }) => {
  const [formData, setFormData] = useState({
    id: undefined,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    isSubscribed: false, 
  });

  const [updateUser] = useUpdateUserMutation();
  // console.log(user , "this is user")
  // ✅ Populate form data from the `user` prop
  useEffect(() => {
    if (user) {
      console.log(user)
      setFormData({
        id: user.id,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        isSubscribed: user.isSubscribed || false,
      });
    }
  }, [user]);

  const handleChange = (
    e: any
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  console.log(user , "check it")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstname, lastname, email, phone, address } = formData;

    // ✅ Validation
    // if (!firstname.trim()) return toast.error("First name is required");
    // if (!lastname.trim()) return toast.error("Last name is required");
    // if (!email.trim()) return toast.error("Email is required");
    // if (!/^\S+@\S+\.\S+$/.test(email))
    //   return toast.error("Invalid email format");
    // if (!phone.trim()) return toast.error("Phone number is required");
    // if (!/^\d{10,15}$/.test(phone)) return toast.error("Invalid phone number");
    // if (!address.trim()) return toast.error("Address is required");

    try {
      const res = await updateUser({ id: user.id, data: formData }).unwrap();
      toast.success(res.message || "User updated successfully");
      refetch();
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
          <h2 className="text-3xl font-semibold">Update User</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit the user details below
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
              // required
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
              // required
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
              // required
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
              // required
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
              // required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* ✅ Subscribe Option */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isSubscribed"
              name="isSubscribed"
              checked={formData.isSubscribed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isSubscribed"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Subscribe to newsletter / updates
            </label>
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition font-medium"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForUpdate;

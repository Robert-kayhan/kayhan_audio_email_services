"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateSingleUserMutation } from "@/store/api/UserApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch: any;
}

const UserFormModal: React.FC<Props> = ({ isOpen, onClose, refetch }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    street: "",
    postal: "",
  });

  const [createSingleUser] = useCreateSingleUserMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const { firstname, lastname, email, phone } = formData;

    if (!firstname.trim()) return toast.error("First name is required");
    if (!lastname.trim()) return toast.error("Last name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email format");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!/^\d{10,15}$/.test(phone)) return toast.error("Invalid phone number");

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { country, state, city, street, postal } = formData;

    if (!country.trim()) return toast.error("Country is required");
    if (!state.trim()) return toast.error("State is required");
    if (!city.trim()) return toast.error("City is required");
    if (!street.trim()) return toast.error("Street address is required");
    if (!postal.trim()) return toast.error("Postal code is required");

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.postal}`,
    };

    try {
      const res = await createSingleUser(payload).unwrap();
      toast.success(res.message || "User created successfully");
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
          <h2 className="text-3xl font-semibold">
            {step === 1 ? "Basic Information" : "Address Information"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1 ? "Fill in user details" : "Fill in address details"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">First Name</label>
                <input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Last Name</label>
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter last name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Street Address</label>
                <input
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter street address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Postal Code</label>
                <input
                  name="postal"
                  value={formData.postal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Enter postal code"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2 flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Save User
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateTechRepairMutation } from "@/store/api/repair-return/tech-repair-returnApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type FormValues = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  orderNo: string;
  companyName: string;
  modelName: string;
  year: number;
  productName: string;
  reason: string;
};

export default function CreateTechSupportPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [createTechRepair] = useCreateTechRepairMutation();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await createTechRepair(data).unwrap();
      toast.success("Your Technical report is Submited");
      router.push("/dashboard/repair-return/product-request");
    } catch (error) {
      toast.error("error");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex justify-center">
      <div className="bg-[#121212] p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-800">
        <h1 className="text-3xl font-semibold mb-6 text-blue-400 tracking-wide">
          Create Tech Support Case
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          {/* USER DETAILS */}
          <h2 className="col-span-2 text-xl font-semibold text-gray-300 mb-2">
            User Details
          </h2>

          <input
            {...register("firstname", { required: "First name is required" })}
            type="text"
            placeholder="First Name"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:border-blue-500 outline-none col-span-1"
          />
          {errors.firstname && (
            <span className="col-span-2 text-red-500">
              {errors.firstname.message}
            </span>
          )}

          <input
            {...register("lastname", { required: "Last name is required" })}
            type="text"
            placeholder="Last Name"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:border-blue-500 outline-none col-span-1"
          />
          {errors.lastname && (
            <span className="col-span-2 text-red-500">
              {errors.lastname.message}
            </span>
          )}

          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 focus:border-blue-500 outline-none"
          />
          {errors.email && (
            <span className="col-span-2 text-red-500">
              {errors.email.message}
            </span>
          )}

          <input
            {...register("phone")}
            type="text"
            placeholder="Phone Number"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 focus:border-blue-500 outline-none"
          />

          {/* PRODUCT DETAILS */}
          <h2 className="col-span-2 text-xl font-semibold text-gray-300 mt-6 mb-2">
            Product Details
          </h2>
          <input

            {...register("orderNo", {
              required: "Order no is required",
            })}
            type="text"
            placeholder="Order no"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 focus:border-blue-500 outline-none"
          />
          {errors.orderNo && (
            <span className="col-span-2 text-red-500">
              {errors.orderNo.message}
            </span>
          )}
          <input
            {...register("companyName", {
              required: "Company name is required",
            })}
            type="text"
            placeholder="Company Name"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-1 focus:border-blue-500 outline-none"
          />
          {errors.companyName && (
            <span className="col-span-2 text-red-500">
              {errors.companyName.message}
            </span>
          )}

          <input
            {...register("modelName", { required: "Model name is required" })}
            type="text"
            placeholder="Model Name"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-1 focus:border-blue-500 outline-none"
          />
          {errors.modelName && (
            <span className="col-span-2 text-red-500">
              {errors.modelName.message}
            </span>
          )}

          <input
            {...register("year", {
              required: "Year is required",
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Year"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 focus:border-blue-500 outline-none"
          />
          {errors.year && (
            <span className="col-span-2 text-red-500">
              {errors.year.message}
            </span>
          )}

          <input
            {...register("productName", {
              required: "Product name is required",
            })}
            type="text"
            placeholder="Product Name"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 focus:border-blue-500 outline-none"
          />
          {errors.productName && (
            <span className="col-span-2 text-red-500">
              {errors.productName.message}
            </span>
          )}

          <textarea
            {...register("reason", { required: "Reason is required" })}
            placeholder="Reason / Issue Description"
            className="bg-black text-white border border-gray-700 p-3 rounded-lg col-span-2 h-28 focus:border-blue-500 outline-none"
          ></textarea>
          {errors.reason && (
            <span className="col-span-2 text-red-500">
              {errors.reason.message}
            </span>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg col-span-2 font-semibold tracking-wide mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

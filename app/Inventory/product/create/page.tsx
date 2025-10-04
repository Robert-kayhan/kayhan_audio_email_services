"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/global/FileUpload";
import { useCreateProductMutation } from "@/store/api/Inventory/productApi";
import { useGetDepartmentQuery } from "@/store/api/Inventory/DepartmentAPi";
import { useGetcompanyQuery } from "@/store/api/Inventory/comapnyApi";
import { useGetCarModelsQuery } from "@/store/api/Inventory/carModelAPi";
import { useRouter } from "next/navigation";
import { useGetChannelsQuery } from "@/store/api/Inventory/channelAPi";

type FormValues = {
  name: string;
  description: string;
  sku_number: string;
  factory_price: number;
  retail_price: number;
  wholesale_price: number;
  stock: number;
  weight: number;
  height: number;
  width: number;
  images: string[];
  car_model_id?: number;
  company_id?: number;
  channel_id?: number;
  department_id?: number;
};

const CreateProductPage = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      sku_number: "",
      factory_price: 0,
      retail_price: 0,
      wholesale_price: 0,
      stock: 0,
      weight: 0,
      height: 0,
      width: 0,
      images: [],
      car_model_id: undefined,
      company_id: undefined,
      channel_id: undefined,
      department_id: undefined,
    },
  });

  const [createProduct, { isLoading, isError }] = useCreateProductMutation();
  const router = useRouter();

  // 🔌 Fetch related dropdown data
  const { data: carModels } = useGetCarModelsQuery({});
  const { data: companies } = useGetcompanyQuery({});
  const { data: departments } = useGetDepartmentQuery({});
  const { data: channels } = useGetChannelsQuery({});

  const onSubmit = async (data: FormValues) => {
    try {
      const result: any = await createProduct(data).unwrap();

      if (result.success) {
        alert("✅ Product created successfully!");
        reset();
        router.push("/Inventory/product");
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error: any) {
      console.error(error);
      alert(
        "❌ Failed to create product: " +
          (error?.data?.message || error.message || error)
      );
    }
  };

  const inputClass =
    "w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "text-sm font-medium text-gray-300";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 text-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-8">➕ Create New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            General Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                {...register("name", { required: "Product name is required" })}
                className={inputClass}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                {...register("description")}
                className={inputClass + " h-28"}
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className={labelClass}>SKU Number</label>
              <input
                {...register("sku_number", { required: "SKU number is required" })}
                className={inputClass}
                placeholder="Enter SKU"
              />
              {errors.sku_number && (
                <p className={errorClass}>{errors.sku_number.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Associations */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Associations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Car Model */}
            <div>
              <label className={labelClass}>Car Model</label>
              <select {...register("car_model_id")} className={inputClass}>
                <option value="">Select Car Model</option>
                {carModels?.data?.map((cm: any) => (
                  <option key={cm.id} value={cm.id}>
                    {cm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div>
              <label className={labelClass}>Company</label>
              <select {...register("company_id")} className={inputClass}>
                <option value="">Select Company</option>
                {companies?.data?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel */}
            <div>
              <label className={labelClass}>Channel</label>
              <select {...register("channel_id")} className={inputClass}>
                <option value="">Select Channel</option>
                {channels?.data?.map((ch: any) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className={labelClass}>Department</label>
              <select {...register("department_id")} className={inputClass}>
                <option value="">Select Department</option>
                {departments?.data?.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Factory Price</label>
              <input type="number" {...register("factory_price")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Retail Price</label>
              <input type="number" {...register("retail_price")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Wholesale Price</label>
              <input type="number" {...register("wholesale_price")} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Stock & Dimensions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Stock & Dimensions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" {...register("stock")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input type="number" {...register("weight")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Height (cm)</label>
              <input type="number" {...register("height")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Width (cm)</label>
              <input type="number" {...register("width")} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Product Images
          </h2>
          <Controller
            name="images"
            control={control}
            rules={{ required: "At least one image is required" }}
            render={({ field }) => (
              <FileUpload files={field.value} setFiles={field.onChange} />
            )}
          />
          {errors.images && <p className={errorClass}>{errors.images.message}</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white transition flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "🚀 Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;

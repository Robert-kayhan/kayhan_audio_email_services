"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useCreateRepairReportMutation } from "@/store/api/repair-return/repairApi";
// Utility: warranty checker
const isOutOfWarranty = (orderDate: string) => {
  if (!orderDate) return false;
  const placedDate = new Date(orderDate);
  const oneYearLater = new Date(placedDate);
  oneYearLater.setFullYear(placedDate.getFullYear() + 1);
  return new Date() > oneYearLater;
};

const OrderSelector = () => {
  const [orderOptions, setOrderOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedOrder, setSelectedOrder] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [postMethod, setPostMethod] = useState("");

  const [createRepairReport] = useCreateRepairReportMutation();

  // Manual entry state (when no order exists)
  const [manualUser, setManualUser] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [manualBilling, setManualBilling] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  });
  const [manualShipping, setManualShipping] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  });
  const [manualProducts, setManualProducts] = useState<
    { id: number; name: string; price: number; quantity: number }[]
  >([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5003/v1/order/list", {
          params: { page: 1, status: "", search: "" },
        });
        if (res.data.success) {
          const options = res.data.data.result.map((o: any) => ({
            value: o.id,
            label: `Order #${o.id}`,
          }));
          setOrderOptions(options);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const handleFetchDetails = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:5003/v1/order/detail/${selectedOrder.value}`
      );
      if (res.data.success && res.data.data.result) {
        setOrderDetail(res.data.data.result);
        setSelectedProducts([]);
      } else {
        setOrderDetail(null);
        setError("Order not found");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (id: number) => {
    console.log(id, "clg this is id");
    const numId = Number(id); // ensure ID is a number
    setSelectedProducts(
      (prev) =>
        prev.includes(numId)
          ? prev.filter((p) => p !== numId) // unselect this product
          : [...prev, numId] // select this product
    );
  };

  const handleSubmit = async() => {
    if (orderDetail) {
      const selectedProductDetails =
        orderDetail.products?.filter((p: any) =>
          selectedProducts.includes(p.product_id)
        ) || [];

      if (selectedProductDetails.length === 0) {
        alert("Please select at least one product!");
        return;
      }
      const data = {
        order_id: orderDetail?.id,
        customer_id: orderDetail,
        customer_name: orderDetail?.billing_address?.name,
        customer_email: orderDetail?.billing_address?.email,
        customer_phone: orderDetail.billing_address?.phone,
        billing_address: orderDetail?.billing_address,
        shipping_address: orderDetail?.shipping_address,
        products: selectedProductDetails,
        user_tracking_number: trackingNumber,
        user_post_method: postMethod,
      };
     await createRepairReport(data).unwrap
    } else {
      // Manual entry
      if (manualProducts.length === 0) {
        alert("Please add at least one product!");
        return;
      }
      console.log("Manual User:", manualUser);
      console.log("Manual Billing:", manualBilling);
      console.log("Manual Shipping:", manualShipping);
      console.log("Manual Products:", manualProducts);
      console.log("Tracking Number:", trackingNumber);
      console.log("Post Method:", postMethod);
    }
  };

  const handleAddManualProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: "",
      price: 0,
      quantity: 1,
    };
    setManualProducts([...manualProducts, newProduct]);
  };

  const handleManualProductChange = (
    id: number,
    field: keyof (typeof manualProducts)[0],
    value: any
  ) => {
    setManualProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // const handleSubmit = () => {
  //   if (orderDetail) {
  //     const selectedProductDetails =
  //       orderDetail?.products?.filter((p: any) =>
  //         selectedProducts.includes(p.id)
  //       ) || [];
  //     console.log("Selected Products:", selectedProductDetails);
  //     console.log("Tracking Number:", trackingNumber);
  //     console.log("Post Method:", postMethod);
  //     console.log("Order ID:", orderDetail?.id);
  //   } else {
  //     console.log("Manual User:", manualUser);
  //     console.log("Manual Billing:", manualBilling);
  //     console.log("Manual Shipping:", manualShipping);
  //     console.log("Manual Products:", manualProducts);
  //     console.log("Tracking Number:", trackingNumber);
  //     console.log("Post Method:", postMethod);
  //   }
  // };

  console.log(orderDetail?.products);
  return (
    <div className="min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      <div className="bg-white dark:bg-gray-800 max-w-5xl w-full p-8 rounded-2xl shadow-lg transition-colors">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Repair and return
        </h2>

        {/* Order selector */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Select
              options={orderOptions}
              value={selectedOrder}
              onChange={setSelectedOrder}
              placeholder="Search order number…"
              isSearchable
            />
          </div>
          <button
            onClick={handleFetchDetails}
            disabled={!selectedOrder || loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Loading…" : "Show Details"}
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

        {/* Order details OR Manual Entry */}
        {orderDetail ? (
          <div className="space-y-8">
            {/* Order header with warranty */}
            <div className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Order #{orderDetail.id || "N/A"}
              </h3>
              {orderDetail?.createdAt && (
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  Placed on:{" "}
                  {new Date(orderDetail.createdAt).toLocaleDateString()}
                </p>
              )}
              {orderDetail?.createdAt && (
                <p
                  className={`text-sm font-semibold mt-2 ${
                    isOutOfWarranty(orderDetail.createdAt)
                      ? "text-red-500 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {isOutOfWarranty(orderDetail.createdAt)
                    ? "Out of Warranty"
                    : "Under Warranty"}
                </p>
              )}
            </div>

            {/* Customer Details */}
            <section className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Customer Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={orderDetail.user_detail?.name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={orderDetail.user_detail?.last_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 col-span-2"
                  value={orderDetail.user_detail?.email || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 col-span-2"
                  value={orderDetail.user_detail?.phone || ""}
                  readOnly
                />
              </div>
            </section>

            {/* Billing + Shipping */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                  Billing Address
                </h4>
                <div className="space-y-2 text-gray-800 dark:text-gray-100">
                  <p>{orderDetail.billing_address?.street_address}</p>
                  <p>
                    {orderDetail.billing_address?.city},{" "}
                    {orderDetail.billing_address?.state_name}
                  </p>
                  <p>
                    {orderDetail.billing_address?.country_name} -{" "}
                    {orderDetail.billing_address?.postcode}
                  </p>
                </div>
              </section>

              <section className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                  Shipping Address
                </h4>
                <div className="space-y-2 text-gray-800 dark:text-gray-100">
                  <p>{orderDetail.shipping_address?.street_address}</p>
                  <p>
                    {orderDetail.shipping_address?.city},{" "}
                    {orderDetail.shipping_address?.state_name}
                  </p>
                  <p>
                    {orderDetail.shipping_address?.country_name} -{" "}
                    {orderDetail.shipping_address?.postcode}
                  </p>
                </div>
              </section>
            </div>

            {/* Products */}
            <section className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Products
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="border px-3 py-2 text-left">Select</th>
                      <th className="border px-3 py-2 text-left">Name</th>
                      <th className="border px-3 py-2 text-left">Price</th>
                      <th className="border px-3 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.products?.map((prod: any, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <td className="border px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(
                              Number(prod.product_id)
                            )} // only this product
                            onChange={() =>
                              handleProductToggle(Number(prod?.product_id))
                            }
                          />
                        </td>
                        <td className="border px-3 py-2 text-gray-800 dark:text-gray-100">
                          {prod.name}
                        </td>
                        <td className="border px-3 py-2 text-gray-800 dark:text-gray-100">
                          ${prod.price}
                        </td>
                        <td className="border px-3 py-2 text-gray-800 dark:text-gray-100">
                          {prod.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          /* Manual entry when no order */
          <div className="space-y-8">
            <p className="text-gray-700 dark:text-gray-300">
              No order selected. Enter details manually:
            </p>

            {/* User */}
            <section className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                User Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={manualUser.name}
                  onChange={(e) =>
                    setManualUser({ ...manualUser, name: e.target.value })
                  }
                />
                <input
                  placeholder="Last Name"
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={manualUser.last_name}
                  onChange={(e) =>
                    setManualUser({ ...manualUser, last_name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  className="border p-2 rounded-lg col-span-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={manualUser.email}
                  onChange={(e) =>
                    setManualUser({ ...manualUser, email: e.target.value })
                  }
                />
                <input
                  placeholder="Phone"
                  className="border p-2 rounded-lg col-span-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={manualUser.phone}
                  onChange={(e) =>
                    setManualUser({ ...manualUser, phone: e.target.value })
                  }
                />
              </div>
            </section>

            {/* Billing + Shipping */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Billing Address
                </h4>
                <div className="space-y-2">
                  {Object.keys(manualBilling).map((key) => (
                    <input
                      key={key}
                      placeholder={key}
                      className="border p-2 rounded-lg w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      value={(manualBilling as any)[key]}
                      onChange={(e) =>
                        setManualBilling({
                          ...manualBilling,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </section>

              <section className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Shipping Address
                </h4>
                <div className="space-y-2">
                  {Object.keys(manualShipping).map((key) => (
                    <input
                      key={key}
                      placeholder={key}
                      className="border p-2 rounded-lg w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      value={(manualShipping as any)[key]}
                      onChange={(e) =>
                        setManualShipping({
                          ...manualShipping,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Products */}
            <section className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                Products
              </h4>
              <button
                onClick={handleAddManualProduct}
                className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Add Product
              </button>
              <div className="space-y-3">
                {manualProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="grid grid-cols-4 gap-3 items-center"
                  >
                    <input
                      placeholder="Name"
                      className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      value={prod.name}
                      onChange={(e) =>
                        handleManualProductChange(
                          prod.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      value={prod.price}
                      onChange={(e) =>
                        handleManualProductChange(
                          prod.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      value={prod.quantity}
                      onChange={(e) =>
                        handleManualProductChange(
                          prod.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Shipping Info + Submit (shared) */}
        <div className="mt-8 space-y-6">
          {/* Shipping Info */}
          <section className="p-6 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 space-y-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">
              Shipping Info
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tracking Number"
                className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Post Method"
                className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                value={postMethod}
                onChange={(e) => setPostMethod(e.target.value)}
              />
            </div>
          </section>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSelector;

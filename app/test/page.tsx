"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const OrderSelector = () => {
  const [orderOptions, setOrderOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedOrder, setSelectedOrder] = useState<
    { value: number; label: string } | null
  >(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch list of orders for dropdown
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5003/v1/order/list",
          { params: { page: 1, status: "", search: "" } }
        );
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

  // Fetch details of one order
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

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="bg-white max-w-5xl w-full p-8 text-black">
        <h2 className="text-3xl font-bold mb-6 text-center">Order Lookup</h2>

        {/* Order selector */}
        <div className="flex gap-2 mb-4">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Show Details"}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Order details */}
        {orderDetail && (
          <div className="border rounded p-4 mt-4 space-y-6">
            <h3 className="text-xl font-semibold">
              Order #{orderDetail.id} — Status: {orderDetail.status}
            </h3>

            {/* User details */}
            <section>
              <h4 className="font-semibold mb-2">Customer Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded"
                  value={orderDetail.user_detail?.name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.user_detail?.last_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded col-span-2"
                  value={orderDetail.user_detail?.email || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded col-span-2"
                  value={orderDetail.user_detail?.phone || ""}
                  readOnly
                />
              </div>
            </section>

            {/* Billing Address */}
            <section>
              <h4 className="font-semibold mb-2">Billing Address</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded col-span-2"
                  value={orderDetail.billing_address?.street_address || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.billing_address?.city || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.billing_address?.state_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.billing_address?.country_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.billing_address?.postcode || ""}
                  readOnly
                />
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded col-span-2"
                  value={orderDetail.shipping_address?.street_address || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.shipping_address?.city || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.shipping_address?.state_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.shipping_address?.country_name || ""}
                  readOnly
                />
                <input
                  className="border p-2 rounded"
                  value={orderDetail.shipping_address?.postcode || ""}
                  readOnly
                />
              </div>
            </section>

            {/* Products */}
            <section>
              <h4 className="font-semibold mb-2">Products</h4>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">Price</th>
                      <th className="border px-2 py-1">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.products?.map((prod: any, idx: number) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{prod.name}</td>
                        <td className="border px-2 py-1">{prod.price}</td>
                        <td className="border px-2 py-1">{prod.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Totals */}
            <section>
              <p>
                <strong>Subtotal:</strong> ${orderDetail.sub_total}
              </p>
              <p>
                <strong>Shipping:</strong> ${orderDetail.shipping_charge}
              </p>
              <p>
                <strong>Total Paid:</strong> ${orderDetail.total_paid_value}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSelector;

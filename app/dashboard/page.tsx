"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useGetDashboardStatsQuery } from "@/store/api/dashBoradAPi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LeadsDashboard() {
  const [selectedUser, setSelectedUser] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");

  const { data, isLoading, isError } = useGetDashboardStatsQuery({
    userId: selectedUser,
    timeRange,
  });

  const stats = data?.data?.stats || {
    totalLeads: 0,
    salesDone: 0,
    salesNotDone: 0,
    quotations: 0,
    leadProgress: 0,
  };

  // --- Default channels (always shown)
  const defaultChannels = [
    { name: "Facebook", value: 0 },
    { name: "Website", value: 0 },
    { name: "Tik Tok", value: 0 },
    { name: "Walk-in", value: 0 },
    { name: "Over the phone", value: 0 },
    { name: "Email", value: 0 },
    { name: "Google", value: 0 },
    { name: "YouTube", value: 0 },
    { name: "Instagram", value: 0 },
    { name: "Referrals", value: 0 },
  ];

  // --- Map API names to your required names
  const normalizeName = (name: string) => {
    switch (name.toLowerCase()) {
      case "call":
        return "Over the phone";
      case "referral":
        return "Referrals";
      default:
        return name;
    }
  };

  // --- Merge API data with defaults
  const apiChannels = (data?.data?.channels || []).map((ch: any) => ({
    name: normalizeName(ch.name),
    value: ch.value,
  }));

  const channelData = defaultChannels.map((ch) => {
    const found = apiChannels.find(
      (a: any) => a.name.toLowerCase() === ch.name.toLowerCase()
    );
    return { ...ch, value: found ? found.value : 0 };
  });

  const channelChart = {
    options: {
      chart: { type: "donut" },
      labels: channelData.map((c) => c.name),
      theme: { mode: "dark" },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          const seriesIndex = opts.seriesIndex;
          const value = opts.w.globals.series[seriesIndex];
          return `${value} (${val.toFixed(1)}%)`;
        },
        style: {
          colors: ["#fff"],
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return `${val} leads`;
          },
        },
      },
    } as ApexOptions,
    series: channelData.map((c) => c.value),
  };

  const salesChart = {
    options: {
      chart: { type: chartType },
      xaxis: { categories: ["Sales Done", "Sales Not Done", "Quotations" ,"invoices"] },
      theme: { mode: "dark" },
    } as ApexOptions,
    series: [
      {
        name: "Count",
        data: [stats.salesDone, stats.salesNotDone, stats.quotations ,stats.invoices],
      },
    ],
  };

  const dateButtons = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "month" },
    { label: "Last Month", value: "last_month" },
    { label: "This Year", value: "this_year" },
    { label: "Last Year", value: "last_year" },
  ];

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Error loading data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          className="bg-gray-800 p-2 rounded"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="kayhanaudio@gmail.com">Kayhan Audio</option>
          <option value="robertsmith12358@gmail.com">Robart</option>
          <option value="bendordevic1998@hotmail.com">Ben</option>
          <option value="sales@kayhanaudio.com.au">Ahmed</option>
        </select>

        <div className="flex gap-2">
          {dateButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setTimeRange(btn.value)}
              className={`px-4 py-2 rounded transition-all ${
                timeRange === btn.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <select
          className="bg-gray-800 p-2 rounded"
          value={chartType}
          onChange={(e) =>
            setChartType(e.target.value as "bar" | "line" | "pie")
          }
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Total Leads</p>
          <h2 className="text-2xl font-bold">{stats.totalLeads}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Sales Done</p>
          <h2 className="text-2xl font-bold">{stats.salesDone}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Sales Not Done</p>
          <h2 className="text-2xl font-bold">{stats.salesNotDone}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Lead Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(stats.leadProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">
            {stats.leadProgress > 100 ? "100%+" : `${stats.leadProgress}%`}
          </p>
        </div>
      </div>

      {/* Channel Stats */}
      {channelData.length > 0 && (
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 mb-6">
          {channelData.map((ch: any) => (
            <div key={ch.name} className="bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">{ch.name}</p>
              <h2 className="text-2xl font-bold">{ch.value}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <Chart
            options={salesChart.options}
            series={salesChart.series}
            type={chartType}
            height={300}
          />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Leads by Channel</h3>
          <Chart
            options={channelChart.options}
            series={channelChart.series}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}

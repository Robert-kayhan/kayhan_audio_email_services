"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LeadsDashboard() {
  const [selectedUser, setSelectedUser] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [chartType, setChartType] = useState("bar");

  // Dummy stats data
  const stats = {
    totalLeads: 120,
    salesDone: 50,
    salesNotDone: 40,
    quotations: 30,
    leadProgress: 60,
  };

  // Dummy channel data
  const channelData = [
    { name: "Facebook", value: 40 },
    { name: "Website", value: 30 },
    { name: "Instagram", value: 20 },
    { name: "Other", value: 10 },
  ];

  const channelChart = {
  options: {
    labels: channelData.map((c) => c.name),
    theme: { mode: "dark" },
    dataLabels: {
      enabled: true,
      formatter: function (val:any, opts:any) {
        const seriesIndex = opts.seriesIndex;
        const total = opts.w.globals.seriesTotals.reduce((a:any, b:any) => a + b, 0);
        const value = opts.w.config.series[seriesIndex];
        return `${value} (${val.toFixed(1)}%)`;
      },
      style: {
        colors: ['#fff'],
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      y: {
        formatter: function (val:any) {
          return `${val} leads`;
        },
      },
    },
  },
  series: channelData.map((c) => c.value),
};


  const salesChart = {
    options: {
      chart: { type: chartType },
      xaxis: { categories: ["Sales Done", "Sales Not Done", "Quotations"] },
      theme: { mode: "dark" },
    },
    series: [
      {
        name: "Count",
        data: [stats.salesDone, stats.salesNotDone, stats.quotations],
      },
    ],
  };

  // Button labels and values
  const dateButtons = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Month", value: "month" },
    { label: "Last Month", value: "last_month" },
  ];

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
          <option value="1">John Doe</option>
          <option value="2">Jane Smith</option>
        </select>

        {/* Date Filter Buttons */}
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
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${stats.leadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{stats.leadProgress}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          {/* <Chart
          width={}
            options={salesChart.options}
            series={salesChart.series}
            type={chartType}
            height={300}
          /> */}
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Leads by Channel</h3>
          {/* <Chart
            options={channelChart.options}
            series={channelChart.series}
            type="donut"
            height={300}
          /> */}
        </div>
      </div>
    </div>
  );
}

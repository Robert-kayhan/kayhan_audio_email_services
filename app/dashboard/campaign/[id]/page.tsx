"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Plane, Clock, XCircle, MailOpen } from "lucide-react";
import { useGetAllCampaignByidQuery } from "@/store/api/campaignApi";
import { useParams } from "next/navigation";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function EmailDashboard() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetAllCampaignByidQuery(id as string);
  const [darkMode, setDarkMode] = useState(true);
  const [chartType, setChartType] = useState<"pie" | "donut">("pie");
  console.log(data , "this is data ")
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !data) return <p className="text-center mt-10 text-red-500">Error loading campaign</p>;

  const { data: campaign, stats } = data;

  const statsList = [
    { name: "Sent", value: stats.sent, icon: Plane, color: "#22c55e" },
    { name: "Pending", value: stats.pending, icon: Clock, color: "#facc15" },
    { name: "Failed", value: stats.failed, icon: XCircle, color: "#ef4444" },
    { name: "Opened", value: stats.opened, icon: MailOpen, color: "#8b5cf6" },
  ];

  const chartOptions: ApexOptions = {
    chart: { type: chartType, toolbar: { show: true }, foreColor: darkMode ? "#fff" : "#000" },
    labels: statsList.map((s) => s.name),
    colors: statsList.map((s) => s.color),
    legend: { position: "bottom" },
    tooltip: { theme: darkMode ? "dark" : "light" },
  };

  const chartSeries = statsList.map((s) => s.value);

  const progress = (value: number) => Math.min(100, Math.round((value / stats.total) * 100));

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-8 transition-colors duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{campaign.campaignName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">{campaign.campaignSubject}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-colors duration-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "pie" | "donut")}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pie">Pie</option>
            <option value="donut">Donut</option>
          </select>
        </div>
      </div>

      {/* Stats + Template Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {statsList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                style={{ borderColor: item.color }}
                className="p-6 rounded-xl border-2 shadow-lg flex flex-col justify-between transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <p className="text-3xl mt-2 font-bold">{item.value}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress(item.value)}%`, backgroundColor: item.color }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{progress(item.value)}%</p>
              </div>
            );
          })}
        </div>

        {/* Template Preview */}
        <div className="flex-1 max-h-[400px] overflow-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Template Preview</h2>
          <div className="scale-90 transform origin-top-left" dangerouslySetInnerHTML={{ __html: campaign.Template.html }} />
        </div>
      </div>

      {/* Pie/Donut Chart */}
      <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Email Stats</h2>
        <Chart options={chartOptions} series={chartSeries} type={chartType} height={400} />
      </div>
    </div>
  );
}

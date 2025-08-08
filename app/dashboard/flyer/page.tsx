"use client";
import React from "react";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function FlyerPage() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 py-10 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <img src="/logo.webp" alt="Kayhan Logo" className="h-16" />
            <h2 className="text-xl font-semibold mt-2 text-gray-700">
              Quotation for Hyundai iLoad 2007 – 2015
            </h2>
          </div>
          <div className="text-sm space-y-1 w-full md:w-auto">
            <p><span className="font-semibold">Customer:</span> John Doe</p>
            <p><span className="font-semibold">Phone:</span> 123-456-7890</p>
            <p><span className="font-semibold">Email:</span> john@example.com</p>
            <p><span className="font-semibold">Install Fee:</span> $100</p>
            <p><span className="font-semibold">Delivery Fee:</span> $50</p>
            <p><span className="font-semibold">Quote #:</span> A12345</p>
            <p><span className="font-semibold">Valid for:</span> 7 Days</p>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-4 border-purple-500">
          <img src="/headunit.webp" alt="Version 6" className="mx-auto h-40 mb-4" />
          <div className="text-2xl font-bold text-purple-700 mb-1">$1395</div>
          <div className="uppercase font-semibold text-gray-700">Version 6</div>
          <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-sm uppercase tracking-wide">
            Order Now
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-4 border-yellow-400">
          <img src="/headunit.webp" alt="Linux" className="mx-auto h-40 mb-4" />
          <div className="text-2xl font-bold text-yellow-600 mb-1">$695</div>
          <div className="uppercase font-semibold text-gray-700">Linux</div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow overflow-auto">
        <div className="bg-orange-600 text-white text-center text-lg font-semibold py-3 rounded-t-xl">
          Performance and Specifications Comparison
        </div>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Feature</th>
              <th className="border px-4 py-2">Version 6</th>
              <th className="border px-4 py-2">Linux</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              ["Processor", "Qualcomm Snapdragon Octa-Core", "Sunplus SPHE8368U"],
              ["OS", "Android 13", "Linux w/ Kernel 4.3"],
              ["Memory", "6GB LPDDR4 + 256GB UFS", "Basic performance"],
              ["Audio/Video Output", "6 Channel DSP with Coaxial, Optical", "Basic Audio"],
              ["Amplifier", "TDA7851 75W x 4", "15W x 4 Power Amp"],
              ["Microphone", "Background Noise Cancelling", "Internal Microphone"],
              ["Bluetooth", "Bluetooth 5.1", "Basic"],
              ["USB Ports", "4 USB Ports", "2 USB Ports"],
              ["Reverse Camera", "HD 1080p Compatible", "Fair quality"],
              ["Digital TV", "Supported via Adapter", "Not Supported"],
              ["Apple CarPlay / Android Auto", "Wireless & Wired", "Not Compatible"],
              ["DVR / Dash Cam", "Compatible", "Not Compatible"],
            ].map(([feature, v6, linux], idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2 font-medium">{feature}</td>
                <td className="border px-4 py-2">{v6}</td>
                <td className="border px-4 py-2">{linux}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-10 bg-gray-900 text-white rounded-xl p-6 text-sm space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4" />
          <span>Unit 2/153 Dalgety Rd, Laverton North VIC 3026, Australia</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4" />
          <span>support@kayhanaudio.com.au</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4" />
          <span>1300 696 488</span>
        </div>
      </div>
    </div>
  );
}

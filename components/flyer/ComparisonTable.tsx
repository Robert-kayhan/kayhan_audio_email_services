"use client";

import React from "react";
import parse from "html-react-parser";

const specData = [
  {
    feature: "Processor",
    version6: "Qualcomm QCM6125 Octa-Core Kryo 260 (2.0 GHz + 1.8 GHz)",
    linux: "Sunplus SPHE8368-U",
  },
  {
    feature: "Operating System",
    version6: "Android 13",
    linux: "Linux OS with Kernel 4.9 and SDL",
  },
  {
    feature: "Memory",
    version6: "8 GB LPDDR4X + 256 GB UFS",
    linux: "Optimized performance architecture",
  },
  {
    feature: "Wireless CarPlay/Android Auto",
    version6: "Built-in Wireless CarPlay and Wireless Android Auto",
    linux: "Built-in Wireless CarPlay and Wireless Android Auto",
  },
  {
    feature: "Audio / Video Output",
    version6: "5.1 Channel Output (4VRMS) with 48-band EQ, DSP, and DTS Sound, Coaxial, Optical Digital Outputs",
    linux: "4.2-Channel RCA (2 Sub-Out, 4 RCA) with Digital Sound Processor (DSP)",
  },
  {
    feature: "Amplifier",
    version6: "TDA7808 75W x 4",
    linux: "55W x 4 Power Amplifier",
  },
  {
    feature: "Camera Inputs",
    version6: "Compatible with Reverse and Front Cameras, Built-in 360° Camera Chip (Camera Sold Separately)",
    linux: "Dedicated Front and Reverse Camera Inputs",
  },
  {
    feature: "Microphone",
    version6: "Background Noise Cancelling Microphone for Enhanced Call Quality",
    linux: "Microphone for Clear Calls",
  },
  {
    feature: "Bluetooth",
    version6: "Version 5.0 LE",
    linux: "Bluetooth 5.0",
  },
  {
    feature: "USB Ports",
    version6: "3 USB 2.0 Ports",
    linux: "2 Rear USB Ports",
  },
  {
    feature: "Steering Wheel & AC Controls",
    version6: "Fully Compatible",
    linux: "Fully Compatible",
  },
  {
    feature: "Factory Reversing Camera",
    version6: "Compatible (Adaptor plug Sold Separately)",
    linux: "Compatible (Adaptor plug Sold Separately)",
  },
  {
    feature: "Audio and Video Features",
    version6: "Advanced DSP with Coaxial, Optical Digital Outputs",
    linux: "video out capabilities",
  },
  {
    feature: "Radio Tuner",
    version6: "Digital Radio (DAB) with RDS and RBDS",
    linux: "FM Radio with RDS and AM Radio with RX3356 Chip",
  },
  {
    feature: "Google Play Store",
    version6: "Compatible",
    linux: "Not Compatible",
  },
  {
    feature: "Netflix",
    version6: "Compatible",
    linux: "Not Compatible",
  },
  {
    feature: "Disney+",
    version6: "Compatible",
    linux: "Not Compatible",
  },
  {
    feature: "Foxtel",
    version6: "Compatible",
    linux: "Not Compatible",
  },
  {
    feature: "APPs",
    version6: "Compatible with Tons of Apps",
    linux: "Not Compatible",
  },
  {
    feature: "Online Videos",
    version6: "Compatible",
    linux: "Not Compatible",
  },
];

export default function ComparisonTable() {
  return (
    <div className="p-4 overflow-x-auto bg-white text-sm text-gray-900">
      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            <th className="p-3 border border-gray-300">Feature</th>
            <th className="p-3 border border-gray-300">Version 6 Head Unit</th>
            <th className="p-3 border border-gray-300">Linux Head Unit</th>
          </tr>
        </thead>
        <tbody>
          {specData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 border border-gray-300 font-medium">
                {parse(item.feature)}
              </td>
              <td className="p-3 border border-gray-300">
                {parse(item.version6)}
              </td>
              <td className="p-3 border border-gray-300">
                {parse(item.linux)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

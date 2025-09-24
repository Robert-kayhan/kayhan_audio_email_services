"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Layers,
  Menu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, url: "" },
  { name: "Department", icon: <Users />, url: "" },
  { name: "Order", icon: <ShoppingCart />, url: "" },
  { name: "Product", icon: <Package />, url: "" },
  { name: "Category", icon: <Layers />, url: "" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Sidebar
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-56" : "w-16"}`}
    >
      {/* Hamburger / Toggle Button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {isOpen && <span className="font-bold text-lg">MyApp</span>}
        <button
          aria-label="button"
          className="p-2 rounded hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <Link
            href={item.url}
            key={item.name}
            className="flex items-center gap-4 py-3 px-4 hover:bg-gray-800 cursor-pointer transition-colors"
          >
            {item.icon}
            {isOpen && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

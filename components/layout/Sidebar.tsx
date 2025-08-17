"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LucideListOrdered,
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  User,
  LogOutIcon,
  PhoneCall,
  Album,
  Menu,
  X,
} from "lucide-react";
import { useLogoutMutation } from "@/store/api/AuthApi";

const userInfo = {
  username: "karan",
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Mail, label: "Campaigns", href: "/dashboard/campaign" },
  { icon: FileText, label: "Templates", href: "/dashboard/template" },
  { icon: User, label: "User", href: "/dashboard/user" },
  { icon: Users, label: "Leads Group", href: "/dashboard/lead-group" },
  {
    icon: LucideListOrdered,
    label: "Match Order",
    href: "/dashboard/macth-with-orders",
  },
  { icon: PhoneCall, label: "CRM", href: "/dashboard/lead-folow-up" },
  {
    icon: Settings,
    label: "Product specifications",
    href: "/dashboard/product-specifications",
  },
  { icon: Album, label: "Flyer", href: "/dashboard/flyer/" },
];

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await logout({}).unwrap();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        id="navigation-container"
        className="group fixed z-50 h-screen bg-black text-white transition-all duration-300
                   w-[64px] hover:w-[240px] md:flex flex-col justify-between p-4 hidden"
      >
        <div className="flex flex-col space-y-4">
          {navItems.map(({ icon: Icon, label, href }, i) => (
            <Link
              key={i}
              href={href}
              className="flex items-center hover:translate-x-2 transition-transform"
            >
              <Icon className="mr-2 mt-6 min-w-[20px]" size={20} />
              <span className="nav-item-name hidden group-hover:inline-block mt-6">
                {label}
              </span>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className="flex items-center hover:translate-x-2 transition-transform"
          >
            <LogOutIcon className="mr-2 mt-6" size={20} />
            <span className="nav-item-name hidden group-hover:inline-block mt-6 cursor-pointer">
              Logout
            </span>
          </button>
        </div>

        {userInfo && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-white"
            >
              <span className="nav-item-name hidden group-hover:inline-block cursor-pointer">
                Kayhan Audio
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between p-4 z-50">
        <span className="font-semibold">Kayhan Audio</span>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-6 z-40 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6">
          {navItems.map(({ icon: Icon, label, href }, i) => (
            <Link
              key={i}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 hover:translate-x-2 transition-transform"
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}

          <button
            onClick={logoutHandler}
            className="flex items-center space-x-2 hover:translate-x-2 transition-transform"
          >
            <LogOutIcon size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;

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
  BookKeyIcon,
  ReceiptText,
} from "lucide-react";
import { useLogoutMutation } from "@/store/api/AuthApi";

const userInfo = {
  username: "karan",
};

// Navigation items with optional subItems
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: Mail,
    label: "Campaigns",
    href: "/dashboard/campaign",
    subItems: [
      { label: "Retail Campaigns", href: "/dashboard/campaign" },
      {
        label: "Wholesale Campaigns",
        href: "/wholesale/compagin",
      },
    ],
  },
  {
    icon: FileText,
    label: "Templates",
    href: "/dashboard/template",
    subItems: [
      { label: "Retail Campaigns", href: "/dashboard/template" },
      {
        label: "Wholesale Campaigns",
        href: "/wholesale/templates",
      },
    ],
  },
  {
    icon: User,
    label: "User",
    href: "",
    subItems: [
      { label: "RetailUser", href: "/dashboard/user" },
      {
        label: "Wholesale User",
        href: "/wholesale/users",
      },
    ],
  },
  { icon: Users, label: "Leads Group", href: "/dashboard/lead-group",subItems: [
      { label: "Retail Lead", href: "/dashboard/lead-group" },
      {
        label: "Wholesale Lead  ",
        href: "/wholesale/lead-group",
      },
    ], },
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
  { icon: BookKeyIcon, label: "Booking", href: "/dashboard/booking/" },
  { icon: ReceiptText, label: "Invoice", href: "/dashboard/invoice" },
];

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // track expanded items
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

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const renderNavItem = (item: (typeof navItems)[0]) => {
    const isExpanded = expandedMenus.includes(item.label);
    return (
      <div key={item.label}>
        <div
          onClick={() => (item.subItems ? toggleMenu(item.label) : undefined)}
          className="flex items-center justify-between hover:translate-x-2 transition-transform cursor-pointer mt-6"
        >
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon size={20} />
            <span className="nav-item-name hidden group-hover:inline-block">
              {item.label}
            </span>
          </Link>
          {item.subItems && (
            <span className="text-gray-400 group-hover:inline-block">
              {isExpanded ? "▾" : "▸"}
            </span>
          )}
        </div>
        {/* Render subItems */}
        {item.subItems && isExpanded && (
          <div className="ml-6 mt-2 flex flex-col space-y-2">
            {item.subItems.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        id="navigation-container"
        className="group fixed z-50 bg-black text-white transition-all duration-300 h-screen overflow-y-auto
                   w-[64px] hover:w-[240px] md:flex flex-col justify-between p-4 hidden"
      >
        <div className="flex flex-col space-y-4">
          {navItems.map(renderNavItem)}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className="flex items-center hover:translate-x-2 transition-transform mt-6"
          >
            <LogOutIcon className="mr-2" size={20} />
            <span className="nav-item-name hidden group-hover:inline-block cursor-pointer">
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
      <div className="md:hidden top-0 left-0 w-full bg-black text-white flex items-center justify-between p-4 z-50">
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
          {navItems.map((item) => {
            const isExpanded = expandedMenus.includes(item.label);
            return (
              <div key={item.label}>
                <div
                  onClick={() =>
                    item.subItems ? toggleMenu(item.label) : setMenuOpen(false)
                  }
                  className="flex items-center justify-between hover:translate-x-2 transition-transform cursor-pointer"
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                  {item.subItems && <span>{isExpanded ? "▾" : "▸"}</span>}
                </div>
                {item.subItems && isExpanded && (
                  <div className="ml-6 mt-2 flex flex-col space-y-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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

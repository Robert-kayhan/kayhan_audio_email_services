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
  Album
} from "lucide-react";
import { useLogoutMutation } from "@/store/api/AuthApi";

const userInfo = {
  username: "karan",
};

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <div
      id="navigation-container"
      className="group fixed z-50 h-screen bg-black text-white transition-all duration-300
                 w-[64px] hover:w-[240px] md:flex flex-col justify-between p-4 hidden"
    >
      {/* Navigation Links */}
      <div className="flex flex-col space-y-4">
        {[
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: Mail, label: "Campaigns", href: "/dashboard/campaign" },
          { icon: FileText, label: "Templates", href: "/dashboard/template" },
          { icon: User, label: "User", href: "/dashboard/user" },
          { icon: Users, label: "Leads Group", href: "/dashboard/lead-group" },
          { icon: LucideListOrdered, label: "Match Order", href: "/dashboard/macth-with-orders" },
          { icon: PhoneCall, label: "CRM", href: "/dashboard/lead-folow-up" },
          { icon: Album, label: "Flyer", href: "/dashboard/flyer/" },

        ].map(({ icon: Icon, label, href }, i) => (
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

      {/* User Dropdown */}
      {userInfo && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-white"
          >
            <span className="nav-item-name hidden group-hover:inline-block cursor-pointer">
              {/* {userInfo.username} */}
              Kayhan Audio
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;

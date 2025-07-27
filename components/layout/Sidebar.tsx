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
} from "lucide-react";
import { useLogoutMutation } from "@/store/api/AuthApi";
import { log } from "console";
// TEMP mock user (you can replace with Redux or real auth check)
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
    <div className="group hidden md:flex flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] z-50 h-screen fixed transition-all duration-300">
      {/* Top Navigation Items */}
      <div className="flex flex-col justify-center space-y-4">
        <Link
          href="/dashboard"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <LayoutDashboard className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            Dashboard
          </span>
        </Link>

        <Link
          href="/dashboard/campaign"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <Mail className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            Campaigns
          </span>
        </Link>

        <Link
          href="/dashboard/template"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <FileText className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            Templates
          </span>
        </Link>

        <Link
          href="/dashboard/user"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <User className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            User
          </span>
        </Link>
        <Link
          href="/dashboard/lead-group"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <Users className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            Leads Group{" "}
          </span>
        </Link>
        <Link
          href="/dashboard/macth-with-orders"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <LucideListOrdered className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">
            Match order{" "}
          </span>
        </Link>
        <button onClick={()=>logoutHandler()} className="flex items-center hover:translate-x-2 transition-transform">
          <LogOutIcon className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12 group-hover:cursor-pointer">
            LogOut
          </span>
        </button>
      </div>

      {/* Bottom Dropdown/Login Section */}
      <div className="relative">
        {userInfo && (
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-white"
            >
              <span className="hidden group-hover:inline group-hover:cursor-pointer">
                {userInfo.username}
              </span>
              {/* {dropdownOpen ? (
                <ChevronUp className="ml-1" size={16} />
              ) : (
                <ChevronDown className="ml-1" size={16} />
              )} */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;

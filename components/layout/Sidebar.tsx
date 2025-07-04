"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
 User
} from "lucide-react";

// TEMP mock user (you can replace with Redux or real auth check)
const userInfo = {
  username: "karan",
};

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // const logoutHandler = async () => {
  //   try {
  //     // Replace this with actual logout logic
  //     router.push("/login");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div
      className="group hidden md:flex flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] z-50 h-screen fixed transition-all duration-300"
    >
      {/* Top Navigation Items */}
      <div className="flex flex-col justify-center space-y-4">
        <Link href="/dashboard" className="flex items-center hover:translate-x-2 transition-transform">
          <LayoutDashboard className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">Dashboard</span>
        </Link>

        <Link href="/dashboard/campaign" className="flex items-center hover:translate-x-2 transition-transform">
          <Mail className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">Campaigns</span>
        </Link>

        <Link href="/dashboard/template" className="flex items-center hover:translate-x-2 transition-transform">
          <FileText className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">Templates</span>
        </Link>

        <Link href="/dashboard/user" className="flex items-center hover:translate-x-2 transition-transform">
          <User className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">User</span>
        </Link>
         <Link href="/dashboard/lead-group" className="flex items-center hover:translate-x-2 transition-transform">
          <Users className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">Leads Group </span>
        </Link>
        <Link href="/settings" className="flex items-center hover:translate-x-2 transition-transform">
          <Settings className="mr-2 mt-12" size={20} />
          <span className="hidden group-hover:inline nav-item-name mt-12">Settings</span>
        </Link>
      </div>

      {/* Bottom Dropdown/Login Section */}
      <div className="relative">
        {userInfo &&
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-white"
            >
              <span className="hidden group-hover:inline">{userInfo.username}</span>
              {/* {dropdownOpen ? (
                <ChevronUp className="ml-1" size={16} />
              ) : (
                <ChevronDown className="ml-1" size={16} />
              )} */}
            </button>
          </div>
       }
      </div>
    </div>
  );
};

export default Navigation;

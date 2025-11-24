"use client";

import * as React from "react";
import {
  Book,
  Users,
  BookOpen,
  Library,
  LayoutDashboard,
  BookMarked,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Master Data",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Users",
          icon: Users,
        },
        {
          title: "Books",
          icon: Book,
        },
      ],
    },
    {
      title: "Borrowings",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "Borrow status",
          icon: BookOpen,
        },
      ],
    },
  ],
};

export function AppSidebar({ setActiveMenu, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 bg-linear-to-br from-indigo-50 to-blue-50">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-data-[collapsible=icon]:hidden">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Taruna Library
            </h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} setActiveMenu={setActiveMenu} />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 bg-linear-to-br from-gray-50 to-white">
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

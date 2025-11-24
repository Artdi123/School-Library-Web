"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  Shield,
} from "lucide-react";

import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-50 data-[state=open]:to-blue-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 rounded-xl py-6 group"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 rounded-xl border-2 border-indigo-200 shadow-sm">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                {user?.role === "admin" && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-gray-900">
                  {user?.name || user?.username}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs text-gray-500">
                    {user?.email}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-400 group-hover:text-indigo-600 transition-colors group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-xl shadow-2xl border-gray-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl">
                <div className="relative">
                  <Avatar className="h-12 w-12 rounded-xl border-2 border-indigo-200 shadow-sm">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-semibold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  {user?.role === "admin" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900">
                    {user?.name || user?.username}
                  </span>
                  <span className="truncate text-xs text-gray-600">
                    {user?.email}
                  </span>
                  {user?.role && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-700 w-fit mt-1 border border-indigo-200">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="p-1">
              <DropdownMenuItem
                className="cursor-pointer rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors py-2.5"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

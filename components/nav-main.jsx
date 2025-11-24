"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items, setActiveMenu }) {
  const [activeItem, setActiveItem] = useState("users");

  return (
    <SidebarGroup className="px-2 py-4">
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="hover:bg-linear-to-r hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-700 transition-all duration-200 rounded-xl py-6 data-[state=open]:bg-linear-to-r data-[state=open]:from-indigo-50 data-[state=open]:to-blue-50 data-[state=open]:text-indigo-700"
                >
                  {item.icon && (
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-linear-to-br from-indigo-100 to-blue-100 text-indigo-600 group-hover:from-indigo-200 group-hover:to-blue-200 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="font-semibold">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-4 border-l-2 border-indigo-100 pl-4 py-2 space-y-3">
                  {item.items?.map((subItem) => {
                    const menuKey = subItem.title
                      .toLowerCase()
                      .replace(" ", "");
                    const finalKey =
                      menuKey === "borrowstatus" ? "borrows" : menuKey;
                    const isActive = activeItem === finalKey;

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={`transition-all duration-200 rounded-lg py-6 ${
                            isActive
                              ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md"
                              : "hover:bg-linear-to-r hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-700"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActiveMenu(finalKey);
                              setActiveItem(finalKey);
                            }}
                            className="w-full"
                          >
                            <div className="flex items-center gap-3 w-full py-1">
                              {subItem.icon && (
                                <div
                                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : "bg-linear-to-br from-indigo-100 to-blue-100 text-indigo-600"
                                  }`}
                                >
                                  <subItem.icon className="w-4 h-4" />
                                </div>
                              )}
                              <div className="flex flex-col items-start flex-1">
                                <span className="font-medium text-sm">
                                  {subItem.title}
                                </span>
                                {subItem.description && (
                                  <span
                                    className={`text-xs ${
                                      isActive
                                        ? "text-white/80"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {subItem.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

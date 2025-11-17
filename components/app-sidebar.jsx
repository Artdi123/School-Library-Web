"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Admin_001",
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: "Master Data",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Users",
        },
        {
          title: "Books",
        },
      ],
    },
    {
      title: "Borrowings",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Borrow status",
        },
      ],
    },
  ],
};

export function AppSidebar({ setActiveMenu, ...props }) {
  // test
  const { data: session, status } = useSession();

  console.log("Session:", session);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} setActiveMenu={setActiveMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

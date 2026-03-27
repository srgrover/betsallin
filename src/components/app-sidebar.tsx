"use client"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconTerminal2, IconRobot, IconBook, IconSettings, IconLifebuoy, IconSend, IconFrame, IconChartPie, IconMap, IconBallFootball, IconLogin } from "@tabler/icons-react"
import { User } from "next-auth"

const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <IconTerminal2
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: (
        <IconRobot
        />
      ),
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <IconBook
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <IconSettings
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: (
        <IconLifebuoy
        />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <IconSend
        />
      ),
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <IconFrame
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <IconChartPie
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <IconMap
        />
      ),
    },
  ],
  navAuth: [
    {
      title: "Sign In",
      url: "/login",
      icon: (
        <IconLogin
        />
      ),
    },
  ],
}

interface Props {
  user?: User
}

export function AppSidebar({ user }: Props) {
  return (
    <Sidebar
      className="top-(--header-height) h-full!"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconBallFootball className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BetsAllIn</span>
                  <span className="truncate text-xs">Your bet game</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {
        user ? (
          <SidebarContent>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>
        ) : (
          <SidebarContent>
            <NavMain items={data.navAuth} />
          </SidebarContent>
        )
      }
      {user && (
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

"use client"

import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Label } from "./ui/label"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string,
    value: number,
    color: string,
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Label key={item.title}>
              {item.icon}
              <span className="truncate">{item.title}</span>
              <span className="truncate font-bold text-lg">{item.value}</span>
              </Label>
            // <SidebarMenuItem key={item.title}>
            //   <SidebarMenuButton asChild size="sm">
            //     <a href={item.url}>
            //       {item.icon}
            //       <span>{item.title}</span>
            //     </a>
            //   </SidebarMenuButton>
            // </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

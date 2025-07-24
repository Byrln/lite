"use client"

import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="hover:bg-sidebar-accent/80">
                    {item.icon && <item.icon className="transition-all duration-300 group-hover:scale-110" />}
                    <span className="transition-all duration-300">{item.title}</span>
                    <ChevronRight className="ml-auto transition-all duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-hover:scale-110" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-sidebar-accent/80">
                  <Link href={item.url}>
                    {item.icon && <item.icon className="transition-all duration-300 group-hover:scale-110" />}
                    <span className="transition-all duration-300">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {item.items && (
                <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1">
                  <SidebarMenuSub className="animate-in slide-in-from-left-2 duration-300">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="animate-in fade-in-50 slide-in-from-left-1 duration-300" style={{ animationDelay: `${(item.items || []).indexOf(subItem) * 50}ms` }}>
                        <SidebarMenuSubButton asChild className="hover:bg-sidebar-accent/60">
                          <Link href={subItem.url}>
                            <span className="transition-all duration-300 text-white">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

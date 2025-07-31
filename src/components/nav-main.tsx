"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { Icon } from "@iconify/react"
import { IconifyProps } from "@/components/iconify/types"

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
    titleEn?: string
    url: string
    icon?: { name: string; color?: string } | IconifyProps
    isActive?: boolean
    items?: {
      title: string
      titleEn?: string
      url: string
      icon?: { name: string; color?: string } | IconifyProps
      items?: {
        title: string
        titleEn?: string
        url: string
      }[]
    }[]
  }[]
}) {
  const { locale } = useRouter()
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
            <SidebarMenuItem className="capitalize">
              {item.items ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={locale === "en" ? item.titleEn || item.title : item.title} className="capitalize hover:bg-sidebar-accent/80">
                    {item.icon && <Icon icon={typeof item.icon === 'object' && 'name' in item.icon ? item.icon.name : item.icon} color={typeof item.icon === 'object' && 'color' in item.icon ? item.icon.color : undefined} className="transition-all duration-300 group-hover:scale-110" width={16} height={16} />}
                    <span className="transition-all duration-300">{locale === "en" ? item.titleEn || item.title : item.title}</span>
                    <Icon icon="lucide:chevron-right" className="ml-auto transition-all duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-hover:scale-110" width={16} height={16} color="white" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton asChild tooltip={locale === "en" ? item.titleEn || item.title : item.title} className="hover:bg-sidebar-accent/80">
                  <Link href={item.url}>
                    {item.icon && <Icon icon={typeof item.icon === 'object' && 'name' in item.icon ? item.icon.name : item.icon} color={typeof item.icon === 'object' && 'color' in item.icon ? item.icon.color : undefined} className="transition-all duration-300 group-hover:scale-110" width={16} height={16} />}
                    <span className="transition-all duration-300">{locale === "en" ? item.titleEn || item.title : item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {item.items && (
                <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1">
                  <SidebarMenuSub className="animate-in slide-in-from-left-2 duration-300">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="animate-in fade-in-50 slide-in-from-left-1 duration-300" style={{ animationDelay: `${(item.items || []).indexOf(subItem) * 50}ms` }}>
                        {subItem.items ? (
                          <Collapsible
                            asChild
                            className="group/sub-collapsible"
                          >
                            <div>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton className="hover:bg-sidebar-accent/60">
                                  {subItem.icon && <Icon icon={typeof subItem.icon === 'object' && 'name' in subItem.icon ? subItem.icon.name : subItem.icon} color={typeof subItem.icon === 'object' && 'color' in subItem.icon ? subItem.icon.color : undefined} className="transition-all duration-300 group-hover:scale-110" width={14} height={14} />}
                                  <span className="transition-all duration-300 text-white">{locale === "en" ? subItem.titleEn || subItem.title : subItem.title}</span>
                                  <Icon icon="lucide:chevron-right" className="ml-auto transition-all duration-300 ease-in-out group-data-[state=open]/sub-collapsible:rotate-90 group-hover:scale-110" width={14} height={14} color="white" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1">
                                <div className="ml-3 border-l border-white bg-sidebar-accent/10 rounded-r-md py-1 pl-2">
                                  {subItem.items.map((nestedItem) => (
                                    <SidebarMenuSubButton key={nestedItem.title} asChild className="hover:bg-sidebar-accent/40 ml-2">
                                      <Link href={nestedItem.url}>
                                        <span className="transition-all duration-300 text-white text-sm">{locale === "en" ? nestedItem.titleEn || nestedItem.title : nestedItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ) : (
                          <SidebarMenuSubButton asChild className="hover:bg-sidebar-accent/60">
                            <Link href={subItem.url}>
                              {subItem.icon && <Icon icon={typeof subItem.icon === 'object' && 'name' in subItem.icon ? subItem.icon.name : subItem.icon} color={typeof subItem.icon === 'object' && 'color' in subItem.icon ? subItem.icon.color : undefined} className="transition-all duration-300 group-hover:scale-110" width={14} height={14} />}
                              <span className="transition-all duration-300 text-white">{locale === "en" ? subItem.titleEn || subItem.title : subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        )}
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

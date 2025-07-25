"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { IconifyProps } from "@/components/iconify/types"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import sidebarConfig from "@/components/layouts/dashboard/sidebar-config"

// Icon map is no longer needed as we use Lucide icons directly

function transformSidebarConfig(config: any[], intl: any) {
  return config.map((item) => {
    // item.icon is now an object with name and color from getIcon function
    const iconData = item.icon || { name: "lucide:square-terminal", color: undefined }

    return {
      title: intl.formatMessage({
        id: item.titleEn || `menu.${item.title}`,
        defaultMessage: item.title
      }),
      url: item.path || "#",
      icon: iconData,
      isActive: false,
      items: item.children ? item.children.map((child: any) => ({
        title: intl.formatMessage({
          id: child.titleEn || `menu.${child.title}`,
          defaultMessage: child.title
        }),
        url: child.path || "#",
        icon: child.icon || undefined,
        items: child.children ? child.children.map((nestedChild: any) => ({
          title: intl.formatMessage({
            id: nestedChild.titleEn || `menu.${nestedChild.title}`,
            defaultMessage: nestedChild.title
          }),
          url: nestedChild.path || "#",
        })) : undefined,
      })) : undefined,
    }
  })
}

// getIconNameFromConfig function is no longer needed as icons are now strings

interface HotelSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sideBarData?: any[]
}

export function HotelSidebar({ sideBarData, ...props }: HotelSidebarProps) {
  const intl = useIntl()
  const router = useRouter()
  const { data: session } = useSession()

  const configToUse = sideBarData || sidebarConfig
  const navItems = transformSidebarConfig(configToUse, intl)

  const username = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username') || 'Admin'
    }
    return 'Admin'
  }, [])

  const hotelId = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hotelId') || '1'
    }
    return '1'
  }, [])

  const data = {
    user: {
      name: username,
      email: `Hotel id: ${hotelId}`,
      avatar: "/images/avatar.jpg",
    },
    teams: [
      {
        name: "Hotel PMS",
        logo: "lucide:gallery-vertical-end",
        plan: "Enterprise",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#1a1f38] text-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-[#1a1f38] text-white border-t-2 border-gray-500">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="bg-[#1a1f38] text-white border-t-2 border-gray-500">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
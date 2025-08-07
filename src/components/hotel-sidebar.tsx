"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { IconifyProps } from "@/components/iconify/types"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
  const locale = intl.locale || 'mon'

  return config.map((item) => {
    // item.icon is now an object with name and color from getIcon function
    const iconData = item.icon || { name: "lucide:square-terminal", color: undefined }

    return {
      title: locale === 'en' && item.titleEn ? item.titleEn : item.title,
      titleEn: item.titleEn,
      url: item.path || "#",
      icon: iconData,
      isActive: false,
      items: item.children ? item.children.map((child: any) => ({
        title: locale === 'en' && child.titleEn ? child.titleEn : child.title,
        titleEn: child.titleEn,
        url: child.path || "#",
        icon: child.icon || undefined,
        items: child.children ? child.children.map((nestedChild: any) => ({
          title: locale === 'en' && nestedChild.titleEn ? nestedChild.titleEn : nestedChild.title,
          titleEn: nestedChild.titleEn,
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
  const [sidebarMode, setSidebarMode] = React.useState<'front-office' | 'configuration'>('front-office')

  const configToUse = sideBarData || sidebarConfig

  // Filter sidebar items based on current mode
  const filteredConfig = React.useMemo(() => {
    if (sidebarMode === 'configuration') {
      // Show only configuration items (items with paths starting with /conf/ or /mini-bar/)
      return configToUse.filter(item =>
        item.path?.startsWith('/conf/') || 
        item.path?.startsWith('/mini-bar/') ||
        item.titleEn === 'Accounting' ||
        item.titleEn === 'Pos Api Config' ||
        item.titleEn === 'Hotel Information' ||
        item.titleEn === 'Hotel Settings' ||
        item.titleEn === 'User Role' ||
        item.titleEn === 'User' ||
        item.titleEn === 'Reason' ||
        item.titleEn === 'Reservation Source' ||
        item.titleEn === 'Vip Status' ||
        item.titleEn === 'Customer Group' ||
        item.titleEn === 'Promotions' ||
        item.titleEn === 'Packages' ||
        item.titleEn === 'Mini Bar Groups' ||
        item.titleEn === 'Mini Bar Items'
      )
    } else {
      // Show all items except configuration items
      return configToUse.filter(item =>
        !(item.path?.startsWith('/conf/') || 
          item.path?.startsWith('/mini-bar/') ||
          item.titleEn === 'Accounting' ||
          item.titleEn === 'Pos Api Config' ||
          item.titleEn === 'Hotel Information' ||
          item.titleEn === 'Hotel Settings' ||
          item.titleEn === 'User Role' ||
          item.titleEn === 'User' ||
          item.titleEn === 'Reason' ||
          item.titleEn === 'Reservation Source' ||
          item.titleEn === 'Vip Status' ||
          item.titleEn === 'Customer Group' ||
          item.titleEn === 'Promotions' ||
          item.titleEn === 'Packages' ||
          item.titleEn === 'Mini Bar Groups' ||
          item.titleEn === 'Mini Bar Items')
      )
    }
  }, [configToUse, sidebarMode])

  const navItems = transformSidebarConfig(filteredConfig, intl)

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
      <SidebarContent className="bg-[#1a1f38] text-white border-t-2 border-gray-500 flex flex-col justify-between">
        <NavMain items={navItems} />
        <NavSecondary
          currentMode={sidebarMode}
          onModeChange={setSidebarMode}
        />
      </SidebarContent>
      <SidebarFooter className="bg-[#1a1f38] text-white border-t-2 border-gray-500">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
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

const iconMap: { [key: string]: string } = {
  "pie-chart-2-fill": "eva:pie-chart-2-fill",
  "shopping-cart-fill": "eva:shopping-cart-fill",
  "people-fill": "eva:people-fill",
  "calendar-fill": "eva:calendar-fill",
  "pricetags-fill": "eva:pricetags-fill",
  "home-fill": "eva:home-fill",
  "credit-card-fill": "eva:credit-card-fill",
  "book-open-fill": "eva:book-open-fill",
  "settings-2-fill": "eva:settings-2-fill",
  "award-fill": "eva:award-fill",
  "options-2-fill": "eva:options-2-fill",
}

function transformSidebarConfig(config: any[], intl: any) {
  return config.map((item) => {
    const iconName = getIconNameFromConfig(item.icon)
    const iconString = iconMap[iconName] || "lucide:square-terminal"

    return {
      title: intl.formatMessage({
        id: item.titleEn || `menu.${item.title}`,
        defaultMessage: item.title
      }),
      url: item.path || "#",
      icon: iconString,
      isActive: false,
      items: item.children ? item.children.map((child: any) => ({
        title: intl.formatMessage({
          id: child.titleEn || `menu.${child.title}`,
          defaultMessage: child.title
        }),
        url: child.path || "#",
      })) : undefined,
    }
  })
}

function getIconNameFromConfig(iconComponent: any) {
  if (!iconComponent || !iconComponent.props) return "square-terminal"
  const iconName = iconComponent.props.icon?.name || iconComponent.props.icon
  if (typeof iconName === 'string') {
    return iconName
  }
  // Handle Eva icons object structure
  if (iconName && iconName.name) {
    return iconName.name
  }
  return "square-terminal"
}

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
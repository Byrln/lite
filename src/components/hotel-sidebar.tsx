"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Command,
  CreditCard,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Users,
  Tag,
} from "lucide-react"

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

// Icon mapping for sidebar config
const iconMap: { [key: string]: any } = {
  "pie-chart-2-fill": PieChart,
  "shopping-cart-fill": ShoppingCart,
  "people-fill": Users,
  "calendar-fill": Calendar,
  "pricetags-fill": Tag,
  "home-fill": Home,
  "credit-card-fill": CreditCard,
  "book-open-fill": BookOpen,
  "settings-2-fill": Settings2,
  "award-fill": FileText,
  "options-2-fill": Settings2,
}

// Transform sidebar config to match shadcn format
function transformSidebarConfig(config: any[], intl: any) {
  return config.map((item) => {
    const iconName = getIconNameFromConfig(item.icon)
    const IconComponent = iconMap[iconName] || SquareTerminal

    return {
      title: intl.formatMessage({
        id: item.titleEn || `menu.${item.title}`,
        defaultMessage: item.title
      }),
      url: item.path || "#",
      icon: IconComponent,
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

// Extract icon name from iconify component
function getIconNameFromConfig(iconComponent: any) {
  if (!iconComponent || !iconComponent.props) return "square-terminal"
  const iconName = iconComponent.props.icon?.name || iconComponent.props.icon
  return iconName || "square-terminal"
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

  // Get real user data from localStorage and session
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
        logo: GalleryVerticalEnd,
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
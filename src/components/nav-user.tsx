"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Languages,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { QuestionMark, QuestionMarkOutlined, QuestionMarkRounded } from "@mui/icons-material"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { useIntl } from "react-intl"

// Language menu item component
function LanguageMenuItem({ value, label, icon }: { value: string; label: string; icon: string }) {
  const router = useRouter()
  const { locale, asPath } = router
  const isSelected = locale === value

  const handleLanguageChange = () => {
    router.push(asPath, asPath, { locale: value })
  }

  return (
    <DropdownMenuItem
      onClick={handleLanguageChange}
      className={`flex items-center gap-2 ${isSelected ? 'bg-accent' : ''}`}
    >
      <Image
        src={icon}
        alt={label}
        width={20}
        height={20}
        className="rounded-sm"
      />
      <span>{label}</span>
      {isSelected && <span className="ml-auto text-xs">✓</span>}
    </DropdownMenuItem>
  )
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const intl = useIntl();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">HO</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">HO</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              <Link href="/faq" className="gap-2">
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <QuestionMarkOutlined />
                  <span className="pl-2">FAQ</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent">
                  <Languages className="h-4 w-4" />
                  <span>{intl.formatMessage({ id: "TextLanguage" })}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <LanguageMenuItem value="en" label="English" icon="/static/icons/ic_flag_en.svg" />
                  <DropdownMenuSeparator />
                  <LanguageMenuItem value="mon" label="Монгол" icon="/static/icons/ic_flag_mgl.svg" />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-red-200 border border-red-500 cursor-pointer hover:bg-red-300" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
              <div className="flex items-center gap-3 text-red-700">
                <LogOut className="w-4 h-4" />
                {intl.formatMessage({ id: "TextLogOut" })}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu >
  )
}

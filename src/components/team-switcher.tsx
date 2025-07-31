import * as React from "react"
import { Icon } from "@iconify/react"
import { IconifyProps } from "@/components/iconify/types"
import { useRouter } from "next/router"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: IconifyProps
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  const handleDemoCalendar = () => {
    // Set demo mode in localStorage
    localStorage.setItem('demoMode', 'true')
    // Navigate to demo calendar
    router.push('/new-calendar/demo')
  }

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex mt-1 aspect-square size-8 items-center justify-center rounded-lg bg-gray-200 text-sidebar-primary-foreground">
                {/* <activeTeam.logo className="size-4" /> */}
                <Image
                  src="/images/logo_sm.png"
                  alt="logo"
                  width={16}
                  height={16}
                  className="w-6 h-4"
                />
              </div>
              <div className="flex flex-col text-left text-sm leading-tight">
                <div className="flex text-lg"><span className="truncate font-semibold">
                  Ho
                </span>
                  <span className="truncate font-semibold">
                    Re
                  </span>
                  <span className="truncate font-semibold">
                    Ca
                  </span>
                  <span className="truncate font-semibold">
                    Soft
                  </span></div>
                <span className="truncate text-[8px]">Hotel, Resort, Camp Software</span>
              </div>
              <Icon icon="lucide:chevrons-up-down" className="ml-auto" width={16} height={16} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              test
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Icon icon={team.logo} className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleDemoCalendar}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Icon icon="lucide:calendar" className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Demo Calendar</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Icon icon="lucide:plus" className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add test</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

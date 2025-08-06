import { useState, useEffect } from "react"
import { GetPrivilegesSWR } from "lib/api/user"
import sidebarConfig from "components/layouts/dashboard/sidebar-config"
import { HotelSidebar } from "@/components/hotel-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useAppState } from "lib/context/app"
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"
// import NotificationBell from "./notification-bell"
import { CommandPalette, useCommandPalette } from "./command-palette"
import { Search, Command, Home, Settings } from "lucide-react"
import Link from "next/link"
import { useIntl } from "react-intl";
import CalendarControlsModal from "@/components/common/calendar-controls-modal";
import { CalendarFiltersProvider, useCalendarFilters } from "@/lib/context/calendar-filters";
import Image from "next/image";
import { useRouter } from "next/router";
import { FilterList } from "@mui/icons-material"


const getModifierKey = () => {
  if (typeof window !== 'undefined') {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'
  }
  return 'Ctrl'
}

function DashboardContent({ children }: any) {
  const { data, error } = GetPrivilegesSWR()
  const [sideBarData, setSideBarData] = useState<any[] | undefined>(undefined)
  const [lastValidSideBarData, setLastValidSideBarData] = useState<any[] | undefined>(undefined)
  const [state, dispatch]: any = useAppState()
  const breadcrumbs = useBreadcrumbs(sideBarData)
  const { open, setOpen } = useCommandPalette()
  const [modifierKey, setModifierKey] = useState('Ctrl')
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [isCalendarLoading, setIsCalendarLoading] = useState(false)

  const router = useRouter()
  const intl = useIntl();

  const {
    dayCount,
    setDayCount,
    currentView,
    setCurrentView,
    searchRoomTypeID,
    setSearchRoomTypeID,
    searchCurrDate,
    setSearchCurrDate,
    isHoverEnabled,
    setIsHoverEnabled,
    rerenderKey,
    setRerenderKey,
  } = useCalendarFilters()

  const isHandsontablePage = router.pathname.includes('/handsontable')

  useEffect(() => {
    setModifierKey(getModifierKey())
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'b' && e.altKey) {
        e.preventDefault()
        setCalendarModalOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  function filterMenu(menu: any, uniqueMenuLinks: any) {
    return menu.reduce((filteredMenu: any, item: any) => {
      if (item.path && (uniqueMenuLinks.includes(item.path) || item.path === "/room/management" || item.path === "/rate" || item.path === "/payment")) {
        filteredMenu.push(item)
      }
      if (item.children) {
        const filteredChildren = filterMenu(
          item.children,
          uniqueMenuLinks
        )
        if (filteredChildren.length > 0) {
          filteredMenu.push({
            ...item,
            children: filteredChildren,
          })
        }
      }

      return filteredMenu
    }, [])
  }

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch({
        type: "userRole",
        userRole: data,
      })
      let menuLinks = data
        .map((action: any) =>
          action.Status == true ? action.MenuLink2 : null
        )
        .filter((link: any) => link) // Filter out null or undefined values

      // Removing duplicates
      //@ts-ignore
      let uniqueMenuLinks = [...new Set(menuLinks)]

      const filteredMenu = filterMenu(sidebarConfig, uniqueMenuLinks)
      if (filteredMenu && filteredMenu.length > 0) {
        setSideBarData(filteredMenu)
        setLastValidSideBarData(filteredMenu) // Store as backup
      }
    } else if (data === undefined && lastValidSideBarData) {
      setSideBarData(lastValidSideBarData)
    }
  }, [data])


  return (
    <SidebarProvider>
      <HotelSidebar sideBarData={sideBarData} />
      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={index} className="flex items-center capitalize">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {breadcrumb.isCurrentPage ? (
                        <BreadcrumbPage>
                          {index === 0 && !breadcrumb.title ? (
                            <Home className="h-4 w-4" />
                          ) : (
                            breadcrumb.title
                          )}
                        </BreadcrumbPage>
                      ) : breadcrumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link href={breadcrumb.href}>
                            {index === 0 && !breadcrumb.title ? (
                              <Home className="h-4 w-4" />
                            ) : (
                              breadcrumb.title
                            )}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <span className="text-muted-foreground">
                          {index === 0 && !breadcrumb.title ? (
                            <Home className="h-4 w-4" />
                          ) : (
                            breadcrumb.title
                          )}
                        </span>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            {/* Refresh Button - Only visible on handsontable pages */}
            {isHandsontablePage && (
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => {
                    setIsCalendarLoading(true);
                    setRerenderKey((prevKey) => prevKey + 1);
                    setTimeout(() => {
                      setIsCalendarLoading(false);
                    }, 1000);
                  }}
                  disabled={isCalendarLoading}
                  variant="ghost"
                  size="sm"
                  className="relative h-8 xl:h-9 w-full px-2 border border-[#804FE6] bg-input hover:bg-[#804FE6] hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  <Image
                    src="/images/logo_sm.png"
                    alt="Refresh"
                    width={20}
                    height={20}
                    className="w-5 h-3"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCalendarModalOpen(true)}
                  className="flex items-center h-8 xl:h-9 w-full px-2 border border-gray-300 bg-input hover:bg-muted/80 transition-colors"
                >
                  <FilterList className="h-4 w-4" />
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">Alt</span>B
                  </kbd>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              className="relative px-3 border border-gray-300 bg-input h-8 w-8 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
            >
              <Search className="h-4 w-4 xl:ml-2" />
              <span className="hidden xl:inline-flex">{intl.formatMessage({
                id: "TextSearch",
              })}</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                <span className="text-xs">{modifierKey}</span>K
              </kbd>
            </Button>
            {/* <NotificationBell /> */}
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="max-w-full h-full">
            {children}
          </div>
        </div>
      </SidebarInset>
      <CommandPalette open={open} setOpen={setOpen} />
      <CalendarControlsModal
        open={calendarModalOpen}
        onOpenChange={setCalendarModalOpen}
        dayCount={dayCount}
        currentView={currentView}
        searchRoomTypeID={searchRoomTypeID}
        searchCurrDate={searchCurrDate}
        isHoverEnabled={isHoverEnabled}
        onDayCountChange={setDayCount}
        onCurrentViewChange={setCurrentView}
        onSearchRoomTypeIDChange={setSearchRoomTypeID}
        onSearchCurrDateChange={setSearchCurrDate}
        onHoverEnabledChange={setIsHoverEnabled}
      />
    </SidebarProvider>
  )
}

export default function DashboardLayout({ children }: any) {
  return (
    <CalendarFiltersProvider>
      <DashboardContent>{children}</DashboardContent>
    </CalendarFiltersProvider>
  )
}
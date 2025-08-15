import React, { useState, useEffect } from "react"
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
import { Search, Command, Home, Settings, Grid3X3, Calendar, CalendarDays } from "lucide-react"
import Link from "next/link"
import { useIntl } from "react-intl";
import CalendarControlsModal from "@/components/common/calendar-controls-modal";
import { CalendarFiltersProvider, useCalendarFilters } from "@/lib/context/calendar-filters";
import Image from "next/image";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { FilterList } from "@mui/icons-material"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FrontOfficeAPI } from "lib/api/front-office"
import { format } from "date-fns"
import { getCurrentDate } from "lib/utils/helpers"


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
  const [workingDate, setWorkingDate] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

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
    isGridView,
    setIsGridView,
  } = useCalendarFilters()

  const isHandsontablePage = router.pathname.includes('/handsontable')

  // Refresh function for handsontable pages
  const handleRefresh = async () => {
    if (isHandsontablePage && !isCalendarLoading) {
      setIsCalendarLoading(true)

      try {
        // Mutate all handsontable-related SWR caches
        const endpoints = [
          '/api/FrontOffice/ReservationDetailsByDate',
          '/api/RoomType/List',
          '/api/Room/List',
          '/api/FrontOffice/StayView2',
          '/api/RoomBlock/List',
          '/api/FrontOffice/WorkingDate'
        ];

        await Promise.all(
          endpoints.map(endpoint => {
            // Handle both simple string keys and array keys [url, params]
            return mutate((key: any) => {
              if (typeof key === 'string') {
                return key === endpoint;
              }
              if (Array.isArray(key) && key.length > 0) {
                return key[0] === endpoint;
              }
              return false;
            });
          })
        );

        // Also update the rerender key for any components that depend on it
        setRerenderKey((prevKey) => prevKey + 1)
      } catch (error) {
        console.error('Error refreshing handsontable data:', error)
      } finally {
        setTimeout(() => {
          setIsCalendarLoading(false)
        }, 500)
      }
    }
  }

  // Keyboard shortcut for refresh (Ctrl/Cmd + R) - only on handsontable pages
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        isHandsontablePage &&
        (event.key === 'r' || event.key === 'R') &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault()
        handleRefresh()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isHandsontablePage, isCalendarLoading])

  useEffect(() => {
    setModifierKey(getModifierKey())
    fetchWorkingDate()
  }, [])

  const fetchWorkingDate = async () => {
    try {
      const response = await FrontOfficeAPI.workingDate()
      if (response.status === 200 && response.workingDate && response.workingDate.length > 0) {
        setWorkingDate(response.workingDate[0].WorkingDate)
      } else {
        // Fallback to current date if API response is invalid
        setWorkingDate(new Date().toISOString().split('T')[0])
      }
    } catch (error) {
      // Fallback to current date if API fails
      setWorkingDate(new Date().toISOString().split('T')[0])
    }
  }

  const navigateToToday = async () => {
    setIsNavigating(true)
    try {
      const today = new Date(getCurrentDate())
      setSearchCurrDate(today)
      setRerenderKey(prev => prev + 1)
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))
    } finally {
      setIsNavigating(false)
    }
  }

  // Keyboard shortcut for calendar modal (Alt + B) - only on handsontable pages
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        isHandsontablePage &&
        (e.key === 'b' || e.key === 'B') &&
        e.altKey
      ) {
        e.preventDefault()
        setCalendarModalOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isHandsontablePage])

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
            {/* Working Date Display */}
            {workingDate && (
              <div
                className={`flex items-center gap-2 px-3 py-1 border border-blue-200 bg-blue-50 rounded-md shadow-sm transition-all duration-200 ${isNavigating
                    ? 'opacity-70 cursor-wait'
                    : 'cursor-pointer hover:bg-blue-100'
                  }`}
                onClick={!isNavigating ? navigateToToday : undefined}
                title={isNavigating ? "Navigating..." : "Click to go to today"}
              >
                <CalendarDays className={`h-4 w-4 text-blue-600 transition-transform duration-200 ${isNavigating ? 'animate-spin' : ''
                  }`} />
                <span className="text-sm font-medium text-blue-800">
                  {intl.formatMessage({ id: "WorkingDate" }, { defaultMessage: "Working Date" })}
                </span>
                <span className="text-sm font-semibold text-blue-900">
                  {format(new Date(workingDate.replace(/ /g, "T")), "MMM dd, yyyy")}
                </span>
                {isNavigating && (
                  <span className="text-xs text-blue-600 animate-pulse">
                    Loading...
                  </span>
                )}
              </div>
            )}

            {/* Refresh Button - Only visible on handsontable pages */}
            {isHandsontablePage && (
              <div className="flex gap-2 items-center">
                <Button
                  onClick={handleRefresh}
                  disabled={isCalendarLoading}
                  variant="ghost"
                  size="sm"
                  className="relative h-8 xl:h-9 w-full px-3 border border-[#804FE6] bg-input hover:bg-[#804FE6] transition-all duration-200 transform hover:scale-105"
                >
                  <Image
                    src="/images/logo_sm.png"
                    alt="Refresh"
                    width={20}
                    height={20}
                    className="w-5 h-3"
                  />
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex ml-2">
                    <span className="text-xs">{getModifierKey()}</span><span className="text-sm">R</span>
                  </kbd>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCalendarModalOpen(true)}
                  className="flex items-center h-8 xl:h-9 w-full px-2 border border-gray-300 bg-input hover:bg-muted/80 transition-colors"
                >
                  <FilterList className="h-4 w-4" />
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">Alt</span><span className="text-sm">B</span>
                  </kbd>
                </Button>

                {/* Grid View Toggle */}
                {/* <div className="flex items-center gap-2 px-2 py-1 border border-gray-300 bg-input rounded-md">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <Switch
                    id="grid-view-toggle"
                    checked={isGridView}
                    onCheckedChange={setIsGridView}
                    className="data-[state=checked]:bg-[#804FE6]"
                  />
                  <Grid3X3 className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="grid-view-toggle" className="text-xs text-gray-600 cursor-pointer">
                    Grid
                  </Label>
                </div> */}
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
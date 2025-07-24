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
import { useAppState } from "lib/context/app"

export default function DashboardLayout({ children }: any) {
  const { data, error } = GetPrivilegesSWR()
  const [sideBarData, setSideBarData] = useState<any[] | undefined>(undefined)
  const [lastValidSideBarData, setLastValidSideBarData] = useState<any[] | undefined>(undefined)
  const [state, dispatch]: any = useAppState()

  function filterMenu(menu: any, uniqueMenuLinks: any) {
    return menu.reduce((filteredMenu: any, item: any) => {
      if (item.path && uniqueMenuLinks.includes(item.path)) {
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
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    PMS
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { GetPrivilegesSWR } from "lib/api/user";
import sidebarConfig from "components/layouts/dashboard/sidebar-config";

import DashboardNavbar from "./dashboard-navbar";
import DashboardSidebar from "./dashboard-sidebar";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
    display: "flex",
    minHeight: "100%",
    overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up("lg")]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

export default function DashboardLayout({ children }: any) {
    const [open, setOpen] = useState(false);
    const { data, error } = GetPrivilegesSWR();
    const [sideBarData, setSideBarData] = useState(null);

    function filterMenu(menu: any, uniqueMenuLinks: any) {
        return menu.reduce((filteredMenu: any, item: any) => {
            // Check if the 'path' property exists and if it's included in the uniqueMenuLinks array
            if (item.oldPath && uniqueMenuLinks.includes(item.oldPath)) {
                // If the item passes the filter, add it to the filteredMenu
                filteredMenu.push(item);
            }

            // If the item has children, filter the children recursively
            if (item.children) {
                const filteredChildren = filterMenu(
                    item.children,
                    uniqueMenuLinks
                );
                // If there are filtered children, add them to the item
                if (filteredChildren.length > 0) {
                    filteredMenu.push({
                        ...item,
                        children: filteredChildren,
                    });
                }
            }

            return filteredMenu;
        }, []);
    }
    useEffect(() => {
        if (data) {
            // Extracting MenuLink values
            let menuLinks = data
                .map((action: any) => action.MenuLink)
                .filter((link: any) => link); // Filter out null or undefined values

            // Removing duplicates
            //@ts-ignore
            let uniqueMenuLinks = [...new Set(menuLinks)];
            console.log("uniqueMenuLinks", uniqueMenuLinks);
            const filteredMenu = filterMenu(sidebarConfig, uniqueMenuLinks);
            setSideBarData(filteredMenu);

            console.log("filteredMenu", filteredMenu);
        }
    }, [data]);

    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar
                isOpenSidebar={open}
                onCloseSidebar={() => setOpen(false)}
                sideBarData={sideBarData}
            />
            <MainStyle>{children}</MainStyle>
        </RootStyle>
    );
}

import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { GetPrivilegesSWR } from "lib/api/user";
import sidebarConfig from "components/layouts/dashboard/sidebar-config";

import DashboardNavbar from "./dashboard-navbar";
import DashboardSidebar from "./dashboard-sidebar";
import { useAppState } from "lib/context/app";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;
const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_MINIMIZED = 80;

const RootStyle = styled("div")({ 
    display: "flex", 
    minHeight: "100%", 
    overflow: "hidden", 
    width: "100%", 
    position: "relative",
});

const MainStyle = styled("div", {
    shouldForwardProp: (prop) => prop !== "isMinimized",
})<{ isMinimized?: boolean }>((props) => {
    const { theme, isMinimized } = props;
    return {
        flexGrow: 1,
        overflow: "auto",
        minHeight: "100%",
        paddingTop: APP_BAR_MOBILE + 24,
        paddingBottom: theme.spacing(10),
        transition: theme.transitions.create(["margin", "padding"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.up("lg")]: {
            paddingTop: isMinimized ? theme.spacing(2) : APP_BAR_DESKTOP + 24,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            marginLeft: isMinimized ? DRAWER_WIDTH_MINIMIZED : DRAWER_WIDTH,
        },
    };
});

export default function DashboardLayout({ children }: any) {
    const [open, setOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { data, error } = GetPrivilegesSWR();
    const [sideBarData, setSideBarData] = useState(null);
    const [lastValidSideBarData, setLastValidSideBarData] = useState(null);
    const [state, dispatch]: any = useAppState();
    
    const handleSidebarMinimize = (minimized: boolean) => {
        setIsMinimized(minimized);
    };

    function filterMenu(menu: any, uniqueMenuLinks: any) {
        return menu.reduce((filteredMenu: any, item: any) => {
            if (item.path && uniqueMenuLinks.includes(item.path)) {
                filteredMenu.push(item);
            }
            if (item.children) {
                const filteredChildren = filterMenu(
                    item.children,
                    uniqueMenuLinks
                );
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
        if (data && data.length > 0) {
            dispatch({
                type: "userRole",
                userRole: data,
            });
            let menuLinks = data
                .map((action: any) =>
                    action.Status == true ? action.MenuLink2 : null
                )
                .filter((link: any) => link); // Filter out null or undefined values

            // Removing duplicates
            //@ts-ignore
            let uniqueMenuLinks = [...new Set(menuLinks)];

            const filteredMenu = filterMenu(sidebarConfig, uniqueMenuLinks);
            if (filteredMenu && filteredMenu.length > 0) {
                setSideBarData(filteredMenu);
                setLastValidSideBarData(filteredMenu); // Store as backup
            }
        } else if (!data && lastValidSideBarData) {
            setSideBarData(lastValidSideBarData);
        }
    }, [data]);

    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} isMinimized={isMinimized} />
            <DashboardSidebar
                isOpenSidebar={open}
                onCloseSidebar={() => setOpen(false)}
                sideBarData={sideBarData}
                onToggleMinimize={handleSidebarMinimize}
            />
            <MainStyle isMinimized={isMinimized}>
                <div className="root" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>{children}</div>
            </MainStyle>
        </RootStyle>
    );
}

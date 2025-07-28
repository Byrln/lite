import { Icon } from "@iconify/react";
import menu2Fill from "@iconify/icons-eva/menu-2-fill";
import { alpha, styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import AccountPopover from "./account-popover";
import LanguagePopover from "./language-popover";

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isMinimized",
})<{ isMinimized?: boolean }>((props) => {
  const { theme, isMinimized } = props as { theme: any; isMinimized?: boolean };
  return {
    boxShadow: "none",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    width: "100%",
    [theme.breakpoints.up("lg")]: {
      display: "none",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
    },
  };
});

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
  },
  padding: theme.spacing(0, 5),
}));

export default function DashboardNavbar({ onOpenSidebar, isMinimized }: any) {
  return (
    <RootStyle isMinimized={isMinimized}>
      <ToolbarStyle sx={{ borderBottom: "1px solid #E6E8EE" }}>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: "text.primary", fontSize: "18px" }}
        >
          <Icon icon={menu2Fill} width={28} height={28} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <LanguagePopover />
          {/* <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

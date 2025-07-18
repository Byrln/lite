import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import {
  Box,
  Link as MaterialLink,
  Drawer,
  IconButton,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Logo from "components/logo";
import Scrollbar from "components/scrollbar";
import NavSection from "components/nav-section";
import LanguagePopover from "./language-popover";
import AccountPopover from "./account-popover";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_MINIMIZED = 80;

const RootStyle = styled("div")(({ theme }) => ({
  // [theme.breakpoints.up("xl")]: {
  //     flexShrink: 0,
  //     width: DRAWER_WIDTH,
  // },
}));

const AccountStyle = styled("div")(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
  sideBarData,
  onToggleMinimize,
}: any) {
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const handleToggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    if (onToggleMinimize) {
      onToggleMinimize(newMinimizedState);
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
        backgroundColor: "#1a1f38",
      }}
    >
      <DrawerHeader>
        {!isMinimized ? (
          <div className="flex sticky top-0">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link href="/" passHref>
                <a>
                  <Box sx={{ display: "flex" }}>
                    <Logo />
                  </Box>
                </a>
              </Link>
            </Box>
            <Tooltip title="Хаах" placement="right">
              <IconButton onClick={handleToggleMinimize} sx={{ color: '#ffffff' }}>
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className="flex sticky top-0">
            <Box sx={{ display: "none", alignItems: "center" }}>
              <Link href="/" passHref>
                <a>
                  <Box sx={{ display: "flex" }}>
                    <Logo size="sm" />
                  </Box>
                </a>
              </Link>
            </Box>
            <Tooltip title="Нээх" placement="right">
              <IconButton onClick={handleToggleMinimize} sx={{ color: '#ffffff' }}>
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </DrawerHeader>

      {/* <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link href="#" passHref>
                    <MaterialLink underline="none">
                        <AccountStyle>
                            <Avatar src={account.photoURL} alt="photoURL" />
                            <Box sx={{ ml: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: "text.primary" }}
                                >
                                    {account.displayName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {account.email}
                                </Typography>
                            </Box>
                        </AccountStyle>
                    </MaterialLink>
                </Link>
            </Box> */}

      {sideBarData ? <NavSection navConfig={sideBarData} isMinimized={isMinimized} /> : <></>}
      {/* <NavSection navConfig={sidebarConfig} /> */}

      <Box sx={{ flexGrow: 1 }} />

      {/* Language and Account options at bottom of sidebar */}
      <Box sx={{
        p: 2,
        display: 'flex',
        flexDirection: isMinimized ? 'column' : 'row',
        justifyContent: isMinimized ? 'center' : 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#ffffff'
      }}>
        <LanguagePopover />
        {isMinimized && <Box sx={{ height: 16 }} />}
        {!isMinimized && <Box sx={{ width: 16 }} />}
        <AccountPopover />
      </Box>

      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
                <Stack
                    alignItems="center"
                    spacing={3}
                    sx={{
                        p: 2.5,
                        pt: 5,
                        borderRadius: 2,
                        position: "relative",
                        bgcolor: "grey.200",
                    }}
                >
                    <Box
                        component="img"
                        src="/static/illustrations/illustration_avatar.png"
                        sx={{ width: 100, position: "absolute", top: -50 }}
                    />

                    <Box sx={{ textAlign: "center" }}>
                        <Typography gutterBottom variant="h6">
                            Get more?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                        >
                            From only $69
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        href="https://pms.horecasoft.mn/"
                        target="_blank"
                        variant="contained"
                    >
                        Upgrade to Pro
                    </Button>
                </Stack>
            </Box> */}
    </Scrollbar>
  );

  return (
    <RootStyle>
      {/* Mobile drawer - shown when sidebar is toggled on mobile */}
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: {
            width: isMinimized ? DRAWER_WIDTH_MINIMIZED : DRAWER_WIDTH,
            boxSizing: 'border-box',
            transition: theme => theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        {renderContent}
      </Drawer>

      {/* Desktop drawer - always visible on desktop */}
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            width: isMinimized ? DRAWER_WIDTH_MINIMIZED : DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            transition: theme => theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            bgcolor: "#1a1f38",
            position: 'fixed',
            height: '100%',
            zIndex: 1200,
          },
        }}
        sx={{ display: { xs: 'none', lg: 'block' } }}
      >
        {renderContent}
      </Drawer>
    </RootStyle>
  );
}

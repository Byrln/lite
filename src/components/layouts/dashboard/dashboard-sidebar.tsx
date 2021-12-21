import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import {
    Box,
    Link as MaterialLink,
    Button,
    Drawer,
    Typography,
    Avatar,
    Stack,
} from "@mui/material";

import Logo from "components/logo";
import Scrollbar from "components/scrollbar";
import NavSection from "components/nav-section";
import { MHidden } from "components/@material-extend";
import sidebarConfig from "./sidebar-config";
import account from "components/_mocks_/account";

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("lg")]: {
        flexShrink: 0,
        width: DRAWER_WIDTH,
    },
}));

const AccountStyle = styled("div")(({ theme }: any) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: theme.palette.grey[200],
}));

export default function DashboardSidebar({
    isOpenSidebar,
    onCloseSidebar,
}: any) {
    const router = useRouter();

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: "100%",
                "& .simplebar-content": {
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Box sx={{ px: 2.5, py: 3 }}>
                <Link href="/" passHref>
                    <a>
                        <Box sx={{ display: "inline-flex" }}>
                            <Logo />
                        </Box>
                    </a>
                </Link>
            </Box>

            <Box sx={{ mb: 5, mx: 2.5 }}>
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
            </Box>

            <NavSection navConfig={sidebarConfig} />

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
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
            </Box>
        </Scrollbar>
    );

    return (
        <RootStyle>
            <MHidden width="lgUp">
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{
                        sx: { width: DRAWER_WIDTH },
                    }}
                >
                    {renderContent}
                </Drawer>
            </MHidden>

            <MHidden width="lgDown">
                <Drawer
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: DRAWER_WIDTH,
                            bgcolor: "background.default",
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            </MHidden>
        </RootStyle>
    );
}

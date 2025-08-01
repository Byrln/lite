import { Icon } from "@iconify/react";
import { useRef, useState, useContext } from "react";
import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";
import Link from "next/link";
import { alpha } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import {
    Button,
    Box,
    Divider,
    MenuItem,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import { useIntl } from "react-intl";

import MenuPopover from "components/menu-popover";
import account from "components/_mocks_/account";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import NewEdit from "components/common/change-password";
// const MENU_OPTIONS = [
//     // {
//     //     label: "Home",
//     //     icon: homeFill,
//     //     linkTo: "/",
//     // },
//     // {
//     //     label: "Profile",
//     //     icon: personFill,
//     //     linkTo: "#",
//     // },
//     // {
//     //     label: "Settings",
//     //     icon: settings2Fill,
//     //     linkTo: "#",
//     // },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const { handleModal }: any = useContext(ModalContext);
    const [state, dispatch]: any = useAppState();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const intl = useIntl();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    color: '#ffffff',
                    ...(open && {
                        "&:before": {
                            zIndex: 1,
                            content: "''",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            position: "absolute",
                            bgcolor: (theme) =>
                                alpha(theme.palette.grey[900], 0.72),
                        },
                    }),
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL" />
            </IconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{ width: 220 }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle1" noWrap>
                        {localStorage.getItem("username")}
                    </Typography>
                    {/* <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                    >
                        {account.email}
                    </Typography> */}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* {MENU_OPTIONS.map((option) => (
                    <Link key={option.label} href={option.linkTo} passHref>
                        <MenuItem
                            onClick={handleClose}
                            sx={{ typography: "body2", py: 1, px: 2.5 }}
                        >
                            <Box
                                component={Icon}
                                icon={option.icon}
                                sx={{
                                    mr: 2,
                                    width: 24,
                                    height: 24,
                                }}
                            />

                            {option.label}
                        </MenuItem>
                    </Link>
                ))} */}

                <Box sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        onClick={() => {
                            handleModal(
                                true,
                                intl.formatMessage({
                                    id: "MenuChangePassword",
                                }),
                                <NewEdit handleModal={handleModal} />,
                                null,
                                "small"
                            );
                            dispatch({
                                type: "isShow",
                                isShow: null,
                            });
                            dispatch({
                                type: "editId",
                                editId: null,
                            });
                        }}
                        className="mb-3"
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.23)', color: '#ffffff' }}
                    >
                        {intl.formatMessage({
                            id: "MenuChangePassword",
                        })}
                    </Button>

                    <Button
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        onClick={() =>
                            signOut({
                                callbackUrl: "http://pms2.horecasoft.mn",
                            })
                        }
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.23)', color: '#ffffff' }}
                    >
                        {intl.formatMessage({
                            id: "MenuLogOut",
                        })}
                    </Button>
                </Box>
            </MenuPopover>
        </>
    );
}

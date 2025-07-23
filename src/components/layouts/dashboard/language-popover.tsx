/* eslint-disable @next/next/no-img-element */
import { useRef, useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";

import { alpha } from "@mui/material/styles";
import {
    Box,
    MenuItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";

import MenuPopover from "components/menu-popover";

const LANGS = [
    {
        value: "en",
        label: "English",
        icon: "/static/icons/ic_flag_en.svg",
    },
    {
        value: "mon",
        label: "Монгол",
        icon: "/static/icons/ic_flag_mgl.svg",
    },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
    const { locale, asPath }: any = useRouter();

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

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
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.focusOpacity
                            ),
                    }),
                }}
            >
                <img
                    src={
                        LANGS.filter((item: any) => item.value == locale)[0]
                            ? LANGS.filter(
                                  (item: any) => item.value == locale
                              )[0].icon
                            : LANGS[0].icon
                    }
                    alt={
                        LANGS.filter((item: any) => item.value == locale)[0]
                            ? LANGS.filter(
                                  (item: any) => item.value == locale
                              )[0].label
                            : LANGS[0].label
                    }
                />
            </IconButton>
            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
            >
                <Box sx={{ py: 1 }}>
                    {LANGS.map((option) => (
                        <Link key={option.value} href={asPath} locale={option.value} legacyBehavior>
                            <MenuItem
                                key={option.value}
                                selected={option.value === locale}
                                onClick={() => handleClose()}
                                sx={{ py: 1, px: 2.5 }}
                            >
                                <ListItemIcon>
                                    <Box
                                        component="img"
                                        alt={option.label}
                                        src={option.icon}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{
                                        variant: "body2",
                                    }}
                                >
                                    {option.label}
                                </ListItemText>
                            </MenuItem>
                        </Link>
                    ))}
                </Box>
            </MenuPopover>
        </>
    );
}

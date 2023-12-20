import { Icon } from "@iconify/react";
import { useState } from "react";
import searchFill from "@iconify/icons-eva/search-fill";
import { styled, alpha } from "@mui/material/styles";
import {
    Box,
    Input,
    Slide,
    Button,
    InputAdornment,
    ClickAwayListener,
    IconButton,
} from "@mui/material";

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled("div")(({ theme }: any) => ({
    padding: "20px !important",
    top: 0,
    left: 0,
    zIndex: 1200,
    width: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    height: "auto !important",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    // padding: theme.spacing(0, 3),
    boxShadow: theme.customShadows.z8,
    backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
    [theme.breakpoints.up("md")]: {
        height: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5),
    },
}));

export default function Searchbar({ children }: any) {
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={handleClose}
        >
            <div>
                {!isOpen && (
                    <IconButton onClick={handleOpen}>
                        <Icon icon={searchFill} width={20} height={20} />
                    </IconButton>
                )}

                <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
                    <SearchbarStyle>{children}</SearchbarStyle>
                </Slide>
            </div>
        </ClickAwayListener>
    );
}

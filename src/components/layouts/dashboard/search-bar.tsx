import { Icon } from "@iconify/react";
import { useState } from "react";
import searchFill from "@iconify/icons-eva/search-fill";
import { styled, alpha } from "@mui/material/styles";
import {
    Modal,
    IconButton,
    Paper,
} from "@mui/material";

const SearchModalStyle = styled(Paper)(({ theme }: any) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600,
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[24],
    outline: "none",
    [theme.breakpoints.up("md")]: {
        width: "70%",
        padding: theme.spacing(4),
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
        <>
            <IconButton onClick={handleOpen}>
                <Icon icon={searchFill} width={20} height={20} />
            </IconButton>

            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="search-modal"
                aria-describedby="search-modal-description"
            >
                <SearchModalStyle>
                    {children}
                </SearchModalStyle>
            </Modal>
        </>
    );
}

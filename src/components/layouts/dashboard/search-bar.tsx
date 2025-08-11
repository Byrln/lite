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
  width: "95%",
  maxWidth: 900,
  maxHeight: "90vh",
  overflow: "auto",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[24],
  outline: "none",
  [theme.breakpoints.up("md")]: {
    width: "85%",
    padding: theme.spacing(5),
  },
  [theme.breakpoints.up("lg")]: {
    width: "80%",
    maxWidth: 1200,
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

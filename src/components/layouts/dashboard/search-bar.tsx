import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import filterFill from "@iconify/icons-eva/funnel-fill";
import { styled, alpha } from "@mui/material/styles";
import {
  Modal,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { useIntl } from "react-intl";

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
  const intl = useIntl();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Add keyboard shortcut for Alt+B
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Tooltip title={intl.formatMessage({ id: "TooltipFilter" })} arrow>
        <IconButton onClick={handleOpen} className="rounded-full bg-primary-main hover:bg-primary-dark">

          <Icon icon={filterFill} className="text-white" width={20} height={20} />
        </IconButton>
      </Tooltip>

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

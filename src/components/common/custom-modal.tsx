import { useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { useAppState } from "lib/context/app";
import { useIntl } from "react-intl";
import { useEffect } from "react";

import { ModalContext } from "lib/context/modal";

const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
    maxHeight: '90vh',
    outline: 'none',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  modalHeader: {
    flexShrink: 0,
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  modalBody: {
    flex: 1,
    overflow: 'auto',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  },
  small: {
    width: '90%',
    maxWidth: '400px',
  },
  medium: {
    width: '90%',
    maxWidth: '800px',
  },
  large: {
    width: '90%',
    maxWidth: '1200px',
  },
};

const styles = {
  boxContainer: {
    px: 4,
    backgroundColor: "#804fe6e6",
    color: "white",
  },
  bodyContainer: {
    py: 1,
    px: 4,
    pb: 3,
  },
};

interface CustomModalProps {
  ArrivalDate?: string;
  DepartureDate?: string;
}

const CustomModal = ({ ArrivalDate, DepartureDate }: CustomModalProps = {}) => {
  const intl = useIntl();
  const [state, dispatch]: any = useAppState();

  const {
    visible,
    modalTitle,
    modalContent,
    emptyModal,
    handleModal,
    modalType,
    isWithSubmit,
  }: any = useContext(ModalContext);

  const getModalSize = () => {
    if (modalType === "large") {
      return modalStyles.large;
    } else if (modalType === "medium") {
      return modalStyles.medium;
    } else if (modalType === "small") {
      return modalStyles.small;
    }
    return modalStyles.medium;
  };

  const handleClose = () => {
    handleModal();
    dispatch({
      type: "isShow",
      isShow: null,
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        handleClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <Box sx={{ ...modalStyles.modal, ...getModalSize() }}>
        {!emptyModal && (
          <div style={modalStyles.modalHeader}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={styles.boxContainer}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  gutterBottom
                  className="mt-3 "
                >
                  {modalTitle}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  aria-label="save"
                  style={{ color: "white" }}
                  type="submit"
                  form="modal-form"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label="close"
                  style={{ color: "white" }}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
            <Divider />
          </div>
        )}

        <div style={modalStyles.modalBody}>
          <Typography
            id="modal-modal-description"
            sx={styles.bodyContainer}
          >
            {modalContent}

            {!emptyModal && (
              <>
                {isWithSubmit ? (
                  <Box
                    sx={{
                      mx: "auto",
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "row-reverse",
                      paddingRight: "110px",
                      marginTop: "-32px",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      key="back"
                      onClick={() => {
                        handleClose();
                        dispatch({
                          type: "editId",
                          editId: "",
                        });
                      }}
                    >
                      {intl.formatMessage({
                        id: "ButtonClose",
                      })}
                    </Button>
                  </Box>
                ) : (
                  <>
                    {/* <Divider className="mt-3 mb-3" /> */}
                    <Box
                      sx={{
                        mx: "auto",
                        textAlign: "right",
                      }}
                      className="mt-3"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        key="back"
                        onClick={() => {
                          handleClose();
                          dispatch({
                            type: "editId",
                            editId: "",
                          });
                        }}
                      >
                        {intl.formatMessage({
                          id: "ButtonClose",
                        })}
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default CustomModal;

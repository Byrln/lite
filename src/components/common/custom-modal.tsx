import { useContext } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { useAppState } from "lib/context/app";
import { useIntl } from "react-intl";

import { ModalContext } from "lib/context/modal";

const styles = {
    small: {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        py: 1,
        px: 4,
        pb: 3,
        maxHeight: "90%",
        width: "30%",
        overflow: "auto",
        borderRadius: "10px",
    },
    medium: {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        py: 1,
        px: 4,
        pb: 3,
        maxHeight: "90%",
        width: "60%",
        overflow: "auto",
        borderRadius: "10px",
    },
    large: {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        py: 1,
        px: 4,
        pb: 3,
        maxHeight: "90%",
        width: "90%",
        overflow: "auto",
        borderRadius: "10px",
    },
};

const CustomModal = () => {
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

    const getStyle = () => {
        let result: any = null;
        if (modalType === "large") {
            result = styles.large;
        } else if (modalType === "medium") {
            result = styles.medium;
        } else if (modalType === "small") {
            result = styles.small;
        }
        return result;
    };

    return (
        <Modal
            open={visible}
            onClose={() => handleModal()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={getStyle()}>
                {!emptyModal && (
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            gutterBottom
                            className="mt-3 "
                        >
                            {modalTitle}
                        </Typography>

                        <IconButton
                            aria-label="close"
                            onClick={() => handleModal()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                )}

                <Divider />

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
                                        onClick={() => (
                                            handleModal(),
                                            dispatch({
                                                type: "editId",
                                                editId: "",
                                            })
                                        )}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonClose",
                                        })}
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <Divider className="mt-3 mb-3" />
                                    <Box
                                        sx={{
                                            mx: "auto",
                                            textAlign: "right",
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            key="back"
                                            onClick={() => (
                                                handleModal(),
                                                dispatch({
                                                    type: "editId",
                                                    editId: "",
                                                })
                                            )}
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
            </Box>
        </Modal>
    );
};

export default CustomModal;

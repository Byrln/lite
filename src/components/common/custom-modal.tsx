import {useContext} from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import {ModalContext} from "lib/context/modal";

const style = {
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
    width: "80%",
    overflow: "auto",
};

const CustomModal = () => {
    const {visible, modalTitle, modalContent, emptyModal, handleModal}: any =
        useContext(ModalContext);

    return (
        <Modal
            open={visible}
            onClose={() => handleModal()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

                {
                    (!emptyModal && modalTitle.length > 0) && <Typography
                        id="modal-modal-title"
                        variant="h4"
                        gutterBottom
                        className="mb-3 mt-2"
                    >
                        {modalTitle}
                    </Typography>
                }


                <Typography id="modal-modal-description" sx={{mt: 2}}>

                    {modalContent}

                    {!emptyModal && <>
                        <Divider className="mt-3 mb-3"/>
                        <Box
                            sx={{
                                mx: "auto",
                                textAlign: "right",
                            }}
                        >
                            <Button
                                variant="outlined"
                                key="back"
                                onClick={() => handleModal()}
                            >
                                Хаах
                            </Button>
                        </Box>
                    </>}

                </Typography>
            </Box>
        </Modal>
    );
};

export default CustomModal;

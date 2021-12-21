import { useState } from "react";
import { mutate } from "swr";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";

const DeleteButton = ({ api, id, listUrl }: any) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            await api.delete(id);
            await mutate(listUrl);

            toast("Амжилттай устгагдлаа.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setLoading(false);
            handleClose();
        } catch {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <div>
            <LoadingButton
                loading={loading}
                variant="outlined"
                onClick={handleClickOpen}
                color="error"
                startIcon={<DeleteForeverIcon />}
            >
                Устгах
            </LoadingButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <HelpOutlineIcon />
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Та устгахдаа итгэлтэй байна уу?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Үгүй</Button>
                    <LoadingButton
                        loading={loading}
                        onClick={handleDelete}
                        autoFocus
                    >
                        Тийм
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteButton;

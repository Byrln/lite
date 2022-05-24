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
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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

            toast("Амжилттай устгагдлаа.");

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
                <DialogTitle id="alert-dialog-title" className=""></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <HelpOutlineIcon />
                            <Typography>
                                Та устгахдаа итгэлтэй байна уу?
                            </Typography>
                        </Stack>
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

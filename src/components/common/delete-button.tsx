import { useState } from "react";
import { mutate } from "swr";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

const DeleteButton = ({ api, id, listUrl, functionAfterSubmit }: any) => {
    const intl = useIntl();

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

            if (functionAfterSubmit) {
                functionAfterSubmit();
            }

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
                size="small"
                loading={loading}
                variant="outlined"
                onClick={handleClickOpen}
                color="error"
                startIcon={<DeleteForeverIcon />}
            >
                {intl.formatMessage({
                    id: "TextVoid",
                })}
            </LoadingButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/*<DialogTitle id="alert-dialog-title" className=""></DialogTitle>*/}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <HelpOutlineIcon />
                            <Typography>
                                {intl.formatMessage({
                                    id: "MsgConfirmation",
                                })}
                            </Typography>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {" "}
                        {intl.formatMessage({
                            id: "ButtonReturn",
                        })}
                    </Button>
                    <LoadingButton
                        loading={loading}
                        onClick={handleDelete}
                        autoFocus
                    >
                        {intl.formatMessage({
                            id: "ButtonOk",
                        })}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteButton;

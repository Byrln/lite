import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import { PosApiAPI } from "lib/api/pos-api";

const Send = ({ id, HotelCode, listUrl }: any) => {
    const intl = useIntl();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnClick = async () => {
        setLoading(true);
        try {
            const response = await PosApiAPI.send(HotelCode);
            console.log("response", response);
            await mutate(listUrl);
            setLoading(false);
            toast(response.Message ? response.Message : "Амжилттай.");
            handleClose();
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Button key={id} onClick={handleClickOpen}>
                {intl.formatMessage({
                    id: "ButtonSend",
                })}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {intl.formatMessage({
                        id: "ButtonSend",
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({
                            id: "MsgConfirmation",
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Үгүй</Button>
                    <Button onClick={handleOnClick} autoFocus>
                        {intl.formatMessage({
                            id: "ButtonOk",
                        })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Send;

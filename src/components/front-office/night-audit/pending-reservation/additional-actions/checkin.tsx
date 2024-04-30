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

import { ReservationAPI } from "lib/api/reservation";

const CheckIn = ({ id, TransactionID, listUrl }: any) => {
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
            await ReservationAPI.checkIn(TransactionID);
            await mutate(listUrl);
            setLoading(false);
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );
            handleClose();
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Button key={id} onClick={handleClickOpen}>
                {intl.formatMessage({
                    id: "ButtonCheckIn",
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
                        id: "ButtonCheckIn",
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "MsgConfirmation" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {intl.formatMessage({ id: "ButtonCancel" })}
                    </Button>
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

export default CheckIn;

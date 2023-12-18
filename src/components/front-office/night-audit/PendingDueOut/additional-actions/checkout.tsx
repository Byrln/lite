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

import { ReservationAPI } from "lib/api/reservation";

const CheckOut = ({ id, TransactionID, listUrl }: any) => {
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
            await ReservationAPI.checkOut(TransactionID);
            await mutate(listUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleClose();
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <Button key={id} onClick={handleClickOpen}>
                Зочин гаргах
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Зочин гаргах</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Та итгэлтэй байна уу
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Үгүй</Button>
                    <Button onClick={handleOnClick} autoFocus>
                        Тийм
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CheckOut;

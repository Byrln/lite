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

import { PosApiAPI } from "lib/api/pos-api";

const Void = ({ id, HotelCode, listUrl }: any) => {
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
                Илгээх
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Илгээх</DialogTitle>
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

export default Void;

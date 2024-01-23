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

import { HouseKeepingAPI } from "lib/api/house-keeping";

const StatusRemove = ({ RoomID, listUrl }: any) => {
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
            await HouseKeepingAPI.update({
                HouseKeepingStatusID: 0,
                RoomID: RoomID,
            });
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
            <Button key={RoomID} onClick={handleClickOpen}>
                Төлөв цэвэрлэх
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Төлөв цэвэрлэх
                </DialogTitle>
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

export default StatusRemove;

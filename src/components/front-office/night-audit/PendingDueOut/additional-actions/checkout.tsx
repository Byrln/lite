import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { useState, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import ReservationEdit from "components/front-office/reservation-list/edit";
import { ReservationAPI } from "lib/api/reservation";
import { ModalContext } from "lib/context/modal";
const buttonStyle = {
  color: "#804fe6",
  width: "100%",
  justifyContent: "flex-start",
};
const CheckOut = ({
  id,
  TransactionID,
  listUrl,
  buttonVariant,
  customRerender,
}: any) => {
  const intl = useIntl();
  const { handleModal }: any = useContext(ModalContext);
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
      if (customRerender) {
        customRerender();
      }
      setLoading(false);
      toast(
        intl.formatMessage({
          id: "TextSuccess",
        })
      );
      handleClose();
    } catch (error) {
      setLoading(false);
      handleClose();
      handleModal(
        true,
        intl.formatMessage({
          id: "ButtonReservation",
        }),
        <ReservationEdit
          transactionID={TransactionID}
          additionalMutateUrl={listUrl}
        />,
        null,
        "large"
      );
    }
  };

  return (
    <>
      <Button key={id} sx={buttonStyle} onClick={handleClickOpen} variant={buttonVariant} startIcon={<NoMeetingRoomIcon />}>
        {intl.formatMessage({
          id: "ButtonCheckOut",
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
            id: "ButtonCheckOut",
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
          <Button onClick={handleClose}>
            {intl.formatMessage({
              id: "ButtonCancel",
            })}
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

export default CheckOut;

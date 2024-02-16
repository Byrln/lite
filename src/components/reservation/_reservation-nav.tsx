import { ReservationAPI } from "lib/api/reservation";
import { useState, useEffect, useContext } from "react";
import {
    Grid,
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { fToCustom } from "lib/utils/format-time";
import { listUrl as calendarItemsURL } from "lib/api/front-office";

import { mutate } from "swr";
import { ModalContext } from "lib/context/modal";
import { toast } from "react-toastify";

import AmendStayForm from "components/reservation/amend-stay";
import VoidTransactionForm from "components/reservation/void-transaction";
import CancelReservationForm from "components/reservation/cancel-reservation";
import RoomMoveForm from "components/reservation/room-move";
import RoomAssign from "components/reservation/room-assign";
import AuditTrail from "components/reservation/audit-trail";
import ExtraCharge from "components/reservation/extra-charge";

import { listUrl } from "lib/api/front-office";

const buttonStyle = {
    borderBottom: "1px solid #efefef",
    width: "100%",
};

const ReservationNav = ({
    reservation,
    itemInfo,
    reloadDetailInfo,
    additionalMutateUrl,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [openNoShow, setOpenNoShow] = useState(false);
    const handleClickOpenNoShow = () => {
        setOpenNoShow(true);
    };
    const [loading, setLoading] = useState(false);

    const handleOnClickNoShow = async () => {
        setLoading(true);
        try {
            await ReservationAPI.noShow(reservation.TransactionID);
            await mutate(listUrl);
            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }
            setLoading(false);
            toast("Амжилттай.");
            handleCloseNoShow();
        } catch (error) {
            setLoading(false);
        }
    };

    const handleCloseNoShow = () => {
        setOpenNoShow(false);
    };

    const finishCall = async (msg: string) => {
        await mutate(calendarItemsURL);
        if (reloadDetailInfo) {
            reloadDetailInfo();
        }
        toast(msg);
    };

    const onCheckInClick = async (evt: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await ReservationAPI.checkIn(reservation.TransactionID);
        await mutate(calendarItemsURL);
        if (additionalMutateUrl) {
            await mutate(additionalMutateUrl);
        }
        finishCall("Амжилттай");
    };

    const unassignRoom = async (evt: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await ReservationAPI.roomUnassign(reservation.TransactionID);
        await mutate(calendarItemsURL);
        if (additionalMutateUrl) {
            await mutate(additionalMutateUrl);
        }
        finishCall("Амжилттай");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #efefef",
            }}
        >
            <Button variant={"text"} size="small" sx={buttonStyle}>
                Card
            </Button>
            {reservation.CheckIn && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={onCheckInClick}
                    sx={buttonStyle}
                >
                    Check In
                </Button>
            )}
            {reservation.NoShow && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    Mark No Show
                </Button>
            )}
            <Dialog
                open={openNoShow}
                onClose={handleCloseNoShow}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Ирээгүй</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Та итгэлтэй байна уу
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNoShow}>Үгүй</Button>
                    <Button onClick={handleOnClickNoShow} autoFocus>
                        Тийм
                    </Button>
                </DialogActions>
            </Dialog>
            {reservation.IsEdit && (
                <a href={`transaction/edit/${reservation.TransactionID}`}>
                    <Button variant={"text"} size="small" sx={buttonStyle}>
                        Edit Transaction
                    </Button>
                </a>
            )}
            {reservation.GroupOperation && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={() => {
                        handleModal(
                            true,
                            "Extra Charge",
                            <ExtraCharge
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    Extra Charge
                </Button>
            )}
            {reservation.GroupOperation && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    Edit Group
                </Button>
            )}
            {reservation.MoveRoom && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={() => {
                        handleModal(
                            true,
                            "Room Move",
                            <RoomMoveForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    Room Move
                </Button>
            )}
            {reservation.AmendStay && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={() => {
                        handleModal(
                            true,
                            "Amend Stay",
                            <AmendStayForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    Amend Stay
                </Button>
            )}
            {/*{reservation.SetMessage && (*/}
            {/*    <Button*/}
            {/*        variant={"text"}*/}
            {/*        size="small"*/}
            {/*        sx={buttonStyle}*/}
            {/*    >Set Message</Button>*/}
            {/*)}*/}
            {reservation.Void && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Void Transaction",
                            <VoidTransactionForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                customMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    Void Transaction
                </Button>
            )}
            {reservation.Cancel && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Cancel Reservation",
                            <CancelReservationForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                customMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    Cancel Reservation
                </Button>
            )}
            {reservation.Assign && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Assign Room",
                            <RoomAssign
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    Assign Room
                </Button>
            )}
            {reservation.Unassign && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={unassignRoom}
                >
                    Unassign Room
                </Button>
            )}
            {reservation.AuditTrail && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Хяналт",
                            <AuditTrail
                                TransactionID={reservation.TransactionID}
                            />,
                            null,
                            "large"
                        );
                    }}
                >
                    Хяналт
                </Button>
            )}
        </Box>
    );
};

export default ReservationNav;

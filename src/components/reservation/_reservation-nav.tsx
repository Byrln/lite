import { ReservationAPI } from "lib/api/reservation";
import { useState, useEffect, useContext } from "react";
import { Grid, Box, Paper, Typography, Button } from "@mui/material";
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

const buttonStyle = {
    borderBottom: "1px solid #efefef",
};

const ReservationNav = ({
    reservation,
    itemInfo,
    transactionInfo,
    reloadDetailInfo,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);

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
        // var res = await ReservationApi.checkIn(transactionInfo.TransactionID);
        await mutate(calendarItemsURL);
        finishCall("Амжилттай");
    };

    const unassignRoom = async (evt: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        // var res = await ReservationApi.roomUnassign(
        //     transactionInfo.TransactionID
        // );
        await mutate(calendarItemsURL);
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
            {transactionInfo.CheckIn && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={onCheckInClick}
                    sx={buttonStyle}
                >
                    Check In
                </Button>
            )}
            {transactionInfo.NoShow && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    Mark No Show
                </Button>
            )}
            {transactionInfo.IsEdit && (
                <a href={`transaction/edit/${reservation.TransactionID}`}>
                    <Button variant={"text"} size="small" sx={buttonStyle}>
                        Edit Transaction
                    </Button>
                </a>
            )}
            {transactionInfo.GroupOperation && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    Extra Charge
                </Button>
            )}
            {transactionInfo.GroupOperation && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    Edit Group
                </Button>
            )}
            {transactionInfo.MoveRoom && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={() => {
                        handleModal(
                            true,
                            "Room Move",
                            <RoomMoveForm
                                transactionInfo={transactionInfo}
                                reservation={reservation}
                            />
                        );
                    }}
                >
                    Room Move
                </Button>
            )}
            {transactionInfo.AmendStay && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={() => {
                        handleModal(
                            true,
                            "Amend Stay",
                            <AmendStayForm
                                transactionInfo={transactionInfo}
                                reservation={reservation}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    Amend Stay
                </Button>
            )}
            {/*{transactionInfo.SetMessage && (*/}
            {/*    <Button*/}
            {/*        variant={"text"}*/}
            {/*        size="small"*/}
            {/*        sx={buttonStyle}*/}
            {/*    >Set Message</Button>*/}
            {/*)}*/}
            {transactionInfo.Void && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Void Transaction",
                            <VoidTransactionForm
                                transactionInfo={transactionInfo}
                                reservation={reservation}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    Void Transaction
                </Button>
            )}
            {transactionInfo.Cancel && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Cancel Reservation",
                            <CancelReservationForm
                                transactionInfo={transactionInfo}
                                reservation={reservation}
                            />
                        );
                    }}
                >
                    Cancel Reservation
                </Button>
            )}
            {transactionInfo.Assign && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Assign Room",
                            <RoomAssign
                                transactionInfo={transactionInfo}
                                reservation={reservation}
                            />
                        );
                    }}
                >
                    Assign Room
                </Button>
            )}
            {transactionInfo.Unassign && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={unassignRoom}
                >
                    Unassign Room
                </Button>
            )}
            {transactionInfo.AuditTrail && (
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    AuditTrail
                </Button>
            )}
        </Box>
    );
};

export default ReservationNav;

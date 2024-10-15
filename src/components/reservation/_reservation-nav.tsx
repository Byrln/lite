import { ReservationAPI } from "lib/api/reservation";
import { useState, useContext } from "react";
import { Box, Button } from "@mui/material";
import { listUrl as calendarItemsURL } from "lib/api/front-office";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

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
import Checkout from "components/front-office/night-audit/PendingDueOut/additional-actions/checkout";

import { listUrl } from "lib/api/front-office";
import MarkNoShowForm from "./no-show";

const buttonStyle = {
    color: "#804fe6",
    width: "100%",
};

const ReservationNav = ({
    reservation,
    itemInfo,
    reloadDetailInfo,
    additionalMutateUrl,
}: any) => {
    const { locale }: any = useRouter();
    const intl = useIntl();
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
            toast(
                intl.formatMessage({
                    id: "TextSuccess",
                })
            );
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
        if (
            !confirm(
                intl.formatMessage({
                    id: "MsgConfirmation",
                })
            )
        ) {
            return;
        }
        var res = await ReservationAPI.checkIn(reservation.TransactionID);
        await mutate(calendarItemsURL);
        if (additionalMutateUrl) {
            await mutate(additionalMutateUrl);
        }
        finishCall(
            intl.formatMessage({
                id: "TextSuccess",
            })
        );
    };

    const unassignRoom = async (evt: any) => {
        if (
            !confirm(
                intl.formatMessage({
                    id: "MsgConfirmation",
                })
            )
        ) {
            return;
        }
        var res = await ReservationAPI.roomUnassign(reservation.TransactionID);
        await mutate(calendarItemsURL);
        if (additionalMutateUrl) {
            await mutate(additionalMutateUrl);
        }
        finishCall(
            intl.formatMessage({
                id: "TextSuccess",
            })
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #efefef",
            }}
        >
            {/* <Button variant={"text"} size="small" sx={buttonStyle}>
                {intl.formatMessage({
                    id: "ButtonCard",
                })}
            </Button> */}
            {reservation.CheckIn && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={onCheckInClick}
                    sx={buttonStyle}
                >
                    {intl.formatMessage({
                        id: "ButtonCheckIn",
                    })}
                </Button>
            )}
            {/* {reservation.NoShow && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={handleClickOpenNoShow}
                >
                    {intl.formatMessage({
                        id: "ButtonMarkNoShow",
                    })}
                </Button>
            )} */}
            {reservation.NoShow && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={() => {
                        handleModal(
                            true,
                            intl.formatMessage({
                                id: "ButtonMarkNoShow",
                            }),
                            <MarkNoShowForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />,
                            null,
                            "small"
                        );
                    }}
                >
                    {intl.formatMessage({
                        id: "ButtonMarkNoShow",
                    })}
                </Button>
            )}
            {/* <Dialog
                open={openNoShow}
                onClose={handleCloseNoShow}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {" "}
                    {intl.formatMessage({
                        id: "ButtonMarkNoShow",
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
                    <Button onClick={handleCloseNoShow}>
                        {intl.formatMessage({
                            id: "ButtonCancel",
                        })}
                    </Button>
                    <Button onClick={handleOnClickNoShow} autoFocus>
                        {intl.formatMessage({
                            id: "ButtonOk",
                        })}
                    </Button>
                </DialogActions>
            </Dialog> */}
            <a
                href={
                    locale == "mon"
                        ? `/mon/transaction/edit/${reservation.TransactionID}`
                        : `/transaction/edit/${reservation.TransactionID}`
                }
            >
                <Button variant={"text"} size="small" sx={buttonStyle}>
                    {intl.formatMessage({
                        id: "ButtonEditTransaction",
                    })}
                </Button>
            </a>
            <Button
                variant={"text"}
                size="small"
                sx={buttonStyle}
                onClick={() => {
                    handleModal(
                        true,
                        intl.formatMessage({
                            id: "ButtonExtraCharge",
                        }),
                        <ExtraCharge
                            transactionInfo={reservation}
                            reservation={reservation}
                            additionalMutateUrl={additionalMutateUrl}
                        />,
                        null,
                        "medium"
                    );
                }}
            >
                {intl.formatMessage({
                    id: "ButtonExtraCharge",
                })}
            </Button>
            {/* {reservation.GroupOperation && (
                <a href={`transaction/group-edit/${reservation.GroupID}`}>
                    <Button variant={"text"} size="small" sx={buttonStyle}>
                        {intl.formatMessage({
                            id: "ButtonEditGroup",
                        })}
                    </Button>
                </a>
            )} */}
            {reservation.MoveRoom && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={() => {
                        handleModal(
                            true,
                            intl.formatMessage({
                                id: "ButtonRoomMove",
                            }),
                            <RoomMoveForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    {intl.formatMessage({
                        id: "ButtonRoomMove",
                    })}
                </Button>
            )}
            {reservation.AmendStay && (
                <Button
                    variant={"text"}
                    size="small"
                    onClick={() => {
                        handleModal(
                            true,
                            intl.formatMessage({
                                id: "ButtonAmendStay",
                            }),
                            <AmendStayForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    {intl.formatMessage({
                        id: "ButtonAmendStay",
                    })}
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
                            intl.formatMessage({
                                id: "ButtonVoidTransaction",
                            }),
                            <VoidTransactionForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                customMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                    sx={buttonStyle}
                >
                    {intl.formatMessage({
                        id: "ButtonVoidTransaction",
                    })}
                </Button>
            )}

            {reservation.CheckOut && (
                <Checkout
                    key={`checkout-${reservation.TransactionID}`}
                    TransactionID={reservation.TransactionID}
                    listUrl={additionalMutateUrl}
                    buttonVariant="text"
                />
            )}
            {reservation.Cancel && (
                <Button
                    variant={"text"}
                    size="small"
                    sx={buttonStyle}
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            intl.formatMessage({
                                id: "ButtonCancelReservation",
                            }),
                            <CancelReservationForm
                                transactionInfo={reservation}
                                reservation={reservation}
                                customMutateUrl={additionalMutateUrl}
                            />
                        );
                    }}
                >
                    {intl.formatMessage({
                        id: "ButtonCancelReservation",
                    })}
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
                    {intl.formatMessage({
                        id: "ButtonAssignRoom",
                    })}
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

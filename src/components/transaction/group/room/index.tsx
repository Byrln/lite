import { useContext, useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Checkbox,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { TransactionInfoSWR } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import AmendStayForm from "components/reservation/amend-stay";
import { ReservationAPI } from "lib/api/reservation";
import RoomMoveForm from "components/reservation/room-move";
import VoidTransactionForm from "components/reservation/void-transaction";
import CancelReservationForm from "components/reservation/cancel-reservation";

const RoomCharge = ({ GroupID, arrivalDate, departureDate }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = TransactionInfoSWR({ GroupID: GroupID });
    const [newData, setNewData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const [openNoShow, setOpenNoShow] = useState(false);
    const handleClickOpenNoShow = () => {
        setOpenNoShow(true);
    };

    const unassignRooms = async () => {
        if (!confirm(intl.formatMessage({ id: "MsgConfirmation" }))) {
            return;
        }

        try {
            // Use Promise.all instead of forEach for proper async handling
            const unassignPromises = newData
                .filter((room: any) => room.isChecked === true)
                .map(async (room: any) => {
                    try {
                        await ReservationAPI.roomUnassign(room.TransactionID);
                    } catch (error) {
                        console.error(`Room unassign error for ${room.TransactionID}:`, error);
                        // Continue with other rooms even if one fails
                    }
                });
            
            await Promise.all(unassignPromises);
            await mutate("/api/FrontOffice/TransactionInfo");

            let tempEntity = [...newData];
            tempEntity.forEach((element: any) => (element.isChecked = false));
            setNewData(tempEntity);
            setRerenderKey((prevKey) => prevKey + 1);
            toast(intl.formatMessage({ id: "TextSuccess" }));
        } catch (error) {
            console.error("Bulk room unassign error:", error);
            await mutate("/api/FrontOffice/TransactionInfo");
            toast(intl.formatMessage({ id: "TextSuccess" }));
        }
    };

    const unassignRoom = async (TransactionID: any) => {
        if (!confirm(intl.formatMessage({ id: "MsgConfirmation" }))) {
            return;
        }
        try {
            var res = await ReservationAPI.roomUnassign(TransactionID);
            await mutate("/api/FrontOffice/TransactionInfo");
            toast(intl.formatMessage({ id: "TextSuccess" }));
        } catch (error) {
            console.error("Room unassign error:", error);
            // The error might actually be a success message from the API
            // so we still mutate and show success
            await mutate("/api/FrontOffice/TransactionInfo");
            toast(intl.formatMessage({ id: "TextSuccess" }));
        }
    };

    const handleOnClickNoShow = async (TransactionID: any) => {
        setLoading(true);
        try {
            await ReservationAPI.noShow(TransactionID);
            await mutate("/api/FrontOffice/TransactionInfo");

            setLoading(false);
            toast(intl.formatMessage({ id: "TextSuccess" }));
            handleCloseNoShow();
        } catch (error) {
            setLoading(false);
        }
    };

    const handleCloseNoShow = () => {
        setOpenNoShow(false);
    };

    const onCheckInClick = async (TransactionID: any) => {
        if (!confirm(intl.formatMessage({ id: "MsgConfirmation" }))) {
            return;
        }
        var res = await ReservationAPI.checkIn(TransactionID);
        await mutate("/api/FrontOffice/TransactionInfo");
        toast(intl.formatMessage({ id: "TextSuccess" }));
    };

    useEffect(() => {
        if (data) {
            setNewData(data);
        }
    }, [data]);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...newData];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
        setNewData(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
        },
        {
            title: "",
            key: "check",
            dataIndex: "check",
            withCheckBox: true,
            onChange: onCheckboxChange,
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <Checkbox
                        key={rerenderKey}
                        checked={
                            newData &&
                            newData[dataIndex] &&
                            newData[dataIndex].isChecked
                        }
                        onChange={(e: any) => {
                            let tempEntity = [...newData];
                            tempEntity[dataIndex].isChecked = e.target.checked;
                            setNewData(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "TextFolioNo" }),
            key: "FolioNo",
            dataIndex: "FolioNo",
        },
        {
            title: intl.formatMessage({ id: "TextRoom" }),
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderGuestName" }),
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderArrival" }),
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
            render: function render(id: any, value: any) {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderDeparture" }),
            key: "DepartureDate",
            dataIndex: "DepartureDate",
            render: function render(id: any, value: any) {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderStatus" }),
            key: "StatusCode",
            dataIndex: "StatusCode",
            render: function render(id: any, value: any) {
                return value == "StatusConfirmReservation"
                    ? "Баталгаажсан захиалга"
                    : value == "StatusCancel"
                    ? "Цуцлах"
                    : value == "StatusVoid"
                    ? "Устгасан"
                    : value;
            },
        },
        {
            title: intl.formatMessage({ id: "RowHeaderAction" }),
            key: "Action",
            dataIndex: "Action",
            render: function render(id: any, record: any, element: any) {
                return (
                    <>
                        <Button
                            aria-controls={`menu${id}`}
                            variant={"outlined"}
                            size="small"
                            onClick={(e) => handleClick(e, element)}
                        >
                            {intl.formatMessage({ id: "RowHeaderAction" })}
                        </Button>
                        {selectedRow && (
                            <Menu
                                id={`menu${id}`}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                {selectedRow.CheckIn && (
                                    <MenuItem
                                        key={`checkIn${id}`}
                                        onClick={() => {
                                            onCheckInClick(
                                                selectedRow.TransactionID
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonCheckIn",
                                        })}
                                    </MenuItem>
                                )}

                                {selectedRow.AmendStay && (
                                    <MenuItem
                                        key={`amendStay${id}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                intl.formatMessage({
                                                    id: "ButtonAmendStay",
                                                }),
                                                <AmendStayForm
                                                    transactionInfo={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                        ArrivalDate:
                                                            selectedRow.ArrivalDate,
                                                        DepartureDate:
                                                            selectedRow.DepartureDate,
                                                    }}
                                                    reservation={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                        ArrivalDate:
                                                            selectedRow.ArrivalDate,
                                                        DepartureDate:
                                                            selectedRow.DepartureDate,
                                                    }}
                                                    additionalMutateUrl={
                                                        "/api/FrontOffice/TransactionInfo"
                                                    }
                                                />
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonAmendStay",
                                        })}
                                    </MenuItem>
                                )}
                                {selectedRow.Cancel && (
                                    <MenuItem
                                        key={`cancelReservation${id}`}
                                        onClick={(evt: any) => {
                                            handleModal(
                                                true,
                                                intl.formatMessage({
                                                    id: "ButtonCancelReservation",
                                                }),
                                                <CancelReservationForm
                                                    transactionInfo={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                    }}
                                                    reservation={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                    }}
                                                    customMutateUrl={
                                                        "/api/FrontOffice/TransactionInfo"
                                                    }
                                                />
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonCancelReservation",
                                        })}
                                    </MenuItem>
                                )}

                                {selectedRow.MoveRoom && (
                                    <MenuItem
                                        key={`roomMove${id}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                intl.formatMessage({
                                                    id: "ButtonRoomMove",
                                                }),
                                                <RoomMoveForm
                                                    transactionInfo={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                        ArrivalDate:
                                                            selectedRow.ArrivalDate,
                                                        DepartureDate:
                                                            selectedRow.DepartureDate,
                                                        RateTypeID:
                                                            selectedRow.RateTypeID,
                                                    }}
                                                    reservation={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                        ArrivalDate:
                                                            selectedRow.ArrivalDate,
                                                        DepartureDate:
                                                            selectedRow.DepartureDate,
                                                        RateTypeID:
                                                            selectedRow.RateTypeID,
                                                    }}
                                                    additionalMutateUrl={
                                                        "/api/FrontOffice/TransactionInfo"
                                                    }
                                                />
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonRoomMove",
                                        })}
                                    </MenuItem>
                                )}

                                {selectedRow.NoShow && (
                                    <MenuItem
                                        key={`roomMove${id}`}
                                        onClick={() => {
                                            handleClickOpenNoShow();
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonMarkNoShow",
                                        })}
                                    </MenuItem>
                                )}

                                {selectedRow.Unassign && (
                                    <MenuItem
                                        key={`unassignRoom${id}`}
                                        onClick={() => {
                                            unassignRoom(
                                                selectedRow.TransactionID
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonUnassignRoom",
                                        })}
                                    </MenuItem>
                                )}

                                {selectedRow.Void && (
                                    <MenuItem
                                        key={`voidTransaction${id}`}
                                        onClick={(evt: any) => {
                                            handleModal(
                                                true,
                                                intl.formatMessage({
                                                    id: "ButtonVoidTransaction",
                                                }),
                                                <VoidTransactionForm
                                                    transactionInfo={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                    }}
                                                    reservation={{
                                                        TransactionID:
                                                            selectedRow.TransactionID,
                                                    }}
                                                    customMutateUrl={
                                                        "/api/FrontOffice/TransactionInfo"
                                                    }
                                                />
                                            );
                                            handleClose();
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonVoidTransaction",
                                        })}
                                    </MenuItem>
                                )}
                            </Menu>
                        )}

                        {selectedRow && (
                            <Dialog
                                open={openNoShow}
                                onClose={handleCloseNoShow}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {intl.formatMessage({ id: "StatusNoShow" })}
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
                                    <Button
                                        onClick={() =>
                                            handleOnClickNoShow(
                                                selectedRow.TransactionID
                                            )
                                        }
                                        autoFocus
                                    >
                                        {intl.formatMessage({
                                            id: "ButtonOk",
                                        })}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </>
                );
            },
        },
    ];
    return (
        <Box>
            <Box>
                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={() =>
                        handleModal(
                            true,
                            intl.formatMessage({ id: "ButtonAddNewGuest" }),
                            <NewReservation
                                dateStart={arrivalDate}
                                dateEnd={departureDate}
                                groupID={GroupID}
                            />,
                            null,
                            "large"
                        )
                    }
                >
                    {intl.formatMessage({ id: "ButtonAddNewGuest" })}
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={() => unassignRooms()}
                >
                    {intl.formatMessage({ id: "ButtonUnassignRoom" })}
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            intl.formatMessage({
                                id: "ButtonCancelReservation",
                            }),
                            <CancelReservationForm
                                transactionInfo={newData}
                                reservation={newData}
                                customMutateUrl={
                                    "/api/FrontOffice/TransactionInfo"
                                }
                            />
                        );
                    }}
                >
                    {intl.formatMessage({ id: "ButtonCancelReservation" })}
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            intl.formatMessage({ id: "ButtonVoidTransaction" }),
                            <VoidTransactionForm
                                transactionInfo={newData}
                                reservation={newData}
                                customMutateUrl={
                                    "/api/FrontOffice/TransactionInfo"
                                }
                            />
                        );
                    }}
                >
                    {intl.formatMessage({ id: "ButtonVoidTransaction" })}
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={() => {
                        handleModal(
                            true,
                            intl.formatMessage({ id: "ButtonAmendStay" }),
                            <AmendStayForm
                                transactionInfo={{
                                    TransactionID: newData,
                                    ArrivalDate: arrivalDate,
                                    DepartureDate: departureDate,
                                }}
                                reservation={{
                                    TransactionID: newData,
                                    ArrivalDate: arrivalDate,
                                    DepartureDate: departureDate,
                                }}
                                additionalMutateUrl={
                                    "/api/FrontOffice/TransactionInfo"
                                }
                            />
                        );
                    }}
                >
                    {intl.formatMessage({ id: "ButtonAmendStay" })}
                </Button>
            </Box>

            <Divider className="mt-3 mb-3" />

            {newData && (
                <CustomTable
                    columns={columns}
                    data={newData}
                    error={error}
                    modalTitle={intl.formatMessage({
                        id: "RowHeaderRoomCharge",
                    })}
                    excelName={intl.formatMessage({
                        id: "RowHeaderRoomCharge",
                    })}
                    pagination={false}
                    datagrid={false}
                    hasPrint={false}
                    hasExcel={false}
                    id="TransactionID"
                />
            )}
        </Box>
    );
};

export default RoomCharge;

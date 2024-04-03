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

import CustomTable from "components/common/custom-table";
import { FolioSWR } from "lib/api/folio";
import { TransactionInfoSWR } from "lib/api/front-office";
import NewReservation from "components/front-office/reservation-list/new";
import { ModalContext } from "lib/context/modal";
import AmendStayForm from "components/reservation/amend-stay";
import { ReservationAPI } from "lib/api/reservation";
import RoomMoveForm from "components/reservation/room-move";
import VoidTransactionForm from "components/reservation/void-transaction";
import CancelReservationForm from "components/reservation/cancel-reservation";

const RoomCharge = ({ GroupID, arrivalDate, departureDate }: any) => {
    console.log("ArrivalDate", arrivalDate);
    console.log("departureDate", departureDate);

    const { handleModal }: any = useContext(ModalContext);
    // const { data, error } = FolioSWR(null, GroupID);
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
        if (!confirm("Are you sure?")) {
            return;
        }

        newData.forEach(async (room: any) => {
            if (room.isChecked == true) {
                await ReservationAPI.roomUnassign(room.TransactionID);
            }
        });
        await mutate("/api/FrontOffice/TransactionInfo");

        let tempEntity = [...newData];
        tempEntity.forEach((element: any) => (element.isChecked = false));
        setNewData(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
        // toast("Амжилттай");
    };

    const unassignRoom = async (TransactionID: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await ReservationAPI.roomUnassign(TransactionID);
        await mutate("/api/FrontOffice/TransactionInfo");

        toast("Амжилттай");
    };

    const handleOnClickNoShow = async (TransactionID: any) => {
        setLoading(true);
        try {
            await ReservationAPI.noShow(TransactionID);
            await mutate("/api/FrontOffice/TransactionInfo");

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

    const onCheckInClick = async (TransactionID: any) => {
        if (!confirm("Are you sure?")) {
            return;
        }
        var res = await ReservationAPI.checkIn(TransactionID);
        await mutate("/api/FrontOffice/TransactionInfo");
        toast("Амжилттай");
    };

    function groupByRoom(data: any) {
        return data.reduce((acc: any, current: any) => {
            const roomKey = current.RoomFullNo;

            if (!acc[roomKey]) {
                acc[roomKey] = [];
            }

            acc[roomKey].push(current);

            return acc;
        }, {});
    }

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
                console.log("test", dataIndex);
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
            title: "Тооцооны дугаар",
            key: "FolioNo",
            dataIndex: "FolioNo",
        },
        {
            title: "Өрөө",
            key: "RoomFullNo",
            dataIndex: "RoomFullNo",
        },
        {
            title: "Зочны нэр",
            key: "GuestName",
            dataIndex: "GuestName",
        },
        {
            title: "Ирэх",
            key: "ArrivalDate",
            dataIndex: "ArrivalDate",
            render: function render(id: any, value: any) {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
        },
        {
            title: "Гарах",
            key: "DepartureDate",
            dataIndex: "DepartureDate",
            render: function render(id: any, value: any) {
                return format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy");
            },
        },
        {
            title: "Төлөв",
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
            title: "Үйлдэл",
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
                            Үйлдэл
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
                                        Зочин буулгах
                                    </MenuItem>
                                )}

                                {selectedRow.AmendStay && (
                                    <MenuItem
                                        key={`amendStay${id}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                "Хугацаа өөрчлөх",
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
                                        Хугацаа өөрчлөх
                                    </MenuItem>
                                )}
                                {selectedRow.Cancel && (
                                    <MenuItem
                                        key={`cancelReservation${id}`}
                                        onClick={(evt: any) => {
                                            handleModal(
                                                true,
                                                "Cancel Reservation",
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
                                        Захиалга цуцлах
                                    </MenuItem>
                                )}

                                {selectedRow.MoveRoom && (
                                    <MenuItem
                                        key={`roomMove${id}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                "Room Move",
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
                                        Өрөө шилжих
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
                                        Ирээгүй
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
                                        Өрөөг болих
                                    </MenuItem>
                                )}

                                {selectedRow.Void && (
                                    <MenuItem
                                        key={`voidTransaction${id}`}
                                        onClick={(evt: any) => {
                                            handleModal(
                                                true,
                                                "Void Transaction",
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
                                        Устгах
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
                                    Ирээгүй
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Та итгэлтэй байна уу
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseNoShow}>
                                        Үгүй
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleOnClickNoShow(
                                                selectedRow.TransactionID
                                            )
                                        }
                                        autoFocus
                                    >
                                        Тийм
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
                            `New Reservation`,
                            <NewReservation
                                dateStart={arrivalDate}
                                dateEnd={departureDate}
                                // workingDate={workingDate}
                                groupID={GroupID}
                            />,
                            null,
                            "large"
                        )
                    }
                >
                    Шинэ зочин нэмэх
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={() => unassignRooms()}
                >
                    Өрөөг болих
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Cancel Reservation",
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
                    Захиалга цуцлах
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={(evt: any) => {
                        handleModal(
                            true,
                            "Void Transaction",
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
                    Устгах
                </Button>

                <Button
                    variant={"outlined"}
                    size="small"
                    className="mr-2"
                    onClick={() => {
                        handleModal(
                            true,
                            "Хугацаа өөрчлөх",
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
                    Хугацаа өөрчлөх
                </Button>
            </Box>

            <Divider className="mt-3 mb-3" />

            {newData && (
                <CustomTable
                    columns={columns}
                    data={newData}
                    error={error}
                    modalTitle="Өрөөний тооцоо"
                    excelName="Өрөөний тооцоо"
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

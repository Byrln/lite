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
import { ModalContext } from "lib/context/modal";
import AmendStayForm from "components/reservation/amend-stay";
import { ReservationAPI } from "lib/api/reservation";
import RoomMoveForm from "components/reservation/room-move";
import VoidTransactionForm from "components/reservation/void-transaction";
import CancelReservationForm from "components/reservation/cancel-reservation";

const RoomCharge = ({ GroupID, arrivalDate, departureDate }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const { data, error } = FolioSWR(null, GroupID);
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
        await mutate("/api/Folio/Details");

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
        await mutate("/api/Folio/Details");

        toast("Амжилттай");
    };

    const handleOnClickNoShow = async (TransactionID: any) => {
        setLoading(true);
        try {
            await ReservationAPI.noShow(TransactionID);
            await mutate("/api/Folio/Details");

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
        await mutate("/api/Folio/Details");
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
            let tempData = groupByRoom(data);
            let tempData2: any = [];
            let i: any = 0;

            if (tempData) {
                Object.keys(tempData).forEach((entity: any, test: any) => {
                    tempData[entity];
                    tempData2[i] = [];
                    tempData2[i].FolioNo = "";
                    Object.keys(tempData[entity]).forEach(
                        (entityChild: any) => {
                            tempData2[i].RoomFullNo =
                                tempData[entity][entityChild].RoomFullNo;
                            tempData2[i].FolioNo =
                                tempData2[i].FolioNo +
                                tempData[entity][entityChild].FolioNo +
                                ", ";
                            tempData2[i].BillTo =
                                tempData[entity][entityChild].BillTo;
                            tempData2[i].ArrivalDate = arrivalDate;
                            tempData2[i].DepartureDate = departureDate;
                            tempData2[i].StatusGroup =
                                tempData[entity][entityChild].StatusGroup;
                            tempData2[i].TransactionID =
                                tempData[entity][entityChild].TransactionID;
                        }
                    );
                    i = i + 1;
                });
            }

            setNewData(tempData2);
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
            key: "BillTo",
            dataIndex: "BillTo",
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
            key: "StatusGroup",
            dataIndex: "StatusGroup",
            render: function render(id: any, value: any) {
                return value == 1
                    ? "Баталгаажсан захиалга"
                    : value == 2
                    ? "Ирсэн"
                    : value == 0
                    ? "Цуцалсан"
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
                        <Menu
                            id={`menu${id}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {element.StatusGroup == 1 && (
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
                                                "/api/Folio/Details"
                                            }
                                        />
                                    );
                                    handleClose();
                                }}
                            >
                                Хугацаа өөрчлөх
                            </MenuItem>

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
                                                "/api/Folio/Details"
                                            }
                                        />
                                    );
                                    handleClose();
                                }}
                            >
                                Өрөө шилжих
                            </MenuItem>

                            {element.StatusGroup == 1 && (
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
                                                "/api/Folio/Details"
                                            }
                                        />
                                    );
                                    handleClose();
                                }}
                            >
                                Устгах
                            </MenuItem>

                            {element.StatusGroup == 1 && (
                                <>
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
                                                        "/api/Folio/Details"
                                                    }
                                                />
                                            );
                                            handleClose();
                                        }}
                                    >
                                        Захиалга цуцлах
                                    </MenuItem>

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
                                </>
                            )}
                        </Menu>

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
                                customMutateUrl={"/api/Folio/Details"}
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
                                customMutateUrl={"/api/Folio/Details"}
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
                                additionalMutateUrl={"/api/Folio/Details"}
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

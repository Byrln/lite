import { useContext, useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import { mutate } from "swr";
import { toast } from "react-toastify";

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
    const [newData, setNewData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openNoShow, setOpenNoShow] = useState(false);
    const handleClickOpenNoShow = () => {
        setOpenNoShow(true);
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

    const columns = [
        {
            title: "№",
            key: "№",
            dataIndex: "№",
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
        },
        {
            title: "Гарах",
            key: "DepartureDate",
            dataIndex: "DepartureDate",
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
                        {element.StatusGroup == 1 && (
                            <Button
                                variant={"text"}
                                size="small"
                                onClick={() =>
                                    onCheckInClick(element.TransactionID)
                                }
                            >
                                Зочин буулгах
                            </Button>
                        )}

                        <Button
                            variant={"text"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Хугацаа өөрчлөх",
                                    <AmendStayForm
                                        transactionInfo={{
                                            TransactionID:
                                                element.TransactionID,
                                            ArrivalDate: element.ArrivalDate,
                                            DepartureDate:
                                                element.DepartureDate,
                                        }}
                                        reservation={{
                                            TransactionID:
                                                element.TransactionID,
                                            ArrivalDate: element.ArrivalDate,
                                            DepartureDate:
                                                element.DepartureDate,
                                        }}
                                        additionalMutateUrl={
                                            "/api/Folio/Details"
                                        }
                                    />
                                );
                            }}
                        >
                            Хугацаа өөрчлөх
                        </Button>

                        <Button
                            variant={"text"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Room Move",
                                    <RoomMoveForm
                                        transactionInfo={{
                                            TransactionID:
                                                element.TransactionID,
                                            ArrivalDate: element.ArrivalDate,
                                            DepartureDate:
                                                element.DepartureDate,
                                        }}
                                        reservation={{
                                            TransactionID:
                                                element.TransactionID,
                                            ArrivalDate: element.ArrivalDate,
                                            DepartureDate:
                                                element.DepartureDate,
                                        }}
                                        additionalMutateUrl={
                                            "/api/Folio/Details"
                                        }
                                    />
                                );
                            }}
                        >
                            Өрөө шилжих
                        </Button>

                        {element.StatusGroup == 1 && (
                            <Button
                                variant={"text"}
                                size="small"
                                onClick={handleClickOpenNoShow}
                            >
                                Ирээгүй
                            </Button>
                        )}

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
                                            element.TransactionID
                                        )
                                    }
                                    autoFocus
                                >
                                    Тийм
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Button
                            variant={"text"}
                            size="small"
                            onClick={(evt: any) => {
                                handleModal(
                                    true,
                                    "Void Transaction",
                                    <VoidTransactionForm
                                        transactionInfo={{
                                            TransactionID:
                                                element.TransactionID,
                                        }}
                                        reservation={{
                                            TransactionID:
                                                element.TransactionID,
                                        }}
                                        customMutateUrl={"/api/Folio/Details"}
                                    />
                                );
                            }}
                        >
                            Устгах
                        </Button>

                        {element.StatusGroup == 1 && (
                            <>
                                <Button
                                    variant={"text"}
                                    size="small"
                                    onClick={(evt: any) => {
                                        handleModal(
                                            true,
                                            "Cancel Reservation",
                                            <CancelReservationForm
                                                transactionInfo={{
                                                    TransactionID:
                                                        element.TransactionID,
                                                }}
                                                reservation={{
                                                    TransactionID:
                                                        element.TransactionID,
                                                }}
                                                customMutateUrl={
                                                    "/api/Folio/Details"
                                                }
                                            />
                                        );
                                    }}
                                >
                                    Захиалга цуцлах
                                </Button>

                                <Button
                                    variant={"text"}
                                    size="small"
                                    onClick={() =>
                                        unassignRoom(element.TransactionID)
                                    }
                                >
                                    Өрөөг болих
                                </Button>
                            </>
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <Box>
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

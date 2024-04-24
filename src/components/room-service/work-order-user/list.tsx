import { useContext, useState } from "react";
import {
    Grid,
    Alert,
    Box,
    Skeleton,
    Card,
    CardContent,
    Button,
} from "@mui/material";
import { mutate } from "swr";
import { toast } from "react-toastify";
import moment from "moment";

import { ModalContext } from "lib/context/modal";

import {
    WorkOrderCurrentSWR,
    WorkOrderAPI,
    currentUrl,
} from "lib/api/work-order";
import Iconify from "components/iconify/iconify";

import NewEdit from "./new-edit";

const columns = [
    {
        title: "Reservation No",
        key: "ReservationNo",
        dataIndex: "ReservationNo",
    },
    {
        title: "Guest",
        key: "Guest",
        dataIndex: "Guest",
    },
    {
        title: "Room",
        key: "Room",
        dataIndex: "Room",
    },
    {
        title: "Rate Type",
        key: "RateType",
        dataIndex: "RateType",
    },
    {
        title: "Revervation Type",
        key: "RevervationType",
        dataIndex: "RevervationType",
    },
    {
        title: "Departure",
        key: "Departure",
        dataIndex: "Departure",
    },
    {
        title: "Total",
        key: "Total",
        dataIndex: "Total",
    },
    {
        title: "Deposit",
        key: "Deposit",
        dataIndex: "Deposit",
    },
];

const HouseKeepingList = ({ title }: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const { data, error } = WorkOrderCurrentSWR({ ShowCompleted: false });

    const handleDone = async (WorkOrderRegisterID: any) => {
        setLoading(true);
        try {
            await WorkOrderAPI.end({
                WorkOrderRegisterID: WorkOrderRegisterID,
            });
            await mutate(currentUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleModal();
        } finally {
        }
    };

    const handleDoing = async (WorkOrderRegisterID: any) => {
        setLoading(true);
        try {
            await WorkOrderAPI.updateStatus({
                WorkOrderRegisterID: WorkOrderRegisterID,
                Status: 5,
            });
            await mutate(currentUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleModal();
        } finally {
        }
    };

    return (
        <Grid container spacing={2}>
            {data &&
                data.map((field: any, index: any) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                field.HKStatusCode != "StatusRoomClean" &&
                                    handleModal(
                                        true,
                                        `Төлөв өөрчлөх - ${field.RoomFullName}`,
                                        <div style={{ display: "flex" }}>
                                            <Button
                                                key={field.RoomFullName}
                                                onClick={() => {
                                                    handleDone(
                                                        field.WorkOrderRegisterID
                                                    );
                                                }}
                                                variant="contained"
                                                className="mr-3"
                                            >
                                                Дууссан
                                            </Button>

                                            <Button
                                                key={field.RoomFullName}
                                                onClick={() => {
                                                    handleDoing(
                                                        field.WorkOrderRegisterID
                                                    );
                                                }}
                                                variant="outlined"
                                                className="mr-3"
                                            >
                                                Хүлээгдэж байгаа
                                            </Button>
                                        </div>
                                    );
                                console.log("items", field);
                            }}
                        >
                            <Card
                                style={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {field.RoomFullName}
                                    </span>
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <div>Төлөв : </div>
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {field.WorkOrderStatusID == "5"
                                                    ? "Хүлээгдэж буй"
                                                    : field.WorkOrderStatusID ==
                                                      "2"
                                                    ? "Оноосон"
                                                    : field.WorkOrderStatusID ==
                                                      "3"
                                                    ? "Хийгдэж байгаа"
                                                    : field.StDescription}
                                                <br />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <div>Зэрэглэл : </div>
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {field.WorkOrderPriorityID ==
                                                "3"
                                                    ? "Чухал"
                                                    : field.WorkOrderPriorityID ==
                                                      "2"
                                                    ? "Энгийн"
                                                    : field.WorkOrderPriorityID ==
                                                      "1"
                                                    ? "Чухал биш"
                                                    : field.WorkOrderPriorityCode}
                                                <br />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                marginTop: "4px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <div>Сүүлийн хугацаа : </div>
                                            <div
                                                style={{
                                                    marginLeft: "5px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {moment(field.Deadline).format(
                                                    "YYYY-MM-DD HH:MM:SS"
                                                )}
                                                <br />
                                            </div>
                                        </div>
                                        {field.WODescription && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    marginTop: "4px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <div>Тайлбар : </div>
                                                <div
                                                    style={{
                                                        marginLeft: "5px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {field.WODescription}
                                                </div>
                                            </div>
                                        )}
                                    </span>
                                </CardContent>
                            </Card>
                        </a>
                    </Grid>
                ))}
        </Grid>
    );
};

export default HouseKeepingList;

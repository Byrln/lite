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

import { ModalContext } from "lib/context/modal";
import {
    HouseKeepingCurrentSWR,
    HouseKeepingAPI,
    listCurrentUrl,
} from "lib/api/house-keeping";
import Iconify from "components/iconify/iconify";

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
    const { data, error } = HouseKeepingCurrentSWR();
    const [loading, setLoading] = useState(false);

    function sortData(rooms: any) {
        return rooms.sort((a: any, b: any) => {
            if (a.HouseKeepingStatusID === 2 && b.HouseKeepingStatusID !== 2) {
                return -1;
            } else if (
                a.HouseKeepingStatusID !== 2 &&
                b.HouseKeepingStatusID === 2
            ) {
                return 1;
            }
            if (a.HouseKeepingStatusID !== b.HouseKeepingStatusID) {
                return a.HouseKeepingStatusID - b.HouseKeepingStatusID;
            }
            if (a.Sort1 !== b.Sort1) {
                return a.Sort1 - b.Sort1;
            }
            return a.Sort2 - b.Sort2;
        });
    }

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        );

    const handleStop = async (RoomID: any) => {
        setLoading(true);
        try {
            await HouseKeepingAPI.update({
                RoomID: RoomID,
                HouseKeepingStatusID: 1,
            });
            await mutate(listCurrentUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleModal();
        } finally {
        }
    };

    const handleCleaned = async (RoomID: any) => {
        setLoading(true);
        try {
            await HouseKeepingAPI.roomCleaned({ RoomID: RoomID });
            await mutate(listCurrentUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleModal();
        } finally {
        }
    };

    const handleStartCleaning = async (RoomID: any) => {
        setLoading(true);
        try {
            await HouseKeepingAPI.roomCleaning({ RoomID: RoomID });
            await mutate(listCurrentUrl);
            setLoading(false);
            toast("Амжилттай.");
            handleModal();
        } finally {
        }
    };

    return (
        <Grid container spacing={2}>
            {data &&
                sortData(data).map((field: any, index: any) => (
                    <Grid item xs={6} sm={3} md={2} key={index}>
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                field.HKStatusCode != "StatusRoomClean" &&
                                    handleModal(
                                        true,
                                        `${field.RoomFullName} (${
                                            field.HKStatusCode ==
                                            "StatusRoomClean"
                                                ? "Цэвэр"
                                                : field.HKStatusCode ==
                                                  "StatusRoomDirty"
                                                ? "Бохир"
                                                : field.HKStatusCode ==
                                                  "StatusRoomCleaning"
                                                ? "Цэвэрлэж байгаа"
                                                : field.HKStatusCode
                                        })`,
                                        <div style={{ display: "flex" }}>
                                            {field.HKStatusCode ==
                                                "StatusRoomDirty" && (
                                                <Button
                                                    key={field.RoomFullName}
                                                    onClick={() => {
                                                        handleStartCleaning(
                                                            field.RoomID
                                                        );
                                                    }}
                                                    variant="contained"
                                                    className="mr-3"
                                                >
                                                    Цэвэрлэж эхлэх
                                                </Button>
                                            )}
                                            {field.HKStatusCode ==
                                                "StatusRoomCleaning" && (
                                                <Button
                                                    key={field.RoomFullName}
                                                    onClick={() => {
                                                        handleCleaned(
                                                            field.RoomID
                                                        );
                                                    }}
                                                    variant="contained"
                                                    className="mr-3"
                                                >
                                                    Цэвэрлэж дуусгах
                                                </Button>
                                            )}
                                            {field.HKStatusCode ==
                                                "StatusRoomCleaning" && (
                                                <Button
                                                    key={field.RoomFullName}
                                                    onClick={() => {
                                                        handleStop(
                                                            field.RoomID
                                                        );
                                                    }}
                                                    variant="outlined"
                                                    className="mr-3"
                                                >
                                                    Цэвэрлэгээ зогсоох
                                                </Button>
                                            )}
                                        </div>
                                    );
                                console.log("items", field);
                            }}
                        >
                            <Card
                                style={{
                                    height: "100%",
                                    backgroundColor:
                                        field.HKStatusCode == "StatusRoomDirty"
                                            ? "#FF3300"
                                            : field.HKStatusCode ==
                                              "StatusRoomClean"
                                            ? "#FFCC99"
                                            : field.HKStatusCode ==
                                              "StatusRoomCleaning"
                                            ? "#FFFF33"
                                            : "white",
                                    color:
                                        field.HKStatusCode == "StatusRoomDirty"
                                            ? "white"
                                            : "black",
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
                                            <Iconify
                                                icon={
                                                    field.HKStatusCode ==
                                                    "StatusRoomClean"
                                                        ? "material-symbols:done"
                                                        : field.HKStatusCode ==
                                                          "StatusRoomDirty"
                                                        ? "mdi:dirty"
                                                        : field.HKStatusCode ==
                                                          "StatusRoomCleaning"
                                                        ? "healthicons:cleaning"
                                                        : field.HKStatusCode
                                                }
                                                width="12px"
                                            />
                                            <div
                                                style={{
                                                    marginTop: "-3px",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                {field.HKStatusCode ==
                                                "StatusRoomClean"
                                                    ? "Цэвэр"
                                                    : field.HKStatusCode ==
                                                      "StatusRoomDirty"
                                                    ? "Бохир"
                                                    : field.HKStatusCode ==
                                                      "StatusRoomCleaning"
                                                    ? "Цэвэрлэж байгаа"
                                                    : field.HKStatusCode}
                                                <br />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <Iconify
                                                icon={
                                                    field.StatusCode ==
                                                    "StatusStayOver"
                                                        ? "material-symbols:short-stay-outline"
                                                        : field.StatusCode ==
                                                          "StatusArrived"
                                                        ? "material-symbols:where-to-vote-outline-rounded"
                                                        : field.StatusCode ==
                                                          "StatusConfirmReservation"
                                                        ? "fluent-mdl2:waitlist-confirm-mirrored"
                                                        : ""
                                                }
                                                width="12px"
                                            />
                                            <div
                                                style={{
                                                    marginTop: "-3px",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                {field.StatusCode ==
                                                "StatusStayOver"
                                                    ? "Дахин хонох"
                                                    : field.StatusCode ==
                                                      "StatusArrived"
                                                    ? "Ирсэн"
                                                    : field.StatusCode ==
                                                      "StatusConfirmReservation"
                                                    ? "Баталгаажсан захиалга"
                                                    : ""}
                                            </div>
                                        </div>
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

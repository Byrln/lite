import { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";

import { RoomSWR, listUrl } from "lib/api/room";
import { DailyInfo2SWR, dailyInfo2Url } from "lib/api/report";
import { HouseKeepingCurrentSWR, listCurrentUrl } from "lib/api/house-keeping";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const Folio = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData] = useState<any>(null);
    const [roomStatusData, setRoomStatusData] = useState<any>(null);
    const [roomsData, setRoomsData] = useState<any>(null);
    const [search, setSearch] = useState<any>({});

    const { data: rooms, error: roomSwrError } = RoomSWR(search);
    const { data: roomStatus, error: roomStatusError } =
        HouseKeepingCurrentSWR(search);
    const { data, error } = DailyInfo2SWR(search, workingDate);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            .MuiTableCell-root{
                border:1px solid !important;
                font-size:8px !important;
                line-height:8px !important
                padding:4px !important

              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px solid !important;
                background-color: none !important;
                color :inherit !important;
                font-size:8px !important;
                line-height:8px !important;
                padding:4px !important
              ]
              }
          }`,
        content: () => componentRef.current,
    });

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    function mergeTransactions(transactions: any) {
        const mergedTransactions: any = {};

        transactions.forEach((transaction: any) => {
            const roomNo = transaction.RoomNo;
            if (!mergedTransactions[roomNo]) {
                mergedTransactions[roomNo] = { ...transaction };
            } else {
                // Merge the current transaction with existing transaction
                if (transaction.DepartureName) {
                    mergedTransactions[roomNo].DepartureName =
                        transaction.DepartureName;
                    mergedTransactions[roomNo].DepartureStatusCode1 =
                        transaction.StatusCode1;
                    mergedTransactions[roomNo].CheckedOutDate =
                        transaction.CheckedOutDate;
                } else {
                    mergedTransactions[roomNo].Adult = transaction.Adult;
                    mergedTransactions[roomNo].ArrivalDate =
                        transaction.ArrivalDate;
                    mergedTransactions[roomNo].ArrivalName =
                        transaction.ArrivalName;
                    mergedTransactions[roomNo].BaseAdult =
                        transaction.BaseAdult;
                    mergedTransactions[roomNo].BaseChild =
                        transaction.BaseChild;
                    mergedTransactions[roomNo].CheckedInDate =
                        transaction.CheckedInDate;
                    mergedTransactions[roomNo].Child = transaction.Child;
                    mergedTransactions[roomNo].DepartureDate =
                        transaction.DepartureDate;
                    mergedTransactions[roomNo].FloorNo = transaction.FloorNo;
                    mergedTransactions[roomNo].FullName = transaction.FullName;
                    mergedTransactions[roomNo].RoomNo = transaction.RoomNo;
                    mergedTransactions[roomNo].StatusCode =
                        transaction.StatusCode;
                    mergedTransactions[roomNo].StatusCode1 =
                        transaction.StatusCode1;
                    mergedTransactions[roomNo].TransactionID =
                        transaction.TransactionID;
                    mergedTransactions[roomNo].TransactionID =
                        transaction.DefaultCheckIn;
                    mergedTransactions[roomNo].TransactionID =
                        transaction.DefaultCheckOut;
                }
            }
        });

        return Object.values(mergedTransactions);
    }
    useEffect(() => {
        if (data) {
            let tempValue = groupBy(data, "RoomNo");
            let letTempValue2 = { ...tempValue };

            Object.keys(tempValue).map(
                (key: any) =>
                    (tempValue[key] =
                        tempValue[key].length > 1
                            ? mergeTransactions(tempValue[key])
                            : tempValue[key])
            );

            setReportData(tempValue);
            mutate(listUrl);
        }
    }, [data]);

    useEffect(() => {
        if (rooms) {
            rooms.sort((a: any, b: any) => {
                // Convert RoomNo to lowercase for case-insensitive sorting
                const roomNoA = a.RoomNo.toLowerCase();
                const roomNoB = b.RoomNo.toLowerCase();

                // Compare room numbers
                if (roomNoA < roomNoB) return -1;
                if (roomNoA > roomNoB) return 1;
                return 0;
            });
            let letRoomTemp = groupBy(rooms, "FloorNo");

            setRoomsData(letRoomTemp);
            // mutate(listCurrentUrl);
            setRerenderKey((prevKey) => prevKey + 1);
        }
    }, [rooms]);

    useEffect(() => {
        if (roomStatus) {
            let letRoomTemp = groupBy(roomStatus, "RoomNo");

            setRoomStatusData(letRoomTemp);
            setRerenderKey((prevKey) => prevKey + 1);
        }
    }, [roomStatus]);

    const validationSchema = yup.object().shape({
        FloorID: yup.string().nullable(),
    });
    const formOptions = {
        resolver: yupResolver(validationSchema),
    };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    return (
        <>
            <div style={{ display: "flex" }}>
                <Button
                    variant="outlined"
                    onClick={handlePrint}
                    className="mr-3"
                    startIcon={<PrintIcon />}
                >
                    Хэвлэх
                </Button>
                <CustomSearch
                    listUrl={dailyInfo2Url}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                    />
                </CustomSearch>
            </div>

            <div ref={componentRef}>
                <Box
                    sx={{
                        display: "flex",
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <div style={{ flexGrow: 1, textAlign: "center" }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            style={{ textAlign: "center" }}
                            className="mb-3"
                        >
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        {workingDate &&
                            moment(workingDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                    </Typography>
                </Box>
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                    size="small"
                    key={rerenderKey}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                Бэлэн байгаа
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                Rooms
                            </TableCell>

                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                OCC/Guest name
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                ARR/Guest name
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                Нэмэлт ор
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                Check in Time
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                So
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                LCO
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                do
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                            >
                                dep
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    padding: "10px 2px",
                                }}
                                width={200}
                            >
                                Тайлбар
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roomsData &&
                            reportData &&
                            roomStatusData &&
                            Object.keys(roomsData).map((key) => (
                                <>
                                    <TableRow
                                        key={key}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                paddingLeft: "30px !important",
                                                fontSize: "10px",
                                                textAlign: "center",
                                            }}
                                            colSpan={11}
                                        >
                                            {key} давхар
                                        </TableCell>
                                    </TableRow>
                                    {roomsData[key] &&
                                        Object.keys(roomsData[key]).map(
                                            (key2) => (
                                                <>
                                                    <TableRow
                                                        key={key}
                                                        sx={{
                                                            "&:last-child td, &:last-child th":
                                                                {
                                                                    border: 0,
                                                                },
                                                        }}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {roomStatusData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? roomStatusData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .HKStatusCode ==
                                                                  "StatusRoomClean"
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            }
                                                        </TableCell>

                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .DepartureName
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .ArrivalName
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0].Adult +
                                                                  reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0].Child -
                                                                  reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .BaseAdult -
                                                                  reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0].BaseChild
                                                                    ? reportData[
                                                                          roomsData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .RoomNo
                                                                      ][0]
                                                                          .Adult +
                                                                      reportData[
                                                                          roomsData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .RoomNo
                                                                      ][0]
                                                                          .Child -
                                                                      reportData[
                                                                          roomsData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .RoomNo
                                                                      ][0]
                                                                          .BaseAdult -
                                                                      reportData[
                                                                          roomsData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .RoomNo
                                                                      ][0]
                                                                          .BaseChild
                                                                    : "0"
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .CheckedInDate
                                                                    ? moment(
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .CheckedInDate
                                                                      ).format(
                                                                          "HH:mm:ss"
                                                                      )
                                                                    : moment(
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .ArrivalDate
                                                                      ).format(
                                                                          "HH:mm:ss"
                                                                      )
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .StatusCode1 ==
                                                                  "StatusStayOver"
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .StatusCode1 ==
                                                                  "StatusStayOver"
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .DefaultCheckOut &&
                                                                  reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .CheckedOutDate &&
                                                                  reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .DefaultCheckOut <
                                                                      moment(
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .CheckedOutDate
                                                                      ).format(
                                                                          "HH:mm:ss"
                                                                      )
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .StatusCode1 ==
                                                                  "StatusDueOut"
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            align="left"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        >
                                                            {reportData[
                                                                roomsData[key][
                                                                    key2
                                                                ].RoomNo
                                                            ]
                                                                ? reportData[
                                                                      roomsData[
                                                                          key
                                                                      ][key2]
                                                                          .RoomNo
                                                                  ][0]
                                                                      .CheckedOutDate
                                                                    ? "Тийм"
                                                                    : ""
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            align="left"
                                                            width={200}
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "10px 2px",
                                                            }}
                                                        ></TableCell>
                                                    </TableRow>
                                                </>
                                            )
                                        )}
                                </>
                            ))}
                    </TableBody>
                </Table>

                <div className="mt-3">
                    <Typography variant="body1" gutterBottom className="mr-3">
                        <span style={{ fontWeight: "bold" }}> Хэвлэсэн : </span>{" "}
                        {localStorage.getItem("username")}
                    </Typography>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Хэвлэсэн огноо :{" "}
                        </span>{" "}
                        {moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
                    </Typography>

                    <Typography variant="body1" gutterBottom className="mr-3">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Supervisor signature :{" "}
                        </span>{" "}
                        ..................................
                    </Typography>
                </div>
            </div>
        </>
    );
};

export default Folio;

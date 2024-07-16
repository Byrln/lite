import { useState, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
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
    Grid,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";

import { RoomSWR, listUrl } from "lib/api/room";
import { DailyInfo2SWR, dailyInfo2Url } from "lib/api/report";
import { HouseKeepingRoomSWR, listCurrentUrl } from "lib/api/house-keeping";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const Folio = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData] = useState<any>(null);
    const [roomStatusData, setRoomStatusData] = useState<any>(null);
    const [roomsData, setRoomsData] = useState<any>(null);
    const [search, setSearch] = useState<any>({});

    const { data: rooms, error: roomSwrError } = RoomSWR(search);
    const { data: roomStatus, error: roomStatusError } =
        HouseKeepingRoomSWR(search);
    const { data, error } = DailyInfo2SWR(search, workingDate);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              margin:  20px;
            }

            .MuiTableCell-root{
                border:1px  #DFDFDF solid !important;
                font-size:10px !important;
                line-height:8px !important
                padding:4px !important
              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px #DFDFDF solid !important;
                background-color: none !important;
                color :inherit !important;
                font-size:10px !important;
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
                if (transaction.ArrivalName) {
                    mergedTransactions[roomNo].ArrivalCustomerName =
                        transaction.CustomerName;
                }
                if (transaction.DepartureName) {
                    mergedTransactions[roomNo].DepartureName =
                        transaction.DepartureName;
                    mergedTransactions[roomNo].DepartureStatusCode1 =
                        transaction.StatusCode1;
                    mergedTransactions[roomNo].CheckedOutDate =
                        transaction.CheckedOutDate;
                    mergedTransactions[roomNo].DepartureCustomerName =
                        transaction.CustomerName;
                }
            } else {
                // Merge the current transaction with existing transaction
                if (transaction.DepartureName) {
                    mergedTransactions[roomNo].DepartureName =
                        transaction.DepartureName;
                    mergedTransactions[roomNo].DepartureStatusCode1 =
                        transaction.StatusCode1;
                    mergedTransactions[roomNo].CheckedOutDate =
                        transaction.CheckedOutDate;
                    mergedTransactions[roomNo].DepartureCustomerName =
                        transaction.CustomerName;
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
                    mergedTransactions[roomNo].ArrivalCustomerName =
                        transaction.CustomerName;
                }
            }
        });

        return Object.values(mergedTransactions);
    }
    useEffect(() => {
        if (data) {
            let tempValue = groupBy(data, "RoomNo");

            Object.keys(tempValue).map(
                (key: any) =>
                    (tempValue[key] =
                        // tempValue[key].length > 1
                        //     ?
                        mergeTransactions(tempValue[key]))
                // : tempValue[key])
            );
            console.log("tempValue", tempValue);
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
    console.log("search.Floors", search.Floors);
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
                        search={search}
                    />
                </CustomSearch>
            </div>

            <div ref={componentRef}>
                <div className="print-content">
                    <Box
                        sx={{
                            display: "flex",
                            borderRadius: 1,
                        }}
                        className="print-header"
                        id="header"
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
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                {intl.formatMessage({id:"ReportingPeriod"}) }
                            </span>{" "}
                            {search.CurrDate
                                ? moment(search.CurrDate, "YYYY.MM.DD").format(
                                      "YYYY.MM.DD"
                                  )
                                : moment(workingDate, "YYYY.MM.DD").format(
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
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "40px",
                                    }}
                                >
                                    {intl.formatMessage({id:"TextReady"}) }
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "50px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ConfigRooms"}) }
                                </TableCell>

                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        textOverflow: "ellipsis",
                                        width: "130px",
                                    }}
                                >
                                  {intl.formatMessage({id:"OCC/GuestName"}) }
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        textOverflow: "ellipsis",
                                        width: "130px",
                                    }}
                                >
                                {intl.formatMessage({id:"ARR/GuestName"}) }
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "50px",
                                    }}
                                >
                                 {intl.formatMessage({id:"TextExtraBed"}) }
                                </TableCell>
                                {/* <TableCell
                                align="left"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "11px",
                                    padding: "2px 2px",
                                }}
                            >
                                Check in Time
                            </TableCell> */}
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "30px",
                                    }}
                                >
                                      {intl.formatMessage({id:"TextSo"}) }
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "30px",
                                    }}
                                >
                                    LCO
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "30px",
                                    }}
                                >
                                     {intl.formatMessage({id:"TextDo"}) }
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                        width: "30px",
                                    }}
                                >
                                    dep
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        padding: "2px 2px",
                                    }}
                                    width={250}
                                >
                                     {intl.formatMessage({id:"RowHeaderDescription"}) }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roomsData &&
                                reportData &&
                                roomStatusData &&
                                Object.keys(roomsData).map((key, index) => (
                                    <>
                                        {search.Floors &&
                                        !search.Floors.includes(
                                            String(roomsData[key][0].FloorID)
                                        ) ? (
                                            <>{roomsData[key].FloorID}</>
                                        ) : (
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
                                                            fontWeight: "bold",
                                                            paddingLeft:
                                                                "30px !important",
                                                            fontSize: "11px",
                                                            textAlign: "center",
                                                            padding: "2px",
                                                        }}
                                                        colSpan={11}
                                                    >
                                                          {intl.formatMessage({id:"TextFloor"}) }
                                                             {key}
                                                    </TableCell>
                                                </TableRow>
                                                {roomsData[key] &&
                                                    Object.keys(
                                                        roomsData[key]
                                                    ).map((key2) => (
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
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "40px",
                                                                    }}
                                                                >
                                                                    {/* {roomStatusData[
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
                                                                : ""} */}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "50px",
                                                                    }}
                                                                >
                                                                    {
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    }
                                                                </TableCell>

                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                        width: "130px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            width: "130px",
                                                                            overflow:
                                                                                "hidden",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                        }}
                                                                    >
                                                                        {reportData[
                                                                            roomsData[
                                                                                key
                                                                            ][
                                                                                key2
                                                                            ]
                                                                                .RoomNo
                                                                        ]
                                                                            ? reportData[
                                                                                  roomsData[
                                                                                      key
                                                                                  ][
                                                                                      key2
                                                                                  ]
                                                                                      .RoomNo
                                                                              ][0]
                                                                                  .DepartureName
                                                                                ? reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .DepartureCustomerName &&
                                                                                  reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .DepartureCustomerName !=
                                                                                      ""
                                                                                    ? reportData[
                                                                                          roomsData[
                                                                                              key
                                                                                          ][
                                                                                              key2
                                                                                          ]
                                                                                              .RoomNo
                                                                                      ][0]
                                                                                          .DepartureCustomerName
                                                                                    : reportData[
                                                                                          roomsData[
                                                                                              key
                                                                                          ][
                                                                                              key2
                                                                                          ]
                                                                                              .RoomNo
                                                                                      ][0]
                                                                                          .DepartureName
                                                                                : reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .ArrivalName
                                                                                ? ""
                                                                                : reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .FullName
                                                                            : ""}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                        width: "130px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            width: "130px",
                                                                            overflow:
                                                                                "hidden",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                        }}
                                                                    >
                                                                        {reportData[
                                                                            roomsData[
                                                                                key
                                                                            ][
                                                                                key2
                                                                            ]
                                                                                .RoomNo
                                                                        ]
                                                                            ? reportData[
                                                                                  roomsData[
                                                                                      key
                                                                                  ][
                                                                                      key2
                                                                                  ]
                                                                                      .RoomNo
                                                                              ][0]
                                                                                  .ArrivalName
                                                                                ? reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .ArrivalCustomerName &&
                                                                                  reportData[
                                                                                      roomsData[
                                                                                          key
                                                                                      ][
                                                                                          key2
                                                                                      ]
                                                                                          .RoomNo
                                                                                  ][0]
                                                                                      .ArrivalCustomerName !=
                                                                                      ""
                                                                                    ? reportData[
                                                                                          roomsData[
                                                                                              key
                                                                                          ][
                                                                                              key2
                                                                                          ]
                                                                                              .RoomNo
                                                                                      ][0]
                                                                                          .ArrivalCustomerName
                                                                                    : reportData[
                                                                                          roomsData[
                                                                                              key
                                                                                          ][
                                                                                              key2
                                                                                          ]
                                                                                              .RoomNo
                                                                                      ][0]
                                                                                          .ArrivalName
                                                                                : ""
                                                                            : ""}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="center"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "50px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ] &&
                                                                    reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ][0] &&
                                                                    reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ][0]
                                                                        .ExtraBed >
                                                                        0
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
                                                                                  .BaseChild >
                                                                          0
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
                                                                            : ""
                                                                        : ""}
                                                                </TableCell>
                                                                {/* <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                                padding:
                                                                    "2px 2px",
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
                                                        </TableCell> */}
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "30px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ]
                                                                        ? reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .StatusCode1 ==
                                                                          "StatusStayOver"
                                                                            ? "So"
                                                                            : ""
                                                                        : ""}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "30px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ]
                                                                        ? reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .DefaultCheckOut &&
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .CheckedOutDate &&
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
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
                                                                            ? "LCO"
                                                                            : ""
                                                                        : ""}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "30px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ]
                                                                        ? reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .DepartureStatusCode1 ==
                                                                          "StatusDueOut"
                                                                            ? "do"
                                                                            : ""
                                                                        : ""}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="left"
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                        width: "30px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        roomsData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomNo
                                                                    ]
                                                                        ? reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .DepartureStatusCode1 &&
                                                                          reportData[
                                                                              roomsData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .RoomNo
                                                                          ][0]
                                                                              .DepartureStatusCode1 ==
                                                                              "StatusCheckedOut"
                                                                            ? "dep"
                                                                            : ""
                                                                        : ""}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="left"
                                                                    width={250}
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        padding:
                                                                            "2px 2px",
                                                                    }}
                                                                ></TableCell>
                                                            </TableRow>
                                                        </>
                                                    ))}
                                            </>
                                        )}

                                        {/* Add <hr> tag after every two iterations */}
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-3 print-footer" id="footer">
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            {" "}
                            <Typography
                                variant="body1"
                                gutterBottom
                                className="mr-3"
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    {intl.formatMessage({id:"ReportPrinted"}) }
                                </span>{" "}
                                {localStorage.getItem("username")}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {" "}
                            <Typography
                                variant="body1"
                                gutterBottom
                                className="mr-1"
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    {intl.formatMessage({id:"DateToPrinted"}) }
                                </span>{" "}
                                {moment(new Date()).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography
                                variant="body1"
                                gutterBottom
                                className="mr-3"
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Supervisor signature :{" "}
                                </span>{" "}
                                .....................
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default Folio;

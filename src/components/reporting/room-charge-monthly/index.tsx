import { useState, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import moment from "moment";
import {
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatPrice } from "lib/utils/helpers";
import { useRouter } from "next/router";

import { MonthlyRoomChargeSWR, monthlyRoomChargeUrl } from "lib/api/report";
import { RoomTypeSWR } from "lib/api/room-type";
import { RoomSWR } from "lib/api/room";

import CustomSearch from "components/common/custom-search";
import Search from "./search";

const AvailableRoom = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const router = useRouter();
    const { CurrDate } = router.query;
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [dates, setDates] = useState<any>([]);
    const [dDays, setDDays] = useState<any>([]);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [roomsData, setRoomData] = useState<any>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [dataGroupedByDate, setDataGroupedByDate] = useState<any>(null);

    const [search, setSearch] = useState({
        CurrDate: CurrDate
            ? CurrDate
            : moment(workingDate).format("YYYY-MM-DD"),
    });

    const { data, error } = MonthlyRoomChargeSWR(search);

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({});
    const { data: rooms, error: roomsError } = RoomSWR({});

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            .MuiTableCell-root{
                border:1px solid !important;
                font-size:9px !important;
                line-height:9px !important
                padding:4px !important

              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px solid !important;
                background-color:none !important;
                color :inherit !important;
                font-size:9px !important;
                line-height:9px !important;
                padding:4px !important
              ]
              }
          }`,
        content: () => componentRef.current,
    });

    useEffect(() => {
        let dateArray: any = [];
        let d: any = [];

        for (
            let i = 0;
            i < moment(search.CurrDate).endOf("month").date();
            i++
        ) {
            let tempDate = new Date(
                moment(search.CurrDate).startOf("month").format("YYYY-MM-DD")
            );
            tempDate.setDate(
                moment(search.CurrDate).startOf("month").date() + i
            );
            dateArray.push(moment(tempDate).format("YYYY-MM-DD"));
            d.push(`D${i + 1}`);
        }
        setDDays(d);
        setDates(dateArray);
    }, [search]);

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    useEffect(() => {
        if (data) {
            let tempValue = groupBy(data, "RoomTypeName");
            setDataGroupedByDate(groupBy(data, "StayDate"));
            Object.keys(tempValue).map(
                (key: any) => {
                    tempValue[key] =
                        // tempValue[key].length > 1
                        //     ?
                        groupBy(tempValue[key], "RoomNo");

                    Object.keys(tempValue[key]).map(
                        (key2: any) =>
                            (tempValue[key][key2] = groupBy(
                                tempValue[key][key2],
                                "StayDate"
                            ))
                    );
                }
                // : tempValue[key])
            );

            setReportData(tempValue);
        }
    }, [data]);

    useEffect(() => {
        if (rooms) {
            let tempValue = groupBy(rooms, "RoomTypeName");

            setRoomData(tempValue);
        }
    }, [rooms]);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),

        CustomerID: yup.string().nullable(),
    });

    const formOptions = {
        defaultValues: {
            CurrDate: CurrDate
                ? CurrDate
                : moment(workingDate).format("YYYY-MM-DD"),
        },
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
                    {intl.formatMessage({id:"ButtonPrint"}) }
                </Button>

                <CustomSearch
                    listUrl={monthlyRoomChargeUrl}
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
                <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "center" }}
                    className="mb-3"
                >
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {" "}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                {intl.formatMessage({id:"TextDuration"}) }
                            </span>{" "}
                            {moment(search.CurrDate, "YYYY-MM-DD").format(
                                "YYYY-MM"
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}></Grid>
                    <Grid item xs={12}>
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
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                        rowSpan={2}
                                    >
                                      {intl.formatMessage({id:"ConfigRoomType"}) }
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                        rowSpan={2}
                                    >
                                       {intl.formatMessage({id:"ConfigRooms"}) }
                                    </TableCell>
                                    {dates &&
                                        dates.map((item: any) => (
                                            <TableCell
                                                key={item}
                                                align="center"
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px",
                                                    fontSize: "10px",
                                                }}
                                                colSpan={3}
                                            >
                                                {moment(item).date()}
                                            </TableCell>
                                        ))}
                                </TableRow>
                                <TableRow>
                                    {dates &&
                                        dates.map((item: any) => (
                                            <>
                                                <TableCell
                                                    key={item}
                                                    align="center"
                                                    style={{
                                                        fontWeight: "bold",
                                                        padding: "2px",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                   {intl.formatMessage({id:"TextBasePrice"}) }
                                                </TableCell>
                                                <TableCell
                                                    key={item}
                                                    align="center"
                                                    style={{
                                                        fontWeight: "bold",
                                                        padding: "2px",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                     {intl.formatMessage({id:"TextSale"}) }
                                                </TableCell>
                                                <TableCell
                                                    key={item}
                                                    align="center"
                                                    style={{
                                                        fontWeight: "bold",
                                                        padding: "2px",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {intl.formatMessage({id:"TextIncome"}) }
                                                </TableCell>
                                            </>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roomTypes &&
                                    roomsData &&
                                    reportData &&
                                    roomTypes.map(
                                        (roomType: any, index: any) => (
                                            <>
                                                <TableRow
                                                    key={index}
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
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                        rowSpan={
                                                            roomsData[
                                                                roomType
                                                                    .RoomTypeName
                                                            ]
                                                                ? roomsData[
                                                                      roomType
                                                                          .RoomTypeName
                                                                  ].length + 1
                                                                : 2
                                                        }
                                                    >
                                                        {roomType.RoomTypeName}
                                                    </TableCell>
                                                </TableRow>
                                                {roomsData[
                                                    roomType.RoomTypeName
                                                ] ? (
                                                    roomsData[
                                                        roomType.RoomTypeName
                                                    ].map(
                                                        (
                                                            room: any,
                                                            index: any
                                                        ) => (
                                                            <TableRow
                                                                key={index}
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
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        room.RoomNo
                                                                    }
                                                                </TableCell>
                                                                {dates &&
                                                                    reportData &&
                                                                    dates.map(
                                                                        (
                                                                            item: any
                                                                        ) =>
                                                                            reportData[
                                                                                roomType
                                                                                    .RoomTypeName
                                                                            ] &&
                                                                            reportData[
                                                                                roomType
                                                                                    .RoomTypeName
                                                                            ][
                                                                                room
                                                                                    .RoomNo
                                                                            ] &&
                                                                            reportData[
                                                                                roomType
                                                                                    .RoomTypeName
                                                                            ][
                                                                                room
                                                                                    .RoomNo
                                                                            ][
                                                                                `${item}T00:00:00`
                                                                            ] ? (
                                                                                <>
                                                                                    {" "}
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-normal`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        >
                                                                                            {formatPrice(
                                                                                                reportData[
                                                                                                    roomType
                                                                                                        .RoomTypeName
                                                                                                ][
                                                                                                    room
                                                                                                        .RoomNo
                                                                                                ][
                                                                                                    `${item}T00:00:00`
                                                                                                ][0]
                                                                                                    .NormalRate
                                                                                            )}
                                                                                        </div>
                                                                                    </TableCell>{" "}
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-discount`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        >
                                                                                            {((Number(
                                                                                                reportData[
                                                                                                    roomType
                                                                                                        .RoomTypeName
                                                                                                ][
                                                                                                    room
                                                                                                        .RoomNo
                                                                                                ][
                                                                                                    `${item}T00:00:00`
                                                                                                ][0]
                                                                                                    .NormalRate
                                                                                            ) -
                                                                                                Number(
                                                                                                    reportData[
                                                                                                        roomType
                                                                                                            .RoomTypeName
                                                                                                    ][
                                                                                                        room
                                                                                                            .RoomNo
                                                                                                    ][
                                                                                                        `${item}T00:00:00`
                                                                                                    ][0]
                                                                                                        .RCAmount
                                                                                                )) *
                                                                                                100) /
                                                                                                Number(
                                                                                                    reportData[
                                                                                                        roomType
                                                                                                            .RoomTypeName
                                                                                                    ][
                                                                                                        room
                                                                                                            .RoomNo
                                                                                                    ][
                                                                                                        `${item}T00:00:00`
                                                                                                    ][0]
                                                                                                        .NormalRate
                                                                                                ) >
                                                                                            0
                                                                                                ? `${(
                                                                                                      ((Number(
                                                                                                          reportData[
                                                                                                              roomType
                                                                                                                  .RoomTypeName
                                                                                                          ][
                                                                                                              room
                                                                                                                  .RoomNo
                                                                                                          ][
                                                                                                              `${item}T00:00:00`
                                                                                                          ][0]
                                                                                                              .NormalRate
                                                                                                      ) -
                                                                                                          Number(
                                                                                                              reportData[
                                                                                                                  roomType
                                                                                                                      .RoomTypeName
                                                                                                              ][
                                                                                                                  room
                                                                                                                      .RoomNo
                                                                                                              ][
                                                                                                                  `${item}T00:00:00`
                                                                                                              ][0]
                                                                                                                  .RCAmount
                                                                                                          )) *
                                                                                                          100) /
                                                                                                      Number(
                                                                                                          reportData[
                                                                                                              roomType
                                                                                                                  .RoomTypeName
                                                                                                          ][
                                                                                                              room
                                                                                                                  .RoomNo
                                                                                                          ][
                                                                                                              `${item}T00:00:00`
                                                                                                          ][0]
                                                                                                              .NormalRate
                                                                                                      )
                                                                                                  ).toFixed(
                                                                                                      2
                                                                                                  )}%`
                                                                                                : ""}{" "}
                                                                                        </div>
                                                                                    </TableCell>{" "}
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-amount`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        >
                                                                                            {formatPrice(
                                                                                                reportData[
                                                                                                    roomType
                                                                                                        .RoomTypeName
                                                                                                ][
                                                                                                    room
                                                                                                        .RoomNo
                                                                                                ][
                                                                                                    `${item}T00:00:00`
                                                                                                ][0]
                                                                                                    .RCAmount
                                                                                            )}
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-normal`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        ></div>
                                                                                    </TableCell>{" "}
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-discount`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        ></div>
                                                                                    </TableCell>{" "}
                                                                                    <TableCell
                                                                                        key={`${roomType.RoomTypeName}-${room.RoomNo}-${item}-amount`}
                                                                                        component="th"
                                                                                        scope="row"
                                                                                        width={
                                                                                            50
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "10px",
                                                                                            padding:
                                                                                                "2px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                width: "40px",
                                                                                            }}
                                                                                        ></div>
                                                                                    </TableCell>
                                                                                </>
                                                                            )
                                                                    )}
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            "&:last-child td, &:last-child th":
                                                                {
                                                                    border: 0,
                                                                },
                                                        }}
                                                    >
                                                        <TableCell
                                                            key={`${roomType.RoomTypeName}-all`}
                                                            component="th"
                                                            scope="row"
                                                            width={50}
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding: "2px",
                                                            }}
                                                            colSpan={
                                                                dates
                                                                    ? dates.length *
                                                                          3 +
                                                                      1
                                                                    : 1
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    width: "40px",
                                                                }}
                                                            ></div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        )
                                    )}

                                {roomTypes && roomsData && reportData ? (
                                    <TableRow
                                        key={"summary"}
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
                                                fontSize: "10px",
                                                padding: "2px",
                                                fontWeight: "bold",
                                            }}
                                            colSpan={2}
                                        >
                                            Нийт
                                        </TableCell>
                                        {dates &&
                                            dates.map((item: any) => (
                                                <>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {}
                                                        {dataGroupedByDate &&
                                                            dataGroupedByDate[
                                                                `${item}T00:00:00`
                                                            ] &&
                                                            formatPrice(
                                                                dataGroupedByDate[
                                                                    `${item}T00:00:00`
                                                                ].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        obj.NormalRate,
                                                                    0
                                                                )
                                                            )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            fontWeight: "bold",
                                                        }}
                                                    ></TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {}
                                                        {dataGroupedByDate &&
                                                            dataGroupedByDate[
                                                                `${item}T00:00:00`
                                                            ] &&
                                                            formatPrice(
                                                                dataGroupedByDate[
                                                                    `${item}T00:00:00`
                                                                ].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        obj.RCAmount,
                                                                    0
                                                                )
                                                            )}
                                                    </TableCell>
                                                </>
                                            ))}
                                    </TableRow>
                                ) : (
                                    <></>
                                )}

                                <TableRow
                                    key={"summary"}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                            fontWeight: "bold",
                                        }}
                                        colSpan={2}
                                    >
                                      {intl.formatMessage({id:"TextTotalNumber"}) }
                                    </TableCell>
                                    {dates &&
                                        dates.map((item: any) => (
                                            <>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "2px",
                                                        fontWeight: "bold",
                                                    }}
                                                    colSpan={3}
                                                    align="center"
                                                >
                                                    {}
                                                    {dataGroupedByDate &&
                                                        dataGroupedByDate[
                                                            `${item}T00:00:00`
                                                        ] &&
                                                        dataGroupedByDate &&
                                                        dataGroupedByDate[
                                                            `${item}T00:00:00`
                                                        ].length}
                                                </TableCell>
                                            </>
                                        ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
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
                            {moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </>
    );
};

export default AvailableRoom;

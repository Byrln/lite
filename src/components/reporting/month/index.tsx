import { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { StayViewSWR, stayViewUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const ReportingList = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const { data: customerData, error: customerError } = CustomerSWR(0);
    const [customerName, setCustomerName]: any = useState("Бүгд");
    const [columns, setColumns]: any = useState();
    const [groupminus1, setGroupminus1]: any = useState();

    const [search, setSearch] = useState({
        CurrDate: moment(dateStringToObj(workingDate)),
    });

    const { data, error } = StayViewSWR(search);
    console.log("data", data);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            .css-ztacej-MuiTableCell-root{
                padding:6px !important
                font-size: 9px !important;
    line-height: 14px;
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

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const generateColumns = (data: any) => {
        const datesSet: any = new Set();

        data.forEach((room: any) => {
            const currDate = new Date(room.CurrDate);
            const dateKey = room.CurrDate;

            datesSet.add(dateKey);
        });

        // Convert the Set back to an array and sort it by date
        const columns = [...datesSet].sort();

        return columns;
    };

    useEffect(() => {
        if (data) {
            setColumns(generateColumns(data));
            let tempData = data.filter(
                (room: any) => room.Sort2 != -1 && room.RoomID != -1
            );

            let groupedRooms: { [key: number]: typeof tempData } =
                tempData.reduce((groups: any, room: any) => {
                    const key = room.RoomID;
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(room);
                    return groups;
                }, {});

            let sortedGroups = Object.values(groupedRooms).sort(
                (a, b) => a[0].Sort1 - b[0].Sort1
            );

            sortedGroups.forEach((group: typeof tempData) => {
                group.sort((a: any, b: any) => {
                    if (a.Sort2 === -1 && b.Sort2 !== -1) {
                        return 1; // Put Sort2 = -1 at the end
                    } else if (a.Sort2 !== -1 && b.Sort2 === -1) {
                        return -1; // Put Sort2 = -1 at the end
                    } else if (a.Sort2 === b.Sort2) {
                        return (
                            new Date(a.CurrDate).getTime() -
                            new Date(b.CurrDate).getTime()
                        );
                    } else {
                        return a.Sort2 - b.Sort2;
                    }
                });
            });

            // Sort rooms within each group by CurrDate
            sortedGroups.forEach((group: typeof tempData) => {
                group.sort(
                    (a: any, b: any) =>
                        new Date(a.CurrDate).getTime() -
                        new Date(b.CurrDate).getTime()
                );
            });
            console.log("data3", sortedGroups);
            setReportData(sortedGroups);

            let groupminus1 = data.filter((room: any) => room.Sort2 == -1);

            groupminus1.sort(
                (a: any, b: any) =>
                    new Date(a.CurrDate).getTime() -
                    new Date(b.CurrDate).getTime()
            );
            setGroupminus1(groupminus1);
            console.log("groupminus1", groupminus1);

            // let tempValue = groupBy(data, "CustomerName");

            // setReportData(tempValue);

            // let tempTotal = 0;
            // {
            //     tempValue &&
            //         Object.keys(tempValue).forEach(
            //             (key) =>
            //                 (tempTotal =
            //                     tempTotal +
            //                     tempValue[key].reduce(
            //                         (acc: any, obj: any) => acc + obj.Balance,
            //                         0
            //                     ))
            //         );
            // }

            // setTotalBalance(tempTotal);
            // setRerenderKey((prevKey) => prevKey + 1);
            // // if (
            // //     search &&
            // //     search.CustomerID &&
            // //     search.CustomerID != "" &&
            // //     search.CustomerID != "0"
            // // ) {
            // //     let customerTempData = customerData.filter(
            // //         (element: any) => element.CustomerID == search.CustomerID
            // //     );
            // //     if (customerTempData.length > 0) {
            // //         setCustomerName(customerTempData[0].CustomerName);
            // //     } else {
            // //         setCustomerName("Бүгд");
            // //     }
            // // } else {
            // //     if (search.CustomerID == "0") {
            // //         setCustomerName("N/A");
            // //     } else {
            // //         setCustomerName("Бүгд");
            // //     }
            // // }
        }
    }, [data]);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),

        CustomerID: yup.string().nullable(),
    });
    const formOptions = {
        defaultValues: {
            StartDate: moment(dateStringToObj(workingDate)).startOf("day"),
            EndDate: moment(dateStringToObj(workingDate))
                .add(1, "months")
                .startOf("day"),
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
                    Хэвлэх
                </Button>

                <CustomSearch
                    listUrl={stayViewUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        setArrivalTime={setArrivalTime}
                        ArrivalTime={ArrivalTime}
                        setDepartureTime={setDepartureTime}
                        DepartureTime={DepartureTime}
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
                    Сарын тайлан
                </Typography>
                <Grid container spacing={2}>
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
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                        }}
                                        key={"№"}
                                    >
                                        №
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                        }}
                                        key={"roomType"}
                                    >
                                        Өрөөний төрөл
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                        }}
                                        key={"room"}
                                    >
                                        Өрөө
                                    </TableCell>
                                    {columns &&
                                        Object.keys(columns).map((key) => (
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "9px",
                                                    lineHeight: "14px",
                                                }}
                                                key={key}
                                            >
                                                {moment(columns[key]).format(
                                                    "MM.DD"
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
                                    reportData.map(
                                        (roomType: any, index: any) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                    }}
                                                    colSpan={1}
                                                >
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                    }}
                                                    colSpan={1}
                                                >
                                                    {roomType[0].RoomTypeName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                    }}
                                                    colSpan={1}
                                                >
                                                    {roomType[0].RoomNo}
                                                </TableCell>
                                                {roomType &&
                                                    roomType.map(
                                                        (
                                                            roomType2: any,
                                                            index: any
                                                        ) => (
                                                            <TableCell
                                                                key={`${roomType2.RoomTypeID}-${roomType2.RoomID}-${roomType2.CurrDate}`}
                                                                component="th"
                                                                scope="row"
                                                                style={{
                                                                    padding:
                                                                        "6px",
                                                                    fontSize:
                                                                        "9px",
                                                                    lineHeight:
                                                                        "14px",
                                                                }}
                                                                colSpan={1}
                                                            >
                                                                {
                                                                    roomType2.CurrName
                                                                }
                                                            </TableCell>
                                                        )
                                                    )}
                                            </TableRow>
                                        )
                                    )}
                                <TableRow
                                    key={"total"}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        key={"1"}
                                        component="th"
                                        scope="row"
                                        style={{
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                        }}
                                        colSpan={3}
                                    ></TableCell>
                                    {groupminus1 &&
                                        groupminus1.map(
                                            (groupminus: any, index: any) => (
                                                <TableCell
                                                    key={index}
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                    }}
                                                    colSpan={1}
                                                >
                                                    {
                                                        groupminus.CurrAll.split(
                                                            "/"
                                                        )[0]
                                                    }
                                                </TableCell>
                                            )
                                        )}
                                </TableRow>
                                {/* {reportData &&
                                    Object.keys(reportData).map(
                                        (key) => (
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
                                                            paddingLeft: "30px",
                                                        }}
                                                        colSpan={11}
                                                    >
                                                        {key}
                                                    </TableCell>
                                                </TableRow>
                                                {reportData[key] &&
                                                    Object.keys(
                                                        reportData[key]
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
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomFullName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .GuestName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .StatusDescription
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Arrival
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Departure
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .SourceName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .FolioNo
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .RateTypeName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Debit
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Paid
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Balance
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    ))}
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
                                                        }}
                                                        align="right"
                                                        colSpan={11}
                                                    >
                                                        {reportData &&
                                                            reportData[key] &&
                                                            formatPrice(
                                                                reportData[
                                                                    key
                                                                ].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        obj.Balance,
                                                                    0
                                                                )
                                                            )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                        // console.log(
                                        //     `${key}: ${reportData[key]}`
                                        // );
                                    )}

                                <TableRow
                                    key={"total"}
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
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={11}
                                    >
                                        {formatPrice(totalBalance)}
                                    </TableCell>
                                </TableRow> */}

                                {/* {reportData &&
                                    reportData.map((row: any) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.calories}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.fat}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.carbs}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.protein}
                                            </TableCell>
                                        </TableRow>
                                    ))} */}
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
                                Хэвлэсэн :{" "}
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
                                Хэвлэсэн огноо :{" "}
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

export default ReportingList;

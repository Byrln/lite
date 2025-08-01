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

import { ReportBalanceSWR, balanceUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const ReportingList = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const { data: customerData, error: customerError } = CustomerSWR({});
    const [customerName, setCustomerName]: any = useState("Бүгд");

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)).startOf("day"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .startOf("day"),
        StartTime: "00:00",
        EndTime: "23:59",
        CustomerID: null,
    });

    const { data, error } = ReportBalanceSWR(search, workingDate);

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
            let tempValue = groupBy(data, "CustomerName");

            setReportData(tempValue);

            let tempTotal = 0;
            {
                tempValue &&
                    Object.keys(tempValue).forEach(
                        (key) =>
                            (tempTotal =
                                tempTotal +
                                tempValue[key].reduce(
                                    (acc: any, obj: any) => acc + obj.Balance,
                                    0
                                ))
                    );
            }
            setTotalBalance(tempTotal);
            setRerenderKey((prevKey) => prevKey + 1);
            if (
                search &&
                search.CustomerID &&
                search.CustomerID != "" &&
                search.CustomerID != "0"
            ) {
                let customerTempData = customerData.filter(
                    (element: any) => element.CustomerID == search.CustomerID
                );
                if (customerTempData.length > 0) {
                    setCustomerName(customerTempData[0].CustomerName);
                } else {
                    setCustomerName("Бүгд");
                }
            } else {
                if (search.CustomerID == "0") {
                    setCustomerName("N/A");
                } else {
                    setCustomerName("Бүгд");
                }
            }
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
                    {intl.formatMessage({ id: "ButtonPrint" })}
                </Button>

                <CustomSearch
                    listUrl={balanceUrl}
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
                    {intl.formatMessage({ id: "TitleReportBalance" })}
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
                                {intl.formatMessage({ id: "ReportStartDate" })}
                            </span>{" "}
                            {moment(search.StartDate, "YYYY-MM-DD").format(
                                "YYYY-MM-DD"
                            ) +
                                " " +
                                (search.StartTime
                                    ? search.StartTime.toString() + ":00"
                                    : "00:00:00")}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                {intl.formatMessage({ id: "ReportEndDate" })}
                            </span>{" "}
                            {moment(search.EndDate, "YYYY-MM-DD").format(
                                "YYYY-MM-DD"
                            ) +
                                " " +
                                (search.EndTime
                                    ? search.EndTime.toString() + ":59"
                                    : "23:59:59")}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                {intl.formatMessage({ id: "TextCustomer" })}
                            </span>{" "}
                            {customerName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                            size="small"
                            key={rerenderKey}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        {intl.formatMessage({
                                            id: "ReportRoomType",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "Left_SortByGuestName",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "Left_SortByStatus",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportArrival",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "RowHeaderDeparture",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportSource",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportFolioNo",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportRateType",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportDebit",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportPaid",
                                        })}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({
                                            id: "ReportBalance",
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
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
                                </TableRow>

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
                                {intl.formatMessage({ id: "ReportPrinted" })}
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
                                {intl.formatMessage({ id: "DateToPrinted" })}
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

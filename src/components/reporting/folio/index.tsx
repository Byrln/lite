import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useIntl } from "react-intl";
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
    Box,
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { CheckedOutDetailedSWR, checkedOutDetailedUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const Folio = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)),
        EndDate: moment(dateStringToObj(workingDate)).add(1, "months"),
    });

    const { data, error } = CheckedOutDetailedSWR(search, workingDate);

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
                background-color: none !important;
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
                                    (acc: any, obj: any) =>
                                        Number(acc) +
                                        Number(obj.PayCash) +
                                        Number(obj.PayInvoice) +
                                        Number(obj.PayBank),
                                    0
                                ))
                    );
            }

            setTotalBalance(tempTotal);
            setRerenderKey((prevKey) => prevKey + 1);
            // if (
            //     search &&
            //     search.CustomerID &&
            //     search.CustomerID != "" &&
            //     search.CustomerID != "0"
            // ) {
            //     let customerTempData = customerData.filter(
            //         (element: any) => element.CustomerID == search.CustomerID
            //     );
            //     if (customerTempData.length > 0) {
            //         setCustomerName(customerTempData[0].CustomerName);
            //     } else {
            //         setCustomerName("Бүгд");
            //     }
            // } else {
            //     if (search.CustomerID == "0") {
            //         setCustomerName("N/A");
            //     } else {
            //         setCustomerName("Бүгд");
            //     }
            // }
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
                    listUrl={checkedOutDetailedUrl}
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
                        p: 1,
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
                             { intl.formatMessage({id:"PaymentLogReport"}) }
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            { intl.formatMessage({id:"ReportingPeriod"}) }
                        </span>{" "}
                        (
                        {search.StartDate &&
                            moment(search.StartDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                        {" - "}
                        {search.EndDate
                            ? moment(search.EndDate, "YYYY.MM.DD").format(
                                  "YYYY.MM.DD"
                              )
                            : " "}
                        )
                    </Typography>
                </Box>

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
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        { intl.formatMessage({id:"ConfigRooms"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                       { intl.formatMessage({id:"TextOrganization"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        { intl.formatMessage({id:"TextSurname"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        { intl.formatMessage({id:"ReportCheckedIn"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                     { intl.formatMessage({id:"TextNights"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                       { intl.formatMessage({id:"ReportCheckedOut"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                      { intl.formatMessage({id:"AmountOfRoom"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        { intl.formatMessage({id:"ServiceAmount"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                      { intl.formatMessage({id:"TotalPayment"}) }
                                    </TableCell>
                                    {/* <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Нийт төлөх (НӨТ-тэй)
                                    </TableCell> */}
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                        colSpan={4}
                                    >
                                         { intl.formatMessage({id:"ConfigPaymentMethod"}) }
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                       { intl.formatMessage({id:"ConfigPaymentclosure"}) }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        { intl.formatMessage({id:"TextCash"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        { intl.formatMessage({id:"ReportInvoice"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"ByCard"}) }
                                    </TableCell>
                                    <TableCell
                                        style={{ fontWeight: "bold" }}
                                        align="right"
                                    >
                                         { intl.formatMessage({id:"A/Receivables"}) }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data &&
                                    data.map(
                                        (element: any, index: number) => (
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
                                                    >
                                                        {element.RoomFullNo}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.CustomerName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.GuestName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.ArrivalDate
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.DepartureDate
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.Departure
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {formatPrice(
                                                            element.RoomCharge
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {formatPrice(
                                                            element.ExtraCharge
                                                        )}
                                                    </TableCell>
                                                    {/* <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.TotalCharge}
                                                    </TableCell> */}
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {formatPrice(
                                                            element.TotalCharge
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {formatPrice(
                                                            element.PayCash
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        align="right"
                                                        scope="row"
                                                    >
                                                        {formatPrice(
                                                            element.PayInvoice
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {formatPrice(
                                                            element.PayBank
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {/* {element.RateTypeName} */}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.RateTypeName}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )


                                    )}

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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          (data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.TotalCharge,
                                              0
                                          ) *
                                              100) /
                                              112
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                Дүн :{" "}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          ((data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.TotalCharge,
                                              0
                                          ) *
                                              100) /
                                              112 /
                                              100) *
                                              10
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                НӨАТ :{" "}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          ((data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.TotalCharge,
                                              0
                                          ) *
                                              100) /
                                              112 /
                                              100) *
                                              2
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                НХАТ :{" "}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.TotalCharge,
                                              0
                                          )
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                 { intl.formatMessage({id:"TextTotalAmount"}) }
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.Discount,
                                              0
                                          )
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                { intl.formatMessage({id:"ReportDiscount"}) }
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            {" "}
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.PayCash,
                                              0
                                          )
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                 { intl.formatMessage({id:"TextCash"}) }
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.PayInvoice,
                                              0
                                          )
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                { intl.formatMessage({id:"ReportInvoice"}) }
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {data && data
                                    ? formatPrice(
                                          data.reduce(
                                              (acc: any, obj: any) =>
                                                  acc + obj.PayBank,
                                              0
                                          )
                                      )
                                    : 0}
                            </div>
                            <div
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                 { intl.formatMessage({id:"ByCard"}) }
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                fontSize: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "600",
                                    width: "100px",
                                    textAlign: "right",
                                }}
                            >
                                {formatPrice(totalBalance)}
                            </div>
                            <span
                                style={{
                                    width: "90px",
                                    textAlign: "right",
                                    marginRight: "11px",
                                }}
                            >
                                 { intl.formatMessage({id:"RowHeaderPaid"}) }
                            </span>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                { intl.formatMessage({id:"ReportPrinted"}) }
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
                                { intl.formatMessage({id:"DateToPrinted"}) }
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

export default Folio;

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
    Box,
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { InterAgencyUrl, interAgencyUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const Folio = ({ title, initialData }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState(initialData);

    const { data, error } = InterAgencyUrl(search);

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
            StartDate: moment(dateStringToObj(initialData.StartDate)).startOf(
                "day"
            ),
            EndDate: moment(dateStringToObj(initialData.EndDate)),
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
                    listUrl={interAgencyUrl}
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
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
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
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Зочны нэр
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Ирэх өдөр
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Гарах өдөр
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Өр.төрөл
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Тооц.№
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Нийт төлбөр
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Бэлэн
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Банк
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Нэхэмжлэх
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Үлдэгдэл
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
                                    Object.keys(reportData).map((key) => (
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
                                                                        .GuestName
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {reportData[
                                                                    key
                                                                ][key2].Arrival
                                                                    ? moment(
                                                                          reportData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .Arrival
                                                                      ).format(
                                                                          "YYYY-MM-DD"
                                                                      )
                                                                    : ""}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {reportData[
                                                                    key
                                                                ][key2]
                                                                    .Departure
                                                                    ? moment(
                                                                          reportData[
                                                                              key
                                                                          ][
                                                                              key2
                                                                          ]
                                                                              .Departure
                                                                      ).format(
                                                                          "YYYY-MM-DD"
                                                                      )
                                                                    : ""}
                                                            </TableCell>
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
                                                                        .FolioNo
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
                                                                        .CashAmount
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
                                                                        .BankAmount
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
                                                                        .InvoiceAmount
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
                                                    colSpan={5}
                                                >
                                                    Нийт:
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
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
                                                                    obj.Debit,
                                                                0
                                                            )
                                                        )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
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
                                                                    obj.CashAmount,
                                                                0
                                                            )
                                                        )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
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
                                                                    obj.BankAmount,
                                                                0
                                                            )
                                                        )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
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
                                                                    obj.InvoiceAmount,
                                                                0
                                                            )
                                                        )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
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
                                    ))}

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
                                        colSpan={5}
                                    >
                                        Бүгд:
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        {data &&
                                            formatPrice(
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.Debit,
                                                    0
                                                )
                                            )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        {data &&
                                            formatPrice(
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.CashAmount,
                                                    0
                                                )
                                            )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        {data &&
                                            formatPrice(
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.BankAmount,
                                                    0
                                                )
                                            )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        {data &&
                                            formatPrice(
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.InvoiceAmount,
                                                    0
                                                )
                                            )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        {data &&
                                            formatPrice(
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.Balance,
                                                    0
                                                )
                                            )}
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

export default Folio;

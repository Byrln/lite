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

import { CheckedOutDetailedSWR, checkedOutDetailedUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import { TransactionInfoSWR } from "lib/api/front-office";
import { ChargeAPI } from "lib/api/charge";

const Receipt = ({ TransactionID }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [summary, setSummary]: any = useState(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        TransactionID: TransactionID,
    });

    const reloadReservationData = async () => {
        var res = await ChargeAPI.summary(TransactionID);

        setSummary(res.data.JsonData[0]);
    };

    useEffect(() => {
        reloadReservationData();
    }, [TransactionID]);

    const { data, error } = TransactionInfoSWR(search);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            .MuiTableCell-root{
                border:1px solid !important;
                font-size:11px !important;
                line-height:11px !important
                padding:4px !important

              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px solid !important;
                background-color: none !important;
                color :inherit !important;
                font-size:11px !important;
                line-height:11px !important;
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
    console.log("data", data);
    console.log("summary", summary);

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
            </div>
            {data && data[0] && (
                <div ref={componentRef} style={{ fontSize: "11px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    ROOM TYPE :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {data[0].RoomTypeName}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    ROOM NUM :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {data[0].RoomNo}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <br />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    ORG/COMP :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {data[0].CustomerName}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    FULL NAME :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {data[0].GuestName}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    CHECK IN :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {moment(data[0].ArrivalDate).format(
                                        "YYYY/MM/DD"
                                    )}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    NIGHTS :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {data[0].Nights}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    CHECK OUT :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {moment(data[0].DepartureDate).format(
                                        "YYYY/MM/DD"
                                    )}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6} style={{ marginBottom: "0px" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mb-1"
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    USD RATE :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {formatPrice(1450)}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6} style={{ marginBottom: "0px" }}>
                            <div style={{ fontWeight: "600" }}>
                                ROOM RATE : {formatPrice(90)}$ [-40%]=
                                {formatPrice(54)}$
                            </div>
                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: "0px" }}>
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
                                            }}
                                        >
                                            SERVICE
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            AMOUNT (₮)
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            Amount ($)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        key={"RoomCharge"}
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
                                                fontSize: "11px",
                                            }}
                                        >
                                            Room Charge
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "11px",
                                            }}
                                        >
                                            {summary &&
                                                formatPrice(
                                                    summary.RoomCharges
                                                )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "11px",
                                            }}
                                        >
                                            {summary &&
                                                formatPrice(
                                                    summary.RoomCharges
                                                )}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow
                                        key={"RoomCharge"}
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
                                                fontSize: "11px",
                                            }}
                                        >
                                            Extra Charge
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "11px",
                                            }}
                                        >
                                            {summary &&
                                                formatPrice(
                                                    summary.ExtraCharges
                                                )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "11px",
                                            }}
                                        >
                                            {summary &&
                                                formatPrice(
                                                    summary.ExtraCharges
                                                )}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow
                                        key={"subTotal"}
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
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            SUB TOTAL
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(78300)}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(54)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={"tax"}
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
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            TAX (10%)
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(78300)}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(54)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={"deposit"}
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
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            DEPOSIT
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(78300)}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(54)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={"payment"}
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
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            PAYMENT
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary && summary.TotalPayments
                                            )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary && summary.TotalPayments
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow
                                        key={"payment"}
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
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            Balance
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary && summary.Balance
                                            )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary && summary.Balance
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </div>
            )}
        </>
    );
};

export default Receipt;

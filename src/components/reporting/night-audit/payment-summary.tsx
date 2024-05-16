import { useState, useEffect } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
} from "@mui/material";

import { ReportAPI } from "lib/api/report";
import { formatPrice } from "lib/utils/helpers";

const PaymentSummary = ({ search, rerenderKey }: any) => {
    const [PaymentSummaryData, setPaymentSummaryData]: any = useState(null);
    const [PaymentSummaryData2, setPaymentSummaryData2]: any = useState(null);

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    useEffect(() => {
        (async () => {
            if (search) {
                let rawPaymentSummaryData =
                    await ReportAPI.nightAuditPaymentSummary(search);
                setPaymentSummaryData(rawPaymentSummaryData);

                let tempValue = groupBy(
                    rawPaymentSummaryData,
                    "PaymentMethodName"
                );

                setPaymentSummaryData2(tempValue);
            }
        })();
    }, [search]);

    return (
        <>
            <Typography variant="body1" gutterBottom className="mr-1">
                <span
                    style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                    }}
                >
                    Төлбөрийн хураангуй :
                </span>
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Table aria-label="summary" size="small" key={rerenderKey}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Хэрэглэгч
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Төлбөрийн хэлбэр
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Валют
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Дүн
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {PaymentSummaryData &&
                                PaymentSummaryData.map((item: any) => (
                                    <>
                                        <TableRow
                                            key={item.TransactionID}
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
                                            >
                                                {item.UserName}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                                {item.PaymentMethodName}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                                {item.CurrencyCode}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                                {formatPrice(item.AmountPosted)}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                </Grid>

                <Grid item xs={1}></Grid>

                <Grid item xs={4}>
                    <Table aria-label="summary" size="small" key={rerenderKey}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Төлбөрийн хэлбэр
                                </TableCell>

                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Дүн
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {PaymentSummaryData2 &&
                                Object.keys(PaymentSummaryData2).map((key) => (
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
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {key}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        >
                                            {PaymentSummaryData2[key] &&
                                                formatPrice(
                                                    PaymentSummaryData2[
                                                        key
                                                    ].reduce(
                                                        (acc: any, obj: any) =>
                                                            acc +
                                                            (obj.AmountPosted
                                                                ? obj.AmountPosted
                                                                : 0),
                                                        0
                                                    )
                                                )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentSummary;

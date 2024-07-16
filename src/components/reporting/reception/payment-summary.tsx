import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
} from "@mui/material";
import { formatPrice } from "lib/utils/helpers";

import { ReportAPI } from "lib/api/report";

const Summary = ({ sessionId }: any) => {
    const intl = useIntl();
    const [summaryData, setSummaryData]: any = useState();
    const [summaryGroupedData, setSummaryGroupedData]: any = useState();

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
            if (sessionId) {
                let rawSummaryData = await ReportAPI.receptionPaymentSummary(
                    sessionId
                );
                let tempValue = groupBy(rawSummaryData, "PaymentMethodName");

                setSummaryData(rawSummaryData);
                setSummaryGroupedData(tempValue);
            }
        })();
    }, [sessionId]);

    return (
        <>
            <Typography variant="body1" gutterBottom className="mr-1">
                <span
                    style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                    }}
                >
                     {intl.formatMessage({id:"ReportPaymentSummary"}) }
                </span>
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Table aria-label="summary" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                   {intl.formatMessage({id:"ConfigUser"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ConfigPaymentMethod"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ReportCurrency"}) }
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                 {intl.formatMessage({id:"ReportAmount"}) }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summaryData &&
                                summaryData.map((entity: any, index: any) => (
                                    <TableRow
                                        key={`any`}
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
                                            {entity.UserName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.PaymentMethodName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.CurrencyCode}
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
                                            {formatPrice(entity.AmountPosted)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={4}>
                    <Table aria-label="summary" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ConfigPaymentMethod"}) }
                                </TableCell>

                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                     {intl.formatMessage({id:"ReportAmount"}) }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summaryGroupedData &&
                                Object.keys(summaryGroupedData).map((key) => (
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
                                            {formatPrice(
                                                summaryGroupedData[key].reduce(
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
                            <TableRow
                                key="total"
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
                                >
                                    {intl.formatMessage({id:"ReportSum"}) }
                                </TableCell>

                                <TableCell
                                    component="th"
                                    scope="row"
                                    style={{
                                        fontSize: "10px",
                                        padding: "2px",
                                        fontWeight: "bold",
                                    }}
                                    align="right"
                                >
                                    {summaryData &&
                                        formatPrice(
                                            summaryData.reduce(
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
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </>
    );
};

export default Summary;

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
import moment from "moment";

import { ReportAPI } from "lib/api/report";

const RoomCharge = ({ sessionId }: any) => {
    const [data, setData]: any = useState();
    const intl = useIntl();
    const [groupedData, setGroupedData]: any = useState();

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
                let rawSummaryData = await ReportAPI.receptionRoomCharge(
                    sessionId
                );
                let tempValue = groupBy(rawSummaryData, "PaymentMethodName");

                setData(rawSummaryData);
                setGroupedData(tempValue);
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
                  {intl.formatMessage({id:"ReportRoomCharge"}) }
                </span>
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
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
                                   {intl.formatMessage({id:"TextRoomandType"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                   {intl.formatMessage({id:"ReportStayDate"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ReportRoomCharge"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                   {intl.formatMessage({id:"Left_SortByGuestName"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ReportCompany"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                  {intl.formatMessage({id:"ReportRateType"}) }
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ReportNormalRate"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                    align="right"
                                >
                                   {intl.formatMessage({id:"ReportOfferedRate"}) }
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                   {intl.formatMessage({id:"ReportDifference"}) }
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    {intl.formatMessage({id:"ReportCheckedInBy"}) }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.map((entity: any, index: any) => (
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
                                        >
                                            {entity.RoomFullName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {moment(entity.StayDate).format(
                                                "YYYY-MM-DD hh:mm:ss"
                                            )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.RoomChargeTypeName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.GuestName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.CustomerName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.RateTypeName}
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
                                            {formatPrice(entity.NormalRate)}
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
                                            {formatPrice(entity.RCAmount)}
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
                                            {formatPrice(entity.DiffAmount)}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.CheckedInUser}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            <TableRow
                                key={`total`}
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
                                    }}
                                ></TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    style={{
                                        fontSize: "10px",
                                        padding: "2px",
                                    }}
                                >
                                    Нийт
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
                                    {data && data.length}
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
                                ></TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    style={{
                                        fontSize: "10px",
                                        padding: "2px",
                                        fontWeight: "bold",
                                    }}
                                    align="right"
                                ></TableCell>
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
                                    {data &&
                                        formatPrice(
                                            data.reduce(
                                                (acc: any, obj: any) =>
                                                    acc +
                                                    (obj.NormalRate
                                                        ? Number(obj.NormalRate)
                                                        : 0),
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
                                    align="right"
                                >
                                    {data &&
                                        formatPrice(
                                            data.reduce(
                                                (acc: any, obj: any) =>
                                                    acc +
                                                    (obj.RCAmount
                                                        ? Number(obj.RCAmount)
                                                        : 0),
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
                                    align="right"
                                >
                                    {data &&
                                        formatPrice(
                                            data.reduce(
                                                (acc: any, obj: any) =>
                                                    acc +
                                                    (obj.DiffAmount
                                                        ? Number(obj.DiffAmount)
                                                        : 0),
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
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </>
    );
};

export default RoomCharge;

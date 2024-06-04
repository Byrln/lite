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
import { formatPrice } from "lib/utils/helpers";
import moment from "moment";

import { ReportAPI } from "lib/api/report";

const CheckedOut = ({ sessionId }: any) => {
    const [data, setData]: any = useState();
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
                let rawSummaryData = await ReportAPI.receptionCheckedOut(
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
                    Гарсан :
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
                                    Өрөө/төрөл
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Зочны нэр
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Ирэх өдөр
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Гарах өдөр
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Хоног
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Өрөөний тооцоо
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Нэмэлт тооцоо
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                    align="right"
                                >
                                    Хөнгөлөлт
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Төлсөн
                                </TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Үлдэгдэл
                                </TableCell>
                                <TableCell
                                    style={{
                                        fontWeight: "bold",
                                        padding: "2px",
                                        fontSize: "10px",
                                    }}
                                >
                                    Гаргасан
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
                                            {moment(
                                                entity.CheckedInDate
                                            ).format("YYYY-MM-DD hh/mm/ss")}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {moment(
                                                entity.CheckedOutDate
                                            ).format("YYYY-MM-DD hh/mm/ss")}
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
                                            {entity.Nights}
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
                                            {formatPrice(entity.Charge1Amount)}
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
                                            {formatPrice(entity.Charge2Amount)}
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
                                            {formatPrice(entity.Discount)}
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
                                            {formatPrice(entity.PayAmount)}
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
                                            {formatPrice(entity.Balance)}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "10px",
                                                padding: "2px",
                                            }}
                                        >
                                            {entity.CheckedOutUser}
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
                                    Нийт:
                                </TableCell>
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
                                >
                                    {data &&
                                        formatPrice(
                                            data.reduce(
                                                (acc: any, obj: any) =>
                                                    acc +
                                                    (obj.Charge1Amount
                                                        ? obj.Charge1Amount
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
                                                    (obj.Charge2Amount
                                                        ? obj.Charge2Amount
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
                                                    (obj.Discount
                                                        ? obj.Discount
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
                                                    (obj.PayAmount
                                                        ? obj.PayAmount
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
                                                    (obj.Balance
                                                        ? obj.Balance
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

export default CheckedOut;

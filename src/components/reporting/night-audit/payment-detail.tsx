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
import moment from "moment";

import { ReportAPI } from "lib/api/report";
import { formatPrice } from "lib/utils/helpers";

const PaymentDetail = ({ search, rerenderKey }: any) => {
    const [PaymentDetailData, setPaymentDetailData]: any = useState(null);

    useEffect(() => {
        (async () => {
            if (search) {
                let rawPaymentSummaryData =
                    await ReportAPI.nightAuditPaymentDetail(search);
                setPaymentDetailData(rawPaymentSummaryData);
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
                    Тооцооны хуудас :
                </span>
            </Typography>

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
                            align="center"
                        >
                            Тооц.№
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
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                            Дүн (бусад)
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
                            Хэрэглэгч
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                            Оруулсан
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {PaymentDetailData &&
                        PaymentDetailData.map((item: any) => (
                            <>
                                <TableRow
                                    key={item.TransactionID}
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
                                    >
                                        {item.RoomFullName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.GuestName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                        align="center"
                                    >
                                        {item.FolioNo}
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
                                        {formatPrice(item.AmountCalculated)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.AdditionalNote}
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
                                        {moment(item.CreatedDate).format(
                                            "YYYY-MM-DD hh:mm:ss"
                                        )}
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}

                    <TableRow
                        sx={{
                            "&:last-child td, &:last-child th": {
                                border: 0,
                            },
                        }}
                    >
                        <TableCell
                            align="right"
                            component="th"
                            scope="row"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                                fontWeight: "bold",
                            }}
                            colSpan={3}
                        >
                            Нийт :
                        </TableCell>
                        <TableCell
                            component="th"
                            scope="row"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                            colSpan={5}
                        >
                            {PaymentDetailData &&
                                formatPrice(
                                    PaymentDetailData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.AmountCalculated
                                                ? obj.AmountCalculated
                                                : 0),
                                        0
                                    )
                                )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
};

export default PaymentDetail;

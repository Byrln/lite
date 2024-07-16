import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import moment from "moment";

import { ReportAPI } from "lib/api/report";
import { formatPrice } from "lib/utils/helpers";

const CheckedOut = ({ search, rerenderKey }: any) => {
    const intl = useIntl();
    const [checkedOutData, setCheckedOutData]: any = useState(null);

    useEffect(() => {
        (async () => {
            if (search) {
                let rawCheckedOutData = await ReportAPI.nightAuditCheckedOut(
                    search
                );
                setCheckedOutData(rawCheckedOutData);
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
                   { intl.formatMessage({id:"ReportCheckedOut"}) } 
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
                           { intl.formatMessage({id:"ReportRoomAndType"}) } 
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           { intl.formatMessage({id:"ReportCompany"}) } 
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportCountry"}) } 
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportSource"}) } 
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           { intl.formatMessage({id:"ReportGuestName"}) }
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportArrivalDate"}) }
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportDepartureDate"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           { intl.formatMessage({id:"ReportTotalCharge"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           { intl.formatMessage({id:"ReportRoomCharge"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ConfigExtraCharges"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           { intl.formatMessage({id:"ReportDiscount"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportTotalPaid"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                              { intl.formatMessage({id:"ReportCash"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             { intl.formatMessage({id:"ReportBank"}) }
                        </TableCell>
                        <TableCell
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                            { intl.formatMessage({id:"ReportInvoice"}) }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {checkedOutData &&
                        checkedOutData.map((item: any) => (
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
                                        {item.CustomerName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.CountryName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.ReservationSourceName}
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
                                    >
                                        {moment(item.CheckedInDate).format(
                                            "MM/DD/YYYY"
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
                                        {moment(item.CheckedOutDate).format(
                                            "MM/DD/YYYY"
                                        )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {formatPrice(item.ChargeAmount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {formatPrice(item.Charge1Amount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {formatPrice(item.Charge2Amount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {formatPrice(item.Discount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {formatPrice(item.PayAmount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.PayCash != null
                                            ? formatPrice(item.PayCash)
                                            : ""}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.PayBank != null
                                            ? formatPrice(item.PayBank)
                                            : ""}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.PayInvoice != null
                                            ? formatPrice(item.PayInvoice)
                                            : ""}
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
                                fontSize: "10px",
                                padding: "2px",
                            }}
                            colSpan={6}
                            align="right"
                        >
                            Нийт :{" "}
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
                            {checkedOutData && checkedOutData.length}
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
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.ChargeAmount
                                                ? obj.ChargeAmount
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
                            }}
                            align="right"
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
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
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
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
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.Discount ? obj.Discount : 0),
                                        0
                                    )
                                )}
                        </TableCell>
                        <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.PayAmount ? obj.PayAmount : 0),
                                        0
                                    )
                                )}
                        </TableCell>
                        <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.PayCash ? obj.PayCash : 0),
                                        0
                                    )
                                )}
                        </TableCell>
                        <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.PayBank ? obj.PayBank : 0),
                                        0
                                    )
                                )}
                        </TableCell>
                        <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{
                                fontSize: "10px",
                                padding: "2px",
                            }}
                        >
                            {checkedOutData &&
                                formatPrice(
                                    checkedOutData.reduce(
                                        (acc: any, obj: any) =>
                                            acc +
                                            (obj.PayInvoice
                                                ? obj.PayInvoice
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

export default CheckedOut;

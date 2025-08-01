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

import { ReportAPI } from "lib/api/report";
import { formatPrice } from "lib/utils/helpers";

const RoomCharge = ({ search, rerenderKey }: any) => {
    const intl = useIntl();
    const [roomChargeData, setRoomChargeData]: any = useState(null);

    useEffect(() => {
        (async () => {
            if (search) {
                let rawRoomChargeData = await ReportAPI.nightAuditRoomCharge(
                    search
                );
                setRoomChargeData(rawRoomChargeData);
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
                    {intl.formatMessage({id:"ReportRoomCharge"}) }
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
                          {intl.formatMessage({id:"ReportRoomAndType"}) }
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                             {intl.formatMessage({id:"ReportSum"}) }
                        </TableCell>
                        <TableCell
                            align="center"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                            {intl.formatMessage({id:"ReportFolioNo"}) }
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
                            align="right"
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
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
                    {roomChargeData &&
                        roomChargeData.map((item: any) => (
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
                                        {item.RoomChargeTypeName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.FolioNo}
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
                                        {item.RateTypeName}
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
                                        {formatPrice(item.NormalRate)}
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
                                        {formatPrice(item.RCAmount)}
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
                                        {formatPrice(item.DiffAmount)}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        {item.CheckedInUser}
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                </TableBody>
            </Table>
        </>
    );
};

export default RoomCharge;

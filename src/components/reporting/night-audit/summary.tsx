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

const Summary = ({ search, rerenderKey }: any) => {
    const intl = useIntl();
    const [summaryData, setSummaryData]: any = useState();

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
                let rawSummaryData = await ReportAPI.nightAuditSummary(search);
                let tempValue = groupBy(rawSummaryData, "GroupName");
                setSummaryData(tempValue);
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
                     {intl.formatMessage({id:"RowHeaderSummary"}) }
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
                        ></TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           {intl.formatMessage({id:"ConfigRooms"}) }
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           {intl.formatMessage({id:"ReportAdult"}) }
                        </TableCell>
                        <TableCell
                            style={{
                                fontWeight: "bold",
                                padding: "2px",
                                fontSize: "10px",
                            }}
                        >
                           {intl.formatMessage({id:"ReportChild"}) }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summaryData &&
                        Object.keys(summaryData).map((key) => (
                            <>
                                <TableRow
                                    key={key}
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
                                        colSpan={4}
                                    >
                                        {key}
                                    </TableCell>
                                </TableRow>
                                {summaryData[key] &&
                                    Object.keys(summaryData[key]).map(
                                        (key2, index) => (
                                            <TableRow
                                                key={`${key}-${index}`}
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
                                                    {
                                                        summaryData[key][key2]
                                                            .ItemName
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    {
                                                        summaryData[key][key2]
                                                            .Rooms
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    {
                                                        summaryData[key][key2]
                                                            .Adult
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    {
                                                        summaryData[key][key2]
                                                            .Child
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                            </>
                        ))}
                </TableBody>
            </Table>
        </>
    );
};

export default Summary;

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
import { ReportAPI } from "lib/api/report";

const Receipt = ({ FolioID, language }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [summary, setSummary]: any = useState(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        FolioID: FolioID,
    });

    const reloadReservationData = async () => {
        var res = await ReportAPI.invoice(FolioID);
        setSummary(res);
    };

    useEffect(() => {
        reloadReservationData();
    }, [FolioID]);

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
            {summary && (
                <div ref={componentRef} style={{ fontSize: "11px" }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}>
                            <Typography
                                variant="h6"
                                style={{ fontWeight: "bold" }}
                            >
                                {summary[0] && summary[0].HotelName}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={11}>
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
                                        width: "90px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    Хаяг :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].Address1}
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
                                        width: "90px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    Утас :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].ReservePhone}
                                </div>

                                <div
                                    style={{
                                        width: "90px",
                                        textAlign: "right",
                                        marginRight: "11px",
                                    }}
                                >
                                    И-Мэйл :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].ReserveEmail}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                Нэхэмжлэх
                            </Typography>
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
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].GuestName}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Зах.№ :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].ReservationNo}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Фолио.№ :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].FolioNo}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Нэхэмж.Огноо :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {moment().format("YYYY-MM-DD HH:mm:SS")}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    И-мэйл :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].Email}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Утас :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].Phone}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Хаяг :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].Address}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Ирэх өдөр :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] &&
                                        moment(summary[0].ArrivalDate).format(
                                            "YYYY-MM-DD HH:mm:SS"
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Гарах өдөр :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] &&
                                        moment(summary[0].DepartureDate).format(
                                            "YYYY-MM-DD HH:mm:SS"
                                        )}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Өр.төрөл :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].RoomFullName}
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
                                        width: "90px",
                                        textAlign: "left",
                                        marginRight: "11px",
                                    }}
                                >
                                    Өд.тариф :{" "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] &&
                                        formatPrice(summary[0].DailyRate)}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
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
                                            Огноо
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            Барааны нэр
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            Дүн
                                        </TableCell>
                                        {/* <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            Төлбөр
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "11px",
                                            }}
                                        >
                                            Үлдэгдэл
                                        </TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {summary &&
                                        summary.map(
                                            (entity: any, index: any) => {
                                                return entity.PayAmount ? (
                                                    <></>
                                                ) : (
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
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {moment(
                                                                entity.CurrDate
                                                            ).format(
                                                                "YYYY-MM-DD "
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {entity.ItemName}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                entity.ChargeAmountNoTax
                                                            )}
                                                        </TableCell>
                                                        {/* <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                entity.PayAmount
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                entity.RunningTotalAmount
                                                            )}
                                                        </TableCell> */}
                                                    </TableRow>
                                                );
                                            }
                                        )}

                                    <TableRow
                                        key={"total"}
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
                                            colSpan={5}
                                            align="right"
                                        >
                                            {/* <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {formatPrice(
                                                    summary.reduce(
                                                        (acc: any, obj: any) =>
                                                            acc +
                                                            obj.ChargeAmount,
                                                        0
                                                    )
                                                )}
                                            </span>
                                            <br /> */}
                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                Үйлчилгээ :{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {formatPrice(
                                                    summary[0]
                                                        .ServiceChargeNoTax
                                                )}
                                            </span>
                                            <br />

                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                {summary[0] &&
                                                    summary[0].TaxName1}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {summary[0] &&
                                                    formatPrice(
                                                        summary[0].Tax1
                                                    )}
                                            </span>

                                            {summary[0] &&
                                                summary[0].TaxName2 &&
                                                summary[0].TaxName2 && (
                                                    <>
                                                        <br />{" "}
                                                        <span
                                                            style={{
                                                                width: "90px",
                                                                textAlign:
                                                                    "left",
                                                                marginRight:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {summary[0] &&
                                                                summary[0]
                                                                    .TaxName2 &&
                                                                summary[0]
                                                                    .TaxName2}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    "600",
                                                            }}
                                                        >
                                                            {summary[0] &&
                                                            summary[0].Tax2 &&
                                                            summary[0].Tax2 > 0
                                                                ? formatPrice(
                                                                      summary[0]
                                                                          .Tax2
                                                                  )
                                                                : ""}
                                                        </span>
                                                    </>
                                                )}

                                            <br />
                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                Нийт :{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {formatPrice(
                                                    summary.reduce(
                                                        (acc: any, obj: any) =>
                                                            acc +
                                                            obj.ChargeAmount,
                                                        0
                                                    )
                                                )}
                                            </span>
                                            {/* <br />
                                            {summary &&
                                                summary.map(
                                                    (
                                                        entity: any,
                                                        index: any
                                                    ) => {
                                                        return entity.PayAmount ? (
                                                            <>
                                                                <span
                                                                    style={{
                                                                        width: "90px",
                                                                        textAlign:
                                                                            "left",
                                                                        marginRight:
                                                                            "11px",
                                                                    }}
                                                                >
                                                                    {
                                                                        entity.ItemName
                                                                    }{" "}
                                                                    :{" "}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontWeight:
                                                                            "600",
                                                                    }}
                                                                >
                                                                    {
                                                                        entity.PayAmount
                                                                    }{" "}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        );
                                                    }
                                                )} */}
                                            <br />
                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                Төлбөр :{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {formatPrice(
                                                    summary.reduce(
                                                        (acc: any, obj: any) =>
                                                            acc + obj.PayAmount,
                                                        0
                                                    )
                                                )}
                                            </span>
                                            <br />
                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                Үлдэгдэл :{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {summary &&
                                                    summary.length > 0 &&
                                                    formatPrice(
                                                        summary[
                                                            summary.length - 1
                                                        ].RunningTotalAmount
                                                    )}
                                            </span>
                                        </TableCell>

                                        {/* <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "11px",
                                            }}
                                            colSpan={2}
                                            align="right"
                                        >
                                            {summary &&
                                                summary.map(
                                                    (
                                                        entity: any,
                                                        index: any
                                                    ) => {
                                                        return entity.PayAmount ? (
                                                            <>
                                                                <span
                                                                    style={{
                                                                        width: "90px",
                                                                        textAlign:
                                                                            "left",
                                                                        marginRight:
                                                                            "11px",
                                                                    }}
                                                                >
                                                                    {
                                                                        entity.ItemName
                                                                    }{" "}
                                                                    :{" "}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontWeight:
                                                                            "600",
                                                                    }}
                                                                >
                                                                    {
                                                                        entity.PayAmount
                                                                    }{" "}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        );
                                                    }
                                                )}
                                            <br />
                                            <span
                                                style={{
                                                    width: "90px",
                                                    textAlign: "left",
                                                    marginRight: "11px",
                                                }}
                                            >
                                                Үлдэгдэл :{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {summary &&
                                                    summary.length > 0 &&
                                                    summary[summary.length - 1]
                                                        .RunningTotalAmount}
                                            </span>
                                        </TableCell> */}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={6}>
                            Зочны гарын үсэг : ......................
                        </Grid>
                        <Grid item xs={6}>
                            Гарын үсэг : ......................
                        </Grid>
                    </Grid>
                </div>
            )}
        </>
    );
};

export default Receipt;

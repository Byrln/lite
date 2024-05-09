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
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { formatPrice } from "lib/utils/helpers";
import { ReportAPI } from "lib/api/report";

const Invoice = ({ FolioID, Lang }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [summary, setSummary]: any = useState(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        FolioID: FolioID,
    });

    const reloadReservationData = async () => {
        var res = await ReportAPI.invoiceDetailed({
            FolioID: FolioID,
            Lang: Lang,
            IsInvoice: true,
        });
        setSummary(res);
    };

    useEffect(() => {
        reloadReservationData();
    }, [FolioID]);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
              font-size:10px;
            }
            .MuiTableCell-root{
                border:1px solid !important;
                font-size:9px !important;
                line-height:9px !important
                padding:4px !important

              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px solid !important;
                background-color: none !important;
                color :inherit !important;
                font-size:9px !important;
                line-height:9px !important;
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
                <div ref={componentRef} style={{ fontSize: "9px" }}>
                    <Grid container spacing={1}>
                        {summary[0] &&
                        summary[0].FormHeaderUse &&
                        summary[0].FormHeaderUse == true ? (
                            <>
                                {" "}
                                <img
                                    src={
                                        summary[0].FormHeaderPictureFile &&
                                        summary[0].FormHeaderPictureFile
                                    }
                                    alt="login"
                                    style={{
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </>
                        ) : (
                            <>
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
                                                marginRight: "9px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Хаяг : "
                                                : "Address : "}
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
                                                marginRight: "9px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Утас : "
                                                : "Phone : "}
                                        </div>
                                        <div style={{ fontWeight: "600" }}>
                                            {summary[0] &&
                                                summary[0].ReservePhone}
                                        </div>

                                        <div
                                            style={{
                                                width: "90px",
                                                textAlign: "right",
                                                marginRight: "9px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "И-Мэйл : "
                                                : "E-mail : "}
                                        </div>
                                        <div style={{ fontWeight: "600" }}>
                                            {summary[0] &&
                                                summary[0].ReserveEmail}
                                        </div>
                                    </Box>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                {Lang == "MN" ? "Нэхэмжлэх : " : "Invoice : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Зах.№ : " : "Res.No : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Фолио.№ : "
                                        : "Folio.No : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Нэхэмж.Огноо : "
                                        : "Res.Date : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "И-мэйл : " : "E-Mail : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Утас : " : "Phone : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Хаяг : " : "Address : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Ирэх өдөр : "
                                        : "Arrival Date : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Гарах өдөр : "
                                        : "Departure Date : "}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Өрөөний төрөл : "
                                        : "Room Type : "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].RoomTypeName}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Өрөө : " : "Room.No : "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] && summary[0].RoomNo}
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
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN"
                                        ? "Өд.тариф : "
                                        : "Daily Rate : "}
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {summary[0] &&
                                        `${formatPrice(summary[0].DailyRate)}`}
                                    {summary[0].Discount &&
                                        `[-${
                                            (summary[0].DailyRate *
                                                summary[0].Discount) /
                                            100
                                        }%]=${formatPrice(
                                            summary[0].DailyRate -
                                                summary[0].Discount
                                        )}`}
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
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Огноо : "
                                                : "Date : "}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Барааны нэр : "
                                                : "Item Name : "}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Дүн : "
                                                : "Amount : "}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Төлбөр : "
                                                : "Payment : "}
                                        </TableCell>
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
                                                                fontSize: "9px",
                                                                padding: "2px",
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
                                                                fontSize: "9px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.ItemName}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize: "9px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                entity.ChargeNoTaxAmount
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize: "9px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                entity.PayAmount
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}

                                    {summary[0].ServiceChargeNoTax ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Үйлчилгээ : "
                                                    : "Service Charge : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0]
                                                        .ServiceChargeNoTax
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].ShowRestaurant ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Ресторан : "
                                                    : "Restaurant : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].RestaurantNoTax
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].TotalAmountNoTax ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Нийт (Таксгүй) : "
                                                    : "Total (No Tax) : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].TotalAmountNoTax
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].Tax1Amount ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                VAT :
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].Tax1Amount
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].Tax2Amount ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                City Tax :
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].Tax2Amount
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].TotalAmount ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    fontWeight: "bold",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Нийт : "
                                                    : "Total : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    fontWeight: "bold",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].TotalAmount
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].CashAmount ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Бэлнээр : "
                                                    : "Cash : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].CashAmount
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    {summary[0].BankAmount ? (
                                        <TableRow
                                            key={"Service"}
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
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {Lang == "MN"
                                                    ? "Банкаар : "
                                                    : "Bank : "}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "9px",
                                                    padding: "2px",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    summary[0].BankAmount
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <></>
                                    )}

                                    <TableRow
                                        key={"Service"}
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
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        ></TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                fontWeight: "bold",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        >
                                            {Lang == "MN"
                                                ? "Нийт төлбөр : "
                                                : "Total Payment : "}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        ></TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                fontWeight: "bold",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary[0].TotalPayAmount
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow
                                        key={"Service"}
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
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                        ></TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                fontWeight: "bold",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        >
                                            {Lang == "MN"
                                                ? "Invoice : "
                                                : "Invoice : "}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        ></TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{
                                                fontSize: "9px",
                                                fontWeight: "bold",
                                                padding: "2px",
                                            }}
                                            align="right"
                                        >
                                            {formatPrice(
                                                summary[0].TotalAmount -
                                                    summary[0].TotalPayAmount
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={6}>
                            {Lang == "MN"
                                ? "Зочны гарын үсэг : "
                                : "Guest Signature : "}
                            ......................
                        </Grid>
                        <Grid item xs={6}>
                            {Lang == "MN" ? "Гарын үсэг : " : "Signature : "} :
                            ......................
                        </Grid>

                        {summary[0] &&
                        summary[0].FormFooterUse &&
                        summary[0].FormFooterUse == true ? (
                            <>
                                {" "}
                                <img
                                    src={
                                        summary[0].FormFooterPictureFile &&
                                        summary[0].FormFooterPictureFile
                                    }
                                    alt="login"
                                    style={{
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </Grid>
                </div>
            )}
        </>
    );
};

export default Invoice;

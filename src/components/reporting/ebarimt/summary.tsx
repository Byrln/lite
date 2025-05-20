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
// @ts-expect-error: No type declarations for 'qrcode'
import QRCode from "qrcode";

const ReceiptSummary = ({ eBarimtData, Lang }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [summary, setSummary]: any = useState(null);
    const [rerenderKey, setRerenderKey] = useState(0);

    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        QRCode.toDataURL(
            eBarimtData && eBarimtData[0] && eBarimtData[0].QrData,
            { errorCorrectionLevel: "H" },
            (err: any, url: string) => {
                if (!err) setImgUrl(url);
            }
        );
    }, [eBarimtData]);

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
    console.log("eBarimtData", eBarimtData);
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
            {eBarimtData && (
                <div ref={componentRef} style={{ fontSize: "10px" }}>
                    <div className="my-3 mx-3">
                        <Grid container spacing={1}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                    fontSize: "10px",
                                }}
                                className="mb-2"
                            >
                                <div
                                    style={{
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {Lang == "MN" ? "Борлуулагч" : "Борлуулагч"}
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
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "ТТД : " : "ТТД : "}
                                </div>
                                <div>
                                    {eBarimtData &&
                                        eBarimtData[0] &&
                                        eBarimtData[0].RegisterNo}
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
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "ДДТД : " : "ДДТД : "}
                                </div>
                                <div>
                                    {eBarimtData &&
                                        eBarimtData[0] &&
                                        eBarimtData[0].BIllID}
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
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Огноо : " : "Огноо : "}
                                </div>
                                <div>
                                    {eBarimtData &&
                                        eBarimtData[0] &&
                                        eBarimtData[0].BillDate.replace(
                                            "T",
                                            " "
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
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Касс : " : "Касс : "}
                                </div>
                                <div>
                                    {eBarimtData &&
                                        eBarimtData[0] &&
                                        eBarimtData[0].PosNo}
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
                                        width: " 100px",
                                        textAlign: "left",
                                        marginRight: "9px",
                                    }}
                                >
                                    {Lang == "MN" ? "Ресепшн : " : "Ресепшн : "}
                                </div>
                                <div>
                                    {eBarimtData &&
                                        eBarimtData[0] &&
                                        eBarimtData[0].UserName}
                                </div>
                            </Box>
                            {eBarimtData &&
                            eBarimtData[0] &&
                            eBarimtData[0].CompanyID &&
                            eBarimtData[0].CompanyID != "" ? (
                                <>
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
                                                width: " 100px",
                                                textAlign: "left",
                                                marginRight: "9px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Компаний регистр : "
                                                : "Компаний регистр : "}
                                        </div>
                                        <div>
                                            {eBarimtData &&
                                                eBarimtData[0] &&
                                                eBarimtData[0].CompanyID}
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
                                                width: " 100px",
                                                textAlign: "left",
                                                marginRight: "9px",
                                            }}
                                        >
                                            {Lang == "MN"
                                                ? "Компаний нэр : "
                                                : "Компаний нэр : "}
                                        </div>
                                        <div>
                                            {eBarimtData &&
                                                eBarimtData[0] &&
                                                eBarimtData[0].CompanyName &&
                                                eBarimtData[0].CompanyName}
                                        </div>
                                    </Box>
                                </>
                            ) : (
                                <></>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                                className="mt-3"
                            >
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "10px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                            >
                                                Огноо
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "10px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                            >
                                                Бараа үйлчилгээ
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "10px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                            >
                                                Нэгж үнэ
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "10px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                            >
                                                Т/Ш
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "10px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                            >
                                                Нийт
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {eBarimtData &&
                                            eBarimtData.map(
                                                (
                                                    entity: any,
                                                    index: number
                                                ) => (
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
                                                                    "12px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.CurrDate &&
                                                                entity.CurrDate.replace(
                                                                    "T",
                                                                    " "
                                                                )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.ItemName &&
                                                                entity.ItemName}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.Amount1 &&
                                                                entity.Amount1.toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.Qty &&
                                                                entity.Qty.toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {entity.Amount2 &&
                                                                entity.Amount2.toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                    </TableBody>
                                </Table>
                            </Box>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                    className="mt-3 mb-1 mx-1"
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {Lang == "MN"
                                            ? "Нийт дүн : "
                                            : "Нийт дүн : "}
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].TotalAmount.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                    </div>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                    className="mb-1 mx-1"
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                        }}
                                    >
                                        {Lang == "MN" ? "НӨАТ : " : "НӨАТ : "}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].Vat.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                    </div>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                    className="mb-3 mx-1"
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                        }}
                                    >
                                        {Lang == "MN" ? "НХАТ : " : "НХАТ : "}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].CityTax.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                    </div>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                    className="mb-1 mx-1"
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                        }}
                                    >
                                        {Lang == "MN"
                                            ? "Бэлнээр төлсөн : "
                                            : "Бэлнээр төлсөн : "}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].CashAmount.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                    </div>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                    className="mb-3 mx-1"
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                        }}
                                    >
                                        {Lang == "MN"
                                            ? "Бэлэн бус : "
                                            : "Бэлэн бус : "}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].NonCashAmount.toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                    </div>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        fontWeight: "bold",
                                        justifyContent: "space-between",
                                    }}
                                    className="mb-3 mx-1 "
                                >
                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginRight: "9px",
                                        }}
                                    >
                                        {Lang == "MN"
                                            ? "Сугалаа : "
                                            : "Сугалаа : "}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {eBarimtData &&
                                            eBarimtData[0] &&
                                            eBarimtData[0].Lottery}
                                    </div>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="pt-1">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt="QR Code"
                                            style={{ height: "160px" }}
                                        />
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReceiptSummary;

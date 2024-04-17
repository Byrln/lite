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

const Receipt = ({ TransactionID }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);

    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        TransactionID: TransactionID,
    });

    const { data, error } = TransactionInfoSWR(search);

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
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

    useEffect(() => {
        if (data) {
            let tempValue = groupBy(data, "CustomerName");

            setReportData(tempValue);

            let tempTotal = 0;
            {
                tempValue &&
                    Object.keys(tempValue).forEach(
                        (key) =>
                            (tempTotal =
                                tempTotal +
                                tempValue[key].reduce(
                                    (acc: any, obj: any) =>
                                        Number(acc) +
                                        Number(obj.PayCash) +
                                        Number(obj.PayInvoice) +
                                        Number(obj.PayBank),
                                    0
                                ))
                    );
            }

            setTotalBalance(tempTotal);
            setRerenderKey((prevKey) => prevKey + 1);
            // if (
            //     search &&
            //     search.CustomerID &&
            //     search.CustomerID != "" &&
            //     search.CustomerID != "0"
            // ) {
            //     let customerTempData = customerData.filter(
            //         (element: any) => element.CustomerID == search.CustomerID
            //     );
            //     if (customerTempData.length > 0) {
            //         setCustomerName(customerTempData[0].CustomerName);
            //     } else {
            //         setCustomerName("Бүгд");
            //     }
            // } else {
            //     if (search.CustomerID == "0") {
            //         setCustomerName("N/A");
            //     } else {
            //         setCustomerName("Бүгд");
            //     }
            // }
        }
    }, [data]);

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
            {data && data[0] && (
                <div ref={componentRef} style={{ fontSize: "12px" }}>
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
                                width: "200px",
                                textAlign: "right",
                                marginRight: "10px",
                            }}
                        >
                            ORG/COMP :{" "}
                        </div>
                        <div style={{ fontWeight: "600" }}>
                            {data[0].CustomerName}
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
                                width: "200px",
                                textAlign: "right",
                                marginRight: "10px",
                            }}
                        >
                            ROOM TYPE :{" "}
                        </div>
                        <div style={{ fontWeight: "600" }}>
                            {data[0].RoomTypeName}
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
                                width: "200px",
                                textAlign: "right",
                                marginRight: "10px",
                            }}
                        >
                            ROOM NO :{" "}
                        </div>
                        <div style={{ fontWeight: "600" }}>
                            {data[0].RoomNo}
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
                                width: "200px",
                                textAlign: "right",
                                marginRight: "10px",
                            }}
                        >
                            FULL NAME :{" "}
                        </div>
                        <div style={{ fontWeight: "600" }}>
                            {data[0].GuestName}
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
                                width: "200px",
                                textAlign: "right",
                                marginRight: "10px",
                            }}
                        >
                            DATE :{" "}
                        </div>
                        <div style={{ fontWeight: "600" }}>
                            {moment(data[0].ArrivalDate).format("YYYY.MM.DD")}-
                            {moment(data[0].DepartureDate).format("YYYY.MM.DD")}
                        </div>
                    </Box>
                </div>
            )}
        </>
    );
};

export default Receipt;

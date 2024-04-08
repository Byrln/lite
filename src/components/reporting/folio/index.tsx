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
// import Search from "./search";

const Folio = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const { data: customerData, error: customerError } = CustomerSWR(0);
    const [customerName, setCustomerName]: any = useState("Бүгд");

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)),
        EndDate: moment(dateStringToObj(workingDate)).add(1, "months"),

        // CustomerID: null,
    });

    const { data, error } = CheckedOutDetailedSWR(search, workingDate);

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
                                    (acc: any, obj: any) => acc + obj.Balance,
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

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),

        CustomerID: yup.string().nullable(),
    });
    const formOptions = {
        defaultValues: {
            StartDate: moment(dateStringToObj(workingDate)).startOf("day"),
            EndDate: moment(dateStringToObj(workingDate))
                .add(1, "months")
                .startOf("day"),
        },
        resolver: yupResolver(validationSchema),
    };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);
    console.log("reportData", reportData && Object.keys(reportData).length);
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

                <CustomSearch
                    listUrl={checkedOutDetailedUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    {/* <Search
                        register={register}
                        errors={errors}
                        control={control}
                        setArrivalTime={setArrivalTime}
                        ArrivalTime={ArrivalTime}
                        setDepartureTime={setDepartureTime}
                        DepartureTime={DepartureTime}
                    /> */}
                </CustomSearch>
            </div>

            <div ref={componentRef}>
                <Box
                    sx={{
                        display: "flex",
                        p: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <div style={{ flexGrow: 1, textAlign: "center" }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            style={{ textAlign: "center" }}
                            className="mb-3"
                        >
                            Төлбөрийн бүртгэлийн тайлан
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        (
                        {search.StartDate &&
                            moment(search.StartDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                        {" - "}
                        {search.EndDate
                            ? moment(search.EndDate, "YYYY.MM.DD").format(
                                  "YYYY.MM.DD"
                              )
                            : " "}
                        )
                    </Typography>
                </Box>

                <Grid container spacing={2}>
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
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Өрөө
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Байгууллага
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Овог нэр
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Буусан
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Хоног
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Гарсан
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Өрөөн дүн
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Үйлчилгээ дүн
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Нийт төлөх (НӨТ-гүй)
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Нийт төлөх (НӨТ-тэй)
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                        colSpan={4}
                                    >
                                        Төлбөрийн хэлбэр
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                        rowSpan={2}
                                    >
                                        Төлбөрийн хаалт
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Бэлэн мөнгө
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Нэхэмжлэх
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Картаар
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        А/Авлага
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data &&
                                    data.map(
                                        (element: any, index: number) => (
                                            <>
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
                                                    >
                                                        {element.RoomFullNo}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.CustomerName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.GuestName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.Arrival
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.Departure
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            element.Departure
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.RoomCharge}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.ExtraCharge}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.TotalCharge}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.TotalCharge}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.PayCash}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.PayInvoice}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.PayBank}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.RateTypeName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {element.RateTypeName}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )

                                        // console.log(
                                        //     `${key}: ${reportData[key]}`
                                        // );
                                    )}

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
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={15}
                                    >
                                        {formatPrice(totalBalance)}
                                    </TableCell>
                                </TableRow>

                                {/* {reportData &&
                                    reportData.map((row: any) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.calories}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.fat}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.carbs}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.protein}
                                            </TableCell>
                                        </TableRow>
                                    ))} */}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Хэвлэсэн :{" "}
                            </span>{" "}
                            {localStorage.getItem("username")}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        {" "}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Хэвлэсэн огноо :{" "}
                            </span>{" "}
                            {moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </>
    );
};

export default Folio;

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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "components/iconify/iconify";

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const ArrivalDeparture = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData]: any = useState(null);
    const [groupedData, setGroupedData]: any = useState(null);
    const [ReportType, setReportType] = useState<any>("arrival");

    const [search, setSearch] = useState<any>({
        CurrDate: moment(dateStringToObj(workingDate)),
        ReportType: "arrival",
    });

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const fetchDatas = async () => {
        try {
            let response: any;
            if (ReportType == "arrival") {
                response = await ReportAPI.dailyArrival({
                    CurrDate: moment(search.CurrDate).format("YYYY-MM-DD"),
                });
            } else {
                response = await ReportAPI.dailyDeparture({
                    CurrDate: moment(search.CurrDate).format("YYYY-MM-DD"),
                });
            }

            if (response) {
                // response.sort((a: any, b: any) => {
                //     if (Number(a.RoomNo) < Number(b.RoomNo)) return -1;
                //     if (Number(a.RoomNo) > Number(b.RoomNo)) return 1;
                //     return 0;
                // });
                const groupedData = response.reduce((acc: any, item: any) => {
                    const existingItem = acc.find(
                        (i: any) =>
                            i.GuestFullName === item.GuestFullName &&
                            i.RoomNo === item.RoomNo
                    );
                    if (existingItem) {
                        existingItem.Remarks = existingItem.Remarks
                            ? `${existingItem.Remarks} ${
                                  item.Remarks ? `, ${item.Remarks}` : ""
                              }`
                            : item.Remarks;
                    } else {
                        acc.push({ ...item });
                    }
                    return acc;
                }, []);

                setReportData(groupedData);
                let tempValue = groupBy(response, "CountryName");
                setGroupedData(tempValue);
            }
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [search, ReportType]);

    // const { data, error } = BreakfastSWR(search, workingDate);

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
    const validationSchema = yup.object().shape({
        CurrDate: yup.string().nullable(),
        Reportype: yup.string().nullable(),
    });
    const formOptions = {
        defaultValues: {
            CurrDate: moment(dateStringToObj(workingDate)).startOf("day"),
            Reportype: "arrival",
        },
        resolver: yupResolver(validationSchema),
    };

    const renderIcons = (guestCnt: any) => {
        const stars: any[] = [];

        for (let i = 0; i < guestCnt; i++) {
            stars.push(<Iconify icon="mingcute:round-line" width="12px" />);
        }

        return stars;
    };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

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
                    listUrl={breakfastUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        ReportType={ReportType}
                        setReportType={setReportType}
                    />
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
                            {title}
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        {search.CurrDate &&
                            `${moment(search.CurrDate).format("YYYY.MM.DD")}`}
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
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px 10px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        №
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        Guest name
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Room/Type
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Arrival Date
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Departure Date
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Pick up
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Drop Off
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Extra Bed
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Breakfast
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Early Check in
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Late check Out
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
                                    reportData.map(
                                        (entity: any, index: any) => (
                                            <>
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px 10px",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.GuestFullName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.RoomFullNo}
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
                                                        {moment(
                                                            entity.ArrivalDate
                                                        ).format("YYYY-MM-DD ")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {moment(
                                                            entity.DepartureDate
                                                        ).format("YYYY-MM-DD ")}
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
                                                        {entity.Pickup > 0
                                                            ? Number(
                                                                  entity.Adult
                                                              ) +
                                                              Number(
                                                                  entity.Child
                                                              )
                                                            : ""}
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
                                                        {entity.DropOff > 0
                                                            ? Number(
                                                                  entity.Adult
                                                              ) +
                                                              Number(
                                                                  entity.Child
                                                              )
                                                            : ""}
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
                                                        {Number(
                                                            entity.ExtraBed
                                                        ) > 0
                                                            ? Number(
                                                                  entity.ExtraBed
                                                              )
                                                            : ""}
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
                                                        {Number(
                                                            entity.BreakfastCount
                                                        ) > 0
                                                            ? Number(
                                                                  entity.BreakfastCount
                                                              )
                                                            : ""}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.CheckedInDate &&
                                                        moment(
                                                            entity.CheckedInDate
                                                        ).format("HH:mm:ss") <
                                                            entity.DefaultCheckIn
                                                            ? moment(
                                                                  entity.CheckedInDate
                                                              ).format(
                                                                  "HH:mm:ss"
                                                              )
                                                            : ""}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.CheckedOutDate &&
                                                        moment(
                                                            entity.CheckedOutDate
                                                        ).format("HH:mm:ss") <
                                                            entity.DefaultCheckOut
                                                            ? moment(
                                                                  entity.CheckedOutDate
                                                              ).format(
                                                                  "HH:mm:ss"
                                                              )
                                                            : ""}
                                                    </TableCell>
                                                </TableRow>
                                                {entity.Remarks ? (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            "&:last-child td, &:last-child th":
                                                                { border: 0 },
                                                        }}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                padding:
                                                                    "2px 30px",
                                                            }}
                                                            colSpan={11}
                                                        >
                                                            {entity.Remarks
                                                                ? entity.Remarks
                                                                : " "}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    <></>
                                                )}
                                            </>
                                        )
                                    )}
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={4}></Grid>

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

export default ArrivalDeparture;

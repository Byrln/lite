import { useState, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import moment from "moment";
import {
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";
import { formatPrice } from "lib/utils/helpers";

const MonthlyRevenue = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData]: any = useState(null);
    const [groupedData, setGroupedData]: any = useState(null);
    const [ReportType, setReportType] = useState<any>("arrival");

    const [search, setSearch] = useState<any>({
        CurrDate: moment(dateStringToObj(workingDate)).format("YYYY-MM-DD"),
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
            response = await ReportAPI.monthlyRevenue(search);

            let tempValue = groupBy(response, "RoomChargeGroupName");

            setReportData(response);
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [search, ReportType]);

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
    });
    const formOptions = {
        defaultValues: {
            CurrDate: moment(dateStringToObj(workingDate)).format("YYYY-MM-DD"),
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

    return (
        <>
            <div style={{ display: "flex" }}>
                <Button
                    variant="outlined"
                    onClick={handlePrint}
                    className="mr-3"
                    startIcon={<PrintIcon />}
                >
                      {intl.formatMessage({id:"ButtonPrint"}) }

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
                            {intl.formatMessage({id:"ReportingPeriod"}) }

                        </span>{" "}
                        {search.CurrDate &&
                            `(${moment(search.CurrDate).format("YYYY.MM")})`}
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
                                           {intl.formatMessage({id:"ReportActionDate"}) }

                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                         {intl.formatMessage({id:"ReportAvailableRooms"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                         {intl.formatMessage({id:"ReportSoldRooms"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                       {intl.formatMessage({id:"ReportComplimentary"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                       {intl.formatMessage({id:"ReportOccupancyPerc"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        ADR
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        RevPar
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                         {intl.formatMessage({id:"ReportPax"}) }

                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                      {intl.formatMessage({id:"ReportRoomCharge"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                       {intl.formatMessage({id:"ConfigExtraCharges"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                         {intl.formatMessage({id:"ConfigTax"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                         {intl.formatMessage({id:"ReportPayment"}) }
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
                                                        {entity.DtPart}
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
                                                        {entity.RoomsAvailable}
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
                                                        {entity.RoomsSold}
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
                                                        {
                                                            entity.RoomsComplimentary
                                                        }
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
                                                        {entity.Occupancy}
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
                                                        {entity.ADR}
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
                                                        {entity.RevPar}
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
                                                        {entity.Pax}
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
                                                        {formatPrice(
                                                            entity.RoomCharges
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
                                                        {formatPrice(
                                                            entity.ExtraCharges
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
                                                        {formatPrice(
                                                            entity.TotalTax
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
                                                        {formatPrice(
                                                            entity.Payments
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                    )}
                                <TableRow
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
                                    >
                                        Нийт
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px",
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RoomsAvailable
                                                            ? obj.RoomsAvailable
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RoomsSold
                                                            ? obj.RoomsSold
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RoomsComplimentary
                                                            ? obj.RoomsComplimentary
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Occupancy
                                                            ? obj.Occupancy
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.ADR ? obj.ADR : 0),
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RevPar
                                                            ? obj.RevPar
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Pax ? obj.Pax : 0),
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RoomCharges
                                                            ? obj.RoomCharges
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.ExtraCharges
                                                            ? obj.ExtraCharges
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.TotalTax
                                                            ? obj.TotalTax
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Payments
                                                            ? obj.Payments
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                </TableRow>
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
                                {intl.formatMessage({id:"ReportPrinted"}) }
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
                                {intl.formatMessage({id:"DateToPrinted"}) }
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

export default MonthlyRevenue;

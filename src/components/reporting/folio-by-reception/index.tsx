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
    darkScrollbar,
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    ReportFolioByReceptionUrlSWR,
    reportFolioByReceptionUrl,
} from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const ChargeByReception = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [year, setYear] = useState(moment(workingDate).year());
    const [month, setMonth] = useState(moment(workingDate).month() + 1);
    const [sessions, setSessions]: any = useState([]);
    const [search, setSearch] = useState({
        CurrDate: moment(dateStringToObj(workingDate)),
    });
    const [groupedData, setGroupedData]: any = useState();

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const { data, error } = ReportFolioByReceptionUrlSWR(search, sessions);

    useEffect(() => {
        if (data) {
            let tempValue = groupBy(data, "WorkingDate");

            setGroupedData(tempValue);
        }
    }, [data]);

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
                background-color:none !important;
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
        CurrDate: yup.date().nullable(),
    });
    const formOptions = {
        defaultValues: {
            CurrDate: moment(dateStringToObj(workingDate)),
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
                    { intl.formatMessage({id:"ButtonPrint"}) } 
                </Button>

                <CustomSearch
                    listUrl={reportFolioByReceptionUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        year={year}
                        setYear={setYear}
                        month={month}
                        setMonth={setMonth}
                        sessions={sessions}
                        setSessions={setSessions}
                    />
                </CustomSearch>
            </div>

            <div ref={componentRef}>
                <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "center" }}
                    className="mb-3"
                >
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                { intl.formatMessage({id:"TextStartDate"}) } 
                            </span>{" "}
                            {moment(search.CurrDate)
                                .startOf("month")
                                .format("YYYY-MM-DD")}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                { intl.formatMessage({id:"TextEndDate"}) } 
                            </span>{" "}
                            {moment(search.CurrDate)
                                .endOf("month")
                                .format("YYYY-MM-DD")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Table aria-label="report" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Folio No
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Room/Type
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Arrival
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Departure
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Nights
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Room Charge
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Extra Charge
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Discount
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Total Charge
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Payments
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data &&
                                    data.map((entity: any) => (
                                        <>
                                            <TableRow
                                                key={entity.TransactionID}
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
                                                    {entity.FolioNo}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.RoomFullNo}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.ArrrivalDate
                                                    ).format("YYYY-MM-DD")}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.DepartureDate
                                                    ).format("YYYY-MM-DD")}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    align="right"
                                                >
                                                    {entity.Nights}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    align="right"
                                                >
                                                    {formatPrice(
                                                        entity.RoomCharge
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    align="right"
                                                >
                                                    {formatPrice(
                                                        entity.ExtraCharge
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.Discount
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.TotalCharge
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.Payments
                                                    )}
                                                </TableCell>

                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.Status}
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
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={8}
                                    ></TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.TotalPayment
                                                            ? obj.TotalPayment
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                </TableRow>
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
                                { intl.formatMessage({id:"ReportPrinted"}) } 
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
                                { intl.formatMessage({id:"DateToPrinted"}) } 
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

export default ChargeByReception;

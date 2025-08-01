import { useState, useRef, useEffect } from "react";
import moment from "moment";

import { useIntl } from "react-intl";
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

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const Breakfast = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData]: any = useState(null);
    const [search, setSearch] = useState<any>({
        StartDate: moment(dateStringToObj(workingDate)).format("YYYY-MM-DD"),
        EndDate: moment(dateStringToObj(workingDate))
            .add("month", 1)
            .format("YYYY-MM-DD"),
    });

    const fetchDatas = async () => {
        try {
            const response: any = await ReportAPI.breakfast2({
                StartDate: search.StartDate,
                EndDate: search.EndDate,
            });
            if (response) {
                setReportData(response);
            }
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [search]);

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
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
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
                            {intl.formatMessage({id:"TextBreakfast"}) }
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            {intl.formatMessage({id:"ReportingPeriod"}) }
                        </span>{" "}
                        (
                        {search.StartDate &&
                            `${moment(search.StartDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )} - `}
                        {search.EndDate &&
                            moment(search.EndDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
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
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        №
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         {intl.formatMessage({id:"ReportActionDate"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                          {intl.formatMessage({id:"ReportTotalRooms"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                       {intl.formatMessage({id:"TotalGuest"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({id:"BreakfastIsAvailable"}) }
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
                                                    >
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {moment(
                                                            entity.StayDate
                                                        ).format("YYYY-MM-DD")}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {entity.TotalRoom}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {entity.TotalGuest}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="right"
                                                    >
                                                        {entity.TotalBreakfast}
                                                    </TableCell>
                                                </TableRow>
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

export default Breakfast;

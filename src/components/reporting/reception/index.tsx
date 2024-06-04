import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Typography, Grid, Button, Box } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";
import PaymentSummary from "./payment-summary";
import PaymentDetail from "./payment-detail";
import CheckedIn from "./checked-in";
import CheckedOut from "./checked-out";
import RoomCharge from "./room-charge";
import ExtraCharge from "./extra-charge";
import DueOut from "./due-out";
import CancelVoidNoShow from "./cancel-void-noshow";

const Reception = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [ReportType, setReportType] = useState<any>("arrival");
    const [year, setYear] = useState(moment(workingDate).year());
    const [month, setMonth] = useState(moment(workingDate).month() + 1);
    const [sessionId, setSessionId] = useState(null);

    const [search, setSearch] = useState<any>({
        StartDate: moment(dateStringToObj(workingDate)).format("YYYY-MM-DD"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .format("YYYY-MM-DD"),
    });

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
        StartDate: yup.string().nullable(),
        EndDate: yup.string().nullable(),
        RoomChargeTypeGroupID: yup.string().nullable(),
        RoomChargeTypeID: yup.string().nullable(),
        RoomTypeID: yup.string().nullable(),
        RoomID: yup.string().nullable(),
        UserID: yup.string().nullable(),
    });
    const formOptions = {
        defaultValues: {
            StartDate: moment(dateStringToObj(workingDate)).format(
                "YYYY-MM-DD"
            ),
            EndDate: moment(dateStringToObj(workingDate))
                .add(1, "months")
                .format("YYYY-MM-DD"),
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
                    Хэвлэх
                </Button>

                <CustomSearch
                    listUrl={breakfastUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                    hideButtons={true}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        ReportType={ReportType}
                        setReportType={setReportType}
                        year={year}
                        setYear={setYear}
                        month={month}
                        setMonth={setMonth}
                        sessionId={sessionId}
                        setSessionId={setSessionId}
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
                        {month && year && `(${year}-${month})`}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={4}></Grid>

                    <Grid item xs={12}>
                        <PaymentSummary sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        <PaymentDetail sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        <CheckedIn sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        <CheckedOut sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        <RoomCharge sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        <ExtraCharge sessionId={sessionId} />
                    </Grid>

                    <Grid item xs={12}>
                        {/* <DueOut sessionId={sessionId} /> */}
                    </Grid>

                    <Grid item xs={12}>
                        <CancelVoidNoShow sessionId={sessionId} />
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

export default Reception;

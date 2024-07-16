import { useState, useRef } from "react";
import moment from "moment";
import { useIntl } from "react-intl";
import { Typography, Grid, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { nightAuditSummaryUrl } from "lib/api/report";
import CustomSearch from "components/common/custom-search";
import Search from "./search";
import Summary from "./summary";
import RoomCharge from "./room-charge";
import CheckedOut from "./checked-out";
import PaymentSummary from "./payment-summary";
import PaymentDetail from "./payment-detail";

const AvailableRoom = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);

    const [search, setSearch] = useState({
        CurrDate: moment(workingDate).format("YYYY-MM-DD"),
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
            CurrDate: moment(workingDate).format("YYYY-MM-DD"),
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
                    listUrl={nightAuditSummaryUrl}
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
                <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textAlign: "center" }}
                    className="mb-3"
                >
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {" "}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                { intl.formatMessage({id:"ReportStartDate"}) } 
                            </span>{" "}
                            {moment(search.CurrDate, "YYYY-MM-DD").format(
                                "YYYY-MM-DD"
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}></Grid>

                    <Grid item xs={12}>
                        <Summary search={search} rerenderKey={rerenderKey} />
                    </Grid>

                    <Grid item xs={12}>
                        <RoomCharge search={search} rerenderKey={rerenderKey} />
                    </Grid>

                    <Grid item xs={12}>
                        <CheckedOut search={search} rerenderKey={rerenderKey} />
                    </Grid>

                    <Grid item xs={12}>
                        <PaymentSummary
                            search={search}
                            rerenderKey={rerenderKey}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <PaymentDetail
                            search={search}
                            rerenderKey={rerenderKey}
                        />
                    </Grid>

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

export default AvailableRoom;

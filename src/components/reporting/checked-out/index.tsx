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
import Search from "./search";

const ReportingList = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)).startOf("day"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .startOf("day"),
    });

    const { data, error } = CheckedOutDetailedSWR(search, 6);

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
                    listUrl={checkedOutDetailedUrl}
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
                    <Grid item xs={6}>
                        {" "}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                {intl.formatMessage({id:"ReportStartDate"}) }
                            </span>{" "}
                            {moment(search.StartDate).format("YYYY-MM-DD")}
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
                                {intl.formatMessage({id:"ReportEndDate"}) }
                            </span>{" "}
                            {moment(search.EndDate).format("YYYY-MM-DD")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Table aria-label="report" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportRoomAndType"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"TextCustomer"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportCountry"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportSource"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                       {intl.formatMessage({id:"ReportSource"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportArrival"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportDeparture"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({id:"ReportTotalCharge"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                       {intl.formatMessage({id:"TextRoomCount"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({id:"ReportExtraCharge"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         {intl.formatMessage({id:"ReportDiscount"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                      {intl.formatMessage({id:"ReportPaid"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                       {intl.formatMessage({id:"ReportCash"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         {intl.formatMessage({id:"ReportBank"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({id:"ReportInvoice"}) }
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
                                                        { border: 0 },
                                                }}
                                            >
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
                                                    {entity.CustomerName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.CountryName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        entity.ReservationSourceName
                                                    }
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.GuestName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.ArrivalDate
                                                    ).format(
                                                        "YYYY-MM-DD hh:mm:ss"
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.DepartureDate
                                                    ).format(
                                                        "YYYY-MM-DD hh:mm:ss"
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
                                                        entity.RoomCharge
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
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
                                                        entity.Payments
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.PayCash
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.PayBank
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.PayInvoice
                                                    )}
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
                                        colSpan={6}
                                    ></TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="center"
                                    >
                                        {data && data.length}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.TotalCharge
                                                            ? obj.TotalCharge
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.RoomCharge
                                                            ? obj.RoomCharge
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.ExtraCharge
                                                            ? obj.ExtraCharge
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Discount
                                                            ? obj.Discount
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Payments
                                                            ? obj.Payments
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.PayCash
                                                            ? obj.PayCash
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.PayBank
                                                            ? obj.PayBank
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.PayInvoice
                                                            ? obj.PayInvoice
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

export default ReportingList;

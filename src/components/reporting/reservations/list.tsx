// import { format } from "date-fns";

import { useState, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import {
    Button,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";

import CustomSearch from "components/common/custom-search";
import { ReservationListSWR, reservationListUrl } from "lib/api/report";

import Search from "./search";
import { ModalContext } from "lib/context/modal";
import { formatPrice } from "lib/utils/helpers";

const ReservationsList = ({ title, workingDate }: any) => {
    const intl = useIntl();

    const componentRef: any = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { StatusGroup, StartDate, EndDate, ReservationTypeID } = router.query;
    const [rerenderKey, setRerenderKey] = useState(0);

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

    useEffect(() => {
        setRerenderKey((prevKey) => prevKey + 1);
    }, [StatusGroup, StartDate, EndDate, ReservationTypeID]);



    const { handleModal }: any = useContext(ModalContext);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),
        ReservationTypeID: yup.string().nullable(),
        ReservationSourceID: yup.string().nullable(),
        StatusGroup: yup.string().nullable(),
        GuestName: yup.string(),
        GuestPhone: yup.string(),
        GuestEmail: yup.string(),
        CustomerID: yup.string(),
    });
    const formOptions = {
        defaultValues: {
            StatusGroup: StatusGroup ? StatusGroup : "1",
            StartDate: StartDate
                ? StartDate
                : moment(workingDate).startOf("month").format("YYYY-MM-DD"),
            EndDate: EndDate
                ? EndDate
                : moment(workingDate).endOf("month").format("YYYY-MM-DD"),
            ReservationTypeID: ReservationTypeID ? ReservationTypeID : null,
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

    const [search, setSearch] = useState({
        StatusGroup: StatusGroup ? StatusGroup : "1",
        StartDate: StartDate
            ? StartDate
            : moment(workingDate).startOf("month").format("YYYY-MM-DD"),
        EndDate: EndDate
            ? EndDate
            : moment(workingDate).endOf("month").format("YYYY-MM-DD"),
        ReservationTypeID: ReservationTypeID ? ReservationTypeID : null,
    });

    const { data, error } = ReservationListSWR(search);

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
                    listUrl={reservationListUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        reset={reset}
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
                                    {intl.formatMessage({id:"RowHeaderArrival"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportDeparture"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"Left_SortByGuestName"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportCountry"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportRoomAndType"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"Left_SortByStatus"}) }
                                    </TableCell>
                                    <TableCell
                                        style={{ fontWeight: "bold" }}
                                        align="center"
                                    >
                                        {intl.formatMessage({id:"ReportPax"}) }
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                    {intl.formatMessage({id:"ReportCompany"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {intl.formatMessage({id:"ReportPayment"}) }
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                      {intl.formatMessage({id:"ReportBalance"}) }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data &&
                                    data.map(
                                        (entity: any) => (
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
                                                        {moment(
                                                            entity.ArrivalDate
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
                                                    >
                                                        {entity.GuestName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {" "}
                                                        {entity.GuestCountry}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {entity.RoomFullName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {
                                                            entity.RoomStatusDescription
                                                        }
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="center"
                                                    >
                                                        {entity.Pax}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {entity.CompanyName}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {formatPrice(
                                                            entity.TotalPayment
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {formatPrice(
                                                            entity.TotalBalance
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )

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
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Adult
                                                            ? obj.Adult
                                                            : 0),
                                                    0
                                                )
                                        )}
                                        /{" "}
                                        {formatPrice(
                                            data &&
                                                data.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Child
                                                            ? obj.Child
                                                            : 0),
                                                    0
                                                )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
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
                                                        (obj.TotalBalance
                                                            ? obj.TotalBalance
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

export default ReservationsList;

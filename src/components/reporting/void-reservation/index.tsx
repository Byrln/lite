import { useState, useRef, useEffect } from "react";
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

import { ReportCancelSWR, cancelUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const ReportingList = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)).startOf("day"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .startOf("day"),
    });

    const { data, error } = ReportCancelSWR(search, 5);

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
                    Хэвлэх
                </Button>

                <CustomSearch
                    listUrl={cancelUrl}
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
                                Эх.Хугацаа :{" "}
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
                                Дуус.Хугацаа :{" "}
                            </span>{" "}
                            {moment(search.EndDate).format("YYYY-MM-DD")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Table aria-label="report" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Зах.№
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Блок эхлэх
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Зочны нэр
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Ирэх
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Хоног
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Өр.Төрөл
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Тариф.төр
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Тохир.үнэ
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Төлсөн
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        З.Цуц.Орлого
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Үлдэгдэл
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Цуцласан
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        Цуцал.Огноо
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
                                                    {entity.ReservationNo}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.CreatedDate
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
                                                    {moment(
                                                        entity.ArrivalDate
                                                    ).format("YYYY-MM-DD")}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.Nights}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.RoomTypeName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.RateTypeName}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.DailyCharge &&
                                                        formatPrice(
                                                            entity.DailyCharge
                                                        )}
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
                                                        entity.CancelRevenue
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {formatPrice(
                                                        entity.Balance
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {entity.CancelUserName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {moment(
                                                        entity.CancelDate
                                                    ).format("YYYY-MM-DD")}
                                                    <br />
                                                    {entity.ReasonDescription}
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
                                                        (obj.CancelRevenue
                                                            ? obj.CancelRevenue
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
                                                        (obj.Balance
                                                            ? obj.Balance
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
                                        colSpan={2}
                                    ></TableCell>
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

export default ReportingList;

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
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { AvailableRoomsSWR, availableRoomsUrl } from "lib/api/report";
import { RoomTypeSWR } from "lib/api/room-type";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const AvailableRoom = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [dates, setDates] = useState<any>([]);
    const [dDays, setDDays] = useState<any>([]);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const [customerName, setCustomerName]: any = useState("Бүгд");

    const [search, setSearch] = useState({
        CurrDate: moment(workingDate).format("YYYY-MM-DD"),
    });

    const { data, error } = AvailableRoomsSWR(search);

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({});

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
        let dateArray: any = [];
        let d: any = [];

        for (let i = 0; i < 30; i++) {
            let tempDate = new Date(workingDate);
            tempDate.setDate(moment(workingDate).date() + i);
            dateArray.push(moment(tempDate).format("YYYY-MM-DD"));
            d.push(`D${i + 1}`);
        }
        setDDays(d);
        setDates(dateArray);
    }, []);

    const validationSchema = yup.object().shape({
        StartDate: yup.date().nullable(),
        EndDate: yup.date().nullable(),

        CustomerID: yup.string().nullable(),
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
                    Хэвлэх
                </Button>

                <CustomSearch
                    listUrl={availableRoomsUrl}
                    search={search}
                    setSearch={setSearch}
                    handleSubmit={handleSubmit}
                    reset={reset}
                >
                    <Search
                        register={register}
                        errors={errors}
                        control={control}
                        setArrivalTime={setArrivalTime}
                        ArrivalTime={ArrivalTime}
                        setDepartureTime={setDepartureTime}
                        DepartureTime={DepartureTime}
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
                    Боломжит өрөө
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
                                Эх.Хугацаа :{" "}
                            </span>{" "}
                            {moment(search.CurrDate, "YYYY-MM-DD").format(
                                "YYYY-MM-DD"
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className="mr-1"
                        >
                            <span style={{ fontWeight: "bold" }}>
                                {" "}
                                Харилцагч :{" "}
                            </span>{" "}
                            {customerName}
                        </Typography>
                    </Grid>
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
                                    ></TableCell>
                                    {dates &&
                                        dates.map((item: any) => (
                                            <TableCell
                                                key={item}
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px 10px",
                                                    fontSize: "10px",
                                                }}
                                            >
                                                {moment(item).date()}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data &&
                                    roomTypes &&
                                    data.map((item: any, index: any) => (
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
                                                    padding: "2px 10px",

                                                    fontWeight:
                                                        item.RoomTypeName ==
                                                            "Available Rooms" ||
                                                        roomTypes.some(
                                                            (room: any) =>
                                                                room.RoomTypeName ===
                                                                item.RoomTypeName
                                                        )
                                                            ? "bold"
                                                            : "normal",
                                                }}
                                            >
                                                {item.RoomTypeName}
                                            </TableCell>

                                            {dDays &&
                                                dDays.map((dday: any) => (
                                                    <TableCell
                                                        key={`${item.RoomTypeName}-${dday}`}
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px 10px",
                                                            fontWeight:
                                                                item.RoomTypeName ==
                                                                "Available Rooms"
                                                                    ? "bold"
                                                                    : "normal",
                                                        }}
                                                    >
                                                        {item[dday]}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))}
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

export default AvailableRoom;

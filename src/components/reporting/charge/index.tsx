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
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    ReservationDailyDetailSWR,
    reservationDailyDetailUrl,
} from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const Folio = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const [chargeColumns, setChargeColumns]: any = useState();
    const [newData, setNewData]: any = useState();

    const { data: customerData, error: customerError } = CustomerSWR(0);
    const [customerName, setCustomerName]: any = useState("Бүгд");

    const [search, setSearch] = useState({
        StartDate: moment(dateStringToObj(workingDate)),
        EndDate: moment(dateStringToObj(workingDate)).add(1, "months"),

        // CustomerID: null,
    });

    const { data, error } = ReservationDailyDetailSWR(search, workingDate);

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

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    useEffect(() => {
        if (data) {
            let chargeColumnsTemp: any = {};

            if (data && data[0] && data[0].ChargeDescription) {
                chargeColumnsTemp = parseJsonString(data[0].ChargeDescription);
            }
            setChargeColumns(chargeColumnsTemp);
            data.forEach((entity: any) => {
                if (chargeColumnsTemp) {
                    chargeColumnsTemp.forEach((chargeColumnsEntity: any) => {
                        entity[chargeColumnsEntity.Name] = parseJsonString(
                            entity.ChargeDescription
                        ).filter(
                            (item: any) => item.Name == chargeColumnsEntity.Name
                        )[0].Value;
                    });
                }
            });

            const filteredData = data.filter(
                (item: any) =>
                    moment(item.StayDate, "YYYY.MM.DD").format("YYYY.MM.DD") ==
                    moment(search.StartDate, "YYYY.MM.DD").format("YYYY.MM.DD")
            );

            setNewData(filteredData);

            let tempValue = groupBy(filteredData, "RoomTypeName");
            setReportData(tempValue);

            let tempTotal = 0;
            {
                tempValue &&
                    Object.keys(tempValue).forEach(
                        (key) =>
                            (tempTotal =
                                tempTotal +
                                tempValue[key].reduce(
                                    (acc: any, obj: any) =>
                                        acc + obj.DailyPostedCharge,
                                    0
                                ))
                    );
            }

            setTotalBalance(tempTotal);
            setRerenderKey((prevKey) => prevKey + 1);
        }
    }, [data]);

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

    function parseJsonString(jsonString: any) {
        return jsonString.split("},").map((item: any) => {
            if (!item.endsWith("}")) {
                item += "}";
            }
            return JSON.parse(item);
        });
    }

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
                    listUrl={reservationDailyDetailUrl}
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
                            Буудлын борлуулалт
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        {search.StartDate &&
                            moment(search.StartDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                         
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
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Өр.Төрөл
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Байгууллага
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Зочин
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Ирсэн
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Гарсан
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Хөнгөлөлт
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Буудлын орлого
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        colSpan={
                                            chargeColumns
                                                ? chargeColumns.length
                                                : 1
                                        }
                                    >
                                        Үйлчилгээ
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        rowSpan={2}
                                    >
                                        Нийт
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    {chargeColumns &&
                                        Object.keys(chargeColumns).map(
                                            (key) => (
                                                <TableCell
                                                    key={key}
                                                    align="right"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "9px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    {chargeColumns[key].Name}
                                                </TableCell>
                                            )
                                        )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
                                    Object.keys(reportData).map(
                                        (key) => (
                                            <>
                                                <TableRow
                                                    key={key}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontWeight: "bold",
                                                            paddingLeft: "30px",
                                                            fontSize: "9px",
                                                            padding: "2px",
                                                        }}
                                                        colSpan={
                                                            chargeColumns
                                                                ? Number(
                                                                      chargeColumns.length
                                                                  ) + 8
                                                                : 9
                                                        }
                                                    >
                                                        {key}
                                                    </TableCell>
                                                </TableRow>
                                                {reportData[key] &&
                                                    Object.keys(
                                                        reportData[key]
                                                    ).map((key2) => (
                                                        <>
                                                            <TableRow
                                                                key={key}
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
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .RoomFullName
                                                                    }
                                                                </TableCell>

                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .CompanyName
                                                                    }
                                                                </TableCell>

                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .GuestName
                                                                    }
                                                                </TableCell>

                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .ArrivalDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .DepartureDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        key
                                                                    ][key2]
                                                                        .DailyDiscount
                                                                        ? formatPrice(
                                                                              reportData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .DailyDiscount
                                                                          )
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        key
                                                                    ][key2]
                                                                        .DailyRoomCharge
                                                                        ? formatPrice(
                                                                              reportData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .DailyRoomCharge
                                                                          )
                                                                        : 0}
                                                                </TableCell>

                                                                {chargeColumns ? (
                                                                    chargeColumns.map(
                                                                        (
                                                                            entity: any,
                                                                            index: any
                                                                        ) => (
                                                                            <TableCell
                                                                                key={
                                                                                    index
                                                                                }
                                                                                component="th"
                                                                                scope="row"
                                                                                align="right"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "9px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {reportData[
                                                                                    key
                                                                                ][
                                                                                    key2
                                                                                ][
                                                                                    entity
                                                                                        .Name
                                                                                ]
                                                                                    ? formatPrice(
                                                                                          reportData[
                                                                                              key
                                                                                          ][
                                                                                              key2
                                                                                          ][
                                                                                              entity
                                                                                                  .Name
                                                                                          ]
                                                                                      )
                                                                                    : 0}
                                                                            </TableCell>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <TableCell
                                                                        key={0}
                                                                        component="th"
                                                                        scope="row"
                                                                        align="right"
                                                                        style={{
                                                                            fontSize:
                                                                                "9px",
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        0
                                                                    </TableCell>
                                                                )}
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                    style={{
                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {reportData[
                                                                        key
                                                                    ][key2]
                                                                        .DailyCharge
                                                                        ? formatPrice(
                                                                              reportData[
                                                                                  key
                                                                              ][
                                                                                  key2
                                                                              ]
                                                                                  .DailyCharge
                                                                          )
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    ))}
                                                <TableRow
                                                    key={key}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontWeight: "bold",

                                                            fontSize: "9px",
                                                            padding: "2px",
                                                        }}
                                                        align="right"
                                                        colSpan={5}
                                                    >
                                                        Нийт :
                                                    </TableCell>

                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontWeight: "bold",

                                                            fontSize: "9px",
                                                            padding: "2px",
                                                        }}
                                                        align="right"
                                                        colSpan={1}
                                                    >
                                                        {reportData &&
                                                        reportData[key]
                                                            ? formatPrice(
                                                                  reportData[
                                                                      key
                                                                  ].reduce(
                                                                      (
                                                                          acc: any,
                                                                          obj: any
                                                                      ) =>
                                                                          acc +
                                                                          obj.DailyDiscount
                                                                              ? obj.DailyDiscount
                                                                              : 0,
                                                                      0
                                                                  )
                                                              )
                                                            : 0}
                                                    </TableCell>

                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontWeight: "bold",

                                                            fontSize: "9px",
                                                            padding: "2px",
                                                        }}
                                                        align="right"
                                                        colSpan={1}
                                                    >
                                                        {reportData &&
                                                        reportData[key]
                                                            ? formatPrice(
                                                                  reportData[
                                                                      key
                                                                  ].reduce(
                                                                      (
                                                                          acc: any,
                                                                          obj: any
                                                                      ) =>
                                                                          acc +
                                                                          obj.DailyRoomCharge
                                                                              ? obj.DailyRoomCharge
                                                                              : 0,
                                                                      0
                                                                  )
                                                              )
                                                            : 0}
                                                    </TableCell>

                                                    {chargeColumns ? (
                                                        chargeColumns.map(
                                                            (
                                                                entity: any,
                                                                index: any
                                                            ) => (
                                                                <TableCell
                                                                    key={index}
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",

                                                                        fontSize:
                                                                            "9px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {reportData &&
                                                                    reportData[
                                                                        key
                                                                    ]
                                                                        ? formatPrice(
                                                                              reportData[
                                                                                  key
                                                                              ].reduce(
                                                                                  (
                                                                                      acc: any,
                                                                                      obj: any
                                                                                  ) =>
                                                                                      acc +
                                                                                      obj[
                                                                                          entity
                                                                                              .Name
                                                                                      ],
                                                                                  0
                                                                              )
                                                                          )
                                                                        : 0}
                                                                </TableCell>
                                                            )
                                                        )
                                                    ) : (
                                                        <TableCell
                                                            key={0}
                                                            component="th"
                                                            scope="row"
                                                            align="right"
                                                            style={{
                                                                fontWeight:
                                                                    "bold",

                                                                fontSize: "9px",
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            0
                                                        </TableCell>
                                                    )}

                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontWeight: "bold",

                                                            fontSize: "9px",
                                                            padding: "2px",
                                                        }}
                                                        align="right"
                                                        colSpan={1}
                                                    >
                                                        {reportData &&
                                                        reportData[key]
                                                            ? formatPrice(
                                                                  reportData[
                                                                      key
                                                                  ].reduce(
                                                                      (
                                                                          acc: any,
                                                                          obj: any
                                                                      ) =>
                                                                          acc +
                                                                          obj.DailyCharge,
                                                                      0
                                                                  )
                                                              )
                                                            : 0}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                        // console.log(
                                        //     `${key}: ${reportData[key]}`
                                        // );
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
                                            fontSize: "9px",
                                            padding: "2px",
                                        }}
                                        align="right"
                                        colSpan={
                                            chargeColumns
                                                ? Number(chargeColumns.length) +
                                                  8
                                                : 9
                                        }
                                    >
                                        {totalBalance
                                            ? formatPrice(totalBalance)
                                            : 0}
                                    </TableCell>
                                </TableRow>

                                {/* {reportData &&
                                    reportData.map((row: any) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.calories}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.fat}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.carbs}
                                            </TableCell>
                                            <TableCell align ="left">
                                                {row.protein}
                                            </TableCell>
                                        </TableRow>
                                    ))} */}
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

export default Folio;

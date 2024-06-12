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
} from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";

import { StayViewSWR, stayViewUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";
import { FrontOfficeSWR, listUrl } from "lib/api/front-office";
import { daysInMonth } from "lib/utils/helpers";
import { StayView2SWR } from "lib/api/stay-view2";

const ReportingList = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [ArrivalTime, setArrivalTime]: any = useState("00:00");
    const [DepartureTime, setDepartureTime]: any = useState("23:59");
    const [rerenderKey, setRerenderKey] = useState(0);
    const { data: customerData, error: customerError } = CustomerSWR(0);
    const [customerName, setCustomerName]: any = useState("Бүгд");
    const [columns, setColumns]: any = useState();
    const [groupminus1, setGroupminus1]: any = useState();

    const [search, setSearch] = useState({
        CurrDate: moment(dateStringToObj(workingDate)),
    });

    // const { data, error } = StayVaaiewSWR(search);
    const { data, error } = FrontOfficeSWR({
        CurrDate: `${moment(search.CurrDate).format("YYYY")}-${moment(
            search.CurrDate
        ).format("MM")}-01`,
        NumberOfDays: daysInMonth(
            moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
            moment(search.CurrDate, "YYYY-MM-DD").year()
        ),
        RoomTypeID: null,
    });

    const { data: availableRooms, error: availableRoomsError } = StayView2SWR(
        `${moment(search.CurrDate).format("YYYY")}-${moment(
            search.CurrDate
        ).format("MM")}-01`,

        daysInMonth(
            moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
            moment(search.CurrDate, "YYYY-MM-DD").year()
        ) > 30
            ? 30
            : daysInMonth(
                  moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
                  moment(search.CurrDate, "YYYY-MM-DD").year()
              )
    );

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            body {
                -webkit-print-color-adjust: exact;
              }
            .css-ztacej-MuiTableCell-root{
                padding:6px !important
                font-size: 9px !important;
    line-height: 14px;
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

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const generateColumns = () => {
        const datesSet: any = [];
        daysInMonth(
            moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
            moment(search.CurrDate, "YYYY-MM-DD").year()
        ) - 1,
            search.CurrDate;

        var i;

        for (
            i = 1;
            i <=
            daysInMonth(
                moment(search.CurrDate, "YYYY-MM-DD").month() + 1,
                moment(search.CurrDate, "YYYY-MM-DD").year()
            );
            i++
        ) {
            const currDate = new Date(
                `${moment(search.CurrDate).format("YYYY")}-${moment(
                    search.CurrDate
                ).format("MM")}-${i}`
            );

            datesSet.push(currDate);
        }

        // Convert the Set back to an array and sort it by date

        return datesSet;
    };
    useEffect(() => {
        if (data) {
            setColumns(generateColumns());
            console.log("data", data);

            let tempValue = groupBy(data, "RoomTypeName");

            Object.keys(tempValue).map((key: any) => {
                tempValue[key] = groupBy(tempValue[key], "RoomNo");
            });
            mutate(`/api/FrontOffice/StayView2`);
            setReportData(tempValue);
            setRerenderKey((prevKey) => prevKey + 1);
        }
    }, [data]);

    const validationSchema = yup.object().shape({
        CurrDate: yup.date().nullable(),
    });

    const formOptions = {
        defaultValues: {
            CurrDate: moment(dateStringToObj(workingDate)).startOf("day"),
        },
        resolver: yupResolver(validationSchema),
    };

    function getContrastYIQ(hexcolor: any) {
        var r = parseInt(hexcolor.substring(1, 3), 16);
        var g = parseInt(hexcolor.substring(3, 5), 16);
        var b = parseInt(hexcolor.substring(5, 7), 16);
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "black" : "white";
    }

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
                    listUrl={listUrl}
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
                    Сарын тайлан
                </Typography>
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
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                            backgroundColor: "white",
                                            color: "black",
                                        }}
                                        key={"room"}
                                    >
                                        Өрөө
                                    </TableCell>
                                    {columns &&
                                        columns.map((entity: any) => (
                                            <TableCell
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px",
                                                    fontSize: "9px",
                                                    lineHeight: "14px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    width: "100px",
                                                }}
                                                key={entity}
                                            >
                                                {moment(entity).format("MM.DD")}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData &&
                                    Object.keys(reportData).map((key) => (
                                        <>
                                            {reportData[key] &&
                                                Object.keys(
                                                    reportData[key]
                                                ).map((key2) => (
                                                    <TableRow
                                                        key={key2}
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
                                                                padding: "6px",
                                                                fontSize: "9px",
                                                                lineHeight:
                                                                    "14px",
                                                            }}
                                                            colSpan={1}
                                                        >
                                                            {key2}
                                                        </TableCell>
                                                        {columns &&
                                                            columns.map(
                                                                (
                                                                    entity: any
                                                                ) => (
                                                                    <TableCell
                                                                        style={{
                                                                            padding:
                                                                                "0px",
                                                                            fontSize:
                                                                                "9px",
                                                                            lineHeight:
                                                                                "14px",
                                                                        }}
                                                                        key={
                                                                            entity
                                                                        }
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                width: "40px",
                                                                                overflow:
                                                                                    "hidden",
                                                                            }}
                                                                        >
                                                                            {reportData[
                                                                                key
                                                                            ][
                                                                                key2
                                                                            ] &&
                                                                                reportData[
                                                                                    key
                                                                                ][
                                                                                    key2
                                                                                ]
                                                                                    .filter(
                                                                                        (
                                                                                            entityData: any
                                                                                        ) => {
                                                                                            return (
                                                                                                new Date(
                                                                                                    entity
                                                                                                ) >=
                                                                                                    new Date(
                                                                                                        `${moment(
                                                                                                            entityData.StartDate
                                                                                                        ).format(
                                                                                                            "YYYY-MM-DD"
                                                                                                        )} 00:00`
                                                                                                    ) &&
                                                                                                new Date(
                                                                                                    entity
                                                                                                ) <
                                                                                                    new Date(
                                                                                                        `${moment(
                                                                                                            entityData.EndDate
                                                                                                        ).format(
                                                                                                            "YYYY-MM-DD"
                                                                                                        )} 00:00`
                                                                                                    )
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            blog: any
                                                                                        ) => {
                                                                                            console.log(
                                                                                                "blog",
                                                                                                blog
                                                                                            );
                                                                                            return (
                                                                                                <TableCell
                                                                                                    style={{
                                                                                                        padding:
                                                                                                            "6px",
                                                                                                        fontSize:
                                                                                                            "9px",
                                                                                                        lineHeight:
                                                                                                            "14px",
                                                                                                        width: "100px",

                                                                                                        backgroundColor: `#${blog.StatusColor}`,
                                                                                                        color: getContrastYIQ(
                                                                                                            `#${blog.StatusColor}`
                                                                                                        ),
                                                                                                    }}
                                                                                                    key={`${blog.GuestName}-${entity}`}
                                                                                                >
                                                                                                    {
                                                                                                        blog.GuestName
                                                                                                    }
                                                                                                </TableCell>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                        </div>
                                                                    </TableCell>
                                                                )
                                                            )}
                                                    </TableRow>
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
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                        fontWeight: "bold",
                                                    }}
                                                    // colSpan={
                                                    //     columns
                                                    //         ? columns.length + 1
                                                    //         : 1
                                                    // }
                                                >
                                                    {key}
                                                </TableCell>
                                                {columns &&
                                                    columns.map(
                                                        (entity: any) => (
                                                            <TableCell
                                                                key={`${key}-${entity}`}
                                                                component="th"
                                                                scope="row"
                                                                align="center"
                                                                style={{
                                                                    padding:
                                                                        "6px",
                                                                    fontSize:
                                                                        "9px",
                                                                    lineHeight:
                                                                        "14px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {Number(
                                                                    Object.keys(
                                                                        reportData[
                                                                            key
                                                                        ]
                                                                    ).length
                                                                ) -
                                                                    Number(
                                                                        Object.values(
                                                                            reportData[
                                                                                key
                                                                            ]
                                                                        ).filter(
                                                                            (
                                                                                entityData: any
                                                                            ) => {
                                                                                return entityData.filter(
                                                                                    (
                                                                                        entityData2: any
                                                                                    ) => {
                                                                                        return (
                                                                                            new Date(
                                                                                                entity
                                                                                            ) >=
                                                                                                new Date(
                                                                                                    `${moment(
                                                                                                        entityData2.StartDate
                                                                                                    ).format(
                                                                                                        "YYYY-MM-DD"
                                                                                                    )} 00:00`
                                                                                                ) &&
                                                                                            new Date(
                                                                                                entity
                                                                                            ) <
                                                                                                new Date(
                                                                                                    `${moment(
                                                                                                        entityData2.EndDate
                                                                                                    ).format(
                                                                                                        "YYYY-MM-DD"
                                                                                                    )} 00:00`
                                                                                                )
                                                                                        );
                                                                                    }
                                                                                )
                                                                                    .length >
                                                                                    0
                                                                                    ? true
                                                                                    : false;
                                                                            }
                                                                        ).length
                                                                    )}
                                                                /
                                                                {
                                                                    Object.keys(
                                                                        reportData[
                                                                            key
                                                                        ]
                                                                    ).length
                                                                }
                                                            </TableCell>
                                                        )
                                                    )}
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
                                        key={"1"}
                                        component="th"
                                        scope="row"
                                        style={{
                                            padding: "6px",
                                            fontSize: "9px",
                                            lineHeight: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Нийт
                                    </TableCell>
                                    {columns &&
                                        columns.map((entity: any) => (
                                            <TableCell
                                                key={`${entity}-total`}
                                                component="th"
                                                scope="row"
                                                style={{
                                                    padding: "6px",
                                                    fontSize: "9px",
                                                    lineHeight: "14px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {availableRooms &&
                                                    availableRooms[0] &&
                                                    availableRooms[0][
                                                        `D${moment(
                                                            entity
                                                        ).format("D")}`
                                                    ] &&
                                                    availableRooms[0][
                                                        `D${moment(
                                                            entity
                                                        ).format("D")}`
                                                    ]}
                                            </TableCell>
                                        ))}
                                    {/* {groupminus1 &&
                                        groupminus1.map(
                                            (groupminus: any, index: any) => (
                                                <TableCell
                                                    key={index}
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        padding: "6px",
                                                        fontSize: "9px",
                                                        lineHeight: "14px",
                                                    }}
                                                    colSpan={1}
                                                >
                                                    {
                                                        groupminus.CurrAll.split(
                                                            "/"
                                                        )[0]
                                                    }
                                                </TableCell>
                                            )
                                        )} */}
                                </TableRow>
                                {/* {reportData &&
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
                                                        }}
                                                        colSpan={11}
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
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .StatusDescription
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Arrival
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {moment(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Departure
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .SourceName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .FolioNo
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .RateTypeName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Debit
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Paid
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                >
                                                                    {formatPrice(
                                                                        reportData[
                                                                            key
                                                                        ][key2]
                                                                            .Balance
                                                                    )}
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
                                                        }}
                                                        align="right"
                                                        colSpan={11}
                                                    >
                                                        {reportData &&
                                                            reportData[key] &&
                                                            formatPrice(
                                                                reportData[
                                                                    key
                                                                ].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        obj.Balance,
                                                                    0
                                                                )
                                                            )}
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
                                        }}
                                        align="right"
                                        colSpan={11}
                                    >
                                        {formatPrice(totalBalance)}
                                    </TableCell>
                                </TableRow> */}

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

export default ReportingList;

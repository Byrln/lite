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
    Box,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "components/iconify/iconify";

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import Search from "./search";
import { formatPrice } from "lib/utils/helpers";

const ArrivalDeparture = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData]: any = useState(null);
    const [groupedData, setGroupedData]: any = useState(null);
    const [ReportType, setReportType] = useState<any>("arrival");

    const [search, setSearch] = useState<any>({
        StartDate: moment(dateStringToObj(workingDate)).format("YYYY-MM-DD"),
        EndDate: moment(dateStringToObj(workingDate))
            .add(1, "months")
            .format("YYYY-MM-DD"),
    });

    const groupBy = (items: any, key: any) =>
        items.reduce(
            (result: any, item: any) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
        );

    const fetchDatas = async () => {
        try {
            let response: any;
            response = await ReportAPI.extraChargeDetailed(search);

            let tempValue = groupBy(response, "RoomChargeGroupName");
            setGroupedData(tempValue);

            let tempValue2 = { ...tempValue };
            Object.keys(tempValue2).forEach((RoomChargeGroupName) => {
                let temp: any = groupBy(
                    tempValue2[RoomChargeGroupName],
                    "RoomChargeTypeName"
                );
                tempValue2[RoomChargeGroupName] = temp;
            });
            setReportData(tempValue2);
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [search, ReportType]);

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
                        ReportType={ReportType}
                        setReportType={setReportType}
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
                            {intl.formatMessage({id:"ReportingPeriod"}) }
                        </span>{" "}
                        {search.StartDate &&
                            `(${moment(search.StartDate).format(
                                "YYYY.MM.DD"
                            )}  -  ${moment(search.EndDate).format(
                                "YYYY.MM.DD"
                            )})`}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {reportData &&
                        Object.keys(reportData).map((key) => (
                            <Grid item xs={12} key={key}>
                                <div style={{ fontWeight: "bold" }}>{key}</div>
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
                                            >
                                               {intl.formatMessage({id:"ReportItemName"}) }
                                            </TableCell>

                                            <TableCell
                                                align="left"
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px",
                                                    fontSize: "10px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ReportRoomAndType"}) }
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px",

                                                    fontSize: "10px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ReportActionDate"}) }
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px",

                                                    fontSize: "10px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ReportUnitPrice"}) }
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "2px",

                                                    fontSize: "10px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ReportQuantity"}) }
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ReportSum"}) }
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"ConfigUser"}) }
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                }}
                                            >
                                               {intl.formatMessage({id:"TextEntered"}) }
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reportData[key] &&
                                            Object.keys(reportData[key]).map(
                                                (key2) => (
                                                    <>
                                                        {/* <TableRow
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
                                                                    fontSize:
                                                                        "10px",
                                                                    padding:
                                                                        "2px 10px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                colSpan={8}
                                                            >
                                                                {key2}
                                                            </TableCell>
                                                        </TableRow> */}
                                                        {reportData[key][
                                                            key2
                                                        ] &&
                                                            reportData[key][
                                                                key2
                                                            ].map(
                                                                (
                                                                    entity: any,
                                                                    index: any
                                                                ) => (
                                                                    <>
                                                                        <TableRow
                                                                            key={
                                                                                index
                                                                            }
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
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    entity.RoomChargeTypeName
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    entity.RoomFullNo
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="left"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {moment(
                                                                                    entity.ChargeDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD "
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="right"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {formatPrice(
                                                                                    entity.UnitPrice
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="right"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    entity.Quantity
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="right"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {formatPrice(
                                                                                    entity.Amount
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="left"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    entity.UserName
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                align="left"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    padding:
                                                                                        "2px",
                                                                                }}
                                                                            >
                                                                                {moment(
                                                                                    entity.CreatedDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD hh:mm:ss"
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                )
                                                            )}
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
                                                                    fontSize:
                                                                        "10px",
                                                                    padding:
                                                                        "2px 10px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                colSpan={4}
                                                            ></TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    padding:
                                                                        "2px ",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                align="right"
                                                            >
                                                                {reportData[
                                                                    key
                                                                ][key2].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        (obj.Quantity
                                                                            ? obj.Quantity
                                                                            : 0),
                                                                    0
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    padding:
                                                                        "2px ",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                align="right"
                                                            >
                                                                {formatPrice(
                                                                    reportData[
                                                                        key
                                                                    ][
                                                                        key2
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.Amount
                                                                                ? obj.Amount
                                                                                : 0),
                                                                        0
                                                                    )
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    padding:
                                                                        "2px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                                colSpan={2}
                                                            ></TableCell>
                                                        </TableRow>
                                                    </>
                                                )
                                            )}
                                        <TableRow
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
                                                    padding: "2px",
                                                    fontWeight: "bold",
                                                }}
                                                colSpan={4}
                                            >
                                                {key}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px ",
                                                    fontWeight: "bold",
                                                }}
                                                align="right"
                                            ></TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px ",
                                                    fontWeight: "bold",
                                                }}
                                                align="right"
                                            >
                                                {formatPrice(
                                                    groupedData[key].reduce(
                                                        (acc: any, obj: any) =>
                                                            acc +
                                                            (obj.Amount
                                                                ? obj.Amount
                                                                : 0),
                                                        0
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    fontSize: "10px",
                                                    padding: "2px",
                                                    fontWeight: "bold",
                                                }}
                                                colSpan={2}
                                            ></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        ))}
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

export default ArrivalDeparture;

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
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "components/iconify/iconify";

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const Breakfast = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [reportData, setReportData]: any = useState(null);
    const [groupedData, setGroupedData]: any = useState(null);

    const [search, setSearch] = useState<any>({
        CurrDate: moment(dateStringToObj(workingDate)),
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
            const response: any = await ReportAPI.breakfast({
                CurrDate: search.CurrDate.format("YYYY-MM-DD"),
                Mandatory: null,
            });
            if (response) {
                response.sort((a: any, b: any) => {
                    if (Number(a.RoomNo) < Number(b.RoomNo)) return -1;
                    if (Number(a.RoomNo) > Number(b.RoomNo)) return 1;
                    return 0;
                });
                setReportData(response);
                let tempValue = groupBy(response, "CountryName");
                setGroupedData(tempValue);
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

    const renderIcons = (guestCnt: any) => {
        const stars: any[] = [];

        for (let i = 0; i < guestCnt; i++) {
            stars.push(<Iconify icon="mingcute:round-line" width="12px" />);
        }

        return stars;
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
                            Өглөөний цай
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        {search.CurrDate &&
                            `${moment(search.CurrDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}`}
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
                                            padding: "2px 10px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        №
                                    </TableCell>

                                    {/* <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",
                                            fontSize: "10px",
                                        }}
                                    >
                                        Захиалгын дугаар
                                    </TableCell> */}
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Өрөө №
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Зочны тоо
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            padding: "2px",

                                            fontSize: "10px",
                                        }}
                                    >
                                        Өглөөний цайтай эсэх
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                            width: "50px",
                                        }}
                                    >
                                        Ирсэн
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Улс орон
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            width: "150px",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Өрөөнд эсвэл ресторан /Хэдэн цагт/
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Вауцертай эсэх
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{
                                            fontWeight: "bold",
                                            width: "350px",
                                            fontSize: "10px",
                                            padding: "2px",
                                        }}
                                    >
                                        Нэмэлт тайлбар
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
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px 10px",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </TableCell>
                                                    {/* <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.ReservationNo}
                                                    </TableCell> */}
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.RoomNo}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="center"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.GuestCnt}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.Breakfast ==
                                                        true
                                                            ? "BF"
                                                            : "No bf"}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            width: "50px",
                                                        }}
                                                    >
                                                        {renderIcons(
                                                            entity.GuestCnt
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    >
                                                        {entity.CountryName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            width: "150px",
                                                        }}
                                                    ></TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                        }}
                                                    ></TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        align="left"
                                                        style={{
                                                            fontSize: "10px",
                                                            padding: "2px",
                                                            width: "350px",
                                                        }}
                                                    ></TableCell>
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
                                            fontSize: "11px",
                                            padding: "2px",
                                        }}
                                        colSpan={10}
                                        align="left"
                                    >
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Хянасан ресепшн :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        ></span>
                                        <br />
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Нийт зочин :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        >
                                            {reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc + obj.GuestCnt,
                                                    0
                                                )}
                                        </span>
                                        <br />
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Өглөөний цайнд орох зочин :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        >
                                            {reportData &&
                                                reportData.reduce(
                                                    (acc: any, obj: any) =>
                                                        acc +
                                                        (obj.Breakfast == true
                                                            ? obj.GuestCnt
                                                            : 0),
                                                    0
                                                )}
                                        </span>
                                        <br />

                                        {groupedData &&
                                            Object.keys(groupedData).map(
                                                (countryName) => (
                                                    <>
                                                        <span
                                                            style={{
                                                                width: "90px",
                                                                textAlign:
                                                                    "left",
                                                                marginRight:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {countryName} :{" "}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    "600",
                                                            }}
                                                        >
                                                            {groupedData[
                                                                countryName
                                                            ] &&
                                                                groupedData[
                                                                    countryName
                                                                ].reduce(
                                                                    (
                                                                        acc: any,
                                                                        obj: any
                                                                    ) =>
                                                                        acc +
                                                                        (obj.Breakfast ==
                                                                        true
                                                                            ? obj.GuestCnt
                                                                            : 0),
                                                                    0
                                                                )}
                                                        </span>
                                                        <br />
                                                    </>
                                                )
                                            )}
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Боолтоор авах зочин :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        ></span>
                                        <br />
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Цагаан хоол :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        ></span>
                                        <br />
                                        <span
                                            style={{
                                                width: "90px",
                                                textAlign: "left",
                                                marginRight: "11px",
                                            }}
                                        >
                                            Бусад тайлбар :{" "}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        ></span>
                                        <br />
                                        <br />
                                    </TableCell>
                                </TableRow>
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

export default Breakfast;

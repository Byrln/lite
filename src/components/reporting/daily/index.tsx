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
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { CheckedOutDetailedSWR, checkedOutDetailedUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";

import { DailyInfoSWR } from "lib/api/report";

const Folio = ({ title, workingDate }: any) => {
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [totalBalance, setTotalBalance] = useState<any>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [finalData, setFinalData] = useState<any>(null);

    const { data, error } = DailyInfoSWR();

    const handlePrint = useReactToPrint({
        pageStyle: `@media print {
            @page {
              padding: 20px;
            }
            .MuiTableCell-root{
                border:1px solid !important;
                font-size:8px !important;
                line-height:8px !important
                padding:4px !important

              }
              .MuiTableCell-head, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer{
                border:1px solid !important;
                background-color: none !important;
                color :inherit !important;
                font-size:8px !important;
                line-height:8px !important;
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
            let tempValue = groupBy(data, "FloorNo");
            console.log("data", data);
            console.log("tempValue", tempValue);
            setFinalData(tempValue);
        }
    }, [data]);

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
            </div>

            <div ref={componentRef}>
                <Box
                    sx={{
                        display: "flex",
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
                            Өдрийн мэдээ
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            Тайлант үе :{" "}
                        </span>{" "}
                        {workingDate &&
                            moment(workingDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                    </Typography>
                </Box>
                <ImageList variant="masonry" cols={2} gap={8}>
                    {finalData &&
                        Object.keys(finalData).map((key) => (
                            <ImageListItem
                                key={key}
                                style={{
                                    width: "100%",
                                    height: "fit-content",
                                }}
                            >
                                <div style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            height: "20px",
                                        }}
                                    >
                                        {" "}
                                        {key} давхар
                                    </div>

                                    <Table
                                        // sx={{ minWidth: 650 }}
                                        aria-label="simple table"
                                        size="small"
                                        key={rerenderKey}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Өрөө
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Байгууллага
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Улс
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Ирэх
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Гарах
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Тоо
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Төлөх
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {finalData[key] &&
                                                finalData[key].map(
                                                    (
                                                        element: any,
                                                        index: number
                                                    ) => (
                                                        <>
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
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        element.RoomNo
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        element.CustomerName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        element.CountryName
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {element.ArrivalDate &&
                                                                        moment(
                                                                            element.ArrivalDate
                                                                        ).format(
                                                                            "YYYY-MM-DD"
                                                                        )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {element.DepartureDate &&
                                                                        moment(
                                                                            element.DepartureDate
                                                                        ).format(
                                                                            "YYYY-MM-DD"
                                                                        )}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {
                                                                        element.Adult
                                                                    }
                                                                    /
                                                                    {
                                                                        element.Child
                                                                    }
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="right"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        padding:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    {formatPrice(
                                                                        element.Balance
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
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                    align="right"
                                                    colSpan={2}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "left",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Ирэх:
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <div className="mr-2">
                                                            Өрөө:{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.ArrivalDate &&
                                                                            moment(
                                                                                obj.ArrivalDate
                                                                            ).format(
                                                                                "YYYY-MM-DD"
                                                                            ) ==
                                                                                moment(
                                                                                    workingDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD"
                                                                                )
                                                                                ? 1
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            Зочин :{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.ArrivalDate &&
                                                                            moment(
                                                                                obj.ArrivalDate
                                                                            ).format(
                                                                                "YYYY-MM-DD"
                                                                            ) ==
                                                                                moment(
                                                                                    workingDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD"
                                                                                )
                                                                                ? obj.Adult +
                                                                                  obj.Child
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                    align="right"
                                                    colSpan={2}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "left",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Байгаа:
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <div className="mr-2">
                                                            Байгаа:{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.ArrivalDate &&
                                                                            obj.DepartureDate &&
                                                                            new Date(
                                                                                obj.ArrivalDate
                                                                            ) <
                                                                                new Date(
                                                                                    workingDate
                                                                                ) &&
                                                                            new Date(
                                                                                workingDate
                                                                            ) <
                                                                                new Date(
                                                                                    obj.DepartureDate
                                                                                )
                                                                                ? 1
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            Зочин :{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.ArrivalDate &&
                                                                            obj.DepartureDate &&
                                                                            new Date(
                                                                                obj.ArrivalDate
                                                                            ) <
                                                                                new Date(
                                                                                    workingDate
                                                                                ) &&
                                                                            new Date(
                                                                                workingDate
                                                                            ) <
                                                                                new Date(
                                                                                    obj.DepartureDate
                                                                                )
                                                                                ? obj.Adult +
                                                                                  obj.Child
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                    align="right"
                                                    colSpan={2}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "left",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Гарах:
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <div className="mr-2">
                                                            Өрөө:{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.DepartureDate &&
                                                                            moment(
                                                                                obj.DepartureDate
                                                                            ).format(
                                                                                "YYYY-MM-DD"
                                                                            ) ==
                                                                                moment(
                                                                                    workingDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD"
                                                                                )
                                                                                ? 1
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            Зочин :{" "}
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {finalData[
                                                                    key
                                                                ] &&
                                                                    finalData[
                                                                        key
                                                                    ].reduce(
                                                                        (
                                                                            acc: any,
                                                                            obj: any
                                                                        ) =>
                                                                            acc +
                                                                            (obj.DepartureDate &&
                                                                            moment(
                                                                                obj.DepartureDate
                                                                            ).format(
                                                                                "YYYY-MM-DD"
                                                                            ) ==
                                                                                moment(
                                                                                    workingDate
                                                                                ).format(
                                                                                    "YYYY-MM-DD"
                                                                                )
                                                                                ? obj.Adult +
                                                                                  obj.Child
                                                                                : 0),
                                                                        0
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "8px",
                                                        padding: "2px",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "left",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Орлого :{" "}
                                                        {finalData[key] &&
                                                            formatPrice(
                                                                finalData[
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
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </ImageListItem>
                        ))}
                    <ImageListItem
                        key={"total"}
                        style={{
                            width: "100%",
                            height: "fit-content",
                        }}
                    >
                        {" "}
                        <div
                            style={{
                                fontWeight: "bold",
                                height: "20px",
                                marginTop: "20px",
                            }}
                        >
                            {" "}
                            Нийт:
                        </div>
                        <Table
                            // sx={{ minWidth: 650 }}
                            aria-label="simple table"
                            size="small"
                            key={rerenderKey}
                        >
                            <TableBody>
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
                                            fontSize: "8px",
                                            padding: "2px",
                                        }}
                                        align="right"
                                        colSpan={2}
                                    >
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Ирэх:
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div className="mr-2">
                                                Өрөө:{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.ArrivalDate &&
                                                                moment(
                                                                    obj.ArrivalDate
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                ) ==
                                                                    moment(
                                                                        workingDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                                    ? 1
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                            <div>
                                                Зочин :{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.ArrivalDate &&
                                                                moment(
                                                                    obj.ArrivalDate
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                ) ==
                                                                    moment(
                                                                        workingDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                                    ? obj.Adult +
                                                                      obj.Child
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "8px",
                                            padding: "2px",
                                        }}
                                        align="right"
                                        colSpan={2}
                                    >
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Байгаа:
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div className="mr-2">
                                                Байгаа:{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.ArrivalDate &&
                                                                obj.DepartureDate &&
                                                                new Date(
                                                                    obj.ArrivalDate
                                                                ) <
                                                                    new Date(
                                                                        workingDate
                                                                    ) &&
                                                                new Date(
                                                                    workingDate
                                                                ) <
                                                                    new Date(
                                                                        obj.DepartureDate
                                                                    )
                                                                    ? 1
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                            <div>
                                                Зочин :{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.ArrivalDate &&
                                                                obj.DepartureDate &&
                                                                new Date(
                                                                    obj.ArrivalDate
                                                                ) <
                                                                    new Date(
                                                                        workingDate
                                                                    ) &&
                                                                new Date(
                                                                    workingDate
                                                                ) <
                                                                    new Date(
                                                                        obj.DepartureDate
                                                                    )
                                                                    ? obj.Adult +
                                                                      obj.Child
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontSize: "8px",
                                            padding: "2px",
                                        }}
                                        align="right"
                                        colSpan={2}
                                    >
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Гарах:
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div className="mr-2">
                                                Өрөө:{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.DepartureDate &&
                                                                moment(
                                                                    obj.DepartureDate
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                ) ==
                                                                    moment(
                                                                        workingDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                                    ? 1
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                            <div>
                                                Зочин :{" "}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {data &&
                                                        data.reduce(
                                                            (
                                                                acc: any,
                                                                obj: any
                                                            ) =>
                                                                acc +
                                                                (obj.DepartureDate &&
                                                                moment(
                                                                    obj.DepartureDate
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                ) ==
                                                                    moment(
                                                                        workingDate
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    )
                                                                    ? obj.Adult +
                                                                      obj.Child
                                                                    : 0),
                                                            0
                                                        )}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "8px",
                                            padding: "2px",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Орлого :{" "}
                                            {data &&
                                                formatPrice(
                                                    data.reduce(
                                                        (acc: any, obj: any) =>
                                                            acc + obj.Balance,
                                                        0
                                                    )
                                                )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-3">
                            <Typography
                                variant="body1"
                                gutterBottom
                                className="mr-3"
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Хэвлэсэн :{" "}
                                </span>{" "}
                                {localStorage.getItem("username")}
                            </Typography>
                            <Typography
                                variant="body1"
                                gutterBottom
                                className="mr-1"
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Хэвлэсэн огноо :{" "}
                                </span>{" "}
                                {moment(new Date()).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )}
                            </Typography>
                        </div>
                    </ImageListItem>
                </ImageList>
            </div>
        </>
    );
};

export default Folio;

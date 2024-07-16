import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useIntl } from "react-intl";
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

import { ReportAPI, breakfastUrl } from "lib/api/report";
import { dateStringToObj } from "lib/utils/helpers";
import { formatPrice } from "lib/utils/helpers";
import CustomSearch from "components/common/custom-search";
import { CustomerSWR } from "lib/api/customer";
import Search from "./search";

const Breakfast = ({ title, workingDate }: any) => {
    const intl = useIntl();
    const componentRef: any = useRef<HTMLDivElement>(null);
    const [rerenderKey, setRerenderKey] = useState(0);
    const [mandatoryData, setMandatoryData]: any = useState(null);
    const [totalMandatory, setTotalMandatory]: any = useState(null);
    const [totalNonMandatory, setTotalNonMandatory]: any = useState(null);

    const [nonMandatoryData, setNonMandatoryData]: any = useState(null);
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
            const mand: any = await ReportAPI.breakfast({
                CurrDate: search.CurrDate.format("YYYY-MM-DD"),
                Mandatory: true,
            });
            if (mand) {
                let tempValue = groupBy(mand, "RoomTypeName");
                let tempValueRoom = groupBy(mand, "RoomNo");
                let tempValueGuest = groupBy(mand, "GuestName");

                let tempGuestValue = 0;

                Object.keys(tempValue).forEach((roomType) => {
                    const tempRoom = groupBy(tempValue[roomType], "RoomNo");
                    const tempGuest = groupBy(tempValue[roomType], "GuestName");

                    tempValue[roomType][0].GuestCount = 0;
                    tempValue[roomType].map((entity: any) => {
                        tempValue[roomType][0].GuestCount =
                            Number(tempValue[roomType][0].GuestCount) +
                            Number(entity.Adult) +
                            Number(entity.Child);
                    });
                    tempGuestValue =
                        tempGuestValue + tempValue[roomType][0].GuestCount;
                    tempValue[roomType][0].RoomCount =
                        Object.keys(tempRoom).length;
                });

                setTotalMandatory({
                    Total: mand.length,
                    RoomCount: Object.keys(tempValueRoom).length,
                    GuestCount: tempGuestValue,
                });

                setMandatoryData(tempValue);
            }
            const nonmand: any = await ReportAPI.breakfast({
                CurrDate: search.CurrDate.format("YYYY-MM-DD"),
                Mandatory: false,
            });
            if (nonmand) {
                let tempNonValue = groupBy(nonmand, "RoomTypeName");
                let tempNonValueRoom = groupBy(nonmand, "RoomNo");
                let tempNonValueGuest = groupBy(nonmand, "GuestName");

                let tempGuestValue = 0;

                Object.keys(tempNonValue).forEach((roomType) => {
                    const tempRoom = groupBy(tempNonValue[roomType], "RoomNo");
                    const tempGuest = groupBy(
                        tempNonValue[roomType],
                        "GuestName"
                    );

                    tempNonValue[roomType][0].GuestCount = 0;
                    tempNonValue[roomType].map((entity: any) => {
                        tempNonValue[roomType][0].GuestCount =
                            Number(tempNonValue[roomType][0].GuestCount) +
                            Number(entity.Adult) +
                            Number(entity.Child);
                    });
                    tempGuestValue =
                        tempGuestValue + tempNonValue[roomType][0].GuestCount;
                    tempNonValue[roomType][0].RoomCount =
                        Object.keys(tempRoom).length;

                    tempNonValue[roomType][0].RoomCount =
                        Object.keys(tempRoom).length;
                });

                setTotalNonMandatory({
                    Total: nonmand.length,
                    RoomCount: Object.keys(tempNonValueRoom).length,
                    GuestCount: tempGuestValue,
                });

                setNonMandatoryData(tempNonValue);
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
                    { intl.formatMessage({id:"ButtonPrint"}) } 
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
                          { intl.formatMessage({id:"ReportGuestforBreakfast"}) } 
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            { intl.formatMessage({id:"ButtonReport"}) } 
                        </span>{" "}
                        {search.CurrDate &&
                            moment(search.CurrDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                    </Typography>
                </Box>
                <div
                    style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginLeft: "24px",
                        marginBottom: "12px",
                    }}
                >
                    { intl.formatMessage({id:"RowHeaderDate"}) } 
                </div>
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
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        №
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                    { intl.formatMessage({id:"TextOrganization"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"RowHeaderName"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"ReportCountry"}) } 
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"Left_SortByRoom"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        { intl.formatMessage({id:"MenuNumber"}) } 
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mandatoryData &&
                                    Object.keys(mandatoryData).map((key) => (
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
                                            {mandatoryData[key] &&
                                                Object.keys(
                                                    mandatoryData[key]
                                                ).map((key2, index) => (
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
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    mandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .CustomerName
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    mandatoryData[
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
                                                                    mandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .CountryName
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    mandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .RoomNo
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    mandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .Adult
                                                                }
                                                                /
                                                                {
                                                                    mandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .Child
                                                                }
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
                                                    colSpan={4}
                                                ></TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
                                                >
                                                  { intl.formatMessage({id:"ConfigRooms"}) } 
                                                    {mandatoryData &&
                                                        mandatoryData[key] &&
                                                        mandatoryData[key][0] &&
                                                        mandatoryData[key][0]
                                                            .RoomCount &&
                                                        mandatoryData[key][0]
                                                            .RoomCount}
                                                </TableCell>

                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
                                                >
                                                  {intl.formatMessage({id:"RowHeaderGuest"}) }
                                                    {mandatoryData &&
                                                        mandatoryData[key] &&
                                                        mandatoryData[key][0] &&
                                                        mandatoryData[key][0]
                                                            .GuestCount &&
                                                        mandatoryData[key][0]
                                                            .GuestCount}
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
                                        colSpan={4}
                                    >
                                       { intl.formatMessage({id:"TotalNumberOfBreakfastGuests"}) } 
                                        {totalMandatory &&
                                            totalMandatory.Total &&
                                            totalMandatory.Total}
                                    </TableCell>

                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        { intl.formatMessage({id:"ConfigRooms"}) } 
                                        {totalMandatory &&
                                            totalMandatory.RoomCount &&
                                            totalMandatory.RoomCount}
                                    </TableCell>

                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                        { intl.formatMessage({id:"RowHeaderGuest"}) } 
                                        {totalMandatory &&
                                            totalMandatory.GuestCount &&
                                            totalMandatory.GuestCount}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={4}></Grid>
                </Grid>
                <br />
                <br />
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
                            { intl.formatMessage({id:"ReportGuestforBreakfast"}) } 
                        </Typography>
                    </div>
                    <Typography variant="body1" gutterBottom className="mr-1">
                        <span style={{ fontWeight: "bold" }}>
                            {" "}
                            { intl.formatMessage({id:"ButtonReport"}) } 
                        </span>{" "}
                        {search.CurrDate &&
                            moment(search.CurrDate, "YYYY.MM.DD").format(
                                "YYYY.MM.DD"
                            )}
                    </Typography>
                </Box>
                <div
                    style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginLeft: "24px",
                        marginBottom: "12px",
                    }}
                >
                     { intl.formatMessage({id:"RowHeaderDate"}) } 
                </div>
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
                                    <TableCell style={{ fontWeight: "bold" }}>
                                        №
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                       { intl.formatMessage({id:"TextOrganization"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"RowHeaderFirstName"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        { intl.formatMessage({id:"ReportCountry"}) } 
                                    </TableCell>

                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                         { intl.formatMessage({id:"Left_SortByRoom"}) } 
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        { intl.formatMessage({id:"MenuNumber"}) } 
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nonMandatoryData &&
                                    Object.keys(nonMandatoryData).map((key) => (
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
                                            {nonMandatoryData[key] &&
                                                Object.keys(
                                                    nonMandatoryData[key]
                                                ).map((key2, index) => (
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
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    nonMandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .CustomerName
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    nonMandatoryData[
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
                                                                    nonMandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .CountryName
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    nonMandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .RoomNo
                                                                }
                                                            </TableCell>
                                                            <TableCell
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {
                                                                    nonMandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .Adult
                                                                }
                                                                /
                                                                {
                                                                    nonMandatoryData[
                                                                        key
                                                                    ][key2]
                                                                        .Child
                                                                }
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
                                                    colSpan={4}
                                                ></TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
                                                >
                                                     {intl.formatMessage({id:"ConfigRooms"}) }
                                                    {nonMandatoryData &&
                                                        nonMandatoryData[key] &&
                                                        nonMandatoryData[
                                                            key
                                                        ][0] &&
                                                        nonMandatoryData[key][0]
                                                            .RoomCount &&
                                                        nonMandatoryData[key][0]
                                                            .RoomCount}
                                                </TableCell>

                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                    align="right"
                                                    colSpan={1}
                                                >
                                                   {intl.formatMessage({id:"RowHeaderGuest"}) }
                                                    {nonMandatoryData &&
                                                        nonMandatoryData[key] &&
                                                        nonMandatoryData[
                                                            key
                                                        ][0] &&
                                                        nonMandatoryData[key][0]
                                                            .GuestCount &&
                                                        nonMandatoryData[key][0]
                                                            .GuestCount}
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
                                        colSpan={4}
                                    >
                                       {intl.formatMessage({id:"NumberOfBreakfast"}) }
                                        {totalNonMandatory &&
                                            totalNonMandatory.Total &&
                                            totalNonMandatory.Total}
                                    </TableCell>

                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                 {intl.formatMessage({id:"ConfigRooms"}) }
                                        {totalNonMandatory &&
                                            totalNonMandatory.RoomCount &&
                                            totalNonMandatory.RoomCount}
                                    </TableCell>

                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        align="right"
                                        colSpan={1}
                                    >
                                         {intl.formatMessage({id:"RowHeaderGuest"}) }
                                        {totalNonMandatory &&
                                            totalNonMandatory.GuestCount &&
                                            totalNonMandatory.GuestCount}
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

export default Breakfast;

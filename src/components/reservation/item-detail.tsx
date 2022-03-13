import { ReservationApi } from "lib/api/reservation";
import { useState, useEffect } from "react";
import { Grid, Box, Paper, Typography } from "@mui/material";
import { fToCustom, countNights } from "lib/utils/format-time";
import ReservationNav from "./_reservation-nav";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FrontOfficeAPI } from "lib/api/front-office";

const styleTime = {
    backgroundColor: "#00008B",
    color: "#ffffff",
    px: 2,
    py: 2,
    p: {
        fontSize: "1.1em",
        textAlign: "center",
        fontWeight: "600",
    },
};

const styleNight = {
    backgroundColor: "orange",
    color: "#ffffff",
    px: 2,
    py: 2,
    p: {
        fontSize: "1.1em",
        textAlign: "center",
        fontWeight: "600",
    },
};

const ItemDetail = ({ itemInfo }: any) => {
    const [reservation, setReservation]: any = useState(null);
    const [transactionInfo, setTransactionInfo]: any = useState(null);

    const reloadDetailInfo = async () => {
        var res = await ReservationApi.get(itemInfo.transactionId);
        var trs = await FrontOfficeAPI.transactionInfo(itemInfo.transactionId);
        setReservation(res);
        setTransactionInfo(trs);
    };

    useEffect(() => {
        reloadDetailInfo();
    }, [itemInfo]);

    return (
        <>
            {transactionInfo && (
                <Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <h4>{reservation?.GuestName}</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        px: 1,
                                        backgroundColor:
                                            "#" + transactionInfo.StatusColor,
                                        color: "white",
                                    }}
                                >
                                    <Typography>
                                        {reservation &&
                                            reservation.ReservationTypeName}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Box sx={styleTime}>
                                <p>
                                    {fToCustom(
                                        transactionInfo.ArrivalDate,
                                        "MMM dd"
                                    )}
                                </p>
                                <p>
                                    {fToCustom(
                                        transactionInfo.ArrivalDate,
                                        "kk:mm:ss"
                                    )}
                                </p>
                            </Box>
                            <Box sx={styleNight}>
                                <p>{countNights(transactionInfo.ArrivalDate, transactionInfo.DepartureDate)}</p>
                                <p>Night</p>
                            </Box>
                            <Box sx={styleTime}>
                                <p>
                                    {fToCustom(
                                        transactionInfo.DepartureDate,
                                        "MMM dd"
                                    )}
                                </p>
                                <p>
                                    {fToCustom(
                                        transactionInfo.DepartureDate,
                                        "kk:mm:ss"
                                    )}
                                </p>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <b>ReservationNo</b>
                                        </TableCell>
                                        <TableCell>
                                            {transactionInfo.ReservationNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Group Code</b>
                                        </TableCell>
                                        <TableCell>
                                            {transactionInfo.GroupCode}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Booker Name</b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation?.UserName}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={2}>
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={itemInfo}
                                transactionInfo={transactionInfo}
                                reloadDetailInfo={reloadDetailInfo}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default ItemDetail;

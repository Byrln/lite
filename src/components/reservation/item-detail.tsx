import { ReservationApi } from "lib/api/reservation";
import { useState, useEffect } from "react";
import { Grid, Box, Paper, Typography } from "@mui/material";
import { fToCustom } from "lib/utils/format-time";
import ReservationNav from "./_reservation-nav";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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

    const fetchDatas = async () => {
        console.log("====== Item Detail =======", itemInfo.transactionId);
        var res = await ReservationApi.get(itemInfo.transactionId);
        console.log(res);
        setReservation(res);
    };

    useEffect(() => {
        fetchDatas();
    }, [itemInfo]);

    return (
        <>
            {reservation && (
                <Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <h4>{reservation.GuestName}</h4>
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
                                        backgroundColor: "success.main",
                                        color: "white",
                                    }}
                                >
                                    <Typography>
                                        {reservation.ReservationTypeName}
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
                                        reservation.ArrivalDate,
                                        "MMM dd"
                                    )}
                                </p>
                                <p>
                                    {fToCustom(
                                        reservation.ArrivalDate,
                                        "kk:mm:ss"
                                    )}
                                </p>
                            </Box>
                            <Box sx={styleNight}>
                                <p>1</p>
                                <p>Night</p>
                            </Box>
                            <Box sx={styleTime}>
                                <p>
                                    {fToCustom(
                                        reservation.DepartureDate,
                                        "MMM dd"
                                    )}
                                </p>
                                <p>
                                    {fToCustom(
                                        reservation.DepartureDate,
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
                                            {reservation.ReservationNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Group Code</b>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Booker Name</b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.UserName}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={2}>
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={itemInfo}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default ItemDetail;

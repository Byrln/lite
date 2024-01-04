import { ReservationAPI } from "lib/api/reservation";
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
import RemarkList from "./remark/list";
import CircularProgress from "@mui/material/CircularProgress";

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

const ItemDetail = ({ reservation, reloadDetailInfo }: any) => {
    return (
        <>
            {reservation ? (
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
                                <div>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            px: 1,
                                            backgroundColor:
                                                "#" + reservation.StatusColor,
                                            color: "white",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography>
                                            {reservation &&
                                                reservation.StatusCode}
                                        </Typography>
                                    </Paper>
                                    <p style={{ fontSize: "12px" }}>
                                        Check In No {reservation.CheckinNo}
                                    </p>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Grid container spacing={0}>
                                <Grid item xs={3}>
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
                                        <p>
                                            {countNights(
                                                reservation.ArrivalDate,
                                                reservation.DepartureDate
                                            )}
                                        </p>
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
                                <Grid item xs={9}>
                                    <Table aria-label="simple table">
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
                                                    <b>GroupCode</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.GroupCode}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Folio No</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.FolioNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>VoucherNo</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Room No/Room Type</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>

                            <RemarkList
                                TransactionID={reservation.TransactionID}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Room Charge</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.FolioNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Extra Charge</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{ textAlign: "right" }}
                                                >
                                                    Mini bar
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.VoucherNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    sx={{ textAlign: "right" }}
                                                >
                                                    Restaurant
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Total Amount</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Deposit</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Balance</b>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={4}>
                                    <ReservationNav
                                        reservation={reservation}
                                        itemInfo={reservation}
                                        reloadDetailInfo={reloadDetailInfo}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress color="primary" />
                </Grid>
            )}
        </>
    );
};

export default ItemDetail;

import { ReservationAPI } from "lib/api/reservation";
import { useState, useEffect } from "react";
import { Grid, Box, Paper, Typography, Divider } from "@mui/material";
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
    px: 1,
    py: 1,
    p: {
        fontSize: "14px",
        textAlign: "center",
        fontWeight: "600",
    },
};

const styleNight = {
    backgroundColor: "orange",
    color: "#ffffff",
    px: 1,
    py: 1,
    p: {
        fontSize: "14px",
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

                    <Divider />
                    <br />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2}>
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
                        <Grid item xs={12} sm={6} md={4}>
                            <Table aria-label="simple table" size="small">
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

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            display={{ xs: "none", sm: "block", md: "none" }}
                        >
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={reservation}
                                reloadDetailInfo={reloadDetailInfo}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Table aria-label="simple table" size="small">
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
                                        <TableCell sx={{ textAlign: "right" }}>
                                            Mini bar
                                        </TableCell>
                                        <TableCell>
                                            {reservation.VoucherNo}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: "right" }}>
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
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                            display={{ xs: "block", sm: "none", md: "block" }}
                        >
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={reservation}
                                reloadDetailInfo={reloadDetailInfo}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <br />
                            <RemarkList
                                TransactionID={reservation.TransactionID}
                            />
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

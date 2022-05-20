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

const ItemDetail = ({ itemInfo }: any) => {
    const [reservation, setReservation]: any = useState(null);
    const [transactionInfo, setTransactionInfo]: any = useState(null);

    const reloadDetailInfo = async () => {
        var res = await ReservationApi.get(itemInfo.detail.TransactionID);
        var trs = await FrontOfficeAPI.transactionInfo(
            itemInfo.detail.TransactionID
        );
        setReservation(res);
        setTransactionInfo(trs);
    };

    useEffect(() => {
        reloadDetailInfo();
    }, [itemInfo]);

    return (
        <>
            {transactionInfo ? (
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
                                                "#" +
                                                transactionInfo.StatusColor,
                                            color: "white",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography>
                                            {reservation &&
                                                reservation.ReservationTypeName}
                                        </Typography>
                                    </Paper>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Grid container spacing={0}>
                                <Grid item xs={3}>
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
                                        <p>
                                            {countNights(
                                                transactionInfo.ArrivalDate,
                                                transactionInfo.DepartureDate
                                            )}
                                        </p>
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
                                <Grid item xs={9}>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <b>ReservationNo</b>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        transactionInfo.ReservationNo
                                                    }
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>GroupCode</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.GroupCode}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Folio No</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.FolioNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>VoucherNo</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Room No/Room Type</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>

                            <RemarkList
                                TransactionID={transactionInfo.TransactionID}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Room Charge</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.FolioNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Extra Charge</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{ textAlign: "right" }}
                                                >
                                                    Mini bar
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.VoucherNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    sx={{ textAlign: "right" }}
                                                >
                                                    Restaurant
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.VoucherNo}
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <b>Total Amount</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Deposit</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <b>Balance</b>
                                                </TableCell>
                                                <TableCell>
                                                    {transactionInfo.RoomFullNo}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={3}>
                                    <ReservationNav
                                        reservation={reservation}
                                        itemInfo={itemInfo}
                                        transactionInfo={transactionInfo}
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

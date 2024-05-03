import { ReservationAPI } from "lib/api/reservation";
import { useState, useEffect, useContext } from "react";
import { Grid, Box, Paper, Typography, Divider, Button } from "@mui/material";
import { fToCustom, countNights } from "lib/utils/format-time";
import ReservationNav from "./_reservation-nav";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";

import { ReportAPI } from "lib/api/report";
import RemarkList from "./remark/list";
import CircularProgress from "@mui/material/CircularProgress";
import { ModalContext } from "lib/context/modal";
import Receipt from "components/reporting/receipt";
import Invoice from "components/reporting/invoice";

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

const ItemDetail = ({
    reservation,
    reloadDetailInfo,
    additionalMutateUrl,
    summary,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const handleInvoice = async () => {
        setLoading(true);
        console.log("true", true);
        try {
            await ReportAPI.invoice(reservation.FolioID);

            toast("Амжилттай.");

            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

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
                                        Бүртгэлийн дугаар{" "}
                                        {reservation.CheckinNo}
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
                                <p>Хоног</p>
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
                                            <b>Тооцооны дугаар</b>
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
                                            <b>Ваучер №</b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.VoucherNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Өрөө.дугаар/Төрөл</b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.RoomFullNo}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button
                                variant={"text"}
                                size="small"
                                className="mr-3"
                            >
                                Батал.мэйл явуулах
                            </Button>
                            <Button variant={"text"} size="small">
                                Бүрт.хэвлэх
                            </Button>
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
                                additionalMutateUrl={additionalMutateUrl}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Table aria-label="simple table" size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <b>Өрөөний тооцоо</b>
                                        </TableCell>
                                        <TableCell>
                                            {summary.RoomCharges}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Нэмэлт үйлчилгээ</b>
                                        </TableCell>
                                        <TableCell>
                                            {summary.ExtraCharges}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell sx={{ textAlign: "right" }}>
                                            Мини бар
                                        </TableCell>
                                        <TableCell>
                                            {summary.MiniBarCharges}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: "right" }}>
                                            Ресторан
                                        </TableCell>
                                        <TableCell>
                                            {summary.RestaurantCharges}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Нийт дүн</b>
                                        </TableCell>
                                        <TableCell>
                                            {summary.TotalCharges}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Урьдчилгаа</b>
                                        </TableCell>
                                        <TableCell>
                                            {summary.TotalPayments}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Үлдэгдэл</b>
                                        </TableCell>
                                        <TableCell>{summary.Balance}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button
                                variant={"text"}
                                size="small"
                                className="mr-3"
                                onClick={() => {
                                    handleModal(
                                        true,
                                        "Receipt",
                                        <Receipt
                                            TransactionID={
                                                reservation.TransactionID
                                            }
                                        />,
                                        null,
                                        "large"
                                    );
                                }}
                            >
                                Receipt
                            </Button>
                            <Button
                                variant={"text"}
                                size="small"
                                className="mr-3"
                                // onClick={() => handleInvoice()}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        "Receipt",
                                        <Invoice
                                            FolioID={reservation.FolioID}
                                        />,
                                        null,
                                        "large"
                                    );
                                }}
                            >
                                Нэх.хэвлэх
                            </Button>
                            <Button variant={"text"} size="small">
                                Е-Баримт хэвлэх
                            </Button>
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

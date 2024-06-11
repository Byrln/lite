import { useContext } from "react";
import {
    Grid,
    Box,
    Paper,
    Typography,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material";
import { fToCustom, countNights } from "lib/utils/format-time";
import ReservationNav from "./_reservation-nav";
import { useIntl } from "react-intl";

import RemarkList from "./remark/list";
import CircularProgress from "@mui/material/CircularProgress";
import { ModalContext } from "lib/context/modal";
import InvoiceSelect from "components/reporting/invoice/select";
import ReceiptSelect from "components/reporting/receipt/select";

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
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);

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
                                        {intl.formatMessage({
                                            id: "TextCheckInNo",
                                        })}{" "}
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
                                <p>
                                    {intl.formatMessage({
                                        id: "TextNights",
                                    })}
                                </p>
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
                                            <b>
                                                {intl.formatMessage({
                                                    id: "TextFolioNo",
                                                })}
                                            </b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.ReservationNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>
                                                {intl.formatMessage({
                                                    id: "RowHeaderGroupCode",
                                                })}
                                            </b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.GroupCode}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>
                                                {intl.formatMessage({
                                                    id: "TextFolioNo",
                                                })}
                                            </b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.FolioNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>
                                                {intl.formatMessage({
                                                    id: "TextVoucherNo",
                                                })}
                                            </b>
                                        </TableCell>
                                        <TableCell>
                                            {reservation.VoucherNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>
                                                {intl.formatMessage({
                                                    id: "TextRoomNoRoomType",
                                                })}
                                            </b>
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
                                {intl.formatMessage({
                                    id: "ButtonSendConfirmation",
                                })}
                            </Button>
                            <Button variant={"text"} size="small">
                                {intl.formatMessage({
                                    id: "ButtonPrintRegistrationForm",
                                })}
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
                                        <ReceiptSelect
                                            FolioID={reservation.FolioID}
                                        ></ReceiptSelect>,
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
                                        "Нэхэмжлэл",
                                        <InvoiceSelect
                                            FolioID={reservation.FolioID}
                                        ></InvoiceSelect>,
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

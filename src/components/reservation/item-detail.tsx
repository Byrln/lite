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
import Iconify from "components/iconify/iconify";
import Link from "next/link";

import RemarkList from "./remark/list";
import CircularProgress from "@mui/material/CircularProgress";
import { ModalContext } from "lib/context/modal";
import InvoiceSelect from "components/reporting/invoice/select";
import ReceiptSelect from "components/reporting/receipt/select";
import EbarimtSelect from "components/reporting/ebarimt/select";
import { formatPrice } from "lib/utils/helpers";
import EditIcon from "@mui/icons-material/Edit";
import RoomGroupEdit from "components/transaction/group/room/group-edit";

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
    extendedProps,
    customRerender,
}: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    return (
        <>
            {reservation ? (
                <Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <div style={{ display: "flex" }}>
                                {extendedProps?.GroupID &&
                                extendedProps?.GroupID != "" ? (
                                    <span
                                        style={{
                                            marginRight: "5px",
                                            marginTop: "2px",
                                            color:
                                                extendedProps?.groupColor &&
                                                extendedProps.groupColor != ""
                                                    ? extendedProps.groupColor
                                                    : "black",
                                        }}
                                    >
                                        {extendedProps?.IsGroupOwner ==
                                        "true" ? (
                                            <Iconify
                                                icon="solar:crown-outline"
                                                width="16px"
                                            />
                                        ) : (
                                            <Iconify
                                                icon="clarity:group-line"
                                                width="16px"
                                            />
                                        )}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                <h4>{reservation?.GuestName}</h4>{" "}
                                <div>
                                    ({reservation?.Adult}/{reservation?.Child})
                                </div>{" "}
                                <div> {reservation?.GuestPhone}</div>
                            </div>
                            <div>{reservation?.GuestEmail}</div>
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
                                            id: "Reservation_ReservationNo",
                                        })}{" "}
                                        {reservation.ReservationNo}
                                    </p>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />
                    <br />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
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
                                            {reservation.FolioNo}
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
                                style={{ color: "#804fe6" }}
                            >
                                {intl.formatMessage({
                                    id: "ButtonSendConfirmation",
                                })}
                            </Button>
                            <Button
                                variant={"text"}
                                size="small"
                                style={{ color: "#804fe6" }}
                            >
                                {intl.formatMessage({
                                    id: "ButtonPrintRegistrationForm",
                                })}
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            display={{ xs: "none", sm: "block" }}
                        >
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={reservation}
                                reloadDetailInfo={reloadDetailInfo}
                                additionalMutateUrl={additionalMutateUrl}
                                customRerender={customRerender}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Table aria-label="simple table" size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <b>Өрөөний тооцоо</b>
                                        </TableCell>
                                        <TableCell style={{ display: "flex" }}>
                                            <div>
                                                {formatPrice(
                                                    summary.RoomCharges
                                                )}
                                            </div>
                                            <Link href="#" passHref>
                                                <a
                                                    className="ml-2"
                                                    style={{
                                                        paddingTop: "3px",
                                                        color: "rgb(24, 119, 242)",
                                                    }}
                                                    onClick={() => {
                                                        handleModal(
                                                            true,
                                                            "Edit",
                                                            <RoomGroupEdit
                                                                GroupID={
                                                                    extendedProps?.GroupID &&
                                                                    extendedProps.GroupID >
                                                                        0
                                                                        ? extendedProps.GroupID
                                                                        : null
                                                                }
                                                                TransactionID={
                                                                    extendedProps?.GroupID
                                                                        ? null
                                                                        : reservation.TransactionID
                                                                }
                                                                additionalMutateUrl={
                                                                    additionalMutateUrl
                                                                }
                                                                RoomID={
                                                                    reservation.RoomID
                                                                }
                                                                customRerender={
                                                                    customRerender
                                                                }
                                                            />,
                                                            null,
                                                            "medium"
                                                        );
                                                    }}
                                                >
                                                    <EditIcon />
                                                </a>
                                            </Link>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Нэмэлт үйлчилгээ</b>
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(summary.ExtraCharges)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <b>Нийт дүн</b>
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(summary.TotalCharges)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Урьдчилгаа</b>
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(summary.TotalPayments)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Үлдэгдэл</b>
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(summary.Balance)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button
                                variant={"text"}
                                size="small"
                                className="mr-3"
                                style={{ color: "#804fe6" }}
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
                                style={{ color: "#804fe6" }}
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
                            <Button
                                variant={"text"}
                                size="small"
                                style={{ color: "#804fe6" }}
                                onClick={() => {
                                    handleModal(
                                        true,
                                        "Е-Баримт",
                                        <EbarimtSelect
                                            FolioID={reservation.FolioID}
                                        ></EbarimtSelect>,
                                        null,
                                        "large"
                                    );
                                }}
                            >
                                Е-Баримт хэвлэх
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            display={{ xs: "block", sm: "none" }}
                        >
                            <ReservationNav
                                reservation={reservation}
                                itemInfo={reservation}
                                reloadDetailInfo={reloadDetailInfo}
                                additionalMutateUrl={additionalMutateUrl}
                                customRerender={customRerender}
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

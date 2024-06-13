import { Grid, Typography, Card, CardContent } from "@mui/material";
import { useIntl } from "react-intl";

import { GuestHistorySummarySWR } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";
import { formatPrice } from "lib/utils/helpers";

const GuestHistory = ({ title }: any) => {
    const intl = useIntl();
    const [state]: any = useAppState();

    const { data, error } = GuestHistorySummarySWR(state.editId);

    return (
        <>
            {data && data[0] && (
                <Card className="mb-3">
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextTotal",
                                    })}{" "}
                                    : {data[0].TotalTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextPaid",
                                    })}{" "}
                                    : {formatPrice(data[0].TotalPaid)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                    <span style={{ fontWeight: "bold" }}>
                                        {intl.formatMessage({
                                            id: "TextStatus",
                                        })}
                                    </span>
                                    :{" "}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextReservation",
                                    })}{" "}
                                    : {data[0].Reservations}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextStaying",
                                    })}{" "}
                                    : {data[0].StayTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextCheckedOut",
                                    })}{" "}
                                    : {data[0].StayTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="subtitle2">
                                    {intl.formatMessage({
                                        id: "TextCancelandNoShow",
                                    })}{" "}
                                    : {data[0].CancelNoShow}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default GuestHistory;

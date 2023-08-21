import { GuestHistorySummarySWR } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";
import { Grid, Typography, Card, CardContent } from "@mui/material";

const GuestHistory = ({ title }: any) => {
    const [state]: any = useAppState();

    const { data, error } = GuestHistorySummarySWR(state.editId);

    return (
        <>
            {data && data[0] && (
                <Card className="mb-3">
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Total : {data[0].TotalTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Paid : {data[0].TotalPaid}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Status Reservation : {data[0].Reservations}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Staying : {data[0].StayTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Checked Out : {data[0].StayTransactions}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="subtitle2">
                                    Cancel & No Show : {data[0].CancelNoShow}
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

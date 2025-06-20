import { useState, useEffect } from "react";
import { Box, Container, Paper, CircularProgress, Typography } from "@mui/material";

import { FrontOfficeAPI } from "lib/api/front-office";
import { ChargeAPI } from "lib/api/charge";
import ReservationDetail from "components/reservation/item-detail";

const NewEdit = ({
    transactionID,
    additionalMutateUrl,
    extendedProps,
    customRerender,
}: any) => {
    const [reservation, setReservation]: any = useState(null);
    const [summary, setSummary]: any = useState(null);
    const [loading, setLoading] = useState(true);

    const reloadDetailInfo = async () => {
        try {
            const res = await FrontOfficeAPI.transactionInfo(transactionID);
            setReservation(res);
        } catch (error) {
            console.error("Error loading reservation details:", error);
        }
    };

    const reloadReservationData = async () => {
        try {
            const res = await ChargeAPI.summary(transactionID);
            setSummary(res.data.JsonData[0]);
        } catch (error) {
            console.error("Error loading summary data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        reloadDetailInfo();
        reloadReservationData();
    }, [transactionID]);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Paper 
                elevation={2} 
                sx={{ 
                    p: 3, 
                    borderRadius: "16px", 
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", flexDirection: "column" }}>
                        <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                            Loading reservation details...
                        </Typography>
                    </Box>
                ) : reservation && summary ? (
                    <Box sx={{ borderRadius: "8px", overflow: "hidden" }}>
                        <ReservationDetail
                            reservation={reservation}
                            reloadDetailInfo={reloadDetailInfo}
                            additionalMutateUrl={additionalMutateUrl}
                            summary={summary}
                            extendedProps={extendedProps}
                            customRerender={customRerender}
                        />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <Typography variant="body1" color="error">
                            Could not load reservation details. Please try again.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default NewEdit;

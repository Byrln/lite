import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import Page from "components/page";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import { FrontOfficeAPI } from "lib/api/front-office";
import ReservationsList from "components/reporting/reservations/list";

const Index = () => {
    const intl = useIntl();

    const title = intl.formatMessage({
        id: "MenuReportReservations",
    });

    const [workingDate, setWorkingDate]: any = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <Box sx={{ pb: 1 }}>
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {workingDate && (
                                <ReservationsList
                                    title={title}
                                    workingDate={workingDate}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

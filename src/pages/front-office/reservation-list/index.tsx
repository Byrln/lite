import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";

import Page from "components/page";
import RevervationList from "components/front-office/reservation-list/list";

const Index = () => {
    const intl = useIntl();

    const title = intl.formatMessage({
        id: "MenuReservationList",
    });

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
                            <RevervationList title={title} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

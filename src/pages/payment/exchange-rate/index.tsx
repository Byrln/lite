import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import ExchangeRate from "components/payment/exchange-rate/list";

const title = "Валютын жагсаалт";

const Index = () => (
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
                        <ExchangeRate title={title} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

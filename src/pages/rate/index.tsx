import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import RateList from "components/rate/list";

const title = "Тариф";

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
                        <RateList />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

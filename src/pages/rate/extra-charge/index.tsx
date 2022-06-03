import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import ExtraChargeList from "components/rate/extra-charge/list";

const title = "Нэмэлт тооцооны төрлүүд";

const Index = () => (
    <>
        <Head>
            <title>{title}</title>
        </Head>

        <Page>
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">{title}</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ExtraChargeList title={title} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

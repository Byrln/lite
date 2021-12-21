import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";

const title = "Dashboard | Horeca";

export default function DashboardApp() {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h4">Hi, Welcome back</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            Horeca PMS
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

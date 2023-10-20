import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Dashboard from "components/dashboard/list";
const title = "Дашбоард | Horeca";

const DashboardApp = () => (
    <>
        <Head>
            <title>{title}</title>
        </Head>

        <Page>
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Тавтай морил</Typography>
                </Box>
                <Dashboard />
            </Container>
        </Page>
    </>
);

export default DashboardApp;

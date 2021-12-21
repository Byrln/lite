import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import MiniBarGroupList from "components/mini-bar/group/list";

const title = "Мини бар групп";

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
                        <MiniBarGroupList />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

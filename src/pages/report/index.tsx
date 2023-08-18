import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Document from "next/document";

const title = "Зочин бүртгэл";

// @ts-ignore
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
                        <iframe src={'blob:http://localhost:5488/36d37eb8-fef2-4515-995f-339b2328dd47'}></iframe>
                        <iframe id="if1" width="100%" height="900" src="https://www.africau.edu/images/default/sample.pdf"></iframe>
                        <object data="{'blob:http://localhost:5488/36d37eb8-fef2-4515-995f-339b2328dd47'}" type="application/pdf">
                            <embed src="{'blob:http://localhost:5488/36d37eb8-fef2-4515-995f-339b2328dd47'}" type="application/pdf" />
                        </object>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

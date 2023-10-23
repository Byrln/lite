import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";

const title = "Боломжит өрөө";

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
                        <iframe
                            width={800}
                            height={600}
                            // @ts-ignore
                            onLoad="this.width=screen.width;this.height=screen.height;" // @ts-ignore
                            src="http://124.158.124.85/ReportServer/Pages/ReportViewer.aspx?%2fAvailable+Rooms&rs:Command=Render&rs:Embed=True"
                            type="application/html"
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

export default Index;

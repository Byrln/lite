import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";

import Page from "components/page";
import RateList from "components/rate/list";
import { TaxSWR } from "lib/api/tax";

const Index = () => {
    const intl = useIntl();
    const { data, error } = TaxSWR();
    
    const title = intl.formatMessage({
        id: "PageTitleRate",
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
                            <RateList taxData={data} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

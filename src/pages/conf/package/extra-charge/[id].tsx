import { Box, Grid, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { PackageExtraChargeSWR } from "lib/api/package-extra-charge";

import Page from "components/page";
import ExtraCharge from "components/conf/package/extra-charge";
const title = "Package";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, error } = PackageExtraChargeSWR(id);

    return (
        <>
            <Head>
                <title>
                    {data && data[0] && data[0].PackageName
                        ? data[0].PackageName
                        : title}
                </title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h4">
                            {data && data[0] && data[0].PackageName
                                ? data[0].PackageName
                                : title}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ExtraCharge
                                title={title}
                                packageId={id}
                                data={data}
                                error={error}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

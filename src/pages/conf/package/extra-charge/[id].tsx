import { Box, Grid, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { PackageExtraChargeSWR } from "lib/api/package-extra-charge";
import { useState, useEffect } from "react";

import Page from "components/page";
import ExtraCharge from "components/conf/package/extra-charge";
const title = "Package";

const Index = () => {
    const [tempData, setTempData] = useState<any>([]);
    const router = useRouter();
    const { id } = router.query;

    const { data, error } = PackageExtraChargeSWR(id);

    useEffect(() => {
        setTempData(data);
    }, [data]);

    return (
        <>
            <Head>
                <title>
                    {tempData && tempData[0] && tempData[0].PackageName
                        ? tempData[0].PackageName
                        : title}
                </title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <Box sx={{ pb: 1 }}>
                        <Typography variant="h6">
                            {tempData && tempData[0] && tempData[0].PackageName
                                ? tempData[0].PackageName
                                : title}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ExtraCharge
                                title={title}
                                packageId={id}
                                error={error}
                                data={tempData}
                                setData={setTempData}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

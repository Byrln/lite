import { Box, Grid, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { PackageRoomSWR } from "lib/api/package-room";

import Page from "components/page";
import Package from "components/conf/package/list";
import RoomList from "components/conf/package/room-list";
const title = "Package";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, error } = PackageRoomSWR(id);

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
                    <Box sx={{ pb: 1 }}>
                        <Typography variant="h6">
                            {data && data[0] && data[0].PackageName
                                ? data[0].PackageName
                                : title}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <RoomList
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

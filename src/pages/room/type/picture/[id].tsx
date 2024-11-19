import { Box, Grid, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { RoomTypeSWR } from "lib/api/room-type";

import Page from "components/page";
import RoomPictureList from "components/room/picture/list";
const title = "Package";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, error } = RoomTypeSWR({ RoomTypeID: id });

    return (
        <>
            <Head>
                <title>
                    {data && data[0] && data[0].RoomTypeName
                        ? data[0].RoomTypeName
                        : title}
                </title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <Box sx={{ pb: 1 }}>
                        <Typography variant="h6">
                            {data && data[0] && data[0].RoomTypeName
                                ? data[0].RoomTypeName
                                : title}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <RoomPictureList
                                title={title}
                                roomTypeID={id}
                                // data={data}
                                // error={error}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import HouseKeeping from "components/room-service/house-keeping/list";
import WorkOrder from "components/room-service/work-order-user/list";
import CustomTab from "components/common/custom-tab";

const title = "House Keeping";

const Index = () => {
    const tabs = [
        {
            label: "Өрөөний жагсаалт",
            component: (
                <>
                    <HouseKeeping title={title} />
                </>
            ),
        },
        {
            label: "Ажлын даалгавар",
            component: (
                <>
                    <WorkOrder title={title} />
                </>
            ),
        },
    ];

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
                    <Box sx={{ width: "100%" }}>
                        <CustomTab tabs={tabs} />
                    </Box>
                </Container>
            </Page>
        </>
    );
};

export default Index;

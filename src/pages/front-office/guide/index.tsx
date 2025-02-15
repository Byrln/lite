import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";
import moment from "moment";
import { useIntl } from "react-intl";

import Page from "components/page";
import Guide from "components/front-office/guide/list";
import { FrontOfficeAPI } from "lib/api/front-office";

// const title = "Night Audit";

const Index = () => {
    const intl = useIntl();

    const title = intl.formatMessage({
        id: "Guide",
    });

    const [workingDate, setWorkingDate]: any = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

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
                            <Guide title={title} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

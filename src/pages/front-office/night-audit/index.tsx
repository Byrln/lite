import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";
import moment from "moment";

import Page from "components/page";
import NightAudit from "components/front-office/night-audit/list";
import { FrontOfficeAPI } from "lib/api/front-office";

const title = "Night Audit";

const Index = () => {
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
                        <Typography variant="h6">
                            {title}{" "}
                            {workingDate
                                ? ` - ` +
                                  moment(workingDate).format("YYYY.MM.DD")
                                : ""}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <NightAudit
                                title={title}
                                workingDate={workingDate}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import Page from "components/page";
import RevervationList from "components/front-office/reservation-list/list";
import { FrontOfficeAPI } from "lib/api/front-office";

const Index = () => {
    const router = useRouter();
    const { StatusGroup, StartDate, EndDate } = router.query;
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

    const intl = useIntl();

    const title = intl.formatMessage({
        id: "MenuReservationList",
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
                            {workingDate ? (
                                <RevervationList
                                    title={title}
                                    workingDate={workingDate}
                                />
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

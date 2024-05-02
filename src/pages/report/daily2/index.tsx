import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Daily2 from "components/reporting/daily2";
import { FrontOfficeAPI } from "lib/api/front-office";
import { HotelSettingAPI } from "lib/api/hotel-setting";

const title = "Өдрийн тайлан";

// @ts-ignore
const Index = () => {
    const [workingDate, setWorkingDate]: any = useState(null);
    const [hotelSettings, setHotelSettings]: any = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }

        let settingsResponse = await HotelSettingAPI.get(
            localStorage.getItem("hotelId")
        );
        if (settingsResponse && settingsResponse[0]) {
            setHotelSettings(settingsResponse[0]);
        }
    };
    console.log("settingsResponse", hotelSettings);

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
                            {workingDate && hotelSettings && (
                                <Daily2
                                    title={title}
                                    workingDate={workingDate}
                                    hotelSettings={hotelSettings}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

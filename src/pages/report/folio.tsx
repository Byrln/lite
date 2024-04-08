import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Folio from "components/reporting/folio";
import { FrontOfficeAPI } from "lib/api/front-office";

const title = "Төлбөрийн бүртгэлийн тайлан";

// @ts-ignore
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
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {/* <iframe
                                width={"100%"}
                                height={600}
                                // @ts-ignore
                                onLoad="this.width=screen.width;this.height=screen.height;" // @ts-ignore
                                src={`https://reporting.horecasoft.mn/ReportServer/Pages/ReportViewer.aspx?%2fBreakfast&rs:Command=Render&rs:Embed=True&DatabaseName=HotelDB_${localStorage.getItem(
                                    "hotelId"
                                )}`}
                                type="application/html"
                            /> */}
                            {workingDate && (
                                <Folio
                                    title={title}
                                    workingDate={workingDate}
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

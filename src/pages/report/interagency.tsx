import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import { format } from "date-fns";

import Page from "components/page";
import Interagency from "components/reporting/interagency";
import { FrontOfficeAPI } from "lib/api/front-office";

const title = "Байгууллага хоорондын тооцоо";

// @ts-ignore
const Index = () => {
    const [initialData, setInitialData]: any = useState(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setInitialData(response.workingDate[0].WorkingDate);

            const date = new Date(response.workingDate[0].WorkingDate);

            // Extract year and month from the date
            const year = date.getFullYear();
            const month = date.getMonth();

            // Get the first day of the month
            const firstDayOfMonth = new Date(year, month, 1);

            // Get the last day of the month
            const lastDayOfMonth = new Date(year, month + 1, 0);

            setInitialData({
                StartDate: `${format(firstDayOfMonth, "yyyy-MM-dd")} 00:00:00`,
                EndDate: `${format(lastDayOfMonth, "yyyy-MM-dd")} 23:59:59`,
            });
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
                                src={`https://reporting.horecasoft.mn/ReportServer/Pages/ReportViewer.aspx?%2fInterAgency&rs:Command=Render&rs:Embed=True&DatabaseName=HotelDB_${localStorage.getItem(
                                    "hotelId"
                                )}`}
                                type="application/html"
                            /> */}
                            {initialData && (
                                <Interagency
                                    title={title}
                                    initialData={initialData}
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

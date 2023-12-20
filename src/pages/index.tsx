import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";

import { FrontOfficeAPI } from "lib/api/front-office";
import Page from "components/page";
import Dashboard from "components/dashboard/list";
const title = "Дашбоард | Horeca";

const DashboardApp = () => {
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
                        <Typography variant="h6">Тавтай морил</Typography>
                    </Box>
                    {workingDate && <Dashboard workingDate={workingDate} />}
                </Container>
            </Page>
        </>
    );
};

export default DashboardApp;

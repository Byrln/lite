import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import dynamic from "next/dynamic";

import Page from "components/page";
import { FrontOfficeAPI } from "lib/api/front-office";
import MyScheduler from "components/new-calendar/test2";

const title = "Календар";

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
                    {workingDate && (
                        <MyScheduler //@ts-ignore
                            workingDate={workingDate}
                        />
                    )}
                </Container>
            </Page>
        </>
    );
};

export default Index;

import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Head from "next/head";

import { FrontOfficeAPI } from "lib/api/front-office";
import Page from "components/page";
import Dashboard from "components/dashboard/list";
import { UserAPI } from "lib/api/user";

const title = "Дашбоард | Horeca";

const DashboardApp = () => {
    const [workingDate, setWorkingDate]: any = useState(null);
    const [haveDashboard, setHaveDashboard]: any = useState(false);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let privileges = await UserAPI.getPrivileges();
        await privileges.map((action: any) =>
            action.ActionName == "DashBoard" && action.Status == true
                ? setHaveDashboard(true)
                : null
        );
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
                    {workingDate && haveDashboard ? (
                        <Dashboard workingDate={workingDate} />
                    ) : (
                        "Хандах эрх байхгүй байна"
                    )}
                </Container>
            </Page>
        </>
    );
};

export default DashboardApp;

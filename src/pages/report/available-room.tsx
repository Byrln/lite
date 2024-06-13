import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";

import Page from "components/page";
import { FrontOfficeAPI } from "lib/api/front-office";
import AvailableRoom from "components/reporting/available-room";
import ReservationsList from "components/reporting/reservations/list";

// @ts-ignore
const Index = () => {
    const intl = useIntl();
    const [value, setValue] = useState(0);

    const title = intl.formatMessage({
        id: "ReportStayViewReport",
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box className="mt-3">
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

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
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="Өглөөний цай"
                            >
                                <Tab
                                    label="Available rooms"
                                    {...a11yProps(0)}
                                />
                                <Tab label="Stayview" {...a11yProps(1)} />
                            </Tabs>

                            <TabPanel value={value} index={0}>
                                {workingDate && (
                                    <AvailableRoom
                                        title={title}
                                        workingDate={workingDate}
                                    />
                                )}
                            </TabPanel>

                            <TabPanel value={value} index={1}>
                                {" "}
                                {workingDate && (
                                    <ReservationsList
                                        title={title}
                                        workingDate={workingDate}
                                    />
                                )}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

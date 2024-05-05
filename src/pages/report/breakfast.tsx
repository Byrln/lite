import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Breakfast from "components/reporting/breakfast";
import BreakfastSummary from "components/reporting/breakfast-summary";
import { FrontOfficeAPI } from "lib/api/front-office";

const title = "Өглөөний цай";

// @ts-ignore
const Index = () => {
    const [workingDate, setWorkingDate]: any = useState(null);
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
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
                                <Tab label="Өглөөний цай" {...a11yProps(0)} />
                                <Tab label="Хувилбар 2" {...a11yProps(1)} />
                            </Tabs>

                            <TabPanel value={value} index={0}>
                                {workingDate && (
                                    <Breakfast
                                        title={title}
                                        workingDate={workingDate}
                                    />
                                )}
                            </TabPanel>

                            <TabPanel value={value} index={1}>
                                {workingDate && (
                                    <BreakfastSummary
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

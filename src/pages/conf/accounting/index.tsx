import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";

import Page from "components/page";
import ChargeList from "components/conf/accounting/charge";
import CustomerList from "components/conf/accounting/customer";
import AccountList from "components/conf/accounting/account";
import { FrontOfficeAPI } from "lib/api/front-office";

// @ts-ignore
const Index = () => {
    const intl = useIntl();

    const title = intl.formatMessage({
        id: "MenuAccounting",
    });

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
                                aria-label={intl.formatMessage({
                                    id: "MenuAccounting",
                                })}
                            >
                                <Tab
                                    label={intl.formatMessage({
                                        id: "TextCharge",
                                    })}
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    label={intl.formatMessage({
                                        id: "TextCustomer",
                                    })}
                                    {...a11yProps(1)}
                                />
                                <Tab
                                    label={intl.formatMessage({
                                        id: "TextAccount",
                                    })}
                                    {...a11yProps(2)}
                                />
                            </Tabs>

                            <TabPanel value={value} index={0}>
                                {workingDate && <ChargeList title={title} />}
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                {workingDate && <CustomerList title={title} />}
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                {workingDate && <AccountList title={title} />}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Index;

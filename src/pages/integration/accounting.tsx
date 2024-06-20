import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Page from "components/page";
import AccountList from "components/integration/accounting/account-list";
import SalesList from "components/integration/sales/sales-list";
import ExtraCharge from "components/integration/extra/extra-charge-list";
import IncomeList from "components/integration/income/income-list";
import { FrontOfficeAPI } from "lib/api/front-office";
import CustomSearch from "components/common/custom-search";
import Search from "components/integration/search";

// @ts-ignore
const Index = () => {
    const [search, setSearch] = useState();

    const validationSchema = yup.object().shape({
        StartDate: yup.string().nullable(),
        EndDate: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

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
                            <CustomSearch
                                search={search}
                                setSearch={setSearch}
                                handleSubmit={handleSubmit}
                                reset={reset}
                            >
                                <Search
                                    register={register}
                                    errors={errors}
                                    control={control}
                                    reset={reset}
                                />
                            </CustomSearch>
                        </Grid>
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
                                        id: "ButtonExtraCharge",
                                    })}
                                    {...a11yProps(0)}
                                />
                                <Tab label="Орлого" {...a11yProps(1)} />
                                <Tab label="Борлуулалт" {...a11yProps(2)} />
                                <Tab label="Данснууд" {...a11yProps(3)} />
                            </Tabs>

                            <TabPanel value={value} index={0}>
                                {workingDate && (
                                    <ExtraCharge
                                        title={title}
                                        search={search}
                                    />
                                )}
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                {workingDate && (
                                    <IncomeList title={title} search={search} />
                                )}
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                {workingDate && (
                                    <SalesList title={title} search={search} />
                                )}
                            </TabPanel>
                            <TabPanel value={value} index={3}>
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

import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import Daily from "components/reporting/daily";
import Daily2 from "components/reporting/daily2";
import { FrontOfficeAPI } from "lib/api/front-office";
import { HotelSettingAPI } from "lib/api/hotel-setting";
import { useIntl } from "react-intl";

// @ts-ignore
const Index = () => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: "PageTitleDaily",
  });
  const [workingDate, setWorkingDate]: any = useState(null);
  const [value, setValue] = useState(0);

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

      <Page className="py-3 px-2">
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
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Өдрийн тайлан"
              >
                <Tab label={intl.formatMessage({ id: "TextVariant" })} {...a11yProps(0)} />
                <Tab label={intl.formatMessage({ id: "TextVariant2" })} {...a11yProps(1)} />
              </Tabs>

              <TabPanel value={value} index={0}>
                {workingDate && (
                  <Daily
                    title={title}
                    workingDate={workingDate}
                  />
                )}
              </TabPanel>

              <TabPanel value={value} index={1}>
                {workingDate && (
                  <Daily2
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

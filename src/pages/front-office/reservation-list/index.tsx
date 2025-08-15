import { Box, Grid, Container, Typography, Tabs, Tab, ToggleButton, ToggleButtonGroup, alpha, useTheme, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { ViewList, ViewModule } from "@mui/icons-material";
import Head from "next/head";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import Page from "components/page";
import RevervationList from "components/front-office/reservation-list/list";
import DepartureList from "components/front-office/depature-list/list";
import DeparturedList from "components/front-office/departured-list/list";
import InHouseListList from "components/front-office/in-house-list/list";
import GroupReservationList from "components/front-office/group-reservation-list";
import GroupDepartureList from "components/front-office/group-reservation-list/departure-list";
import GroupDeparturedList from "components/front-office/group-reservation-list/departured-list";
import GroupInHouseListList from "components/front-office/group-reservation-list/inhouse-list";
import { FrontOfficeAPI } from "lib/api/front-office";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservation-tabpanel-${index}`}
      aria-labelledby={`reservation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `reservation-tab-${index}`,
    'aria-controls': `reservation-tabpanel-${index}`,
  };
}

const Index = () => {
  const router = useRouter();
  const [workingDate, setWorkingDate]: any = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: Single Reservation, 1: Group Reservation
  const [singleListType, setSingleListType] = useState<'arrival' | 'departure' | 'departured' | 'inhouse'>('arrival');
  const [groupListType, setGroupListType] = useState<'arrival' | 'departure' | 'departured' | 'inhouse'>('arrival');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const theme = useTheme();

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    let response = await FrontOfficeAPI.workingDate();
    if (response.status == 200) {
      setWorkingDate(response.workingDate[0].WorkingDate);
    }
  };

  const intl = useIntl();

  const title = intl.formatMessage({
    id: "MenuReservationList",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSingleListTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'arrival' | 'departure' | 'departured' | 'inhouse'
  ) => {
    if (newType !== null) {
      setSingleListType(newType);
    }
  };

  const handleGroupListTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'arrival' | 'departure' | 'departured' | 'inhouse'
  ) => {
    if (newType !== null) {
      setGroupListType(newType);
    }
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'card'
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const ListTypeToggleButtons = ({
    value,
    onChange
  }: {
    value: 'arrival' | 'departure' | 'departured' | 'inhouse',
    onChange: (event: React.MouseEvent<HTMLElement>, newType: 'arrival' | 'departure' | 'departured' | 'inhouse') => void
  }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <div className="bg-[#28a745] rounded-full outline outline-[#28a745] outline-2 shadow-md overflow-hidden">
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={onChange}
          aria-label="list type"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '50px',
              px: 2,
              py: 1,
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.1),
              },
              '&.Mui-selected': {
                bgcolor: 'white',
                color: '#28a745',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  bgcolor: 'white',
                },
              },
            },
          }}
        >
          <ToggleButton value="arrival" aria-label="arrival list">
            {intl.formatMessage({ id: "TextReservationList" }) || 'Arrival List'}
          </ToggleButton>
          <ToggleButton value="departure" aria-label="departure list">
            {intl.formatMessage({ id: "TextDepartureList" }) || 'Departure List'}
          </ToggleButton>
          <ToggleButton value="departured" aria-label="departured list">
            {intl.formatMessage({ id: "TextDeparturedList" }) || 'Departured List'}
          </ToggleButton>
          <ToggleButton value="inhouse" aria-label="in house list">
            {intl.formatMessage({ id: "TextInHouseListing" }) || 'In House List'}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Box>
  );

  const TableCardToggleButtons = () => (
    <div className="bg-[#804FE6] rounded-full outline outline-[#804FE6] outline-2 shadow-md overflow-hidden">
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: '50px',
            px: 2,
            py: 1,
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: alpha('#FFFFFF', 0.1),
            },
            '&.Mui-selected': {
              bgcolor: 'white',
              color: '#804FE6',
              boxShadow: theme.shadows[2],
              '&:hover': {
                bgcolor: 'white',
              },
            },
          },
        }}
      >
        <Tooltip title={intl.formatMessage({ id: 'TextTableView' }) || 'Table View'} arrow>
          <ToggleButton value="table" aria-label="table view">
            <ViewList sx={{ mr: 0.5, fontSize: '1rem' }} />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'TextCardView' }) || 'Card View'} arrow>
          <ToggleButton value="card" aria-label="card view">
            <ViewModule sx={{ mr: 0.5, fontSize: '1rem' }} />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </div>
  );

  const renderListComponent = (listType: 'arrival' | 'departure' | 'departured' | 'inhouse', isGroup: boolean) => {
    if (!workingDate) return <></>;

    switch (listType) {
      case 'arrival':
        return isGroup ? (
          <GroupReservationList
            title={intl.formatMessage({ id: "TextGroupReservation" })}
            workingDate={workingDate}
            tableCardViewMode={viewMode}
          />
        ) : (
          <RevervationList
            title={intl.formatMessage({ id: "TextSingleReservation" })}
            workingDate={workingDate}
          />
        );
      case 'departure':
        return isGroup ? (
          <GroupDepartureList
            title={intl.formatMessage({ id: "TextDepartureList" })}
          />
        ) : (
          <DepartureList
            title={intl.formatMessage({ id: "TextDepartureList" })}
          />
        );
      case 'departured':
        return isGroup ? (
          <GroupDeparturedList
            title={intl.formatMessage({ id: "TextDeparturedList" })}
          />
        ) : (
          <DeparturedList
            title={intl.formatMessage({ id: "TextDeparturedList" })}
          />
        );
      case 'inhouse':
        return isGroup ? (
          <GroupInHouseListList
            title={intl.formatMessage({ id: "TextInHouseListing" })}
          />
        ) : (
          <InHouseListList
            title={intl.formatMessage({ id: "TextInHouseListing" })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Page className="pb-6 pt-3">
        <Container maxWidth="xl">
          <Box className="pb-2 flex justify-between items-center">
            <Typography variant="h6">{title}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {tabValue === 1 && groupListType === 'arrival' && <TableCardToggleButtons />}
              {tabValue === 0 ? (
                <ListTypeToggleButtons
                  value={singleListType}
                  onChange={handleSingleListTypeChange}
                />
              ) : (
                <ListTypeToggleButtons
                  value={groupListType}
                  onChange={handleGroupListTypeChange}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="reservation tabs">
                <Tab label={intl.formatMessage({ id: "TextSingleReservation" })} {...a11yProps(0)} />
                <Tab label={intl.formatMessage({ id: "TextGroupReservation" })} {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderListComponent(singleListType, false)}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {renderListComponent(groupListType, true)}
            </TabPanel>

          </Box>
        </Container>
      </Page>
    </>
  );
};

export default Index;

import React, { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider
} from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";
import {
  Home as HomeIcon,
  Star as StarIcon,
  Activity as ActivityIcon,
  Grid3x3 as Grid3x3Icon,
  Lock as LockIcon,
  Bed as BedIcon
} from "lucide-react";

import Page from "components/page";
import RoomList from "components/room/list";
import AmenityList from "components/room/amenity/list";
import RoomStatusList from "components/room/status/list";
import RoomTypeList from "components/room/type/list";
import RoomBlock from "components/room-service/room-block/list";

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
      id={`room-tabpanel-${index}`}
      aria-labelledby={`room-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `room-tab-${index}`,
    'aria-controls': `room-tabpanel-${index}`,
  };
}

const Index = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const [workingDate] = useState(new Date().toISOString().split('T')[0]);

  const title = intl.formatMessage({
    id: "PageTitleRoomManagement",
  });

  const description = intl.formatMessage({
    id: "RoomManagementDescription",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const roomFeatures = [
    {
      id: 0,
      title: intl.formatMessage({ id: "RoomManagementRooms" }),
      description: intl.formatMessage({ id: "RoomManagementRoomsDesc" }),
      icon: <BedIcon size={40} color="#10b981" />,
      color: "#10b981",
      component: <RoomList title={intl.formatMessage({ id: "RoomManagementRooms" })} />
    },
    {
      id: 1,
      title: intl.formatMessage({ id: "RoomManagementAmenities" }),
      description: intl.formatMessage({ id: "RoomManagementAmenitiesDesc" }),
      icon: <StarIcon size={40} color="#fbbf24" />,
      color: "#fbbf24",
      component: <AmenityList title={intl.formatMessage({ id: "RoomManagementAmenities" })} />
    },
    {
      id: 2,
      title: intl.formatMessage({ id: "RoomManagementStatus" }),
      description: intl.formatMessage({ id: "RoomManagementStatusDesc" }),
      icon: <ActivityIcon size={40} color="#06b6d4" />,
      color: "#06b6d4",
      component: <RoomStatusList title={intl.formatMessage({ id: "RoomManagementStatus" })} />
    },
    {
      id: 3,
      title: intl.formatMessage({ id: "RoomManagementType" }),
      description: intl.formatMessage({ id: "RoomManagementTypeDesc" }),
      icon: <Grid3x3Icon size={40} color="#8b5cf6" />,
      color: "#8b5cf6",
      component: <RoomTypeList title={intl.formatMessage({ id: "RoomManagementType" })} />
    },
    {
      id: 4,
      title: intl.formatMessage({ id: "RoomManagementBlock" }),
      description: intl.formatMessage({ id: "RoomManagementBlockDesc" }),
      icon: <LockIcon size={40} color="#ef4444" />,
      color: "#ef4444",
      component: <RoomBlock title={intl.formatMessage({ id: "RoomManagementBlock" })} workingDate={workingDate} />
    }
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Page>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HomeIcon size={32} color="#1976d2" style={{ marginRight: 12 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                {title}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {description}
            </Typography>
            <Divider />
          </Box>

          {/* Quick Access Cards */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Access
            </Typography>
            <Grid container spacing={3}>
              {roomFeatures.map((feature) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={feature.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: feature.color,
                        borderWidth: 2,
                        borderStyle: 'solid'
                      },
                      border: activeTab === feature.id ? `2px solid ${feature.color}` : '1px solid #e0e0e0'
                    }}
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                      <Button
                        size="small"
                        sx={{
                          color: feature.color,
                          '&:hover': {
                            backgroundColor: `${feature.color}15`
                          }
                        }}
                      >
                        Manage
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Tab Navigation */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500
                }
              }}
            >
              {roomFeatures.map((feature) => (
                <Tab
                  key={feature.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {React.cloneElement(feature.icon, { size: 20 })}
                      {feature.title}
                    </Box>
                  }
                  {...a11yProps(feature.id)}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {roomFeatures.map((feature) => (
            <TabPanel key={feature.id} value={activeTab} index={feature.id}>
              <Paper sx={{ p: 0, minHeight: 400 }}>
                {feature.component}
              </Paper>
            </TabPanel>
          ))}
        </Container>
      </Page>
    </>
  );
};

export default Index;

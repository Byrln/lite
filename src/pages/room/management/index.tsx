import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Page from '@/components/page';
import { Container } from '@mui/material';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  Star,
  Activity,
  Grid3X3,
  Lock,
  Bed,
  Settings,
  Plus
} from 'lucide-react';

// Import existing components
import RoomList from '@/components/room/list';
import AmenityList from '@/components/room/amenity/list';
import RoomStatusList from '@/components/room/status/list';
import RoomTypeList from '@/components/room/type/list';
import RoomBlock from '@/components/room-service/room-block/list';

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

function a11yProps(index: any) {
  return {
    id: `room-tab-${index}`,
    'aria-controls': `room-tabpanel-${index}`,
  };
}

const RoomManagementPage = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const roomFeatures = [
    {
      id: 'rooms',
      title: intl.formatMessage({ id: 'RoomManagementRooms', defaultMessage: 'Rooms' }),
      description: intl.formatMessage({ id: 'RoomManagementRoomsDesc', defaultMessage: 'Manage hotel rooms and their configurations' }),
      icon: <Bed className="h-6 w-6" />,
      color: 'bg-emerald-500',
      component: <RoomList />
    },
    {
      id: 'amenities',
      title: intl.formatMessage({ id: 'RoomManagementAmenities', defaultMessage: 'Amenities' }),
      description: intl.formatMessage({ id: 'RoomManagementAmenitiesDesc', defaultMessage: 'Configure room amenities and features' }),
      icon: <Star className="h-6 w-6" />,
      color: 'bg-amber-500',
      component: <AmenityList />
    },
    {
      id: 'status',
      title: intl.formatMessage({ id: 'RoomManagementStatus', defaultMessage: 'Status' }),
      description: intl.formatMessage({ id: 'RoomManagementStatusDesc', defaultMessage: 'Monitor and update room status' }),
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-cyan-500',
      component: <RoomStatusList />
    },
    {
      id: 'types',
      title: intl.formatMessage({ id: 'RoomManagementTypes', defaultMessage: 'Types' }),
      description: intl.formatMessage({ id: 'RoomManagementTypesDesc', defaultMessage: 'Manage different room types and categories' }),
      icon: <Grid3X3 className="h-6 w-6" />,
      color: 'bg-purple-500',
      component: <RoomTypeList />
    },
    {
      id: 'block',
      title: intl.formatMessage({ id: 'RoomManagementBlock', defaultMessage: 'Block Rooms' }),
      description: intl.formatMessage({ id: 'RoomManagementBlockDesc', defaultMessage: 'Block rooms for maintenance or special events' }),
      icon: <Lock className="h-6 w-6" />,
      color: 'bg-red-500',
      component: <RoomBlock />
    }
  ];

  return (
    <Page
      title={intl.formatMessage({
        id: 'PageTitleRoomManagement',
        defaultMessage: 'Room Management'
      })}
    >
      <Container>
        <div className="space-y-6">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Settings style={{ fontSize: 16 }} />
                      {intl.formatMessage({ id: 'Overview', defaultMessage: 'Overview' })}
                    </Box>
                  }
                  value="overview"
                  {...a11yProps('overview')}
                />
                {roomFeatures.map((feature) => (
                  <Tab
                    key={feature.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {React.cloneElement(feature.icon, { style: { fontSize: 16 } })}
                        {feature.title}
                      </Box>
                    }
                    value={feature.id}
                    {...a11yProps(feature.id)}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={activeTab} index="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomFeatures.map((feature) => (
                  <Card
                    key={feature.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(feature.id);
                        }}
                      >
                        {intl.formatMessage({ id: 'Manage', defaultMessage: 'Manage' })}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabPanel>

            {/* Feature Tabs */}
            {roomFeatures.map((feature) => (
              <TabPanel key={feature.id} value={activeTab} index={feature.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{feature.title}</h2>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                {feature.component}
              </TabPanel>
            ))}
          </Box>
        </div>
      </Container>
    </Page>
  );
};

export default RoomManagementPage;
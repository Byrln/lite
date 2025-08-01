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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roomFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setActiveTab(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${feature.color} text-white flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-sm sm:text-base font-semibold break-words">{feature.title}</h1>
                        <p className="text-xs text-muted-foreground break-words">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border border-primary-main"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(feature.id);
                      }}
                    >
                      {intl.formatMessage({ id: 'TextView' })}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabPanel>

          {/* Feature Tabs */}
          {roomFeatures.map((feature) => (
            <TabPanel key={feature.id} value={activeTab} index={feature.id}>
              <div className="flex items-center gap-2 mb-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
                <div className={`p-1.5 rounded-lg ${feature.color} text-white shadow-md flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-0.5 break-words">{feature.title}</h2>
                  <p className="text-gray-600 text-xs break-words">{feature.description}</p>
                </div>
              </div>
              {feature.component}
            </TabPanel>
          ))}
        </Box>
      </div>
    </Page>
  );
};

export default RoomManagementPage;
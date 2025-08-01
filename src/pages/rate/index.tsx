import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Page from '@/components/page';
import { Container } from '@mui/material';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tag,
  Sun,
  Layers,
  DollarSign,
  Package,
  PlusSquare,
  Percent
} from 'lucide-react';
import { usePrivilegeChecker, RATE_PRIVILEGES } from 'lib/utils/privilege-checker';

// Import existing components
import RateList from '@/components/rate/list';
import SeasonList from '@/components/rate/season/list';
import RateTypeList from '@/components/rate/type/list';
import ExtraChargeGroupList from '@/components/rate/extra-charge-group/list';
import ExtraChargeList from '@/components/rate/extra-charge/list';
import TaxList from '@/components/rate/tax/list';

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
      id={`rate-tabpanel-${index}`}
      aria-labelledby={`rate-tab-${index}`}
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
    id: `rate-tab-${index}`,
    'aria-controls': `rate-tabpanel-${index}`,
  };
}

const RatePage = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('overview');
  const { hasPrivilege } = usePrivilegeChecker();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const allRateFeatures = [
    {
      id: 'seasons',
      title: intl.formatMessage({ id: 'menu.улирал', defaultMessage: 'Season' }),
      description: intl.formatMessage({ id: 'SeasonDesc', defaultMessage: 'Manage seasonal pricing periods' }),
      icon: <Sun className="h-6 w-6" />,
      color: 'bg-amber-500',
      privilege: RATE_PRIVILEGES.SEASONS,
      component: <SeasonList />
    },
    {
      id: 'rate-types',
      title: intl.formatMessage({ id: 'menu.тарифын төрөл', defaultMessage: 'Rate Type' }),
      description: intl.formatMessage({ id: 'RateTypeDesc', defaultMessage: 'Configure different rate categories' }),
      icon: <Layers className="h-6 w-6" />,
      color: 'bg-blue-500',
      privilege: RATE_PRIVILEGES.RATE_TYPES,
      component: <RateTypeList />
    },
    {
      id: 'rates',
      title: intl.formatMessage({ id: 'menu.Тариф', defaultMessage: 'Rate' }),
      description: intl.formatMessage({ id: 'RateDesc', defaultMessage: 'Manage room rates and pricing' }),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-emerald-500',
      privilege: RATE_PRIVILEGES.RATES,
      component: <RateList />
    },
    {
      id: 'extra-charge-groups',
      title: intl.formatMessage({ id: 'menu.Нэм.Үйлчилгээ бүлэг', defaultMessage: 'Extra Charge Group' }),
      description: intl.formatMessage({ id: 'ExtraChargeGroupDesc', defaultMessage: 'Organize extra services into groups' }),
      icon: <Package className="h-6 w-6" />,
      color: 'bg-purple-500',
      privilege: RATE_PRIVILEGES.EXTRA_CHARGE_GROUPS,
      component: <ExtraChargeGroupList />
    },
    {
      id: 'extra-charges',
      title: intl.formatMessage({ id: 'menu.нэмэлт үйлчилгээ', defaultMessage: 'Extra Charges' }),
      description: intl.formatMessage({ id: 'ExtraChargeDesc', defaultMessage: 'Configure additional services and charges' }),
      icon: <PlusSquare className="h-6 w-6" />,
      color: 'bg-red-500',
      privilege: RATE_PRIVILEGES.EXTRA_CHARGES,
      component: <ExtraChargeList />
    },
    {
      id: 'tax',
      title: intl.formatMessage({ id: 'menu.татвар', defaultMessage: 'Tax' }),
      description: intl.formatMessage({ id: 'TaxDesc', defaultMessage: 'Manage tax rates and configurations' }),
      icon: <Percent className="h-6 w-6" />,
      color: 'bg-red-500',
      privilege: RATE_PRIVILEGES.TAX,
      component: <TaxList />
    }
  ];

  // Filter features based on user privileges
  const rateFeatures = allRateFeatures.filter(feature =>
    hasPrivilege(feature.privilege)
  );

  // Ensure we have at least one tab visible, fallback to overview if user has any rate access
  const visibleFeatures = rateFeatures.length > 0 ? rateFeatures :
    (hasPrivilege(RATE_PRIVILEGES.OVERVIEW) ? [allRateFeatures[0]] : []);

  // Reset active tab if current tab is not available
  React.useEffect(() => {
    if (visibleFeatures.length > 0 && activeTab !== 'overview' && !visibleFeatures.find(f => f.id === activeTab)) {
      setActiveTab(visibleFeatures[0].id);
    }
  }, [visibleFeatures, activeTab]);

  return (
    <Page
      title={intl.formatMessage({
        id: 'PageTitleRate',
        defaultMessage: 'Rate Management'
      })}
    >
      <div className="space-y-2">
        <Box sx={{ width: '100%' }}>
          {visibleFeatures.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tag className="h-4 w-4" />
                        {intl.formatMessage({ id: 'Overview', defaultMessage: 'Overview' })}
                      </Box>
                    }
                    value="overview"
                    {...a11yProps('overview')}
                  />
                  {visibleFeatures.map((feature) => (
                    <Tab
                      key={feature.id}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {feature.icon}
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
                  {visibleFeatures.map((feature) => (
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
              {visibleFeatures.map((feature) => (
                <TabPanel key={feature.id} value={activeTab} index={feature.id}>
                  <div className="flex items-start gap-2 mb-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
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
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {intl.formatMessage({ id: 'NoAccessMessage', defaultMessage: 'You do not have access to any rate management features.' })}
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </Page>
  );
};

export default RatePage;

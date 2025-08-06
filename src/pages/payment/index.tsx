import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Page from '@/components/page';
import { Container } from '@mui/material';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CreditCard,
  DollarSign,
  Building2,
  Calculator,
  Wallet
} from 'lucide-react';
import { usePrivilegeChecker, PAYMENT_PRIVILEGES } from 'lib/utils/privilege-checker';

// Import existing components
import PaymentMethodList from '@/components/rate/payment-method/list';
import ExchangeRate from '@/components/payment/exchange-rate/list';
import CompanyDatabase from '@/components/payment/company-database/list';
import CashierList from '@/components/payment/cashier/list';

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
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
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
    id: `payment-tab-${index}`,
    'aria-controls': `payment-tabpanel-${index}`,
  };
}

// Loading skeleton component for feature cards
const FeatureCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full rounded-md" />
    </CardContent>
  </Card>
);

// Loading skeleton for tab content
const TabContentSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

const PaymentPage = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { hasPrivilege } = usePrivilegeChecker();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== activeTab) {
      setIsLoading(true);
      // Simulate loading for smooth transition
      setTimeout(() => {
        setActiveTab(newValue);
        setIsLoading(false);
      }, 300);
    }
  };



  const allPaymentFeatures = [
    {
      id: 'payment-method',
      title: intl.formatMessage({ id: 'menu.төлбөрийн хэлбэр', defaultMessage: 'Payment Method' }),
      description: intl.formatMessage({ id: 'PaymentMethodDesc', defaultMessage: 'Configure payment methods and options' }),
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-blue-500',
      privilege: PAYMENT_PRIVILEGES.PAYMENT_METHODS,
      component: <PaymentMethodList />
    },
    {
      id: 'exchange-rate',
      title: intl.formatMessage({ id: 'menu.валютын ханш', defaultMessage: 'Exchange Rate' }),
      description: intl.formatMessage({ id: 'ExchangeRateDesc', defaultMessage: 'Manage currency exchange rates' }),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
      privilege: PAYMENT_PRIVILEGES.EXCHANGE_RATE,
      component: <ExchangeRate title={intl.formatMessage({ id: 'PageTitleExchangeRate', defaultMessage: 'Exchange Rate' })} />
    },
    {
      id: 'company-database',
      title: intl.formatMessage({ id: 'menu.Байгууллага', defaultMessage: 'Company Database' }),
      description: intl.formatMessage({ id: 'CompanyDatabaseDesc', defaultMessage: 'Manage company and organization records' }),
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-purple-500',
      privilege: PAYMENT_PRIVILEGES.COMPANY_DATABASE,
      component: <CompanyDatabase title={intl.formatMessage({ id: 'PageTitleCompanyDatabase', defaultMessage: 'Company Database' })} />
    },
    {
      id: 'cashier',
      title: intl.formatMessage({ id: 'menu.Касс (Бэлэн мөнгө)', defaultMessage: 'Cashier' }),
      description: intl.formatMessage({ id: 'CashierDesc', defaultMessage: 'Manage cash transactions and cashier operations' }),
      icon: <Wallet className="h-6 w-6" />,
      color: 'bg-amber-500',
      privilege: PAYMENT_PRIVILEGES.CASHIER,
      component: <CashierList title={intl.formatMessage({ id: 'Касс', defaultMessage: 'Cashier' })} />
    }
  ];

  // Filter features based on user privileges
  const paymentFeatures = allPaymentFeatures.filter(feature =>
    hasPrivilege(feature.privilege)
  );

  // Ensure we have at least one tab visible, fallback to overview if user has any payment access
  const visibleFeatures = paymentFeatures.length > 0 ? paymentFeatures :
    (hasPrivilege(PAYMENT_PRIVILEGES.OVERVIEW) ? [allPaymentFeatures[0]] : []);

  // Reset active tab if current tab is not available
  React.useEffect(() => {
    if (visibleFeatures.length > 0 && activeTab !== 'overview' && !visibleFeatures.find(f => f.id === activeTab)) {
      setActiveTab(visibleFeatures[0].id);
    }
  }, [visibleFeatures, activeTab]);

  return (
    <Page
      title={intl.formatMessage({
        id: 'PageTitlePayment',
        defaultMessage: 'Payment & Billing'
      })}
    >
      <div className="space-y-6 py-4 px-8">
        <Box sx={{ width: '100%' }}>
          {visibleFeatures.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calculator style={{ fontSize: 16 }} />
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
                  {isLoading ? (
                    // Show skeleton loading
                    Array.from({ length: 4 }).map((_, index) => (
                      <FeatureCardSkeleton key={index} />
                    ))
                  ) : (
                    visibleFeatures.map((feature, index) => (
                      <div key={feature.id}>
                        <Card
                          className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 shadow-md"
                          onClick={() => handleTabChange({} as React.SyntheticEvent, feature.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`p-1.5 sm:p-2 rounded-xl ${feature.color} text-white shadow-lg flex-shrink-0`}>
                                {feature.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h1 className="text-sm sm:text-base font-semibold text-gray-800 mb-0.5 break-words">{feature.title}</h1>
                                <p className="text-xs text-gray-600 leading-relaxed break-words">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button
                              variant="outline"
                              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary-main hover:border-primary-light hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-200 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTabChange({} as React.SyntheticEvent, feature.id);
                              }}
                            >
                              {intl.formatMessage({ id: 'TextView', defaultMessage: 'View Details' })}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  )}
                </div>
              </TabPanel>

              {/* Feature Tabs */}
              {visibleFeatures.map((feature) => (
                <TabPanel key={feature.id} value={activeTab} index={feature.id}>
                  <div>
                    {isLoading ? (
                      <TabContentSkeleton />
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
                          <div className={`p-1.5 rounded-lg ${feature.color} text-white shadow-md flex-shrink-0`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-0.5 break-words">{feature.title}</h2>
                            <p className="text-gray-600 text-xs break-words">{feature.description}</p>
                          </div>
                        </div>
                        <div className="transition-opacity duration-300">
                          {feature.component}
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
              ))}
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {intl.formatMessage({ id: 'NoAccessMessage', defaultMessage: 'You do not have access to any payment management features.' })}
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </Page >
  );
};

export default PaymentPage;
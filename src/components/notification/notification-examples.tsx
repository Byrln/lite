'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Send as SendIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { NotificationAPI, type NotificationStatusRequest } from '@/lib/api/notification';

// Example notification status queries
const exampleQueries: NotificationStatusRequest[] = [
  {
    NotificationID: 1,
    IsSent: true,
    IsVisit: false,
  },
  {
    NotificationCode: 'SYSTEM_MAINT_001',
    IsSent: true,
  },
  {
    IsVisit: false,
    IsSent: true,
  },
  {
    NotificationID: 5,
  },
];

type ApiStatus = 'checking' | 'connected' | 'error';
type AlertType = { type: 'success' | 'error' | 'info'; message: string };

export default function NotificationExamples() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [previewMode, setPreviewMode] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [creatingStates, setCreatingStates] = useState<Record<number, boolean>>({});
  const [queryingAll, setQueryingAll] = useState(false);
  const [queriedCount, setQueriedCount] = useState(0);

  // Test API connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Test API connection
  const testConnection = async () => {
    setApiStatus('checking');
    try {
      const result = await NotificationAPI.testConnection();
      setApiStatus(result ? 'connected' : 'error');
    } catch (error) {
      console.error('API connection test failed:', error);
      setApiStatus('error');
    }
  };

  // Query individual notification status
  const queryNotificationStatus = async (query: NotificationStatusRequest, index: number) => {
    if (previewMode) {
      setAlert({ type: 'info', message: `Preview: Would query notification status with parameters: ${JSON.stringify(query)}` });
      return;
    }

    if (apiStatus !== 'connected') {
      setAlert({ type: 'error', message: 'API is not connected. Please use preview mode.' });
      return;
    }

    setCreatingStates(prev => ({ ...prev, [index]: true }));
    try {
      const result = await NotificationAPI.getStatus(query);
      if (result.Status) {
        setAlert({ type: 'success', message: `Notification status queried successfully! Found ${result.Data?.length || 0} notifications.` });
      } else {
        setAlert({ type: 'error', message: `Failed to query notification status` });
      }
    } catch (error: any) {
      console.error('Error querying notification status:', error);
      setAlert({ 
        type: 'error', 
        message: `Error querying notification status: ${error.response?.data?.Message || error.message}` 
      });
    } finally {
      setCreatingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  // Query all notification statuses
  const queryAllNotificationStatuses = async () => {
    if (previewMode) {
      setAlert({ type: 'info', message: `Preview: Would query ${exampleQueries.length} notification statuses` });
      return;
    }

    if (apiStatus !== 'connected') {
      setAlert({ type: 'error', message: 'API is not connected. Please use preview mode.' });
      return;
    }

    setQueryingAll(true);
    setQueriedCount(0);
    
    for (let i = 0; i < exampleQueries.length; i++) {
      try {
        const result = await NotificationAPI.getStatus(exampleQueries[i]);
        if (result.Status) {
          setQueriedCount(prev => prev + 1);
        }
      } catch (error) {
        console.error(`Error querying notification status ${i + 1}:`, error);
      }
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setQueryingAll(false);
    setAlert({ 
      type: 'success', 
      message: `Batch query completed! Queried ${queriedCount} out of ${exampleQueries.length} notification statuses.` 
    });
  };

  // Get query type info
  const getQueryTypeInfo = (query: NotificationStatusRequest) => {
    if (query.NotificationID) {
      return { label: 'By ID', color: 'primary' as const, icon: '🆔' };
    }
    if (query.NotificationCode) {
      return { label: 'By Code', color: 'secondary' as const, icon: '📝' };
    }
    if (query.IsSent !== undefined || query.IsVisit !== undefined) {
      return { label: 'By Status', color: 'info' as const, icon: '📊' };
    }
    return { label: 'General', color: 'default' as const, icon: '🔍' };
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <NotificationsIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Notification Query Examples
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {previewMode
                ? 'Preview mode: Test notification queries without sending'
                : 'Query notification statuses through the API platform'}
            </Typography>
          </Box>

          {/* API Status */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                API Connection
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={testConnection}
                disabled={apiStatus === 'checking'}
                startIcon={apiStatus === 'checking' ? <CircularProgress size={16} /> : <RefreshIcon />}
              >
                Test Connection
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {apiStatus === 'checking' && (
                <>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Testing connection...
                  </Typography>
                </>
              )}
              {apiStatus === 'connected' && (
                <>
                  <WifiIcon color="success" />
                  <Typography variant="body2" color="success.main">
                    Connected to API
                  </Typography>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <WifiOffIcon color="error" />
                  <Typography variant="body2" color="error.main">
                    Connection failed
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Preview Mode Toggle */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={previewMode}
                  onChange={(e) => setPreviewMode(e.target.checked)}
                  color="primary"
                />
              }
              label="Preview Mode (Test without API calls)"
            />
          </Box>

          {/* Alert */}
          {alert && (
            <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}

          {/* Examples */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Example Notification Queries
            </Typography>
            
            <Grid container spacing={3}>
              {exampleQueries.map((query, index) => {
                const queryInfo = getQueryTypeInfo(query);
                const isQuerying = creatingStates[index];
                
                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              Query {index + 1}: {queryInfo.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                              {JSON.stringify(query, null, 2)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '1.5rem', ml: 1 }}>
                            {queryInfo.icon}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            label={queryInfo.label}
                            color={queryInfo.color}
                            size="small"
                          />
                          {query.NotificationID && (
                            <Chip
                              label={`ID: ${query.NotificationID}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {query.NotificationCode && (
                            <Chip
                              label={`Code: ${query.NotificationCode}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {query.IsSent !== undefined && (
                            <Chip
                              label={`Sent: ${query.IsSent}`}
                              size="small"
                              color={query.IsSent ? 'success' : 'error'}
                            />
                          )}
                          {query.IsVisit !== undefined && (
                            <Chip
                              label={`Visit: ${query.IsVisit}`}
                              size="small"
                              color={query.IsVisit ? 'success' : 'error'}
                            />
                          )}
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          disabled={isQuerying || (apiStatus !== 'connected' && !previewMode)}
                          onClick={() => queryNotificationStatus(query, index)}
                          startIcon={isQuerying ? <CircularProgress size={16} /> : <SendIcon />}
                        >
                          {isQuerying ? 'Querying...' : previewMode ? 'Preview' : 'Query'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                disabled={queryingAll || (apiStatus !== 'connected' && !previewMode)}
                onClick={queryAllNotificationStatuses}
                startIcon={queryingAll ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ minWidth: 200 }}
              >
                {queryingAll
                  ? `Querying... (${queriedCount}/${exampleQueries.length})`
                  : previewMode
                  ? 'Preview All'
                  : 'Query All Examples'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
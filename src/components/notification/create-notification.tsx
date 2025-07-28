'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NotificationAPI, type NotificationStatusRequest } from '@/lib/api/notification';

// Validation schema for notification status request
const notificationSchema = yup.object().shape({
  NotificationID: yup.number().nullable(),
  NotificationCode: yup.string().nullable(),
  IsSent: yup.boolean().nullable(),
  IsVisit: yup.boolean().nullable(),
});

type FormData = {
  NotificationID?: number | null;
  NotificationCode?: string | null;
  IsSent?: boolean | null;
  IsVisit?: boolean | null;
};

type ApiStatus = 'checking' | 'connected' | 'error';
type AlertType = { type: 'success' | 'error' | 'info'; message: string };

export default function CreateNotification() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<FormData | null>(null);
  const [alert, setAlert] = useState<AlertType | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(notificationSchema),
    defaultValues: {
      NotificationID: null,
      NotificationCode: null,
      IsSent: null,
      IsVisit: null,
    },
  });

  const watchedValues = watch();

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

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (previewMode) {
      setPreviewData(data);
      setAlert({ type: 'success', message: 'Preview generated successfully!' });
      return;
    }

    if (apiStatus !== 'connected') {
      setAlert({ type: 'error', message: 'API is not connected. Please check connection or use preview mode.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const notificationRequest: NotificationStatusRequest = {
        NotificationID: data.NotificationID || undefined,
        NotificationCode: data.NotificationCode || undefined,
        IsSent: data.IsSent || undefined,
        IsVisit: data.IsVisit || undefined,
      };

      const result = await NotificationAPI.getStatus(notificationRequest);
      
      if (result.Status) {
        setAlert({ type: 'success', message: 'Notification status retrieved successfully!' });
        reset();
        setPreviewData(null);
      } else {
        setAlert({ type: 'error', message: 'Failed to get notification status. Please try again.' });
      }
    } catch (error: any) {
      console.error('Error getting notification status:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.Message || 'An error occurred while getting the notification status.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status options
  const statusOptions = [
    { value: true, label: 'True', color: 'success' as const },
    { value: false, label: 'False', color: 'error' as const },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <NotificationsIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Query Notification Status
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {previewMode
                ? 'Preview mode: Test your notification query without sending'
                : 'Query notification status through the API platform'}
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
              label="Preview Mode (Test without API call)"
            />
          </Box>

          {/* Alert */}
          {alert && (
            <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Notification ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('NotificationID')}
                  fullWidth
                  label="Notification ID"
                  type="number"
                  error={!!errors.NotificationID}
                  helperText={errors.NotificationID?.message || 'Optional - Leave empty to query all'}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                />
              </Grid>

              {/* Notification Code */}
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('NotificationCode')}
                  fullWidth
                  label="Notification Code"
                  error={!!errors.NotificationCode}
                  helperText={errors.NotificationCode?.message || 'Optional - Leave empty to query all'}
                />
              </Grid>

              {/* IsSent Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.IsSent}>
                  <InputLabel>Is Sent Status</InputLabel>
                  <Select
                    {...register('IsSent')}
                    value={watchedValues.IsSent === null ? '' : watchedValues.IsSent}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue('IsSent', value === '' ? null : value === 'true');
                    }}
                    label="Is Sent Status"
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">Any</Typography>
                    </MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value.toString()} value={option.value.toString()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={option.label}
                            color={option.color}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.IsSent && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.IsSent.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* IsVisit Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.IsVisit}>
                  <InputLabel>Is Visit Status</InputLabel>
                  <Select
                    {...register('IsVisit')}
                    value={watchedValues.IsVisit === null ? '' : watchedValues.IsVisit}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue('IsVisit', value === '' ? null : value === 'true');
                    }}
                    label="Is Visit Status"
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">Any</Typography>
                    </MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value.toString()} value={option.value.toString()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={option.label}
                            color={option.color}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.IsVisit && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.IsVisit.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || (apiStatus !== 'connected' && !previewMode)}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <NotificationsIcon />}
                sx={{ minWidth: 200 }}
              >
                {isSubmitting
                  ? 'Processing...'
                  : previewMode
                  ? 'Preview Query'
                  : 'Query Status'}
              </Button>
            </Box>
          </form>

          {/* Preview */}
          {previewData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Preview
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Query Parameters Preview
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {previewData.NotificationID && (
                    <Chip
                      label={`Notification ID: ${previewData.NotificationID}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {previewData.NotificationCode && (
                    <Chip
                      label={`Notification Code: ${previewData.NotificationCode}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {previewData.IsSent !== null && (
                    <Chip
                      label={`Is Sent: ${previewData.IsSent}`}
                      color={previewData.IsSent ? 'success' : 'error'}
                      size="small"
                    />
                  )}
                  {previewData.IsVisit !== null && (
                    <Chip
                      label={`Is Visit: ${previewData.IsVisit}`}
                      color={previewData.IsVisit ? 'success' : 'error'}
                      size="small"
                    />
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
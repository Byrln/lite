import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NotificationAPI } from 'lib/api/notification';
import NotificationTypeSelect from 'components/select/notification-type';
import NotificationUserItemSelect from 'components/select/notification-user-item';

// Validation schema for notification creation
const notificationSchema = yup.object().shape({
    NotificationTypeID: yup.number().required('Notification type is required'),
    Title: yup.string().required('Title is required').max(255, 'Title must be less than 255 characters'),
    Message: yup.string().required('Message is required').max(1000, 'Message must be less than 1000 characters'),
    UserID: yup.number().when('NotificationTypeID', {
        is: 2, // Users type
        then: (schema) => schema.required('User is required when notification type is Users'),
        otherwise: (schema) => schema.nullable()
    }),
    Priority: yup.number().required('Priority is required'),
    Status: yup.boolean().default(true)
});

interface CreateNotificationProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CreateNotification: React.FC<CreateNotificationProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [notificationTypeID, setNotificationTypeID] = useState<number>(0);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(notificationSchema),
        defaultValues: {
            NotificationTypeID: 0,
            Title: '',
            Message: '',
            UserID: null,
            Priority: 1,
            Status: true
        }
    });

    const entity = watch();

    const setEntity = (newEntity: any) => {
        Object.keys(newEntity).forEach(key => {
            setValue(key as any, newEntity[key]);
        });
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Prepare data according to HoracaSoft API specification
            const notificationData = {
                NotificationTypeID: data.NotificationTypeID,
                Title: data.Title,
                Message: data.Message,
                UserID: data.NotificationTypeID === 2 ? data.UserID : null,
                Priority: data.Priority,
                Status: data.Status,
                CreatedDate: new Date().toISOString(),
                IsRead: false
            };

            const response = await NotificationAPI.new(notificationData);
            
            if (response.status === 200) {
                setAlert({ type: 'success', message: 'Notification created successfully!' });
                reset();
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            } else {
                setAlert({ type: 'error', message: 'Failed to create notification. Please try again.' });
            }
        } catch (error: any) {
            console.error('Error creating notification:', error);
            setAlert({ 
                type: 'error', 
                message: error.response?.data?.message || 'An error occurred while creating the notification.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setAlert(null);
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Create New Notification
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Notification Type Selection */}
                        <Grid item xs={12}>
                            <NotificationTypeSelect
                                register={register}
                                errors={errors}
                                entity={entity}
                                setEntity={setEntity}
                                setNotificationTypeID={setNotificationTypeID}
                            />
                        </Grid>

                        {/* Title Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                {...register('Title')}
                                error={!!errors.Title}
                                helperText={errors.Title?.message}
                                size="small"
                                margin="dense"
                            />
                        </Grid>

                        {/* Message Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                {...register('Message')}
                                error={!!errors.Message}
                                helperText={errors.Message?.message}
                                multiline
                                rows={4}
                                size="small"
                                margin="dense"
                            />
                        </Grid>

                        {/* User Selection (only when notification type is Users) */}
                        {notificationTypeID === 2 && (
                            <Grid item xs={12}>
                                <NotificationUserItemSelect
                                    register={register}
                                    errors={errors}
                                    field="UserID"
                                    UserTypeID={notificationTypeID}
                                />
                            </Grid>
                        )}

                        {/* Priority Selection */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" margin="dense">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    {...register('Priority')}
                                    label="Priority"
                                    error={!!errors.Priority}
                                    value={entity.Priority || 1}
                                    onChange={(e) => setEntity({ ...entity, Priority: e.target.value })}
                                >
                                    <MenuItem value={1}>Low</MenuItem>
                                    <MenuItem value={2}>Medium</MenuItem>
                                    <MenuItem value={3}>High</MenuItem>
                                    <MenuItem value={4}>Critical</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status Toggle */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" margin="dense">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    {...register('Status')}
                                    label="Status"
                                    value={entity.Status ? 1 : 0}
                                    onChange={(e) => setEntity({ ...entity, Status: e.target.value === 1 })}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={0}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {onCancel && (
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ minWidth: 120 }}
                                >
                                    {loading ? 'Creating...' : 'Create Notification'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Success/Error Alert */}
                <Snackbar
                    open={!!alert}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity={alert?.type}
                        sx={{ width: '100%' }}
                    >
                        {alert?.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default CreateNotification;
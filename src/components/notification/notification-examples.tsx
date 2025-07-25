import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Alert,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { NotificationService } from 'lib/services/notification-service';

/**
 * Example component demonstrating various notification creation patterns
 * using the HoracaSoft API
 */
const NotificationExamples: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [customTitle, setCustomTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [customUserId, setCustomUserId] = useState<number>(1);
    const [customPriority, setCustomPriority] = useState<number>(2);

    const addResult = (type: string, result: any) => {
        setResults(prev => [{
            id: Date.now(),
            type,
            timestamp: new Date().toLocaleTimeString(),
            ...result
        }, ...prev.slice(0, 4)]); // Keep only last 5 results
    };

    // Example 1: System Notification
    const createSystemNotification = async () => {
        setLoading('system');
        try {
            const result = await NotificationService.createSystemNotification(
                'System Maintenance',
                'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM. Please save your work.'
            );
            addResult('System Notification', result);
        } catch (error) {
            addResult('System Notification', { success: false, message: 'Error occurred' });
        } finally {
            setLoading(null);
        }
    };

    // Example 2: User-specific Notification
    const createUserNotification = async () => {
        setLoading('user');
        try {
            const result = await NotificationService.createUserNotification(
                1, // User ID
                'Welcome Message',
                'Welcome to HorecaSoft! Your account has been successfully activated.',
                2 // Medium priority
            );
            addResult('User Notification', result);
        } catch (error) {
            addResult('User Notification', { success: false, message: 'Error occurred' });
        } finally {
            setLoading(null);
        }
    };

    // Example 3: Bulk Notification
    const createBulkNotification = async () => {
        setLoading('bulk');
        try {
            const result = await NotificationService.createBulkNotification(
                {
                    NotificationTypeID: 2,
                    Title: 'Important Update',
                    Message: 'Please update your profile information by the end of this week.',
                    Priority: 3,
                    Status: true
                },
                [1, 2, 3] // Array of user IDs
            );
            addResult('Bulk Notification', result);
        } catch (error) {
            addResult('Bulk Notification', { success: false, message: 'Error occurred' });
        } finally {
            setLoading(null);
        }
    };

    // Example 4: Custom Notification
    const createCustomNotification = async () => {
        if (!customTitle || !customMessage) {
            addResult('Custom Notification', { success: false, message: 'Title and message are required' });
            return;
        }

        setLoading('custom');
        try {
            const result = await NotificationService.createUserNotification(
                customUserId,
                customTitle,
                customMessage,
                customPriority
            );
            addResult('Custom Notification', result);
            // Clear form on success
            if (result.success) {
                setCustomTitle('');
                setCustomMessage('');
            }
        } catch (error) {
            addResult('Custom Notification', { success: false, message: 'Error occurred' });
        } finally {
            setLoading(null);
        }
    };

    // Example 5: Role-based Notification
    const createRoleNotification = async () => {
        setLoading('role');
        try {
            const result = await NotificationService.createNotification({
                NotificationTypeID: 1, // User Roles
                Title: 'Policy Update',
                Message: 'New company policies have been updated. Please review them in the policy section.',
                Priority: 3,
                Status: true
            });
            addResult('Role-based Notification', result);
        } catch (error) {
            addResult('Role-based Notification', { success: false, message: 'Error occurred' });
        } finally {
            setLoading(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                HoracaSoft Notification API Examples
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Demonstration of various notification creation patterns using the HoracaSoft API
            </Typography>

            <Grid container spacing={3}>
                {/* Predefined Examples */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                        Predefined Examples
                    </Typography>
                    
                    <Grid container spacing={2}>
                        {/* System Notification */}
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <WarningIcon color="error" sx={{ mr: 1 }} />
                                        <Typography variant="h6">System Notification</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        High priority system-wide notification for all users
                                    </Typography>
                                    <Chip label="Critical Priority" color="error" size="small" sx={{ mb: 2 }} />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={createSystemNotification}
                                        disabled={loading === 'system'}
                                        color="error"
                                    >
                                        {loading === 'system' ? 'Creating...' : 'Create System Alert'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* User Notification */}
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">User Notification</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Targeted notification for a specific user
                                    </Typography>
                                    <Chip label="Medium Priority" color="info" size="small" sx={{ mb: 2 }} />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={createUserNotification}
                                        disabled={loading === 'user'}
                                    >
                                        {loading === 'user' ? 'Creating...' : 'Create User Message'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bulk Notification */}
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <GroupIcon color="warning" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Bulk Notification</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Send notification to multiple users at once
                                    </Typography>
                                    <Chip label="High Priority" color="warning" size="small" sx={{ mb: 2 }} />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={createBulkNotification}
                                        disabled={loading === 'bulk'}
                                        color="warning"
                                    >
                                        {loading === 'bulk' ? 'Creating...' : 'Send to Multiple Users'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Role-based Notification */}
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <InfoIcon color="success" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Role-based</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Notification sent to users based on their roles
                                    </Typography>
                                    <Chip label="High Priority" color="warning" size="small" sx={{ mb: 2 }} />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={createRoleNotification}
                                        disabled={loading === 'role'}
                                        color="success"
                                    >
                                        {loading === 'role' ? 'Creating...' : 'Send to Roles'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Custom Notification Form */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Custom Notification
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Create a custom notification with your own content
                            </Typography>
                            
                            <TextField
                                fullWidth
                                label="Title"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                margin="dense"
                                size="small"
                            />
                            
                            <TextField
                                fullWidth
                                label="Message"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                margin="dense"
                                size="small"
                                multiline
                                rows={3}
                            />
                            
                            <TextField
                                fullWidth
                                label="User ID"
                                type="number"
                                value={customUserId}
                                onChange={(e) => setCustomUserId(Number(e.target.value))}
                                margin="dense"
                                size="small"
                            />
                            
                            <FormControl fullWidth margin="dense" size="small">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={customPriority}
                                    label="Priority"
                                    onChange={(e) => setCustomPriority(Number(e.target.value))}
                                >
                                    <MenuItem value={1}>Low</MenuItem>
                                    <MenuItem value={2}>Medium</MenuItem>
                                    <MenuItem value={3}>High</MenuItem>
                                    <MenuItem value={4}>Critical</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={createCustomNotification}
                                disabled={loading === 'custom' || !customTitle || !customMessage}
                                sx={{ mt: 2 }}
                            >
                                {loading === 'custom' ? 'Creating...' : 'Send Custom Notification'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Results */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Recent Results
                    </Typography>
                    {results.length === 0 ? (
                        <Alert severity="info">No notifications created yet. Try the examples above!</Alert>
                    ) : (
                        <Box>
                            {results.map((result) => (
                                <Alert
                                    key={result.id}
                                    severity={result.success ? 'success' : 'error'}
                                    sx={{ mb: 1 }}
                                >
                                    <Typography variant="subtitle2">
                                        {result.type} - {result.timestamp}
                                    </Typography>
                                    <Typography variant="body2">
                                        {result.message}
                                        {result.totalSent && (
                                            <span> (Sent: {result.totalSent}, Failed: {result.totalFailed})</span>
                                        )}
                                    </Typography>
                                </Alert>
                            ))}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotificationExamples;
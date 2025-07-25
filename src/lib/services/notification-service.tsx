import { NotificationAPI } from 'lib/api/notification';

/**
 * Enhanced notification service for HoracaSoft API
 * Provides additional functionality beyond the basic CRUD operations
 */
export class NotificationService {
    /**
     * Create a new notification with enhanced validation and formatting
     * @param notificationData - The notification data to create
     * @returns Promise with the API response
     */
    static async createNotification(notificationData: {
        NotificationTypeID: number;
        Title: string;
        Message: string;
        UserID?: number | null;
        Priority: number;
        Status: boolean;
    }) {
        try {
            // Enhanced data formatting for HoracaSoft API
            const formattedData = {
                ...notificationData,
                CreatedDate: new Date().toISOString(),
                IsRead: false,
                // Ensure UserID is null for role-based notifications
                UserID: notificationData.NotificationTypeID === 1 ? null : notificationData.UserID,
            };

            const response = await NotificationAPI.new(formattedData);
            
            return {
                success: response.status === 200,
                data: response.data,
                message: response.status === 200 ? 'Notification created successfully' : 'Failed to create notification'
            };
        } catch (error: any) {
            console.error('NotificationService.createNotification error:', error);
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'An error occurred while creating the notification'
            };
        }
    }

    /**
     * Create a bulk notification for multiple users
     * @param notificationData - Base notification data
     * @param userIds - Array of user IDs to send notification to
     * @returns Promise with bulk creation results
     */
    static async createBulkNotification(
        notificationData: {
            NotificationTypeID: number;
            Title: string;
            Message: string;
            Priority: number;
            Status: boolean;
        },
        userIds: number[]
    ) {
        const results = [];
        
        for (const userId of userIds) {
            const result = await this.createNotification({
                ...notificationData,
                NotificationTypeID: 2, // Force to Users type for bulk
                UserID: userId
            });
            results.push({ userId, ...result });
        }

        return {
            totalSent: results.filter(r => r.success).length,
            totalFailed: results.filter(r => !r.success).length,
            results
        };
    }

    /**
     * Create a system notification (high priority, role-based)
     * @param title - Notification title
     * @param message - Notification message
     * @returns Promise with the API response
     */
    static async createSystemNotification(title: string, message: string) {
        return this.createNotification({
            NotificationTypeID: 1, // User Roles
            Title: `[SYSTEM] ${title}`,
            Message: message,
            Priority: 4, // Critical priority
            Status: true
        });
    }

    /**
     * Create a user-specific notification
     * @param userId - Target user ID
     * @param title - Notification title
     * @param message - Notification message
     * @param priority - Priority level (1-4)
     * @returns Promise with the API response
     */
    static async createUserNotification(
        userId: number,
        title: string,
        message: string,
        priority: number = 2
    ) {
        return this.createNotification({
            NotificationTypeID: 2, // Users
            Title: title,
            Message: message,
            UserID: userId,
            Priority: priority,
            Status: true
        });
    }

    /**
     * Get priority label for display
     * @param priority - Priority number (1-4)
     * @returns Priority label string
     */
    static getPriorityLabel(priority: number): string {
        const labels: { [key: number]: string } = {
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        };
        return labels[priority] || 'Unknown';
    }

    /**
     * Get priority color for UI display
     * @param priority - Priority number (1-4)
     * @returns Color string for Material-UI
     */
    static getPriorityColor(priority: number): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
        const colors: { [key: number]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
            1: 'default',
            2: 'info',
            3: 'warning',
            4: 'error'
        };
        return colors[priority] || 'default';
    }

    /**
     * Validate notification data before sending
     * @param data - Notification data to validate
     * @returns Validation result with errors if any
     */
    static validateNotificationData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.NotificationTypeID || ![1, 2].includes(data.NotificationTypeID)) {
            errors.push('Invalid notification type');
        }

        if (!data.Title || data.Title.trim().length === 0) {
            errors.push('Title is required');
        } else if (data.Title.length > 255) {
            errors.push('Title must be less than 255 characters');
        }

        if (!data.Message || data.Message.trim().length === 0) {
            errors.push('Message is required');
        } else if (data.Message.length > 1000) {
            errors.push('Message must be less than 1000 characters');
        }

        if (data.NotificationTypeID === 2 && !data.UserID) {
            errors.push('User ID is required for user-specific notifications');
        }

        if (!data.Priority || ![1, 2, 3, 4].includes(data.Priority)) {
            errors.push('Invalid priority level');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export default NotificationService;
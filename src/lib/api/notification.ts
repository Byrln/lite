import useSWR from "swr";
import axios from "../utils/axios";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.horacasoft.com';

// API endpoints
const API_BASE = "/api/Notification";
const ENDPOINTS = {
  item: `${API_BASE}/Item`,
  status: `${API_BASE}/Status`,
} as const;

// Notification interfaces based on PMS Web API documentation
export interface NotificationItem {
  NotificationID: number;
  ItemID: number; // TransactionID
}

export interface NotificationStatus {
  NotificationID: number;
  NotificationCode: string;
  NotificationTypeID: number;
  NotificationObjectID: number;
  ObjectTypeName: string;
  NotificationText: string;
  NotificationLink: string;
  Parameter1: string;
  Parameter2: string;
  Parameter3: string;
  Parameter4: string;
  CreatedDate: string;
  IsSent: boolean;
  SentDate: string;
  IsVisit: boolean;
  VisitDate: string;
}

// Request interfaces
export interface NotificationItemRequest {
  NotificationID?: number;
  NotificationCode?: string;
}

export interface NotificationStatusRequest {
  NotificationID?: number;
  NotificationCode?: string;
  IsSent?: boolean;
  IsVisit?: boolean;
}

// API Response interface
export interface ApiResponse<T = any> {
  Status: boolean;
  Code: string;
  Message: string;
  JsonData?: T;
}

// SWR hooks for notification status
export const useNotificationStatus = (request?: NotificationStatusRequest) => {
  return useSWR<NotificationStatus[]>(
    request ? [ENDPOINTS.status, request] : null,
    async ([url, req]) => {
      const response = await axios.post(url, req);
      return response.data?.JsonData || [];
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );
};

export const useNotificationItems = (request?: NotificationItemRequest) => {
  return useSWR<NotificationItem[]>(
    request ? [ENDPOINTS.item, request] : null,
    async ([url, req]) => {
      const response = await axios.post(url, req);
      return response.data?.JsonData || [];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Cache for 10 seconds
    }
  );
};

// Notification API functions
export const NotificationAPI = {
  // Get notification items (TransactionIDs)
  async getItems(request: NotificationItemRequest): Promise<ApiResponse<NotificationItem[]>> {
    try {
      const response = await axios.post(ENDPOINTS.item, request);
      return {
        Status: response.data?.Status === true,
        Code: response.data?.Code || '',
        Message: response.data?.Message || '',
        JsonData: response.data?.JsonData || [],
      };
    } catch (error: any) {
      console.error('Error fetching notification items:', error);
      return {
        Status: false,
        Code: 'ERROR',
        Message: error.response?.data?.Message || 'Failed to fetch notification items',
      };
    }
  },

  // Get notification status
  async getStatus(request: NotificationStatusRequest): Promise<ApiResponse<NotificationStatus[]>> {
    try {
      const response = await axios.post(ENDPOINTS.status, request);
      return {
        Status: response.data?.Status === true,
        Code: response.data?.Code || '',
        Message: response.data?.Message || '',
        JsonData: response.data?.JsonData || [],
      };
    } catch (error: any) {
      console.error('Error fetching notification status:', error);
      return {
        Status: false,
        Code: 'ERROR',
        Message: error.response?.data?.Message || 'Failed to fetch notification status',
      };
    }
  },

  // Update notification status (mark as visited)
  async updateStatus(request: NotificationStatusRequest): Promise<ApiResponse<NotificationStatus[]>> {
    try {
      const response = await axios.post(ENDPOINTS.status, {
        ...request,
        IsVisit: true,
        VisitDate: new Date().toISOString(),
      });
      return {
        Status: response.data?.Status === true,
        Code: response.data?.Code || '',
        Message: response.data?.Message || '',
        JsonData: response.data?.JsonData || [],
      };
    } catch (error: any) {
      console.error('Error updating notification status:', error);
      return {
        Status: false,
        Code: 'ERROR',
        Message: error.response?.data?.Message || 'Failed to update notification status',
      };
    }
  },

  // Mark notification as visited
  async markAsVisited(notificationId: number): Promise<ApiResponse<NotificationStatus[]>> {
    return this.updateStatus({
      NotificationID: notificationId,
      IsVisit: true,
    });
  },

  // Test API connection
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const response = await this.getStatus({});
      return {
        connected: response.Status === true,
      };
    } catch (error: any) {
      console.error('API connection test failed:', error);
      return {
        connected: false,
        error: error.message || 'Connection failed',
      };
    }
  },
};

// Legacy exports for backward compatibility
export const NotificationSWR = useNotificationStatus;
export const NotificationTypeSWR = useNotificationItems;
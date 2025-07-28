import React, { useState, useEffect } from "react";
import { Bell, Check, X, Wifi, WifiOff, RefreshCw, AlertCircle, Clock, Zap, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/radix-popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NotificationAPI, useNotificationStatus, type NotificationStatus, type NotificationStatusRequest } from "@/lib/api/notification";
import { cn } from "@/lib/utils";

type ApiStatus = 'idle' | 'checking' | 'connected' | 'disconnected';

// Type configuration
const getTypeConfig = (typeId: number) => {
  switch (typeId) {
    case 1:
      return {
        label: "Info",
        icon: <Eye className="h-3 w-3" />,
        color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        dotColor: "bg-blue-500",
      };
    case 2:
      return {
        label: "Alert",
        icon: <AlertCircle className="h-3 w-3" />,
        color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
        dotColor: "bg-orange-500",
      };
    default:
      return {
        label: "General",
        icon: <Check className="h-3 w-3" />,
        color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
        dotColor: "bg-gray-500",
      };
  }
};

// Notification Item Component
interface NotificationItemProps {
  notification: NotificationStatus;
  onMarkAsVisited: (id: number) => Promise<void>;
}

function NotificationItem({ notification, onMarkAsVisited }: NotificationItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const typeConfig = getTypeConfig(notification.NotificationTypeID);

  const handleMarkAsVisited = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || notification.IsVisit) return;

    setIsLoading(true);
    try {
      await onMarkAsVisited(notification.NotificationID);
    } finally {
      setIsLoading(false);
    }
  };



  const handleClick = () => {
    if (!notification.IsVisit && !isLoading) {
      onMarkAsVisited(notification.NotificationID);
    }
  };

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer border-l-4 group relative",
        !notification.IsVisit
          ? "bg-muted/30 border-l-primary shadow-sm"
          : "border-l-transparent hover:border-l-muted",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-medium truncate flex-1",
                !notification.IsVisit && "font-semibold"
              )}
            >
              {notification.NotificationText}
            </h4>
            <Badge
              variant="outline"
              className={cn("text-xs px-2 py-0.5 font-medium border", typeConfig.color)}
            >
              <span className="flex items-center gap-1">
                {typeConfig.icon}
                {notification.ObjectTypeName || typeConfig.label}
              </span>
            </Badge>
          </div>



          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {(() => {
                const date = new Date(notification.CreatedDate);
                return isNaN(date.getTime())
                  ? "Invalid date"
                  : formatDistanceToNow(date, { addSuffix: true });
              })()}
            </span>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.IsVisit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
                  onClick={handleMarkAsVisited}
                  disabled={isLoading}
                  title="Mark as visited"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              {notification.NotificationLink && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(notification.NotificationLink, '_blank');
                  }}
                  disabled={isLoading}
                  title="Open link"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Unvisited Indicator */}
        {!notification.IsVisit && (
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", typeConfig.dotColor)} />
            <span className="text-xs font-medium text-primary">NEW</span>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

// Main Notification Bell Component
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const [statusRequest] = useState<NotificationStatusRequest>({});
  const { data: notifications, error, mutate } = useNotificationStatus(statusRequest);

  // Test API connection
  const testConnection = async () => {
    setApiStatus('checking');
    try {
      const result = await NotificationAPI.testConnection();
      setApiStatus(result.connected ? 'connected' : 'disconnected');
      if (result.connected) {
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      setApiStatus('disconnected');
    }
  };

  // Auto-test connection when popover opens
  useEffect(() => {
    if (open && apiStatus === 'idle') {
      testConnection();
    }
  }, [open]);

  // Process notifications
  const sortedNotifications = notifications
    ? [...notifications]
        .sort((a, b) => {
          const dateA = new Date(a.CreatedDate);
          const dateB = new Date(b.CreatedDate);
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10)
    : [];

  const unvisitedCount = notifications ? notifications.filter((n) => !n.IsVisit).length : 0;

  // Event handlers
  const handleMarkAsVisited = async (notificationId: number) => {
    try {
      await NotificationAPI.markAsVisited(notificationId);
      mutate();
    } catch (error) {
      console.error('Error marking notification as visited:', error);
    }
  };

  const handleMarkAllAsVisited = async () => {
    if (isMarkingAllRead || unvisitedCount === 0) return;

    setIsMarkingAllRead(true);
    try {
      const unvisitedIds = notifications?.filter((n) => !n.IsVisit).map((n) => n.NotificationID) || [];
      for (const id of unvisitedIds) {
        await NotificationAPI.markAsVisited(id);
      }
      mutate();
    } catch (error) {
      console.error('Error marking all notifications as visited:', error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  // Status configuration
  const getStatusConfig = () => {
    switch (apiStatus) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: 'Connected',
          color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
          dotColor: 'bg-green-500',
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-3 w-3" />,
          label: 'Disconnected',
          color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
          dotColor: 'bg-red-500',
        };
      case 'checking':
        return {
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          label: 'Checking...',
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
          dotColor: 'bg-yellow-500 animate-pulse',
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: 'Idle',
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
          dotColor: 'bg-gray-400',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative h-8 w-8 p-0 transition-all duration-200",
            apiStatus === 'connected' && "hover:bg-green-50 hover:text-green-600",
            apiStatus === 'disconnected' && "hover:bg-red-50 hover:text-red-600"
          )}
        >
          <div className="relative">
            <Bell
              className={cn(
                "h-4 w-4 transition-all duration-200",
                unvisitedCount > 0 && "animate-bounce"
              )}
            />

            {/* API Status Dot */}
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background",
                statusConfig.dotColor
              )}
            />

            {/* Unvisited Badge */}
            {unvisitedCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-in zoom-in-50"
              >
                {unvisitedCount > 99 ? '99+' : unvisitedCount}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-lg">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", statusConfig.color)}>
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={testConnection}
              disabled={apiStatus === 'checking'}
              className="h-6 w-6 p-0"
              title="Test API Connection"
            >
              <RefreshCw className={cn("h-3 w-3", apiStatus === 'checking' && "animate-spin")} />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {unvisitedCount > 0
                  ? `${unvisitedCount} new notification${unvisitedCount === 1 ? '' : 's'}`
                  : 'All caught up!'}
              </p>
              {lastCheck && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last checked: {formatDistanceToNow(lastCheck, { addSuffix: true })}
                </p>
              )}
            </div>
            {unvisitedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsVisited}
                disabled={isMarkingAllRead}
                className="text-xs"
              >
                {isMarkingAllRead ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Marking...
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1" /> Mark all visited
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="h-[400px] overflow-y-auto">
          {!notifications ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">Loading notifications...</p>
                  <p className="text-xs text-muted-foreground mt-1">Connecting to API</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                  <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Connection Error</p>
                  <p className="text-xs text-muted-foreground mt-1">Unable to load notifications</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    mutate();
                    testConnection();
                  }}
                  className="mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-muted">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No notifications to display</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {sortedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.NotificationID}
                  notification={notification}
                  onMarkAsVisited={handleMarkAsVisited}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {sortedNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm" onClick={() => setOpen(false)}>
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
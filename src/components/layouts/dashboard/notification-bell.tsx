import React, { useState, useRef } from "react"
import { Bell, X, Check, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/radix-popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { NotificationSWR, NotificationAPI } from "@/lib/api/notification"
import { cn } from "@/lib/utils"

interface Notification {
  NotificationID: number
  Title: string
  Message: string
  CreatedDate: string
  IsRead: boolean
  Priority: number
  NotificationTypeID: number
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss
}: {
  notification: Notification
  onMarkAsRead: (id: number) => void
  onDismiss: (id: number) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return "text-red-600 dark:text-red-400" // Critical
      case 3: return "text-orange-600 dark:text-orange-400" // High
      case 2: return "text-blue-600 dark:text-blue-400" // Medium
      default: return "text-gray-600 dark:text-gray-400" // Low
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return "Critical"
      case 3: return "High"
      case 2: return "Medium"
      default: return "Low"
    }
  }

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading || notification.IsRead) return

    setIsLoading(true)
    try {
      await onMarkAsRead(notification.NotificationID)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading) return

    setIsLoading(true)
    try {
      await onDismiss(notification.NotificationID)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationClick = () => {
    if (!notification.IsRead && !isLoading) {
      onMarkAsRead(notification.NotificationID)
    }
  }

  return (
    <div
      className={cn(
        "p-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 group",
        !notification.IsRead ? "bg-muted/30 border-l-primary" : "border-l-transparent",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onClick={handleNotificationClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.IsRead && "font-semibold"
            )}>
              {notification.Title}
            </h4>
            <Badge
              variant="outline"
              className={cn("text-xs px-1 py-0", getPriorityColor(notification.Priority))}
            >
              {getPriorityLabel(notification.Priority)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {notification.Message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {(() => {
                const date = new Date(notification.CreatedDate)
                return isNaN(date.getTime())
                  ? 'Invalid date'
                  : formatDistanceToNow(date, { addSuffix: true })
              })()}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.IsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                  onClick={handleMarkAsRead}
                  disabled={isLoading}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                onClick={handleDismiss}
                disabled={isLoading}
                title="Mark as read and dismiss"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        {!notification.IsRead && (
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
        )}
      </div>
    </div>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const { data: notifications, error, mutate } = NotificationSWR()

  // Filter and sort notifications
  const sortedNotifications = notifications
    ? [...notifications]
      .sort((a: Notification, b: Notification) => {
        const dateA = new Date(a.CreatedDate)
        const dateB = new Date(b.CreatedDate)
        // Handle invalid dates by putting them at the end
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
        if (isNaN(dateA.getTime())) return 1
        if (isNaN(dateB.getTime())) return -1
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 10) // Show only latest 10
    : []

  const unreadCount = notifications
    ? notifications.filter((n: Notification) => !n.IsRead).length
    : 0

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // Update the notification as read using the API
      await NotificationAPI.update({
        NotificationID: notificationId,
        IsRead: true
      })

      // Refresh the notifications data
      mutate()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleDismiss = async (notificationId: number) => {
    try {
      // Since delete endpoint doesn't exist, mark as read and hide from UI
      // This is a workaround until the delete endpoint is implemented
      await NotificationAPI.update({
        NotificationID: notificationId,
        IsRead: true
      })

      // Refresh the notifications data
      mutate()
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead || unreadCount === 0) return

    setIsMarkingAllRead(true)
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications?.filter((n: Notification) => !n.IsRead) || []

      await Promise.all(
        unreadNotifications.map((notification: Notification) =>
          NotificationAPI.update({
            NotificationID: notification.NotificationID,
            IsRead: true
          })
        )
      )

      // Refresh the notifications data
      mutate()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  if (error) {
    console.error('Error loading notifications:', error)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 p-0"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                  : 'All caught up!'
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
                className="text-xs"
              >
                {isMarkingAllRead ? "Marking..." : "Mark all read"}
              </Button>
            )}
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto">
          {!notifications ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {sortedNotifications.map((notification: Notification) => (
                <NotificationItem
                  key={notification.NotificationID}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </div>

        {sortedNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setOpen(false)
                  // Navigate to notifications page if it exists
                  // router.push('/notifications')
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
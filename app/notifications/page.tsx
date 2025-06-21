"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Info,
  Car,
  CreditCard,
  FileText,
  Clock,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: 1,
        type: "booking",
        title: "Booking Confirmed",
        message: "Your booking for BMW X5 has been confirmed. Start OTP: 123456",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "high",
      },
      {
        id: 2,
        type: "payment",
        title: "Payment Successful",
        message: "Payment of ₹5,000 has been processed successfully for booking #1234",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: "medium",
      },
      {
        id: 3,
        type: "document",
        title: "Documents Approved",
        message: "Your uploaded documents have been verified and approved",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        priority: "medium",
      },
      {
        id: 4,
        type: "reminder",
        title: "Rental Ending Soon",
        message: "Your rental period ends in 2 hours. Please return the vehicle on time",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        read: false,
        priority: "high",
      },
      {
        id: 5,
        type: "promotion",
        title: "Special Offer",
        message: "Get 20% off on your next booking. Use code SAVE20",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        priority: "low",
      },
    ])
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return Car
      case "payment":
        return CreditCard
      case "document":
        return FileText
      case "reminder":
        return Clock
      case "promotion":
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "from-red-500 to-pink-500"
    if (type === "booking") return "from-blue-500 to-cyan-500"
    if (type === "payment") return "from-green-500 to-emerald-500"
    if (type === "document") return "from-purple-500 to-violet-500"
    if (type === "reminder") return "from-orange-500 to-yellow-500"
    return "from-gray-500 to-slate-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAsUnread = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.read
    if (activeTab === "read") return notif.read
    return notif.type === activeTab
  })

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const NotificationCard = ({ notification }: { notification: any }) => {
    const Icon = getNotificationIcon(notification.type)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card
          className={`glass-dark border-white/20 hover:border-white/30 transition-all ${
            !notification.read ? "border-l-4 border-l-blue-500" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${getNotificationColor(notification.type, notification.priority)} rounded-full flex items-center justify-center flex-shrink-0 glow`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`font-semibold ${notification.read ? "text-gray-300" : "text-white"}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-400"}`}>
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(notification.priority)} border text-xs`}>
                      {notification.priority}
                    </Badge>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {notification.read ? (
                      <Button
                        onClick={() => markAsUnread(notification.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-gray-400 hover:text-white"
                      >
                        <MarkAsUnread className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-gray-400 hover:text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      onClick={() => deleteNotification(notification.id)}
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && <Badge className="bg-red-500 text-white border-0 ml-2">{unreadCount}</Badge>}
              </h1>
              <p className="text-gray-400 text-sm">Stay updated with your bookings and activities</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 glass-dark border border-white/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Payments
              </TabsTrigger>
              <TabsTrigger value="document" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Documents
              </TabsTrigger>
              <TabsTrigger value="read" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Read
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 glow">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
                  <p className="text-gray-400">
                    {activeTab === "unread"
                      ? "You're all caught up! No unread notifications."
                      : `No ${activeTab === "all" ? "" : activeTab} notifications found.`}
                  </p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

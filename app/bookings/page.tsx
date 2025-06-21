"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { paymentAPI, userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Car, CreditCard, FileText, Clock } from "lucide-react"
import { formatCurrency, formatDate, getImageUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function BookingsPage() {
  const { user, logout } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const [liveBookings, setLiveBookings] = useState<any[]>([])
  const [pastBookings, setPastBookings] = useState<any[]>([])
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([])
  const [carsData, setCarsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("live")
  console.log(carsData,"cardData")

  useEffect(() => {
    fetchBookings()
  }, [activeTab])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      let response
      switch (activeTab) {
        case "live":
          response = await userAPI.getLiveBookings()
          setLiveBookings(response.data.bookings || [])
          setCarsData(response.data.cars || [])
          break
        case "past":
          response = await userAPI.getPastBookings()
          setPastBookings(response.data.bookings || [])
          setCarsData(response.data.cars || [])
          break
        case "cancelled":
          response = await userAPI.getCancelledBookings()
          setCancelledBookings(response.data.bookings || [])
          setCarsData(response.data.cars || [])
          break
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem("token")
    toast({
      title: "Logged Out",
      description: "You have been logged out",
    })
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending_payment":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending_approval":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "documents_rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handlePayDue = async (id : number) => {
    const response = await paymentAPI.payDue(id)
    const orderId = response?.data?.order_id
    if (!orderId) {
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      })
      return
    }
    // router.push(`/payment?booking_id=${orderId}`)
  }

  console.log(carsData[0]?.images[0])

  const BookingCard = ({ booking, showActions = true }: { booking: any; showActions?: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="group">
      <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Booking #{booking.id}</CardTitle>
            <Badge className={`${getStatusColor(booking.status)} border`}>
              {booking.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <div className="relative h-48 overflow-hidden mb-5">
          <Image
            src={carsData[booking.car_id]?.images[0] ? getImageUrl(carsData[booking.car_id]?.images[0]) : "/placeholder.svg?height=200&width=300"}
            alt={'car'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-gray-400">Start</p>
                <p className="text-white">{formatDate(booking.start_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-gray-400">End</p>
                <p className="text-white">{formatDate(booking.end_time)}</p>
              </div>
            </div>
          </div>

          {booking.breakdown && (
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-medium">{formatCurrency(booking.breakdown.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Down Payment</span>
                <span className="text-green-400">{formatCurrency(booking.down_payment)}</span>
              </div>
              {booking.due_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Due Amount</span>
                  <span className="text-yellow-400">{formatCurrency(booking.due_amount)}</span>
                </div>
              )}
            </div>
          )}

          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => router.push(`/booking/${booking.id}`)}
                variant="outline"
                size="sm"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 mr-2" />
                View Details</span>
              </Button>

              {booking.status === "pending_payment" && booking.due_amount > 0 && (
                <Button
                  onClick={() => handlePayDue(booking.id)}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 mr-2" />
                  Pay Due</span>
                </Button>
              )}

              {(booking.status === "pending_approval" || booking.status === "doc_upload_required") && !booking.documents?.name && (
                <Button
                  onClick={() => router.push(`/documents/${booking.id}`)}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 mr-2" />
                  Upload Docs</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

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
              <h1 className="text-2xl font-bold gradient-text">My Bookings</h1>
              <p className="text-gray-400 text-sm">Manage your car rentals</p>
            </div>
          </div>

          <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-dark border border-white/20">
            <TabsTrigger value="live" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Live Bookings
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Past Bookings
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-dark rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-4" />
                    <div className="h-3 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : liveBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Live Bookings</h3>
                <p className="text-gray-400 mb-6">You don't have any active bookings</p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Browse Cars
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-dark rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-4" />
                    <div className="h-3 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : pastBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Past Bookings</h3>
                <p className="text-gray-400">Your completed bookings will appear here</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-dark rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-4" />
                    <div className="h-3 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : cancelledBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Cancelled Bookings</h3>
                <p className="text-gray-400">Your cancelled bookings will appear here</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

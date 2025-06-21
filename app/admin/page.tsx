"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { adminAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Car,
  Users,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  BarChart3,
  Settings,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const [approvals, setApprovals] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [earnings, setEarnings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("approvals")

  useEffect(() => {
    if (user?.role !== "admin") {
      // router.push("/dashboard")
      return
    }
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      switch (activeTab) {
        case "approvals":
          const approvalsResponse = await adminAPI.getApprovals()
          setApprovals(approvalsResponse.data.approvals || [])
          setCars(approvalsResponse.data.cars || [])
          break
        case "bookings":
          const bookingsResponse = await adminAPI.getBookings()
          setBookings(bookingsResponse.data.bookings || [])
          break
        case "earnings":
          const earningsResponse = await adminAPI.getEarnings()
          setEarnings(earningsResponse.data)
          break
        case "cars":
          const dashboardResponse = await adminAPI.getDashboard()
          setCars(dashboardResponse.data.cars || [])
          break
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (bookingId: number) => {
    try {
      await adminAPI.approveBooking(bookingId)
      toast({
        title: "Booking Approved! ✅",
        description: "The booking has been approved successfully",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve booking",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (bookingId: number) => {
    try {
      await adminAPI.rejectBooking(bookingId)
      toast({
        title: "Booking Rejected ❌",
        description: "The booking has been rejected",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive",
      })
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
      case "pending_approval":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "documents_rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const ApprovalCard = ({ booking }: { booking: any }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="group">
      <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Booking #{booking.id}</CardTitle>
            <Badge className={`${getStatusColor(booking.status)} border`}>
              {booking.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-400 text-sm">{booking.user_email}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Start Time</p>
              <p className="text-white">{formatDate(booking.start_time)}</p>
            </div>
            <div>
              <p className="text-gray-400">End Time</p>
              <p className="text-white">{formatDate(booking.end_time)}</p>
            </div>
          </div>

          {booking.breakdown && (
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-medium">{formatCurrency(booking.breakdown.total_amount)}</span>
              </div>
            </div>
          )}

          {/* Documents Preview */}
          {booking.documents?.files && Object.keys(booking.documents.files).length > 0 && (
            <div className="space-y-2">
              <p className="text-white text-sm font-medium">Documents</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(booking.documents.files).map(([docType, filePath]: [string, any]) => (
                  <div key={docType} className="relative h-16 bg-gray-800 rounded overflow-hidden">
                    <Image src={`http://127.0.0.1:5000/${filePath}`} alt={docType} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs capitalize">{docType.replace("_", " ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.status === "pending_approval" && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleApprove(booking.id)}
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button onClick={() => handleReject(booking.id)} size="sm" variant="destructive" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => router.push(`/admin/booking/${booking.id}`)}
                size="sm"
                variant="outline"
                className="border-white/30"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const BookingCard = ({ booking }: { booking: any }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="group">
      <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">Booking #{booking.id}</CardTitle>
            <Badge className={`${getStatusColor(booking.status)} border`}>
              {booking.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-400 text-sm">{booking.user_email}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Start Time</p>
              <p className="text-white">{formatDate(booking.start_time)}</p>
            </div>
            <div>
              <p className="text-gray-400">End Time</p>
              <p className="text-white">{formatDate(booking.end_time)}</p>
            </div>
          </div>

          {booking.breakdown && (
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-medium">{formatCurrency(booking.breakdown.total_amount)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => router.push(`/admin/booking/${booking.id}`)}
              size="sm"
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const CarCard = ({ car, index }: { car: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={
              car.images[0]
                ? `http://127.0.0.1:5000/static/uploads/${car.images[0]}`
                : "/placeholder.svg?height=200&width=300"
            }
            alt={car.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 glow">
            <span className="text-white font-bold">{formatCurrency(Number.parseInt(car.price_per_day))}/day</span>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
            <p className="text-gray-400 text-sm">by {car.owner_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-300">
              <span className="text-blue-400">Location:</span> {car.location}
            </div>
            <div className="text-gray-300">
              <span className="text-green-400">Seats:</span> {car.seats}
            </div>
            <div className="text-gray-300">
              <span className="text-orange-400">Fuel:</span> {car.fuel_type}
            </div>
            <div className="text-gray-300">
              <span className="text-purple-400">Color:</span> {car.vehicle_color}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => router.push(`/admin/car/${index}`)}
              size="sm"
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage FutureRide Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/admin/add-car")}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-dark border border-white/20">
            <TabsTrigger value="approvals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Car className="w-4 h-4 mr-2" />
              Cars
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                {approvals.length} Pending
              </Badge>
            </div>

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
            ) : approvals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvals.map((booking) => (
                  <ApprovalCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                <p className="text-gray-400">No pending approvals at the moment</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Bookings</h2>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                {bookings.length} Total
              </Badge>
            </div>

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
            ) : bookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                <p className="text-gray-400">Bookings will appear here once users start renting</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="cars" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Manage Cars</h2>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  {cars.length} Cars
                </Badge>
                <Button
                  onClick={() => router.push("/admin/add-car")}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Car
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-dark rounded-2xl p-6 animate-pulse">
                    <div className="h-32 bg-white/10 rounded mb-4" />
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car, index) => (
                  <CarCard key={index} car={car} index={index} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Cars Available</h3>
                <p className="text-gray-400 mb-6">Add your first car to get started</p>
                <Button
                  onClick={() => router.push("/admin/add-car")}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Car
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Earnings Overview</h2>
              {earnings && (
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Total: {formatCurrency(earnings.total_platform || 0)}
                </Badge>
              )}
            </div>

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
            ) : earnings ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="glass-dark border-white/20">
                    <CardContent className="p-6 text-center">
                      <CreditCard className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {formatCurrency(earnings.total_platform || 0)}
                      </h3>
                      <p className="text-gray-400">Platform Earnings</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark border-white/20">
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{earnings.per_booking?.length || 0}</h3>
                      <p className="text-gray-400">Total Bookings</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark border-white/20">
                    <CardContent className="p-6 text-center">
                      <Car className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{earnings.per_owner?.length || 0}</h3>
                      <p className="text-gray-400">Active Owners</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Bookings */}
                {earnings.per_booking && earnings.per_booking.length > 0 && (
                  <Card className="glass-dark border-white/20">
                    <CardHeader>
                      <CardTitle className="gradient-text">Recent Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {earnings.per_booking.slice(0, 5).map((booking: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-medium">Booking #{booking.booking_id}</p>
                              <p className="text-gray-400 text-sm">{booking.car_name}</p>
                              <p className="text-gray-400 text-sm">{booking.period}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">{formatCurrency(booking.platform_share)}</p>
                              <p className="text-gray-400 text-sm">Platform Share</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Earnings Data</h3>
                <p className="text-gray-400">Earnings data will appear once bookings are completed</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

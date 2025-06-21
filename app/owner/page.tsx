"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { adminAPI, ownerAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, DollarSign, Calendar, Users, Plus, Edit, Trash2, Eye, BarChart3, TrendingUp } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function OwnerDashboard() {
  const { user, logout } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const [cars, setCars] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [earnings, setEarnings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (user?.role !== "owner") {
      console.log(user,"user")
      // router.push("/dashboard")
      return
    }
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      switch (activeTab) {
        case "overview":
          const dashboardResponse = await ownerAPI.getDashboard()
          setCars(dashboardResponse.data.cars || [])
          setBookings(dashboardResponse.data.bookings || [])
          break
        case "cars":
          // const dashboardResponse = await ownerAPI.getDashboard()
          // setCars(dashboardResponse.data.cars || [])
          // setBookings(dashboardResponse.data.bookings || [])
          break
        case "bookings":
          // const bookingsResponse = await adminAPI.getBookings()
          // setBookings(bookingsResponse.data.bookings || [])
          break
        case "earnings":
          const earningsResponse = await ownerAPI.getEarnings()
          setEarnings(earningsResponse.data)
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

  const handleDeleteCar = async (carId: number) => {
    try {
      await adminAPI.deleteCar(carId)
      toast({
        title: "Car Deleted! 🗑️",
        description: "The car has been removed from your fleet",
      })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
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

  const stats = [
    {
      title: "Total Cars",
      value: cars.length.toString(),
      icon: Car,
      color: "from-blue-500 to-cyan-500",
      change: "+2 this month",
    },
    {
      title: "Active Bookings",
      value: bookings.filter((b) => b.status === "approved").length.toString(),
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      change: "+5 this week",
    },
    {
      title: "Total Earnings",
      value: earnings ? formatCurrency(earnings.total_owner || 0) : "₹0",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      change: "+12% this month",
    },
    {
      title: "Total Customers",
      value: new Set(bookings.map((b) => b.user_email)).size.toString(),
      icon: Users,
      color: "from-purple-500 to-violet-500",
      change: "+8 new customers",
    },
  ]

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

          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500/80 backdrop-blur-sm text-white border-0">Available</Badge>
          </div>

          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 glow">
            <span className="text-white font-bold">{formatCurrency(Number.parseInt(car.price_per_day))}/day</span>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
            <p className="text-gray-400 text-sm">{car.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-300">
              <span className="text-blue-400">Seats:</span> {car.seats}
            </div>
            <div className="text-gray-300">
              <span className="text-green-400">Fuel:</span> {car.fuel_type}
            </div>
            <div className="text-gray-300">
              <span className="text-orange-400">Color:</span> {car.vehicle_color}
            </div>
            <div className="text-gray-300">
              <span className="text-purple-400">Bookings:</span> {bookings.filter((b) => b.car_id === index).length}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => router.push(`/owner/car/${index}/edit`)}
              size="sm"
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => router.push(`/owner/car/${index}`)}
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button onClick={() => handleDeleteCar(index)} size="sm" variant="destructive" className="px-3">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const BookingCard = ({ booking }: { booking: any }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "approved":
          return "bg-green-500/20 text-green-400 border-green-500/30"
        case "pending_approval":
          return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        case "cancelled":
          return "bg-red-500/20 text-red-400 border-red-500/30"
        default:
          return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group"
      >
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
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Your Share</span>
                  <span className="text-green-400 font-medium">
                    {formatCurrency(booking.breakdown.total_amount * 0.8)}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={() => router.push(`/owner/booking/${booking.id}`)}
              size="sm"
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center glow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Owner Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage your fleet and earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/owner/add-car")}
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
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Car className="w-4 h-4 mr-2" />
              My Cars
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center glow`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-green-400 text-xs">{stat.change}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-dark border-white/20">
                <CardHeader>
                  <CardTitle className="gradient-text">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Booking #{booking.id}</p>
                          <p className="text-gray-400 text-sm">{booking.user_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">
                            {booking.breakdown ? formatCurrency(booking.breakdown.total_amount * 0.8) : "₹0"}
                          </p>
                          <p className="text-gray-400 text-sm">Your share</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-white/20">
                <CardHeader>
                  <CardTitle className="gradient-text">Top Performing Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cars.slice(0, 3).map((car, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{car.name}</p>
                            <p className="text-gray-400 text-sm">{car.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{formatCurrency(Number.parseInt(car.price_per_day))}</p>
                          <p className="text-gray-400 text-sm">per day</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cars" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Fleet</h2>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  {cars.length} Cars
                </Badge>
                <Button
                  onClick={() => router.push("/owner/add-car")}
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
                <h3 className="text-xl font-bold text-white mb-2">No Cars in Fleet</h3>
                <p className="text-gray-400 mb-6">Add your first car to start earning</p>
                <Button
                  onClick={() => router.push("/owner/add-car")}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Car
                </Button>
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
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                <p className="text-gray-400">Bookings will appear here once customers start renting your cars</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Earnings Overview</h2>
              {earnings && (
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Total: {formatCurrency(earnings.total_owner || 0)}
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
                      <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {formatCurrency(earnings.total_owner || 0)}
                      </h3>
                      <p className="text-gray-400">Total Earnings</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark border-white/20">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{earnings.per_booking?.length || 0}</h3>
                      <p className="text-gray-400">Completed Bookings</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-dark border-white/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {earnings.per_booking?.length > 0
                          ? formatCurrency((earnings.total_owner || 0) / earnings.per_booking.length)
                          : "₹0"}
                      </h3>
                      <p className="text-gray-400">Avg per Booking</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Earnings */}
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
                              <p className="text-green-400 font-bold">{formatCurrency(booking.owner_share)}</p>
                              <p className="text-gray-400 text-sm">Your Share (80%)</p>
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
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Earnings Yet</h3>
                <p className="text-gray-400">Earnings data will appear once bookings are completed</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

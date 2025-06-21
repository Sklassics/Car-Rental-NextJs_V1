"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { useBookingStore } from "@/store/booking"
import { carAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import CarCard from "@/components/cars/car-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { cars, setCars, setLoading, isLoading } = useBookingStore()
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus) {
      paymentStatus === "success" ? toast({ title: "Payment Success" }) : toast({ title: "Payment Failed" })
    }
    fetchCars()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await carAPI.getLiveCars()
      setCars(response.data.cars || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  const handleBookCar = (carId: number) => {
    router.push(`/car/${carId}`)
  }

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === "" || car.location.toLowerCase().includes(locationFilter.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">FutureRide</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/bookings")} variant="glass" className="hidden md:flex">
              My Bookings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold gradient-text mb-6"
          >
            Drive the Future
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Experience premium car rental with cutting-edge technology and unmatched service
          </motion.p>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 mb-12"
      >
        <div className="glass-dark rounded-2xl p-6 border border-white/20">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-white/30"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 glass border-white/30"
              />
            </div>
            {/* <Button className="bg-gradient-to-r from-blue-600 to-purple-600 glow">
              <span className="flex items-center gap-2"><Filter className="w-4 h-4 mr-2" />
              Advanced Filters</span>
            </Button> */}
          </div>
        </div>
      </motion.section>

      {/* Cars Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CarCard car={car} carId={index} onBook={handleBookCar} />
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 glow">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No cars found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.section>
    </div>
  )
}

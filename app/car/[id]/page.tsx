"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { carAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Fuel, ArrowLeft, Clock, Shield, Calendar as CalendarIcon } from "lucide-react"
import { formatCurrency, formatDate, getImageUrl } from "@/lib/utils"
import Image from "next/image"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import 'react-day-picker/dist/style.css'

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [carData, setCarData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startDateTime, setStartDateTime] = useState<Date>(() => {
    const now = new Date()
    // Set to next hour for better UX
    now.setHours(now.getHours() + 1, 0, 0, 0)
    return now
  })
  const [endDateTime, setEndDateTime] = useState<any>()
  const [bookingData, setBookingData] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchCarDetails()
  }, [])

  const fetchCarDetails = async () => {
    try {
      const response = await carAPI.getCarDetails(Number(params.id))
      setCarData(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch car details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const handleBooking = async () => {
    if (!startDateTime || !endDateTime) {
      toast({
        title: "Missing Information",
        description: "Please select start and end times",
        variant: "destructive",
      })
      return
    }

    if (startDateTime >= endDateTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await carAPI.bookCar(Number(params.id), {
        start_time: formatDateTime(startDateTime),
        end_time: formatDateTime(endDateTime),
      })
      setBookingData(response.data)
      toast({
        title: "Booking Created! 🎉",
        description: "Review your booking details below",
      })
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    }
  }

  const handleReserve = async () => {
    try {
      const response = await carAPI.reserveCar(Number(params.id), {
        start_time: formatDateTime(startDateTime),
        end_time: formatDateTime(endDateTime),
      })
      console.log(response,"response")

      // Redirect to payment page
      window.location.href = response.data.next
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    }
  }

  const handlePayFull = async () => {
    try {
      const response = await carAPI.payFull(Number(params.id), {
        start_time: formatDateTime(startDateTime),
        end_time: formatDateTime(endDateTime),
      })
      console.log(response,"response")

      // Redirect to payment page
      window.location.href = response.data.next
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    )
  }

  if (!carData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Car not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const { car, unavailable } = carData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{car.name}</h1>
            <p className="text-gray-400 text-sm">by {car.owner_name}</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Car Images and Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Image Gallery */}
            <Card className="glass-dark border-white/20 overflow-hidden">
              <div className="relative h-80">
                <Image
                  src={
                    car.images[currentImageIndex]
                      ? getImageUrl(car.images[currentImageIndex])
                      : "/placeholder.svg?height=400&width=600"
                  }
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Image navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {car.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white glow" : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Car Specifications */}
            <Card className="glass-dark border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{car.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Seats</p>
                    <p className="text-white font-medium">{car.seats} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Fuel Type</p>
                    <p className="text-white font-medium">{car.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Color</p>
                    <p className="text-white font-medium">{car.vehicle_color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unavailable Dates */}
            {unavailable.length > 0 && (
              <Card className="glass-dark border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Unavailable Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {unavailable.map((period: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                    >
                      <span className="text-white">
                        {formatDate(period.start)} - {formatDate(period.end)}
                      </span>
                      <Badge variant="destructive">{period.reason}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Booking Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="glass-dark border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text text-2xl flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6" />
                  {formatCurrency(Number.parseInt(car.price_per_day))}/day
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Start Date & Time
                    </label>
                    <DateTimePicker
                      value={startDateTime}
                      onChange={setStartDateTime}
                      placeholder="Select start date and time"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      End Date & Time
                    </label>
                    <DateTimePicker
                      value={endDateTime}
                      onChange={setEndDateTime}
                      placeholder="Select end date and time"
                      className="w-full"
                      minDate={startDateTime}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleBooking}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow"
                  >
                    Get Price Quote 💰
                  </Button>
                  <Button
                    onClick={handleReserve}
                    variant="outline"
                    className="w-full h-12 border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    Reserve with Down Payment 🔒
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {bookingData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-dark border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Car Price Total</span>
                        <span>{formatCurrency(bookingData.breakdown.car_price_total)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Car Wash Charge</span>
                        <span>{formatCurrency(bookingData.breakdown.car_wash_charge)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Late Night Charge</span>
                        <span>{formatCurrency(bookingData.breakdown.late_night_charge)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2">
                        <div className="flex justify-between text-white font-bold text-lg">
                          <span>Total Amount</span>
                          <span>{formatCurrency(bookingData.breakdown.total_amount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleReserve}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
                      >
                        Reserve Now 🚀
                      </Button>
                      <Button
                        onClick={handlePayFull}
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        Pay Full Amount
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

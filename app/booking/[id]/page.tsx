"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { documentAPI, paymentAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, CreditCard, FileText, Clock, User, Phone } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Image from "next/image"

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [])

  const fetchBookingDetails = async () => {
    try {
      const response = await documentAPI.getDocuments(Number(params.id))
      setBookingData(response.data.booking)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch booking details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }


  const handlePayDue = async (id : number) => {
    try {
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
    router.push(`/payment?booking_id=${orderId}`)
    } catch (error:any) {
      toast({
        title: "Payment Error",
        description: error.response?.data?.error as string || "Failed to initiate payment",
        variant: "destructive",
      })
    }
  }

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
            <h1 className="text-xl font-bold text-white">Booking #{bookingData.id}</h1>
            <p className="text-gray-400 text-sm">Booking Details</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Information */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Status Card */}
            <Card className="glass-dark border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="gradient-text">Booking Status</CardTitle>
                  <Badge className={`${getStatusColor(bookingData.status)} border`}>
                    {bookingData.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Start Time</p>
                      <p className="text-white font-medium">{formatDate(bookingData.start_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">End Time</p>
                      <p className="text-white font-medium">{formatDate(bookingData.end_time)}</p>
                    </div>
                  </div>
                </div>

                {bookingData.actual_start_time && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Ride Started</p>
                    <p className="text-white">{formatDate(bookingData.actual_start_time)}</p>
                  </div>
                )}

                {bookingData.start_otp && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Start OTP</p>
                    <p className="text-white font-mono text-lg">{bookingData.start_otp}</p>
                  </div>
                )}

                {bookingData.end_otp && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-400 text-sm font-medium">End OTP</p>
                    <p className="text-white font-mono text-lg">{bookingData.end_otp}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            {bookingData.breakdown && (
              <Card className="glass-dark border-white/20">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
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
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total Amount</span>
                        <span>{formatCurrency(bookingData.breakdown.total_amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-green-400 text-sm">Down Payment</p>
                      <p className="text-white font-bold text-lg">{formatCurrency(bookingData.down_payment)}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 text-sm">Due Amount</p>
                      <p className="text-white font-bold text-lg">{formatCurrency(bookingData.due_amount)}</p>
                    </div>
                  </div>

                  {bookingData.razorpay_payment_id && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-400 text-sm">Payment ID</p>
                      <p className="text-white font-mono text-sm">{bookingData.razorpay_payment_id}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {bookingData.documents && (
              <Card className="glass-dark border-white/20">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Submitted Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  {bookingData.documents.name && (
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Personal Information</h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Full Name</p>
                            <p className="text-white">{bookingData.documents.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Address</p>
                            <p className="text-white">{bookingData.documents.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-purple-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Contact</p>
                            <p className="text-white">{bookingData.documents.contact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Files */}
                  {bookingData.documents.files && Object.keys(bookingData.documents.files).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Uploaded Documents</h3>
                      <div className="grid gap-4">
                        {Object.entries(bookingData.documents.files).map(([docType, filePath]: [string, any]) => (
                          <div key={docType} className="bg-white/5 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white capitalize">{docType.replace("_", " ")}</span>
                              <Badge variant="outline" className="border-green-500/50 text-green-400">
                                Uploaded
                              </Badge>
                            </div>
                            <div className="relative h-32 bg-gray-800 rounded-lg overflow-hidden">
                              <Image
                                src={`http://127.0.0.1:5000/${filePath}`}
                                alt={docType}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {(bookingData.status === "pending_approval" || bookingData.status === "doc_upload_required") && !bookingData.documents?.name && (
                      <Button
                        onClick={() => router.push(`/documents/${bookingData.id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}

                    {bookingData.due_amount > 0 && bookingData.status !== "cancelled" && (
                      <Button
                        onClick={() => handlePayDue(bookingData?.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Due Amount
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { triggerRazorpay } from "@/components/payment/razorpay-payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const orderIdParam = searchParams.get("order_id")
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
  }, [searchParams])

  const handlePaymentSuccess = (paymentData: any) => {
    router.push("/dashboard?payment=success")
    // router.push("/payment-status?payment=success")
  }

  const handlePaymentError = (error: any) => {
    router.push("/dashboard?payment=failed")
    // router.push("/payment-status?payment=failed")
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="glass-dark border-white/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Invalid Payment Link</h2>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleToast = ({title, description, variant}: {title: string, description: string, variant: any}) => {
    toast({
      title : title as string,
      description : description as string,
      variant: variant || "default",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="glass-dark border-white/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center glow mb-4"
            >
              <CreditCard className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="gradient-text text-2xl">Secure Payment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="w-5 h-5 text-green-400" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">Click the button below to proceed with secure payment</p>
              <Button
                onClick={() => {
                  // Trigger Razorpay payment
                  if (orderId) {
                    triggerRazorpay(orderId, handlePaymentSuccess, handlePaymentError, handleToast)
                  }
                }}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
              >
                Pay Securely 🔒
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

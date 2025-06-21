"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HelpPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const faqs = [
    {
      question: "How do I book a car?",
      answer:
        "Browse available cars, select your preferred vehicle, choose dates and times, then complete the booking process with payment and document upload.",
    },
    {
      question: "What documents do I need?",
      answer: "You need a valid Aadhar card, driving license, and a selfie photo for verification purposes.",
    },
    {
      question: "How does payment work?",
      answer:
        "You can pay a down payment to reserve the car or pay the full amount upfront. We accept payments through Razorpay.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking. Cancellation policies may apply depending on the timing of cancellation.",
    },
    {
      question: "What if my documents are rejected?",
      answer:
        "If your documents are rejected, you'll receive a notification with the reason. You can re-upload corrected documents.",
    },
    {
      question: "How do I start my rental?",
      answer: "You'll receive a start OTP that you need to provide to the car owner to begin your rental period.",
    },
    {
      question: "What happens if I'm late returning the car?",
      answer: "Late returns may incur additional charges as specified in your booking agreement.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us through the contact options below or use the in-app messaging system.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <h1 className="text-xl font-bold text-white">Help & Support</h1>
            <p className="text-gray-400 text-sm">Get answers to your questions</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto glow">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold gradient-text mb-4">How can we help you?</h2>
              <p className="text-gray-400 text-lg">
                Find answers to common questions or get in touch with our support team
              </p>
            </div>
          </motion.div>

          

          {/* Contact Options */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-dark border-white/20 hover:border-white/30 transition-all cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-400 text-sm">Get instant help from our support team</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-white/20 hover:border-white/30 transition-all cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-400 text-sm">+91 9876543210</p>
                    <p className="text-gray-400 text-xs">Mon-Fri 9AM-6PM</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-white/20 hover:border-white/30 transition-all cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Email</h3>
                    <p className="text-gray-400 text-sm">support@futureride.com</p>
                    <p className="text-gray-400 text-xs">We'll respond within 24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-dark border-white/20">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search for help..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass border-white/30 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-dark border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                    >
                      <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No FAQs found matching your search.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="glass-dark border-white/20">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white">Still need help?</h3>
                <p className="text-gray-400">Can't find what you're looking for? Our support team is here to help.</p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow">
                  <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

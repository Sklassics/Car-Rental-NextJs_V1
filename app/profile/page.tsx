"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Shield,
  Star,
  Car,
  CreditCard,
  Bell,
  Lock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuthStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: user?.email || "",
    phone: "+91 9876543210",
    address: "123 Tech Street, Mumbai, Maharashtra 400001",
    dateOfBirth: "1990-01-01",
    emergencyContact: "+91 9876543211",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    paymentAlerts: true,
  })

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    updateUser({ name: formData.name })
    setIsEditing(false)
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile information has been saved successfully",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const stats = [
    { label: "Total Bookings", value: "12", icon: Car, color: "from-blue-500 to-cyan-500" },
    { label: "Total Spent", value: "₹45,000", icon: CreditCard, color: "from-green-500 to-emerald-500" },
    { label: "Rating", value: "4.9", icon: Star, color: "from-yellow-500 to-orange-500" },
    { label: "Member Since", value: "2023", icon: Shield, color: "from-purple-500 to-violet-500" },
  ]

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
              <h1 className="text-xl font-bold text-white">Profile Settings</h1>
              <p className="text-gray-400 text-sm">Manage your account and preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Profile Card */}
              <Card className="glass-dark border-white/20">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto glow">
                      <span className="text-3xl font-bold text-white">{formData.name.charAt(0)}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{formData.name}</h2>
                    <p className="text-gray-400">{formData.email}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-2">Verified Member</Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-left">{formData.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
                      <CardContent className="p-4 text-center space-y-2">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto`}
                        >
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 glass-dark border border-white/20">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <Card className="glass-dark border-white/20">
                    <CardHeader>
                      <CardTitle className="gradient-text">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-white text-sm font-medium">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              disabled={!isEditing}
                              className="pl-10 glass border-white/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white text-sm font-medium">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!isEditing}
                              className="pl-10 glass border-white/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white text-sm font-medium">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              disabled={!isEditing}
                              className="pl-10 glass border-white/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-white text-sm font-medium">Date of Birth</label>
                          <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            disabled={!isEditing}
                            className="glass border-white/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            className="pl-10 glass border-white/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Emergency Contact</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                            disabled={!isEditing}
                            className="pl-10 glass border-white/30"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <Card className="glass-dark border-white/20">
                    <CardHeader>
                      <CardTitle className="gradient-text flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(preferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {key === "emailNotifications" && "Receive booking updates via email"}
                              {key === "smsNotifications" && "Get SMS alerts for important updates"}
                              {key === "pushNotifications" && "Browser push notifications"}
                              {key === "marketingEmails" && "Promotional offers and news"}
                              {key === "bookingReminders" && "Reminders about upcoming bookings"}
                              {key === "paymentAlerts" && "Payment confirmations and receipts"}
                            </p>
                          </div>
                          <Button
                            onClick={() => handlePreferenceChange(key, !value)}
                            variant={value ? "default" : "outline"}
                            size="sm"
                            className={
                              value
                                ? "bg-gradient-to-r from-green-600 to-blue-600"
                                : "border-white/30 text-white hover:bg-white/10"
                            }
                          >
                            {value ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card className="glass-dark border-white/20">
                    <CardHeader>
                      <CardTitle className="gradient-text flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <h3 className="text-white font-medium mb-2">Password</h3>
                          <p className="text-gray-400 text-sm mb-4">Last changed 30 days ago</p>
                          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                            Change Password
                          </Button>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg">
                          <h3 className="text-white font-medium mb-2">Two-Factor Authentication</h3>
                          <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                          <Button
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                          >
                            Enable 2FA
                          </Button>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg">
                          <h3 className="text-white font-medium mb-2">Login Sessions</h3>
                          <p className="text-gray-400 text-sm mb-4">Manage your active login sessions</p>
                          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                            View Sessions
                          </Button>
                        </div>

                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                          <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all data</p>
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

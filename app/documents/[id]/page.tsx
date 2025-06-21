"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { documentAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, FileText, User, MapPin, Phone, Camera } from "lucide-react"

export default function DocumentUploadPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  })
  const [files, setFiles] = useState({
    aadhar: null as File | null,
    driving_license: null as File | null,
    selfie: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all personal details",
        variant: "destructive",
      })
      return
    }

    if (!files.aadhar || !files.driving_license) {
      toast({
        title: "Missing Documents",
        description: "Please upload Aadhar and Driving License",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("name", formData.name)
      uploadFormData.append("address", formData.address)
      uploadFormData.append("contact", formData.contact)

      if (files.aadhar) uploadFormData.append("aadhar", files.aadhar)
      if (files.driving_license) uploadFormData.append("driving_license", files.driving_license)
      if (files.selfie) uploadFormData.append("selfie", files.selfie)

      const response = await documentAPI.uploadDocuments(Number(params.id), uploadFormData)

      toast({
        title: "Documents Uploaded! 🎉",
        description: response.data.message,
      })

      router.push(`/booking/${params.id}`)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const FileUploadCard = ({
    title,
    field,
    icon: Icon,
    required = false,
  }: {
    title: string
    field: string
    icon: any
    required?: boolean
  }) => (
    <Card className="glass-dark border-white/20 hover:border-white/30 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            {required && <p className="text-red-400 text-sm">Required</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
              files[field as keyof typeof files]
                ? "border-green-500/50 bg-green-500/10"
                : "border-white/30 hover:border-white/50 hover:bg-white/5"
            }`}
            onClick={() => document.getElementById(`file-${field}`)?.click()}
          >
            <input
              id={`file-${field}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
            />

            {files[field as keyof typeof files] ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="text-green-400 font-medium">{(files[field as keyof typeof files] as File)?.name}</p>
                <p className="text-gray-400 text-sm">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-white">Click to upload {title}</p>
                <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
            <h1 className="text-xl font-bold text-white">Upload Documents</h1>
            <p className="text-gray-400 text-sm">Complete your booking verification</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-dark border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 glass border-white/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter your phone number"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        className="pl-10 glass border-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10 glass border-white/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FileUploadCard title="Aadhar Card" field="aadhar" icon={FileText} required />
              <FileUploadCard title="Driving License" field="driving_license" icon={FileText} required />
              <FileUploadCard title="Selfie Photo" field="selfie" icon={Camera} />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full max-w-md h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
              ) : (
                <Upload className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Uploading..." : "Submit Documents"}
            </Button>

            <p className="text-gray-400 text-sm mt-4">Your documents will be reviewed by our team within 24 hours</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

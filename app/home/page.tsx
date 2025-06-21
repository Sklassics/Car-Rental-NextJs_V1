"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Clock, Star, MapPin, Users, Fuel, Search, ArrowRight, Zap, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { carAPI } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [featuredCars, setFeaturedCars] = useState<any[]>([])
  const [searchLocation, setSearchLocation] = useState("")

  useEffect(() => {
    fetchFeaturedCars()
  }, [])

  const fetchFeaturedCars = async () => {
    try {
      const response = await carAPI.getLiveCars()
      setFeaturedCars(response.data.cars?.slice(0, 6) || [])
    } catch (error) {
      console.error("Failed to fetch featured cars")
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/auth")
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "All vehicles are verified and insured for your safety",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for any assistance",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book your ride in seconds with our streamlined process",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Award,
      title: "Premium Fleet",
      description: "Access to luxury and premium vehicles at competitive rates",
      color: "from-orange-500 to-red-600",
    },
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Premium Cars" },
    { number: "50+", label: "Cities" },
    { number: "99%", label: "Satisfaction Rate" },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Business Executive",
      content:
        "FutureRide made my business trip so convenient. The booking process was seamless and the car was in perfect condition.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Rahul Verma",
      role: "Travel Enthusiast",
      content:
        "Amazing experience! The variety of cars and the transparent pricing made it my go-to choice for weekend getaways.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Anita Patel",
      role: "Entrepreneur",
      content:
        "Professional service and well-maintained vehicles. The 24/7 support team is incredibly helpful and responsive.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FutureRide</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#cars" className="text-gray-300 hover:text-white transition-colors">
              Cars
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="/help" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => router.push("/auth")} variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/auth")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold leading-tight"
                >
                  <span className="gradient-text">Drive</span> the <span className="gradient-text">Future</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300 leading-relaxed"
                >
                  Experience premium car rental with cutting-edge technology, transparent pricing, and unmatched
                  service. Your journey starts here.
                </motion.p>
              </div>

              {/* Search Bar */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-dark rounded-2xl p-6 border border-white/20"
              >
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Where do you want to go?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 glass border-white/30 h-12"
                    />
                  </div>
                  <Button
                    onClick={handleGetStarted}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Find Cars
                  </Button>
                </div>
              </motion.div> */}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex gap-4"
              >
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
                >
                  Start Your Journey
                  {/* <ArrowRight className="w-5 h-5 ml-2" /> */}
                </Button>
                <Button
                  onClick={() => router.push("/help")}
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden glass-dark border border-white/20">
                <Image src="https://aestheticwallpapers.io/wallpaper/914602.webp" alt="Premium Car" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute top-6 right-6 glass-dark rounded-full p-3 border border-white/20"
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                  className="absolute bottom-6 left-6 glass-dark rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm font-medium">Verified & Insured</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Why Choose FutureRide?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing car rental with innovative technology and exceptional service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="glass-dark border-white/20 hover:border-white/30 transition-all h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform glow`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section id="cars" className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Featured Vehicles</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our premium collection of vehicles for every occasion
            </p>
          </motion.div>

          {featuredCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/car/${index}`)}
                >
                  <Card className="glass-dark border-white/20 hover:border-white/30 transition-all overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
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

                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-blue-500/80 backdrop-blur-sm text-white border-0">Premium</Badge>
                      </div>

                      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 glow">
                        <span className="text-white font-bold text-sm">
                          {formatCurrency(Number.parseInt(car.price_per_day))}/day
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
                        <p className="text-gray-400 text-sm">by {car.owner_name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{car.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>{car.seats} seats</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Fuel className="w-4 h-4 text-orange-400" />
                          <span>{car.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-dark rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-white/10 rounded mb-4" />
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow"
            >
              View All Cars
              {/* <ArrowRight className="w-5 h-5 ml-2" /> */}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust FutureRide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="glass-dark border-white/20 hover:border-white/30 transition-all h-full">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed italic">"{testimonial.content}"</p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join FutureRide today and experience the future of car rental. Premium vehicles, transparent pricing, and
              exceptional service await you.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow text-lg px-8 py-4"
              >
                <span className="flex items-center gap-2">Get Started Now
                <ArrowRight className="w-6 h-6 ml-2" /></span>
              </Button>
              <Button
                onClick={() => router.push("/help")}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">FutureRide</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Experience the future of car rental with premium vehicles and exceptional service.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#cars" className="block text-gray-400 hover:text-white transition-colors">
                  Cars
                </a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <button
                  onClick={() => router.push("/help")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Help
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Services</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">Car Rental</span>
                <span className="block text-gray-400">Premium Fleet</span>
                <span className="block text-gray-400">24/7 Support</span>
                <span className="block text-gray-400">Insurance</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Contact</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">support@futureride.com</span>
                <span className="block text-gray-400">+91 9876543210</span>
                <span className="block text-gray-400">Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 FutureRide. All rights reserved. Built with ❤️ for the future of mobility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

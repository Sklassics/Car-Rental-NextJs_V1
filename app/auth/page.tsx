"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, Sparkles, User, Phone } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (!email || (!isLogin && (!name || !contact))) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const response = await authAPI.sendOTP(email, "send_otp");
        if (response.data.otp_sent) {
          setShowOtp(true);
          toast({
            title: "OTP Sent! ✨",
            description: "Check your email for the verification code",
          });
        }
      } else {
        const response = await authAPI.register({
          name,
          email,
          contact,
          action: "send_otp",
        });
        if (response.data.otp_sent) {
          setShowOtp(true);
          toast({
            title: "OTP Sent! ✨",
            description: "Check your email for the verification code",
          });
        }
      }
    } catch (error: any) {
      console.log(error, "error");
      toast({
        title: "Error",
        description:
          error?.response?.data?.error ||
          "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const response = await authAPI.login(email, otp);
        const { access_token } = response.data;

        // Set token immediately in auth store
        useAuthStore.setState({ token: access_token });

        // Small delay to ensure token is set
        await new Promise((resolve) => setTimeout(resolve, 100));

        const roleResponse = await authAPI.getRole();
        const { role } = roleResponse.data;

        login({ email, role }, access_token);

        toast({
          title: "Welcome to FutureRide! 🚗",
          description: "Login successful",
        });

        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "owner") {
          window.location.href = "/owner";
        } else {
          window.location.href = "/dashboard  ";
        }
      } else {
        await authAPI.register({
          name,
          email,
          contact,
          action: "register",
          otp,
        });

        toast({
          title: "Registration Successful! 🎉",
          description: "Please login with your credentials",
        });

        setIsLogin(true);
        setShowOtp(false);
        setOtp("");
      }
    } catch (error) {
      console.log(error, "error");
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-dark border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">
              {isLogin ? "Welcome Back" : "Join FutureRide"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Auth Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowOtp(false);
                  setOtp("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white glow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowOtp(false);
                  setOtp("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white glow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!showOtp ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 glass border-white/30 focus:border-blue-400"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="pl-10 glass border-white/30 focus:border-blue-400"
                        />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass border-white/30 focus:border-blue-400"
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      "Send Magic Code ✨"
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 glass border-white/30 focus:border-green-400 text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : isLogin ? (
                      "Enter FutureRide 🚀"
                    ) : (
                      "Complete Registration 🎉"
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                    }}
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white"
                  >
                    Change Email
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

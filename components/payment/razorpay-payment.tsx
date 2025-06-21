"use client";

import { paymentAPI } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function triggerRazorpay(
  orderId: string,
  onSuccess: any,
  onError: any,
  toast?: any
) {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = async () => {
    try {
      const response = await paymentAPI.getPaymentDetails(orderId);
      const { booking, razorpay_key } = response.data;

      const options = {
        key: razorpay_key,
        amount: booking.down_payment * 100,
        currency: "INR",
        name: "FutureRide",
        description: `Booking for ${booking.car_name || "Car"}`,
        order_id: booking.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await paymentAPI.confirmPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast({
              title: "Payment Successful! 🎉",
              description: "Your booking has been confirmed",
            });
            onSuccess(response);
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support",
              variant: "destructive",
            });
            onError(error);
          }
        },
        prefill: {
          name: booking.user_email,
          email: booking.user_email,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            onError(new Error("Payment cancelled"));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Payment Setup Failed",
        description: "Please try again",
        variant: "destructive",
      });
      onError(error);
    }
  };

  script.onerror = () => {
    toast({
      title: "Failed to load Razorpay",
      description: "Please try again later",
      variant: "destructive",
    });
    onError(new Error("Razorpay SDK load failed"));
  };

  document.body.appendChild(script);
}

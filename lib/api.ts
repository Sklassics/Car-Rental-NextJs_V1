import axios from "axios"
import { useAuthStore } from "@/store/auth"
import { usePaymentStore } from "@/store/payment"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://8545-2409-4091-c013-1c06-b147-8726-24f7-5e11.ngrok-free.app/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Try to get token from multiple sources
    let token = useAuthStore.getState().token

    // If no token in store, try to get from localStorage
    if (!token) {
      try {
        const authStorage = localStorage.getItem("auth-storage")
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error)
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = "/auth"
    }
    return Promise.reject(error)
  },
)

export default api

// API functions
export const authAPI = {
  sendOTP: (email: string, action: "send_otp") => api.post("/login", { email, action }),

  login: async (email: string, otp: string) => {
    const response = await api.post("/login", { email, action: "login", otp })

    // Immediately set the token in the store and localStorage
    if (response.data.access_token) {
      // Store token temporarily before role call
      useAuthStore.setState({ token: response.data.access_token })
    }

    return response
  },

  getRole: () => api.get("/role"),

  register: (data: { name: string; email: string; contact: string; action: string; otp?: string }) =>
    api.post("/register", data),

  logout: () => api.post("/logout"),
}

export const carAPI = {
  getLiveCars: () => api.get("/home"),
  getCarDetails: (carId: number) => api.get(`/booking/${carId}`),
  bookCar: (carId: number, data: { start_time: string; end_time: string }) => api.post(`/booking/${carId}`, data),
  reserveCar: (carId: number, data: { start_time: string; end_time: string }) => api.post(`/reserve/${carId}`, data),
  payFull: (carId: number, data: { start_time: string; end_time: string }) => api.post(`/pay_full/${carId}`, data),
}

export const paymentAPI = {
  getPaymentDetails: (orderId: string) => api.get(`/pay?order_id=${orderId}`),
  confirmPayment: async(data: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    const response = await api.post("/payment_success", data)
    if(response.data){
      usePaymentStore.setState({ payment: response?.data })
    }
  },
  payDue: (bookingId: number) => api.post(`/pay_due/${bookingId}`),
  payDueNow: (orderId: string) => api.get(`/pay_due_now?order_id=${orderId}`),
}

export const documentAPI = {
  uploadDocuments: (bookingId: number, formData: FormData) =>
    api.post(`/upload_documents/${bookingId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDocuments: (bookingId: number) => api.get(`/upload_documents/${bookingId}`),
}

export const userAPI = {
  getLiveBookings: () => api.get("/user/bookings/live"),
  getPastBookings: () => api.get("/user/bookings/past"),
  getCancelledBookings: () => api.get("/user/bookings/cancelled"),
  getRideStatus: (bookingId: number) => api.get(`/user/ride_status/${bookingId}`),
}

export const adminAPI = {
  getApprovals: () => api.get("/admin/approvals"),
  approveBooking: (bookingId: number) => api.post(`/admin/approve/${bookingId}`),
  rejectBooking: (bookingId: number) => api.post(`/admin/reject/${bookingId}`),
  getDashboard: () => api.get("/admin/dashboard"),
  getBookings: () => api.get("/admin/bookings"),
  getEarnings: (year?: number, month?: number) => {
    const params = new URLSearchParams()
    if (year) params.append("year", year.toString())
    if (month) params.append("month", month.toString())
    return api.get(`/admin/earnings?${params}`)
  },
  addCar: (formData: FormData) =>
    api.post("/admin/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  editCar: (carId: number, formData: FormData) =>
    api.post(`/admin/edit/${carId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteCar: (carId: number) => api.post(`/admin/delete/${carId}`),
  cancelBooking: (bookingId: number) => api.post(`/admin/cancel_booking/${bookingId}`),
  getLiveRides: () => api.get("/admin/live_rides"),
  forceEndRide: (bookingId: number) => api.post(`/admin/force_end/${bookingId}`),
  getBlockManager: () => api.get("/admin/block_manager"),
  getCarBlocks: (carId: number) => api.get(`/admin/block/${carId}`),
  blockCar: (carId: number, data: { start_block: string; end_block: string }) =>
    api.post(`/admin/block/${carId}`, data),
  unblockCar: (carId: number, blockIndex: number) => api.post(`/admin/unblock/${carId}/${blockIndex}`),
}

export const ownerAPI = {
  getDashboard : () => api.get("/owner/dashboard"),
  getEarnings: (year?: number, month?: number) => {
    const params = new URLSearchParams()
    if (year) params.append("year", year.toString())
    if (month) params.append("month", month.toString())
    return api.get(`/owner/earnings?${params}`)
  },

}

import { create } from "zustand"

interface Car {
  name: string
  owner_name: string
  phone_number: string
  second_number: string
  email: string
  location: string
  seats: string
  fuel_type: string
  price_per_day: string
  vehicle_color: string
  purchase_date: string
  expiry_date: string
  agreement_expiry_date: string
  images: string[]
  blocks: Array<{ start: string; end: string }>
}

interface Booking {
  id: number
  car_id: number
  user_email: string
  start_time: string
  end_time: string
  status: string
  breakdown: {
    car_price_total: number
    car_wash_charge: number
    late_night_charge: number
    total_amount: number
  }
  down_payment: number
  due_amount: number
  razorpay_order_id?: string
  razorpay_payment_id?: string
  documents?: any
}

interface FilterState {
  fuelTypes: string[]
  locations: string[]
  priceRange: [number, number]
  seats: number | null
  minSeats: number | null
  vehicleColors: string[]
  purchaseDateRange: [Date | null, Date | null]
  expiryDateRange: [Date | null, Date | null]
  logic: "AND" | "OR"
}

interface BookingState {
  cars: Car[]
  bookings: Booking[]
  currentBooking: Booking | null
  selectedCar: Car | null
  isLoading: boolean
  error: string | null
  filters: FilterState

  setCars: (cars: Car[]) => void
  setBookings: (bookings: Booking[]) => void
  setCurrentBooking: (booking: Booking | null) => void
  setSelectedCar: (car: Car | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: number, updates: Partial<Booking>) => void
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  cars: [],
  bookings: [],
  currentBooking: null,
  selectedCar: null,
  isLoading: false,
  error: null,
  filters: {
    fuelTypes: [],
    locations: [],
    priceRange: [0, 10000],
    seats: null,
    minSeats: null,
    vehicleColors: [],
    purchaseDateRange: [null, null],
    expiryDateRange: [null, null],
    logic: "AND",
  },

  setCars: (cars) => set({ cars }),
  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setSelectedCar: (car) => set({ selectedCar: car }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addBooking: (booking) => {
    const { bookings } = get()
    set({ bookings: [...bookings, booking] })
  },

  updateBooking: (id, updates) => {
    const { bookings } = get()
    const updatedBookings = bookings.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking))
    set({ bookings: updatedBookings })
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({
    filters: {
      fuelTypes: [],
      locations: [],
      priceRange: [0, 10000],
      seats: null,
      minSeats: null,
      vehicleColors: [],
      purchaseDateRange: [null, null],
      expiryDateRange: [null, null],
      logic: "AND",
    },
  }),
}))

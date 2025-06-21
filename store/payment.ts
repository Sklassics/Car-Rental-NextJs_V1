import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PaymentState {
  payment: any
  setPayment: (payment: any) => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      payment: null,
      setPayment: (payment) => set({ payment }),
    }),
    {
      name: "payment-storage",
    },
  ),
)
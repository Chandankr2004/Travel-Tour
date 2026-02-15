import api from '../lib/api'

export const paymentService = {
  createOrder: async (bookingId: string) => {
    const response = await api.post('/payments/create-order', { bookingId })
    return response.data
  },

  verifyPayment: async (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    bookingId: string
  }) => {
    const response = await api.post('/payments/verify', data)
    return response.data
  },

  getPayment: async (id: string) => {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },
}


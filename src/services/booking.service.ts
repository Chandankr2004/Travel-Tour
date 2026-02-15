import api from '../lib/api'

export interface BookingData {
  tour: string
  travelDate: string
  numberOfTravelers: {
    adults: number
    children: number
  }
  travelerDetails: {
    name: string
    email: string
    phone: string
    address: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
  }
  specialRequests?: string
  couponCode?: string
}

export const bookingService = {
  createBooking: async (data: BookingData) => {
    const response = await api.post('/bookings', data)
    return response.data
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings')
    return response.data
  },

  getBooking: async (id: string) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id: string, cancellationReason?: string) => {
    const response = await api.put(`/bookings/${id}/cancel`, { cancellationReason })
    return response.data
  },
}


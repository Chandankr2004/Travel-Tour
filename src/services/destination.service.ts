import api from '../lib/api'

export interface Destination {
  _id: string
  name: string
  country: string
  description: string
  image: string
  images: string[]
  bestTimeToVisit?: string
  currency?: string
  language?: string
  timeZone?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export const destinationService = {
  getDestinations: async (params?: {
    page?: number
    limit?: number
    country?: string
    search?: string
  }) => {
    const response = await api.get('/destinations', { params })
    return response.data
  },

  getDestination: async (id: string) => {
    const response = await api.get(`/destinations/${id}`)
    return response.data
  },

  getCountries: async () => {
    const response = await api.get('/destinations/countries/list')
    return response.data
  },
}


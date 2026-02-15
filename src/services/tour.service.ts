import api from '../lib/api'

export interface Tour {
  _id: string
  title: string
  slug: string
  destination: {
    _id: string
    name: string
    country: string
    image: string
  }
  description: string
  shortDescription?: string
  images: string[]
  price: number
  discount: number
  duration: {
    days: number
    nights: number
  }
  maxGroupSize: number
  difficulty: 'easy' | 'medium' | 'hard'
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities: string[]
    meals: {
      breakfast: boolean
      lunch: boolean
      dinner: boolean
    }
    accommodation?: string
  }>
  inclusions: string[]
  exclusions: string[]
  highlights: string[]
  availableDates: Array<{
    startDate: string
    endDate: string
    availableSlots: number
  }>
  rating: {
    average: number
    count: number
  }
  isFeatured: boolean
  createdAt: string
}

export interface ToursResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  data: Tour[]
}

export const tourService = {
  getTours: async (params?: {
    page?: number
    limit?: number
    search?: string
    destination?: string
    minPrice?: number
    maxPrice?: number
    duration?: number
    difficulty?: string
    sort?: string
    featured?: boolean
  }): Promise<ToursResponse> => {
    const response = await api.get('/tours', { params })
    return response.data
  },

  getTour: async (id: string) => {
    const response = await api.get(`/tours/${id}`)
    return response.data
  },

  getTourBySlug: async (slug: string) => {
    const response = await api.get(`/tours/slug/${slug}`)
    return response.data
  },

  getFeaturedTours: async (): Promise<{ success: boolean; count: number; data: Tour[] }> => {
    const response = await api.get('/tours/featured')
    return response.data
  },
}


import api from '../lib/api'

export interface ReviewData {
  tour: string
  rating: number
  comment: string
  booking?: string
}

export const reviewService = {
  getTourReviews: async (tourId: string, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/tour/${tourId}`, {
      params: { page, limit }
    })
    return response.data
  },

  createReview: async (data: ReviewData) => {
    const response = await api.post('/reviews', data)
    return response.data
  },

  updateReview: async (id: string, data: Partial<ReviewData>) => {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
}


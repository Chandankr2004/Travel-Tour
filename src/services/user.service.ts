import api from '../lib/api'

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  getWishlist: async () => {
    const response = await api.get('/users/wishlist')
    return response.data
  },

  addToWishlist: async (tourId: string) => {
    const response = await api.post(`/users/wishlist/${tourId}`)
    return response.data
  },

  removeFromWishlist: async (tourId: string) => {
    const response = await api.delete(`/users/wishlist/${tourId}`)
    return response.data
  },
}


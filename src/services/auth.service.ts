import api from '../lib/api'
import { setToken, setUser } from '../lib/auth'

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    if (response.data.token && response.data.user) {
      setToken(response.data.token)
      // Ensure user object has all required fields
      const userData = {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role || 'user',
        avatar: response.data.user.avatar,
        isEmailVerified: response.data.user.isEmailVerified
      }
      setUser(userData)
    }
    return response.data
  },

  login: async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token && response.data.user) {
      // Use localStorage if rememberMe is true, otherwise use sessionStorage
      if (rememberMe) {
        setToken(response.data.token)
        // Ensure user object has all required fields
        const userData = {
          id: response.data.user.id || response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role || 'user',
          avatar: response.data.user.avatar,
          isEmailVerified: response.data.user.isEmailVerified
        }
        setUser(userData)
      } else {
        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('token', response.data.token)
        const userData = {
          id: response.data.user.id || response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role || 'user',
          avatar: response.data.user.avatar,
          isEmailVerified: response.data.user.isEmailVerified
        }
        sessionStorage.setItem('user', JSON.stringify(userData))
      }
      // Dispatch custom event to notify components of auth state change
      window.dispatchEvent(new Event('auth-change'))
      
      // Only log in development mode for security
      if (import.meta.env.DEV) {
        console.log('User logged in successfully')
      }
    }
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    if (response.data.user) {
      // Update user in localStorage with fresh data
      const userData = {
        id: response.data.user._id || response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role || 'user',
        avatar: response.data.user.avatar,
        isEmailVerified: response.data.user.isEmailVerified
      }
      setUser(userData)
    }
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password })
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  },
}


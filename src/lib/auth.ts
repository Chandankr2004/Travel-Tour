export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  isEmailVerified?: boolean
}

export const getToken = (): string | null => {
  // Check sessionStorage first, then localStorage
  return sessionStorage.getItem('token') || localStorage.getItem('token')
}

export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

export const removeToken = (): void => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export const getUser = (): User | null => {
  // Check sessionStorage first, then localStorage
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const isAdmin = (): boolean => {
  const user = getUser()
  return user?.role === 'admin'
}

export const logout = (): void => {
  removeToken()
  removeUser()
  // Dispatch custom event to notify components of auth state change
  window.dispatchEvent(new Event('auth-change'))
  window.location.href = '/'
}


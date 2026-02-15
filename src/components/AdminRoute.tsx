import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, getUser } from '../lib/auth'
import toast from 'react-hot-toast'

interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  useEffect(() => {
    const user = getUser()
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.')
    }
  }, [])

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const user = getUser()
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute


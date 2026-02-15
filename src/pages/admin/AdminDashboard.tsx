import { useQuery } from '@tanstack/react-query'
import { FiUsers, FiCalendar, FiDollarSign, FiPackage } from 'react-icons/fi'
import api from '../../lib/api'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard')
      return response.data
    }
  })

  const stats = data?.data?.stats || {}
  const recentBookings = data?.data?.recentBookings || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers || 0}</p>
              </div>
              <FiUsers className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTours || 0}</p>
              </div>
              <FiPackage className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings || 0}</p>
              </div>
              <FiCalendar className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-4xl text-primary-600" />
            </div>
          </div>
        </div>

        {/* Booking Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Pending Bookings</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pendingBookings || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Confirmed Bookings</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.confirmedBookings || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Cancelled Bookings</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{stats.cancelledBookings || 0}</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-800 text-sm">
              View All
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Tour</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking: any) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{booking.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{booking.tour?.title || 'N/A'}</td>
                      <td className="py-3 px-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">₹{booking.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent bookings</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/tours" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Tours</h3>
            <p className="text-gray-600">Create, edit, and manage tour packages</p>
          </Link>
          <Link to="/admin/destinations" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Destinations</h3>
            <p className="text-gray-600">Add and manage travel destinations</p>
          </Link>
          <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiCalendar, FiDollarSign, FiHeart, FiArrowRight } from 'react-icons/fi'
import { bookingService } from '../../services/booking.service'
import { userService } from '../../services/user.service'
import { getUser } from '../../lib/auth'

const Dashboard = () => {
  const user = getUser()

  const { data: bookingsData } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingService.getMyBookings()
  })

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => userService.getWishlist()
  })

  const bookings = bookingsData?.data?.data || []
  const wishlist = wishlistData?.data?.data || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <FiCalendar className="text-4xl text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Wishlist Items</p>
                <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
              </div>
              <FiHeart className="text-4xl text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0).toLocaleString()}
                </p>
              </div>
              <FiDollarSign className="text-4xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking: any) => (
                <div key={booking._id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.tour?.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.travelDate).toLocaleDateString()} • {booking.numberOfTravelers.adults} Adults, {booking.numberOfTravelers.children} Children
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{booking.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No bookings yet. <Link to="/tours" className="text-primary-600">Explore tours</Link></p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/tours" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Explore Tours</h3>
            <p className="text-gray-600">Discover amazing destinations</p>
          </Link>
          <Link to="/wishlist" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">My Wishlist</h3>
            <p className="text-gray-600">View your saved tours</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


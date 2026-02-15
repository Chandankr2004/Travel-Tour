import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { FiCalendar, FiUsers, FiDollarSign, FiX } from 'react-icons/fi'
import { bookingService } from '../../services/booking.service'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingService.getMyBookings()
  })

  const { mutate: cancelBooking } = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Booking cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  })

  const bookings = data?.data?.data || []

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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link to={`/tours/${booking.tour?.slug}`}>
                          <h3 className="text-2xl font-bold text-gray-900 hover:text-primary-600 mb-2">
                            {booking.tour?.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600">{booking.tour?.destination?.name}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="mr-2" />
                        <span>Travel: {new Date(booking.travelDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiUsers className="mr-2" />
                        <span>{booking.numberOfTravelers.adults} Adults, {booking.numberOfTravelers.children} Children</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="mr-2" />
                        <span className="font-semibold">₹{booking.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Booking Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <p>Booking ID: {booking._id}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this booking?')) {
                            cancelBooking(booking._id)
                          }
                        }}
                        className="btn-secondary flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50"
                      >
                        <FiX />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No bookings found</p>
            <Link to="/tours" className="btn-primary">
              Explore Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings


import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const AdminBookings = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['adminBookings', page, status],
    queryFn: async () => {
      const response = await api.get('/bookings', { params: { page, limit: 20, status } })
      return response.data
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put(`/bookings/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      toast.success('Booking status updated')
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] })
    },
    onError: () => {
      toast.error('Failed to update booking status')
    }
  })

  const bookings = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Bookings</h1>
          <select
            className="input-field w-auto"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Tour</th>
                  <th className="text-left py-3 px-4">Travel Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{booking.tour?.title || 'N/A'}</td>
                    <td className="py-3 px-4">{new Date(booking.travelDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">₹{booking.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <select
                        className="input-field text-sm"
                        value={booking.status}
                        onChange={(e) => updateStatus({ id: booking._id, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary-600 hover:text-primary-800 text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings


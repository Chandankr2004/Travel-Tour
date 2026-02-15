import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { FiHeart } from 'react-icons/fi'
import { userService } from '../../services/user.service'
import TourCard from '../../components/TourCard'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => userService.getWishlist()
  })

  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: userService.removeFromWishlist,
    onSuccess: () => {
      toast.success('Removed from wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: () => {
      toast.error('Failed to remove from wishlist')
    }
  })

  const tours = data?.data?.data || []

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{tours.length} {tours.length === 1 ? 'tour' : 'tours'} saved</p>
          </div>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour: any) => (
              <div key={tour._id} className="relative">
                <button
                  onClick={() => removeFromWishlist(tour._id)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                >
                  <FiHeart className="text-red-500 fill-current" />
                </button>
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
            <p className="text-gray-500">Start adding tours to your wishlist!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist


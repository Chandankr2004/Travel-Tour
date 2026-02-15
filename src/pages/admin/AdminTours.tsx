import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const AdminTours = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTour, setEditingTour] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminTours', page, search],
    queryFn: async () => {
      const response = await api.get('/tours', { params: { page, limit: 20, search } })
      return response.data
    }
  })

  // Fetch destinations for dropdown
  const { data: destinationsData } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const response = await api.get('/destinations')
      return response.data
    }
  })

  const destinations = destinationsData?.data || []

  const { mutate: deleteTour } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/tours/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success('Tour deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['adminTours'] })
    },
    onError: () => {
      toast.error('Failed to delete tour')
    }
  })

  const { mutate: createOrUpdateTour, isPending: isSaving } = useMutation({
    mutationFn: async (tourData: any) => {
      if (editingTour) {
        const response = await api.put(`/tours/${editingTour._id}`, tourData)
        return response.data
      } else {
        const response = await api.post('/tours', tourData)
        return response.data
      }
    },
    onSuccess: () => {
      toast.success(editingTour ? 'Tour updated successfully' : 'Tour created successfully')
      queryClient.invalidateQueries({ queryKey: ['adminTours'] })
      setShowModal(false)
      setEditingTour(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save tour')
    }
  })

  const tours = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Tours</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search tours..."
              className="input-field w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <button 
              onClick={() => {
                setEditingTour(null)
                setShowModal(true)
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Tour</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Tour</th>
                    <th className="text-left py-3 px-4">Destination</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour: any) => (
                    <tr key={tour._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {tour.images?.[0] && (
                            <img
                              src={tour.images[0]}
                              alt={tour.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <Link to={`/tours/${tour.slug}`} className="text-primary-600 hover:underline">
                              {tour.title}
                            </Link>
                            {tour.isFeatured && (
                              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{tour.destination?.name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        ₹{tour.price?.toLocaleString()}
                        {tour.discount > 0 && (
                          <span className="text-red-600 ml-2">-{tour.discount}%</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{tour.duration?.days || 0} Days</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          tour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tour.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setEditingTour(tour)
                              setShowModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                          >
                            <FiEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this tour?')) {
                                deleteTour(tour._id)
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {data.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                  disabled={page === data.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Tour Modal */}
      {showModal && (
        <TourModal
          tour={editingTour}
          destinations={destinations}
          onClose={() => {
            setShowModal(false)
            setEditingTour(null)
          }}
          onSave={(tourData) => createOrUpdateTour(tourData)}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

// Tour Modal Component
interface TourModalProps {
  tour?: any
  destinations: any[]
  onClose: () => void
  onSave: (tourData: any) => void
  isSaving: boolean
}

const TourModal = ({ tour, destinations, onClose, onSave, isSaving }: TourModalProps) => {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    destination: tour?.destination?._id || tour?.destination || '',
    description: tour?.description || '',
    shortDescription: tour?.shortDescription || '',
    price: tour?.price || '',
    discount: tour?.discount || 0,
    'duration.days': tour?.duration?.days || '',
    'duration.nights': tour?.duration?.nights || 0,
    maxGroupSize: tour?.maxGroupSize || '',
    difficulty: tour?.difficulty || 'medium',
    images: tour?.images?.join('\n') || '',
    inclusions: tour?.inclusions?.join('\n') || '',
    exclusions: tour?.exclusions?.join('\n') || '',
    highlights: tour?.highlights?.join('\n') || '',
    isActive: tour?.isActive !== undefined ? tour.isActive : true,
    isFeatured: tour?.isFeatured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const { 'duration.days': _, 'duration.nights': __, ...restFormData } = formData
    
    const tourData = {
      ...restFormData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      maxGroupSize: Number(formData.maxGroupSize),
      images: formData.images.split('\n').filter((url: string) => url.trim()),
      inclusions: formData.inclusions.split('\n').filter((item: string) => item.trim()),
      exclusions: formData.exclusions.split('\n').filter((item: string) => item.trim()),
      highlights: formData.highlights.split('\n').filter((item: string) => item.trim()),
      duration: {
        days: Number(formData['duration.days']),
        nights: Number(formData['duration.nights'])
      }
    }

    onSave(tourData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {tour ? 'Edit Tour' : 'Add New Tour'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Title *
              </label>
              <input
                type="text"
                required
                className="input-field w-full"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <select
                required
                className="input-field w-full"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              >
                <option value="">Select Destination</option>
                {destinations.map((dest: any) => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                className="input-field w-full"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field w-full"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="input-field w-full"
                value={formData['duration.days']}
                onChange={(e) => setFormData({ ...formData, 'duration.days': e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Nights)
              </label>
              <input
                type="number"
                min="0"
                className="input-field w-full"
                value={formData['duration.nights']}
                onChange={(e) => setFormData({ ...formData, 'duration.nights': e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Group Size *
              </label>
              <input
                type="number"
                required
                min="1"
                className="input-field w-full"
                value={formData.maxGroupSize}
                onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                className="input-field w-full"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              maxLength={200}
              className="input-field w-full"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description (max 200 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              className="input-field w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (URLs, one per line) *
            </label>
            <textarea
              required
              rows={3}
              className="input-field w-full"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlights (one per line)
            </label>
            <textarea
              rows={3}
              className="input-field w-full"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              placeholder="Amazing views&#10;Cultural experience"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inclusions (one per line)
              </label>
              <textarea
                rows={3}
                className="input-field w-full"
                value={formData.inclusions}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                placeholder="Accommodation&#10;Meals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclusions (one per line)
              </label>
              <textarea
                rows={3}
                className="input-field w-full"
                value={formData.exclusions}
                onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                placeholder="Flight tickets&#10;Personal expenses"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : tour ? 'Update Tour' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminTours


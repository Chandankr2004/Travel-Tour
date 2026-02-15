import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const AdminDestinations = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDestination, setEditingDestination] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminDestinations', page, search],
    queryFn: async () => {
      const response = await api.get('/destinations', { params: { page, limit: 20, search } })
      return response.data
    }
  })

  const { mutate: deleteDestination } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/destinations/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success('Destination deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['adminDestinations'] })
    },
    onError: () => {
      toast.error('Failed to delete destination')
    }
  })

  const { mutate: createOrUpdateDestination, isPending: isSaving } = useMutation({
    mutationFn: async (destinationData: any) => {
      if (editingDestination) {
        const response = await api.put(`/destinations/${editingDestination._id}`, destinationData)
        return response.data
      } else {
        const response = await api.post('/destinations', destinationData)
        return response.data
      }
    },
    onSuccess: () => {
      toast.success(editingDestination ? 'Destination updated successfully' : 'Destination created successfully')
      queryClient.invalidateQueries({ queryKey: ['adminDestinations'] })
      setShowModal(false)
      setEditingDestination(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save destination')
    }
  })

  const destinations = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Destinations</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="input-field w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <button 
              onClick={() => {
                setEditingDestination(null)
                setShowModal(true)
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Destination</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination: any) => (
                <div key={destination._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={destination.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        destination.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {destination.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{destination.country}</p>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {destination.bestTimeToVisit && (
                          <p>Best time: {destination.bestTimeToVisit}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setEditingDestination(destination)
                            setShowModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                        >
                          <FiEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this destination?')) {
                              deleteDestination(destination._id)
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* Add/Edit Destination Modal */}
      {showModal && (
        <DestinationModal
          destination={editingDestination}
          onClose={() => {
            setShowModal(false)
            setEditingDestination(null)
          }}
          onSave={(destinationData) => createOrUpdateDestination(destinationData)}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

// Destination Modal Component
interface DestinationModalProps {
  destination?: any
  onClose: () => void
  onSave: (destinationData: any) => void
  isSaving: boolean
}

const DestinationModal = ({ destination, onClose, onSave, isSaving }: DestinationModalProps) => {
  const [formData, setFormData] = useState({
    name: destination?.name || '',
    country: destination?.country || '',
    description: destination?.description || '',
    image: destination?.image || '',
    images: destination?.images?.join('\n') || '',
    bestTimeToVisit: destination?.bestTimeToVisit || '',
    currency: destination?.currency || 'USD',
    language: destination?.language || 'English',
    timeZone: destination?.timeZone || '',
    'coordinates.lat': destination?.coordinates?.lat || '',
    'coordinates.lng': destination?.coordinates?.lng || '',
    isActive: destination?.isActive !== undefined ? destination.isActive : true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const { 'coordinates.lat': _, 'coordinates.lng': __, ...restFormData } = formData
    
    const coordinates = {
      lat: formData['coordinates.lat'] ? Number(formData['coordinates.lat']) : undefined,
      lng: formData['coordinates.lng'] ? Number(formData['coordinates.lng']) : undefined,
    }

    const destinationData: any = {
      ...restFormData,
      images: formData.images.split('\n').filter((url: string) => url.trim()),
    }

    // Only add coordinates if both lat and lng are provided
    if (coordinates.lat && coordinates.lng) {
      destinationData.coordinates = coordinates
    }

    onSave(destinationData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {destination ? 'Edit Destination' : 'Add New Destination'}
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
                Destination Name *
              </label>
              <input
                type="text"
                required
                className="input-field w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                required
                className="input-field w-full"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL *
              </label>
              <input
                type="url"
                required
                className="input-field w-full"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="USD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                placeholder="UTC+5:30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Visit
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.bestTimeToVisit}
                onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                placeholder="March to May, October to November"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                className="input-field w-full"
                value={formData['coordinates.lat']}
                onChange={(e) => setFormData({ ...formData, 'coordinates.lat': e.target.value })}
                placeholder="28.6139"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                className="input-field w-full"
                value={formData['coordinates.lng']}
                onChange={(e) => setFormData({ ...formData, 'coordinates.lng': e.target.value })}
                placeholder="77.2090"
              />
            </div>
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
              Additional Images (URLs, one per line)
            </label>
            <textarea
              rows={3}
              className="input-field w-full"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
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
              {isSaving ? 'Saving...' : destination ? 'Update Destination' : 'Create Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDestinations


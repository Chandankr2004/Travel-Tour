import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi'
import { userService } from '../../services/user.service'
import { setUser } from '../../lib/auth'
import toast from 'react-hot-toast'

const Profile = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || '',
        phone: data.data.phone || '',
        email: data.data.email || ''
      })
    }
  }, [data])

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully')
      setUser(data.data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name: formData.name,
      phone: formData.phone
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                disabled
                className="input-field bg-gray-100 cursor-not-allowed"
                value={formData.email}
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex items-center space-x-2"
            >
              <FiSave />
              <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile


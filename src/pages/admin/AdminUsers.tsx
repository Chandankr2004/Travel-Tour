import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page, search],
    queryFn: async () => {
      const response = await api.get('/admin/users', { params: { page, limit: 20, search } })
      return response.data
    }
  })

  const { mutate: updateRole } = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await api.put(`/admin/users/${id}/role`, { role })
      return response.data
    },
    onSuccess: () => {
      toast.success('User role updated')
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
    onError: () => {
      toast.error('Failed to update user role')
    }
  })

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success('User deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
    onError: () => {
      toast.error('Failed to delete user')
    }
  })

  const users = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Users</h1>
          <input
            type="text"
            placeholder="Search users..."
            className="input-field w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
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
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        className="input-field text-sm"
                        value={user.role}
                        onChange={(e) => updateRole({ id: user._id, role: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            deleteUser(user._id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
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

export default AdminUsers


import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiFilter, FiX, FiSearch } from 'react-icons/fi'
import { tourService, Tour } from '../services/tour.service'
import TourCard from '../components/TourCard'
import { useSearchParams } from 'react-router-dom'

const Tours = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    destination: searchParams.get('destination') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    duration: searchParams.get('duration') || '',
    difficulty: searchParams.get('difficulty') || '',
    sort: searchParams.get('sort') || '-createdAt'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['tours', filters, page],
    queryFn: () => tourService.getTours({ 
      ...filters, 
      page, 
      limit: 12,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      duration: filters.duration ? Number(filters.duration) : undefined,
    })
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setPage(1)
    const params = new URLSearchParams()
    Object.entries({ ...filters, [key]: value }).forEach(([k, v]) => {
      if (v) params.append(k, v)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const cleared = {
      search: '',
      destination: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      difficulty: '',
      sort: '-createdAt'
    }
    setFilters(cleared)
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/70"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Tours</h1>
          <p className="text-xl text-gray-200">Find your perfect adventure</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Tours</h1>
          <p className="text-gray-600">Discover amazing travel experiences</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-amber-100/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-primary-500 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search tours by name, destination, or description..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-earth-800 font-medium placeholder-amber-400 bg-white/90 hover:bg-white hover:border-amber-300 shadow-sm"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                showFilters 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white' 
                  : 'bg-gradient-to-r from-amber-100 to-amber-50 text-primary-700 border-2 border-primary-200 hover:from-primary-50 hover:to-primary-100'
              }`}
            >
              <FiFilter className="text-lg" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-amber-200 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input-field w-full"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="input-field w-full"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  className="input-field w-full"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  className="input-field w-full"
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="md:col-span-4 flex justify-end pt-2">
                <button 
                  onClick={clearFilters} 
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiX className="text-lg" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
          <p className="text-gray-700 font-medium">
            {data?.total ? (
              <span>
                Showing <span className="text-primary-600 font-bold">{data.count}</span> of{' '}
                <span className="text-primary-600 font-bold">{data.total}</span> tours
              </span>
            ) : (
              'Loading...'
            )}
          </p>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-gray-700">Sort by:</label>
            <select
              className="input-field w-auto min-w-[200px] font-medium"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating.average">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card skeleton h-96"></div>
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.data.map((tour: Tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>

            {/* Pagination */}
            {data.pages && data.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
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
                  onClick={() => setPage(p => Math.min(data.pages || 1, p + 1))}
                  disabled={page === (data.pages || 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tours found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tours


import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiSearch } from 'react-icons/fi'
import { destinationService, Destination } from '../services/destination.service'

const Destinations = () => {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [page, setPage] = useState(1)

  const { data: destinationsData, isLoading: destinationsLoading } = useQuery({
    queryKey: ['destinations', search, country, page],
    queryFn: () => destinationService.getDestinations({ search, country, page, limit: 12 })
  })

  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: () => destinationService.getCountries()
  })

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Destinations</h1>
          <p className="text-xl text-gray-200">Explore the world's most beautiful places</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center space-x-3">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <select
              className="input-field w-auto"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Countries</option>
              {countriesData?.data?.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        {destinationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card skeleton h-64"></div>
            ))}
          </div>
        ) : destinationsData?.data?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationsData.data.map((destination: Destination, index: number) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/destinations/${destination._id}`}>
                    <div className="card overflow-hidden group cursor-pointer">
                      <div className="relative h-56 overflow-hidden group">
                        <img
                          src={destination.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                          <div className="flex items-center text-sm">
                            <FiMapPin className="mr-1" />
                            <span>{destination.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 line-clamp-2">{destination.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {destinationsData.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {destinationsData.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(destinationsData.pages, p + 1))}
                  disabled={page === destinationsData.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No destinations found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Destinations


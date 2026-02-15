import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiCalendar, FiDollarSign, FiStar, FiArrowRight } from 'react-icons/fi'
import { tourService } from '../services/tour.service'
import TourCard from '../components/TourCard'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    price: ''
  })

  const { data: featuredTours, isLoading } = useQuery({
    queryKey: ['featuredTours'],
    queryFn: () => tourService.getFeaturedTours()
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchData.destination) params.append('search', searchData.destination)
    if (searchData.price) params.append('maxPrice', searchData.price)
    navigate(`/tours?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
          }}
        >
          {/* Gradient Overlay - Warm sunset colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-amber-900/70 to-orange-800/80"></div>
          {/* Additional Warm Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Your Journey Begins Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover amazing destinations and create unforgettable memories
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto w-full px-4"
          >
            <form 
              onSubmit={handleSearch} 
              className="glass bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 border border-white/20"
            >
              {/* Destination Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <FiMapPin className="text-primary-500 text-xl group-hover:text-primary-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-earth-800 font-medium placeholder-amber-400 bg-white/90 hover:bg-white hover:border-amber-300"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                />
              </div>

              {/* Date Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <FiCalendar className="text-primary-500 text-xl group-hover:text-primary-600 transition-colors" />
                </div>
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-earth-800 font-medium bg-white/90 hover:bg-white hover:border-amber-300"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                />
              </div>

              {/* Price Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <FiDollarSign className="text-primary-500 text-xl group-hover:text-primary-600 transition-colors" />
                </div>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-earth-800 font-medium placeholder-amber-400 bg-white/90 hover:bg-white hover:border-amber-300"
                  value={searchData.price}
                  onChange={(e) => setSearchData({ ...searchData, price: e.target.value })}
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit" 
                className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 hover:from-primary-600 hover:via-primary-700 hover:to-accent-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[140px]"
              >
                <FiSearch className="text-xl" />
                <span>Search</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-earth-900 mb-4">Featured Tours</h2>
            <p className="text-earth-700 text-lg">Handpicked experiences for your perfect getaway</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card skeleton h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours?.data?.slice(0, 6).map((tour: any) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/tours" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Tours</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-earth-900 mb-4">Why Choose Us</h2>
            <p className="text-earth-700 text-lg max-w-2xl mx-auto">Experience the difference with our premium travel services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Worldwide Destinations',
                description: 'Explore over 100+ destinations across the globe',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
              },
              {
                icon: '⭐',
                title: 'Best Price Guarantee',
                description: 'Get the best deals with our price match guarantee',
                image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
              },
              {
                icon: '🛡️',
                title: '24/7 Support',
                description: 'Round-the-clock customer support for your peace of mind',
                image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden rounded-t-xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-earth-900">{feature.title}</h3>
                  </div>
                  <p className="text-earth-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-earth-900 mb-4">What Our Customers Say</h2>
            <p className="text-earth-700 text-lg">Real experiences from real travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                location: 'New York, USA',
                rating: 5,
                comment: 'Amazing experience! The tour was well-organized and the destinations were breathtaking.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
              },
              {
                name: 'Michael Chen',
                location: 'London, UK',
                rating: 5,
                comment: 'Best travel agency I\'ve ever used. Highly recommend for anyone looking for quality tours.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
              },
              {
                name: 'Emma Williams',
                location: 'Sydney, Australia',
                rating: 5,
                comment: 'Exceeded all expectations. The guides were knowledgeable and friendly.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-earth-700 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-300 shadow-md"
                  />
                  <div>
                    <p className="font-semibold text-earth-900">{testimonial.name}</p>
                    <p className="text-sm text-earth-600">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/85 via-amber-900/80 to-orange-800/85"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100 mb-8 text-lg">
              Get the latest travel deals and destination updates delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home


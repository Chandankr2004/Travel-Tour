import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiStar, FiUsers } from 'react-icons/fi'
import { Tour } from '../services/tour.service'

interface TourCardProps {
  tour: Tour
}

const TourCard = ({ tour }: TourCardProps) => {
  const discountPrice = tour.price - (tour.price * tour.discount) / 100

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card overflow-hidden"
    >
      <Link to={`/tours/${tour.slug}`}>
        <div className="relative h-56 overflow-hidden group">
          <img
            src={tour.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {tour.discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
              -{tour.discount}%
            </div>
          )}
          {tour.isFeatured && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{tour.title}</h3>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FiMapPin className="mr-1" />
            <span>{tour.destination.name}, {tour.destination.country}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{tour.duration.days} Days</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-1" />
              <span>Max {tour.maxGroupSize}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiStar className="text-yellow-400 fill-current mr-1" />
              <span className="font-semibold">{tour.rating.average.toFixed(1)}</span>
              <span className="text-gray-500 text-sm ml-1">({tour.rating.count})</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              tour.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              tour.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {tour.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-amber-100">
            <div>
              {tour.discount > 0 ? (
                <div>
                  <span className="text-2xl font-bold text-primary-600">₹{discountPrice.toLocaleString()}</span>
                  <span className="text-amber-400 line-through ml-2">₹{tour.price.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary-600">₹{tour.price.toLocaleString()}</span>
              )}
              <p className="text-xs text-earth-500">per person</p>
            </div>
            <button className="btn-primary">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default TourCard


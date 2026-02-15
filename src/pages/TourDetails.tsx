import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiMapPin, FiClock, FiUsers, FiStar, FiCheck, FiX, FiCalendar, FiDollarSign } from 'react-icons/fi'
import { tourService } from '../services/tour.service'
import { isAuthenticated } from '../lib/auth'
import toast from 'react-hot-toast'

const TourDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['tour', slug],
    queryFn: () => tourService.getTourBySlug(slug!)
  })

  const tour = data?.data?.tour
  const reviews = data?.data?.reviews || []

  const discountPrice = tour ? tour.price - (tour.price * tour.discount) / 100 : 0

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to book a tour')
      navigate('/login')
      return
    }
    navigate(`/booking/${tour._id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-96 mb-8"></div>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <Link to="/tours" className="btn-primary">Back to Tours</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96 md:h-[500px]">
            <div className="md:col-span-2 relative overflow-hidden rounded-xl shadow-2xl group">
              <img
                src={tour.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                alt={tour.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tour.images.slice(1, 3).map((img: string, i: number) => (
                <div key={i} className="relative overflow-hidden rounded-xl shadow-lg group">
                  <img
                    src={img || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                    alt={`${tour.title} ${i + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                </div>
              ))}
              {tour.images.length < 3 && (
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">More Photos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{tour.destination.name}, {tour.destination.country}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>{tour.duration.days} Days / {tour.duration.nights} Nights</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  <span>Max {tour.maxGroupSize} travelers</span>
                </div>
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{tour.rating.average.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({tour.rating.count} reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  tour.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  tour.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tour.difficulty}
                </span>
                {tour.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tour.highlights.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day: any, i: number) => (
                    <div key={i} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-semibold text-lg mb-2">Day {day.day}: {day.title}</h3>
                      <p className="text-gray-700 mb-2">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-600 mb-1">Activities:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {day.activities.map((activity: string, j: number) => (
                              <li key={j}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {day.meals.breakfast && <span>🍳 Breakfast</span>}
                        {day.meals.lunch && <span>🍽️ Lunch</span>}
                        {day.meals.dinner && <span>🍴 Dinner</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Inclusions</h2>
                <ul className="space-y-2">
                  {tour.inclusions.map((inclusion: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Exclusions</h2>
                <ul className="space-y-2">
                  {tour.exclusions.map((exclusion: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <FiX className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  {tour.discount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-primary-600">₹{discountPrice.toLocaleString()}</span>
                      <span className="text-gray-400 line-through">₹{tour.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">₹{tour.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">per person</p>
                {tour.discount > 0 && (
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    Save {tour.discount}% - ₹{(tour.price - discountPrice).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>Available dates</span>
                </div>
                {tour.availableDates && tour.availableDates.length > 0 ? (
                  <div className="text-sm text-gray-700">
                    {tour.availableDates.slice(0, 3).map((date: any, i: number) => (
                      <div key={i} className="mb-2">
                        {new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()}
                        {date.availableSlots > 0 && (
                          <span className="text-green-600 ml-2">({date.availableSlots} slots)</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Contact us for availability</p>
                )}
              </div>

              <button onClick={handleBookNow} className="btn-primary w-full text-lg py-3">
                Book Now
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  <FiDollarSign className="inline mr-1" />
                  Best price guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetails


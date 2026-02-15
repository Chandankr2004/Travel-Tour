import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FiCalendar, FiUsers, FiTag } from 'react-icons/fi'
import { tourService } from '../services/tour.service'
import { bookingService } from '../services/booking.service'
import { couponService } from '../services/coupon.service'
import toast from 'react-hot-toast'

const Booking = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    travelDate: '',
    adults: 1,
    children: 0,
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    specialRequests: '',
    couponCode: ''
  })
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  const { data: tourData, isLoading } = useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => tourService.getTour(tourId!)
  })

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (data) => {
      toast.success('Booking created successfully!')
      navigate(`/booking/${data.data._id}/payment`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Booking failed')
    }
  })

  const tour = tourData?.data?.tour
  const discountPrice = tour ? tour.price - (tour.price * tour.discount) / 100 : 0
  const subtotal = tour ? discountPrice * (formData.adults + formData.children * 0.5) : 0
  const totalAmount = subtotal - couponDiscount

  const handleApplyCoupon = async () => {
    if (!formData.couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    if (!tour) return

    try {
      const response = await couponService.validateCoupon(
        formData.couponCode,
        subtotal,
        tourId
      )
      setCouponDiscount(response.data.discount)
      setAppliedCoupon(response.data)
      toast.success('Coupon applied successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon code')
      setCouponDiscount(0)
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponDiscount(0)
    setAppliedCoupon(null)
    setFormData({ ...formData, couponCode: '' })
    toast.success('Coupon removed')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const bookingData = {
      tour: tourId!,
      travelDate: formData.travelDate,
      numberOfTravelers: {
        adults: formData.adults,
        children: formData.children
      },
      travelerDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      },
      specialRequests: formData.specialRequests,
      couponCode: appliedCoupon?.code || undefined
    }

    createBooking(bookingData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <button onClick={() => navigate('/tours')} className="btn-primary">
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">{tour.title}</h2>
              <p className="text-gray-600 mb-4">{tour.destination.name}, {tour.destination.country}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Travel Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Travel Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-2" />
                      Travel Date
                    </label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUsers className="inline mr-2" />
                      Adults
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      className="input-field"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children (under 12)
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="input-field"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              {/* Traveler Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Traveler Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="inline mr-2" />
                  Coupon Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Enter coupon code"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="btn-secondary"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="btn-secondary"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {appliedCoupon.description || `Coupon applied: ${appliedCoupon.code}`}
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  rows={4}
                  className="input-field resize-none"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full py-3 text-lg"
              >
                {isPending ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Price Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Adults ({formData.adults})</span>
                  <span>₹{(discountPrice * formData.adults).toLocaleString()}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({formData.children})</span>
                    <span>₹{(discountPrice * formData.children * 0.5).toLocaleString()}</span>
                  </div>
                )}
                {tour.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Tour Discount ({tour.discount}%)</span>
                    <span>-₹{((tour.price - discountPrice) * (formData.adults + formData.children)).toLocaleString()}</span>
                  </div>
                )}
                {couponDiscount > 0 && appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{Math.max(0, Math.round(totalAmount)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking


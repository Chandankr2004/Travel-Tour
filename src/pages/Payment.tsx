import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiLoader } from 'react-icons/fi'
import { bookingService } from '../services/booking.service'
import { paymentService } from '../services/payment.service'
import toast from 'react-hot-toast'

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId!),
    enabled: !!bookingId
  })

  const { mutate: verifyPayment } = useMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: () => {
      toast.success('Payment successful!')
      navigate('/my-bookings')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Payment verification failed')
      setIsProcessing(false)
    }
  })

  const { mutate: createOrder } = useMutation({
    mutationFn: paymentService.createOrder,
    onSuccess: (data) => {
      const orderId = data.data.orderId
      const amount = data.data.amount
      const bookingId = data.data.bookingId

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
          amount: amount,
          currency: 'INR',
          name: 'Travel Tour',
          description: 'Tour Booking Payment',
          order_id: orderId,
          handler: function (response: any) {
            setIsProcessing(true)
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId
            })
          },
          prefill: {
            name: bookingData?.data?.travelerDetails?.name || '',
            email: bookingData?.data?.travelerDetails?.email || '',
            contact: bookingData?.data?.travelerDetails?.phone || ''
          },
          theme: {
            color: '#0284c7'
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false)
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
        razorpay.on('payment.failed', function () {
          toast.error('Payment failed. Please try again.')
          setIsProcessing(false)
        })
      }
      script.onerror = () => {
        toast.error('Failed to load payment gateway')
        setIsProcessing(false)
      }
      document.body.appendChild(script)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create payment order')
      setIsProcessing(false)
    }
  })

  const handlePayment = () => {
    if (!bookingId) return
    setIsProcessing(true)
    createOrder(bookingId)
  }

  const booking = bookingData?.data
  const tour = booking?.tour

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
          <button onClick={() => navigate('/tours')} className="btn-primary">
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  if (booking.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        >
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
          <button onClick={() => navigate('/my-bookings')} className="btn-primary">
            View My Bookings
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
              {tour && (
                <>
                  <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {tour.destination?.name || 'Destination'}
                  </p>
                </>
              )}
              <div className="space-y-2 text-gray-700">
                <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                <p><strong>Travelers:</strong> {booking.numberOfTravelers.adults} Adult(s), {booking.numberOfTravelers.children} Child(ren)</p>
                <p><strong>Booking ID:</strong> {booking._id}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p className="text-gray-600 mb-4">
                You will be redirected to Razorpay secure payment gateway to complete your payment.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{(booking.totalAmount + booking.discountAmount).toLocaleString()}</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {booking.couponCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({booking.couponCode})</span>
                    <span>Applied</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total</span>
                  <span className="text-primary-600">₹{booking.totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || booking.paymentStatus === 'paid'}
                  className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : booking.paymentStatus === 'paid' ? (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Paid
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment


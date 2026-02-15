import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { authService } from '../services/auth.service'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

const VerifyEmail = () => {
  const { token } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => authService.verifyEmail(token!),
    enabled: !!token
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {isLoading ? (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          ) : isError || !data?.success ? (
            <>
              <FiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">
                The verification link is invalid or has expired.
              </p>
              <Link to="/login" className="btn-primary">
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now log in.
              </p>
              <Link to="/login" className="btn-primary">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail


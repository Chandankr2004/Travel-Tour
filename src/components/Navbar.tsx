import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUser, isAuthenticated, isAdmin, logout } from '../lib/auth'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState(getUser())
  const [admin, setAdmin] = useState(isAdmin())

  // Listen for auth state changes (when login/logout happens)
  useEffect(() => {
    const updateAuthState = () => {
      setAuthenticated(isAuthenticated())
      setUser(getUser())
      setAdmin(isAdmin())
    }

    // Listen for custom auth-change event (dispatched after login/logout)
    window.addEventListener('auth-change', updateAuthState)

    // Listen for storage events (triggered by other tabs/windows)
    window.addEventListener('storage', updateAuthState)

    // Also check on focus (when user comes back to tab)
    window.addEventListener('focus', updateAuthState)

    // Initial check
    updateAuthState()

    return () => {
      window.removeEventListener('auth-change', updateAuthState)
      window.removeEventListener('storage', updateAuthState)
      window.removeEventListener('focus', updateAuthState)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-3 py-1 rounded-lg font-bold text-xl shadow-md">
              TT
            </div>
            <span className="font-bold text-xl text-earth-800">Travel Tour</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/destinations" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
              Destinations
            </Link>
            <Link to="/tours" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
              Tours
            </Link>
            <Link to="/contact" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>

            {authenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className="flex items-center space-x-2 text-earth-700 hover:text-primary-600 transition-colors font-medium"
                >
                  <FiUser className="text-xl" />
                  <span>{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    {admin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t transition-colors"
                      >
                        <FiSettings className="inline mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center transition-colors"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-earth-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/destinations"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/tours"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Tours
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {authenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {admin && (
                  <Link
                    to="/admin/dashboard"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block py-2 text-red-600 hover:text-red-700 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-primary-600 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar


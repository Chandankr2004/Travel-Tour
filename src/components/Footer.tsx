import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiCode } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-earth-900 via-earth-800 to-earth-900 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-3 py-1 rounded-lg font-bold text-xl shadow-lg">
                TT
              </div>
              <span className="font-bold text-xl text-white">Travel Tour</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for unforgettable travel experiences. Explore the world with us.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors transform hover:scale-110">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors transform hover:scale-110">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors transform hover:scale-110">
                <FiInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors transform hover:scale-110">
                <FiLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-primary-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-primary-400 transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FiMapPin className="mt-1 text-primary-400" />
                <span className="text-sm">123 Travel Street, Tourism City, TC 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-primary-400" />
                <span>info@traveltour.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Travel Tour. All rights reserved.
            </p>
            <a
              href="https://frontend-nu-silk-32.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm font-semibold"
            >
              <FiCode className="text-lg" />
              <span>Developer Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


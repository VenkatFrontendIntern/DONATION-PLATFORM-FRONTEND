import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User as UserIcon, LogOut, Home, Search, PlusSquare, Info, Shield } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/campaigns', icon: Search },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Start a Fundraiser', path: '/start-campaign', icon: PlusSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="bg-primary-50 text-primary-600 p-1.5 sm:p-2 rounded-lg">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-colors hover:text-primary-600 ${
                  isActive(link.path) ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900"
                >
                  <UserIcon size={18} />
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link to="/signup">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 active:bg-gray-100 rounded-lg touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-14 sm:top-16 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-semibold touch-manipulation min-h-[44px] flex items-center gap-3 ${
                  isActive(link.path) 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 active:bg-gray-50'
                }`}
              >
                <link.icon size={20} strokeWidth={isActive(link.path) ? 2.5 : 2} />
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-semibold touch-manipulation min-h-[44px] flex items-center gap-3 ${
                  isActive(user?.role === 'admin' ? '/admin' : '/dashboard')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 active:bg-gray-50'
                }`}
              >
                {user?.role === 'admin' ? (
                  <Shield size={20} strokeWidth={isActive('/admin') ? 2.5 : 2} />
                ) : (
                  <UserIcon size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
                )}
                {user?.role === 'admin' ? 'Admin' : 'Profile'}
              </Link>
            )}
            <div className="border-t border-gray-200 my-3 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-3 bg-red-50 text-red-600 rounded-lg font-semibold text-base active:bg-red-100 touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-3 py-3 text-gray-700 font-semibold text-base active:bg-gray-50 rounded-lg touch-manipulation min-h-[44px] flex items-center justify-center mb-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-3 py-3 bg-primary-600 text-white rounded-lg font-semibold text-base active:bg-primary-700 touch-manipulation min-h-[44px] flex items-center justify-center"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

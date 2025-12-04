import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/campaigns' },
    { name: 'About Us', path: '/about' },
    { name: 'Start a Fundraiser', path: '/start-campaign' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-50 text-primary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
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
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <UserIcon size={18} />
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link to="/signup">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
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
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-16 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path) 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-gray-600 font-medium mb-2"
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-gray-600 font-medium mb-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
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

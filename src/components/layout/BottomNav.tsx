import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/campaigns' },
    { icon: PlusSquare, label: 'Create', path: '/start-campaign' },
    { icon: Heart, label: user?.role === 'admin' ? 'Admin' : 'My Donations', path: user?.role === 'admin' ? '/admin' : '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 z-50 safe-area-bottom">
      <div className="flex justify-between items-center">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.label} 
              to={link.path}
              className={`flex flex-col items-center gap-1 min-w-[60px] ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
            >
              <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

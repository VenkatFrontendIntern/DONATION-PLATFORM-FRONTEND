import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Base links that are always shown
  const baseLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/campaigns' },
    { icon: PlusSquare, label: 'Create', path: '/start-campaign' },
  ];

  // Conditional links based on user role
  const conditionalLinks = isAdmin
    ? [
        { icon: Shield, label: 'Admin', path: '/admin' },
      ]
    : [
        { icon: User, label: 'Profile', path: '/dashboard' },
      ];

  const links = [...baseLinks, ...conditionalLinks];

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

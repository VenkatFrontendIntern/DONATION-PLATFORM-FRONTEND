import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <motion.label 
          className="block text-sm font-semibold text-gray-700 mb-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        <motion.input
          type={showPassword ? 'text' : 'password'}
          whileFocus={{ scale: 1.01 }}
          className={cn(
            "w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm",
            "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500",
            "transition-all duration-300 ease-out",
            "bg-white/80 backdrop-blur-sm",
            error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded p-1"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <Eye size={20} className="stroke-2" />
          ) : (
            <EyeOff size={20} className="stroke-2" />
          )}
        </button>
      </div>
      {error && (
        <motion.p 
          className="mt-2 text-sm text-red-600 font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};


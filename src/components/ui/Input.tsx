import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
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
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={cn(
          "w-full px-4 py-3 border-2 rounded-xl shadow-sm",
          "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500",
          "transition-all duration-300 ease-out",
          "bg-white/80 backdrop-blur-sm",
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
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

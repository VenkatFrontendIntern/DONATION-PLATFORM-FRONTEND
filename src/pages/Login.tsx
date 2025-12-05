import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { useAuth } from '../contexts/AuthContext';
import { validators } from '../utils/validators';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validators.email(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!password || password.trim() === '') {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      
      // Redirect admins to admin dashboard, regular users to their dashboard
      if (response.user.role === 'admin') {
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received (network error)
        toast.error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        toast.error(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary-50 text-primary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <span className="font-bold text-2xl text-gray-900">Engala Trust</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue your journey of giving.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput 
            label="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign In
          </Button>
        </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

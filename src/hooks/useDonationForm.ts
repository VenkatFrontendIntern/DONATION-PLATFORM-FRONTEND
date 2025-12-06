import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useDonationForm = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [donationAmount, setDonationAmount] = useState<number | ''>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPan, setDonorPan] = useState('');

  useEffect(() => {
    if (user && isAuthenticated) {
      setDonorName(user.name || '');
      setDonorEmail(user.email || '');
      setDonorPhone(user.phone || '');
      setDonorPan(user.pan || '');
    }
  }, [user, isAuthenticated]);

  return {
    donationAmount,
    setDonationAmount,
    isAnonymous,
    setIsAnonymous,
    donorName,
    setDonorName,
    donorEmail,
    setDonorEmail,
    donorPhone,
    setDonorPhone,
    donorPan,
    setDonorPan,
  };
};


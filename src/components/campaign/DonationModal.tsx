import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CURRENCY_SYMBOL } from '../../constants';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  donationAmount: number | '';
  onAmountChange: (amount: number) => void;
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
  donorName: string;
  onDonorNameChange: (value: string) => void;
  donorEmail: string;
  onDonorEmailChange: (value: string) => void;
  donorPhone: string;
  onDonorPhoneChange: (value: string) => void;
  donorPan: string;
  onDonorPanChange: (value: string) => void;
  processing: boolean;
  success: boolean;
  donationId: string | null;
  onDonate: () => void;
  onDownloadCertificate: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaignTitle,
  donationAmount,
  onAmountChange,
  isAnonymous,
  onAnonymousChange,
  donorName,
  onDonorNameChange,
  donorEmail,
  onDonorEmailChange,
  donorPhone,
  onDonorPhoneChange,
  donorPan,
  onDonorPanChange,
  processing,
  success,
  donationId,
  onDonate,
  onDownloadCertificate,
}) => {
  const { isAuthenticated } = useAuth();
  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Make a Donation</h2>
            <p className="text-gray-500 mb-6 text-sm">
              You are donating to <strong>{campaignTitle}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ({CURRENCY_SYMBOL})
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  className="w-full text-2xl font-bold p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="1000"
                  autoFocus
                  min="1"
                />
              </div>

              <div className="flex gap-2 mb-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onAmountChange(amt)}
                    className="flex-1 py-1 text-sm border rounded-full hover:bg-gray-50 text-gray-600"
                  >
                    {CURRENCY_SYMBOL}{amt}
                  </button>
                ))}
              </div>

              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => onAnonymousChange(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Donate anonymously</span>
                </label>
              </div>

              {!isAuthenticated && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Please <Link to="/login" className="underline">login</Link> to continue
                  </p>
                </div>
              )}

              {isAuthenticated && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => onDonorNameChange(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => onDonorEmailChange(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => onDonorPhoneChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN (Optional)</label>
                    <input
                      type="text"
                      value={donorPan}
                      onChange={(e) => onDonorPanChange(e.target.value.toUpperCase())}
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}

              <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  80G Tax Exemption certificate will be emailed to you automatically after success.
                </p>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={onDonate}
                loading={processing}
                disabled={!donationAmount || Number(donationAmount) <= 0}
              >
                Proceed to Pay
              </Button>

              <div className="text-center text-xs text-gray-400 mt-2">
                Secured by Razorpay
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation was successful. Your 80G certificate has been sent to your email.
            </p>
            <div className="flex flex-col gap-3">
              {donationId && (
                <Button variant="outline" fullWidth onClick={onDownloadCertificate}>
                  Download Certificate
                </Button>
              )}
              <Button onClick={onClose} fullWidth>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


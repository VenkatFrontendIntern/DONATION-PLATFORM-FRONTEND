import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Download, User, Mail } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../constants';
import { Pagination } from '../ui/Pagination';
import { ShimmerMyDonationsSection } from '../ui/Shimmer';

interface Donation {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  certificateUrl?: string;
  campaignId?: { _id: string; title: string };
  donorId?: { _id: string; name: string; email: string };
  donorName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface AllDonationsListProps {
  donations: Donation[];
  pagination: PaginationData;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onDownloadCertificate?: (donationId: string) => void;
}

export const AllDonationsList: React.FC<AllDonationsListProps> = ({
  donations,
  pagination,
  loading,
  onPageChange,
  onLimitChange,
  onDownloadCertificate,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">All Donations</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage all platform donations</p>
      </div>
      
      {loading ? (
        <ShimmerMyDonationsSection animationType="glow" />
      ) : donations.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No donations found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {donations.map((donation) => {
                  const donorName = donation.isAnonymous 
                    ? 'Anonymous' 
                    : donation.donorName || donation.donorId?.name || 'Unknown';
                  const donorEmail = donation.isAnonymous 
                    ? null 
                    : donation.donorEmail || donation.donorId?.email || null;

                  return (
                    <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{donorName}</div>
                            {donorEmail && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {donorEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {donation.campaignId ? (
                          <Link
                            to={`/campaign/${donation.campaignId._id}`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {donation.campaignId.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {CURRENCY_SYMBOL}{donation.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {donation.certificateUrl && onDownloadCertificate && (
                          <button
                            onClick={() => onDownloadCertificate(donation._id)}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium px-3 py-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors ml-auto"
                          >
                            <Download size={16} />
                            <span className="hidden sm:inline">80G</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {donations.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.page || 1}
                totalPages={pagination.pages || Math.ceil((pagination.total || donations.length) / (pagination.limit || 10)) || 1}
                totalItems={pagination.total || donations.length}
                itemsPerPage={pagination.limit || 10}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
                showInfo={true}
                showLimitSelector={!!onLimitChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};


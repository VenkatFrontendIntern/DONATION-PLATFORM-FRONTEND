import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { Search, Filter, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { ShimmerGrid } from '../components/ui/Shimmer';

interface CampaignWithPopulated {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  category?: { _id: string; name: string; slug?: string };
  [key: string]: any;
}

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignWithPopulated[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    loadCampaigns();
  }, [currentPage, selectedCategory, debouncedSearchTerm]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await campaignService.getCategories();
      setCategories(response.categories || []);
    } catch (error: any) {
      setCategories([]);
    }
  };

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        status: 'approved',
        page: currentPage,
        limit: itemsPerPage,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      const response = await campaignService.getAll(params);

      setCampaigns(response.campaigns || []);
      setTotalItems(response.total || 0);

      const calculatedPages = response.pages || Math.ceil((response.total || 0) / itemsPerPage);
      setTotalPages(calculatedPages);
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message || 'Failed to load campaigns. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Explore Campaigns
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover causes that matter and make a difference
          </p>
        </div>

        {/* Filters & Search - Apple-like Design */}
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/50 mb-6 sm:mb-8 sticky top-16 sm:top-20 z-30">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search fundraisers..."
                className="pl-10 sm:pl-12 block w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm sm:text-base py-2.5 sm:py-3 h-[44px] sm:h-[48px] bg-gray-50/50 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-auto sm:min-w-[180px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer w-full sm:w-auto h-[44px] sm:h-[48px] transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
            </div>

          </div>
        </div>

        {/* Results Count */}
        {!loading && campaigns.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Showing <span className="font-semibold text-gray-900">{campaigns.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalItems}</span> campaigns
            </p>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <ShimmerGrid items={12} columns={3} animationType="pulse" />
        ) : error ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-sm">
            <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-4">
              <AlertCircle size={48} className="w-full h-full" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Failed to Load Campaigns</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto px-4">{error}</p>
            <Button onClick={loadCampaigns} variant="outline" className="min-h-[44px]">
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] mr-2" />
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-sm">
            <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4">
              <Filter size={48} className="w-full h-full" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  index={index}
                  priority={index < 2}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  showInfo={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;

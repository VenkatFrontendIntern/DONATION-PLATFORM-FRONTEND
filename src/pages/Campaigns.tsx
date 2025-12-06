import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { Search, Filter, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';

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
  const itemsPerPage = 12; // Number of campaigns per page

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Load campaigns when filters or page change
  useEffect(() => {
    loadCampaigns();
  }, [currentPage, selectedCategory, debouncedSearchTerm]);

  // Load categories on mount
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

      // Calculate total pages
      const calculatedPages = response.pages || Math.ceil((response.total || 0) / itemsPerPage);
      setTotalPages(calculatedPages);
    } catch (error: any) {
      // Extract error message from standardized response format
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Campaigns</h1>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-30">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search fundraisers..."
                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border h-[42px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer w-full sm:w-auto h-[42px]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-red-400 mb-3">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Campaigns</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={loadCampaigns} variant="outline">
              <RefreshCw size={18} className="mr-2" />
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
              <Filter size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  index={index}
                  priority={index < 2}
                />
              ))}
            </div>

            {/* Pagination - Only show when there are multiple pages */}
            {totalPages > 1 ? (
              <div className="mt-8 pt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  showInfo={false}
                />
              </div>
            ) : (
              // Debug: Show info when pagination should appear
              totalItems > 0 && (
                <div className="mt-8 pt-6 text-center text-sm text-gray-500">
                  <p>Total campaigns: {totalItems} | Items per page: {itemsPerPage} | Pages: {totalPages}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {totalItems <= itemsPerPage
                      ? 'Not enough campaigns for pagination (need more than ' + itemsPerPage + ')'
                      : 'Pagination should appear here'}
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;

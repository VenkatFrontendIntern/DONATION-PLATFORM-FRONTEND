import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';

interface AnalyticsSectionProps {
  stats?: {
    campaigns: {
      total: number;
      pending: number;
      approved: number;
      rejected?: number;
    };
    donations: {
      total: number;
      totalAmount: number;
    };
  };
}

// Mock data for donation trends (last 6 months)
const generateDonationTrendsData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // More realistic trend: starting lower, dipping in middle, rising at end
  const baseAmounts = [55000, 60000, 52000, 58000, 65000, 72000];
  const donationCounts = [25, 28, 22, 30, 35, 42];
  
  return months.map((month, index) => ({
    month,
    amount: baseAmounts[index] || 50000,
    donations: donationCounts[index] || 25,
  }));
};

const DONATION_COLORS = {
  area: '#10b981', // emerald-500
  line: '#059669', // emerald-600
};

const CAMPAIGN_COLORS = {
  approved: '#10b981', // emerald-500
  pending: '#f59e0b', // amber-500
  rejected: '#ef4444', // red-500
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ stats }) => {
  const donationTrendsData = generateDonationTrendsData();

  // Prepare campaign status data with proper percentages
  const campaignStatusData = stats
    ? (() => {
        const total = stats.campaigns.total || (stats.campaigns.approved + stats.campaigns.pending + (stats.campaigns.rejected || 0));
        const data = [
          { name: 'Approved', value: stats.campaigns.approved, color: CAMPAIGN_COLORS.approved },
          { name: 'Pending', value: stats.campaigns.pending, color: CAMPAIGN_COLORS.pending },
          ...(stats.campaigns.rejected !== undefined
            ? [{ name: 'Rejected', value: stats.campaigns.rejected, color: CAMPAIGN_COLORS.rejected }]
            : []),
        ];
        // Calculate percentage for each item
        return data.map(item => ({
          ...item,
          percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
        }));
      })()
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-gray-600">{entry.name}:</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {entry.name === 'Amount' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    // Calculate the center point of the segment (middle of the donut ring)
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    // Convert angle to radians and adjust for proper positioning
    const angle = -midAngle * RADIAN;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const percentage = Math.round(percent * 100);

    // Only show label if percentage is significant (>= 5%)
    if (percentage < 5) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-semibold"
        style={{ pointerEvents: 'none' }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Donation Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Donation Volume</h3>
          <p className="text-sm text-gray-500">Last 6 months overview</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={donationTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={DONATION_COLORS.area} stopOpacity={0.3} />
                <stop offset="95%" stopColor={DONATION_COLORS.area} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="amount"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="count"
              orientation="right"
              stroke="#8b5cf6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="amount"
              type="monotone"
              dataKey="amount"
              stroke={DONATION_COLORS.line}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmount)"
              name="Amount"
            />
            <Line
              yAxisId="count"
              type="monotone"
              dataKey="donations"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Donations"
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Amount (₹)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Donation Count</span>
          </div>
        </div>
      </div>

      {/* Campaign Status Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Campaign Status Distribution</h3>
          <p className="text-sm text-gray-500">Current status breakdown</p>
        </div>
        {campaignStatusData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {campaignStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                            <p className="text-sm font-bold text-gray-900">{data.name}</p>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: data.color }}>
                            {data.value} {data.value === 1 ? 'campaign' : 'campaigns'} ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {campaignStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <p>No campaign data available</p>
          </div>
        )}
      </div>
    </div>
  );
};


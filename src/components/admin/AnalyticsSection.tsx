import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { adminService } from '../../services/adminService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

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

interface DonationTrend {
  month: string;
  amount: number;
  donations: number;
}

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
  const [donationTrendsData, setDonationTrendsData] = useState<DonationTrend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  useEffect(() => {
    const loadDonationTrends = async () => {
      try {
        const response = await adminService.getDonationTrends();
        setDonationTrendsData(response.trends || []);
      } catch (error: any) {
        console.error('Failed to load donation trends:', error);
        // If 404, the endpoint doesn't exist yet - use empty data
        // The backend server needs to be restarted to pick up the new route
        if (error?.response?.status === 404) {
          console.warn('Donation trends endpoint not found. Please restart the backend server.');
        }
        // Fallback to empty data if API fails
        setDonationTrendsData([]);
      } finally {
        setLoadingTrends(false);
      }
    };

    loadDonationTrends();
  }, []);

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

  // Chart.js data for donation trends
  const donationChartData = donationTrendsData.length > 0 ? {
    labels: donationTrendsData.map(d => d.month),
    datasets: [
      {
        label: 'Amount (₹)',
        data: donationTrendsData.map(d => d.amount),
        borderColor: DONATION_COLORS.line,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: DONATION_COLORS.line,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Donation Count',
        data: donationTrendsData.map(d => d.donations),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  } : {
    labels: [],
    datasets: [],
  };

  const donationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Amount')) {
                label += `₹${context.parsed.y.toLocaleString('en-IN')}`;
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(0)}k`;
            }
            return `₹${value}`;
          },
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Count',
          color: '#8b5cf6',
          font: {
            size: 12,
            weight: '500',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#8b5cf6',
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
      },
    },
  };

  // Chart.js data for campaign status
  const campaignChartData = {
    labels: campaignStatusData.map(d => d.name),
    datasets: [
      {
        data: campaignStatusData.map(d => d.value),
        backgroundColor: campaignStatusData.map(d => d.color),
        borderWidth: 0,
      },
    ],
  };

  // Custom plugin to display numbers on doughnut chart
  const doughnutLabelPlugin = {
    id: 'doughnutLabel',
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const data = chart.data.datasets[0].data;
      const total = data.reduce((a: number, b: number) => a + b, 0);
      
      if (total === 0) return;
      
      const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
      const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
      
      // Draw total in center
      ctx.save();
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total.toString(), centerX, centerY - 10);
      
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Total', centerX, centerY + 15);
      ctx.restore();
    },
    afterDraw: (chart: any) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const data = chart.data.datasets[0].data;
      const total = data.reduce((a: number, b: number) => a + b, 0);
      
      if (total === 0) return;
      
      meta.data.forEach((arc: any, index: number) => {
        const value = data[index];
        if (value === 0) return;
        
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const radius = (arc.innerRadius + arc.outerRadius) / 2;
        const x = arc.x + Math.cos(angle) * radius;
        const y = arc.y + Math.sin(angle) * radius;
        
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillText(value.toString(), x, y);
        ctx.restore();
      });
    }
  };

  const campaignChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = campaignStatusData.reduce((sum, item) => sum + item.value, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} ${value === 1 ? 'campaign' : 'campaigns'} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Donation Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Donation Volume</h3>
          <p className="text-sm text-gray-500">Last 6 months overview</p>
        </div>
        {loadingTrends ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading donation trends...</div>
          </div>
        ) : donationTrendsData.length > 0 ? (
          <>
            <div style={{ height: '300px' }}>
              <Line data={donationChartData} options={donationChartOptions} />
            </div>
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
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <p>No donation data available for the last 6 months</p>
          </div>
        )}
      </div>

      {/* Campaign Status Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Campaign Status Distribution</h3>
          <p className="text-sm text-gray-500">Current status breakdown</p>
        </div>
        {campaignStatusData.length > 0 ? (
          <>
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={campaignChartData} 
                options={campaignChartOptions}
                plugins={[doughnutLabelPlugin]}
              />
            </div>
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


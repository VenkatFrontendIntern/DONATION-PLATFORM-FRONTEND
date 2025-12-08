import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  ChartTooltip,
  Legend
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

const CAMPAIGN_COLORS = {
  approved: '#10b981', // emerald-500
  pending: '#f59e0b', // amber-500
  rejected: '#ef4444', // red-500
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ stats }) => {

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
    <div className="mb-8">
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


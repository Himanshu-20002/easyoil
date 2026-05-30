import React from 'react';
import { Card } from './Card';
import { mockDashboardData } from '@/lib/dashboard-mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

export function ConsumptionAnalytics() {
  const currentUsage = mockDashboardData.consumption[mockDashboardData.consumption.length - 1];
  const previousUsage = mockDashboardData.consumption[mockDashboardData.consumption.length - 2];
  const trend = ((currentUsage.usage - previousUsage.usage) / previousUsage.usage) * 100;

  return (
    <div id="analytics" className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Fuel Consumption Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Current Month */}
        <Card>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-600">Current Month Usage</p>
            <p className="text-3xl font-bold text-slate-900">{currentUsage.usage.toLocaleString()} L</p>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <TrendingUp className="w-4 h-4" />
              {trend.toFixed(1)}% increase
            </div>
          </div>
        </Card>

        {/* Previous Month */}
        <Card>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-600">Previous Month Usage</p>
            <p className="text-3xl font-bold text-slate-900">{previousUsage.usage.toLocaleString()} L</p>
            <p className="text-xs text-slate-500">Compared to current</p>
          </div>
        </Card>

        {/* Projected */}
        <Card>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-600">Projected Consumption</p>
            <p className="text-3xl font-bold text-slate-900">6,800 L</p>
            <p className="text-xs text-slate-500">Next 30 days</p>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Consumption Trend</h3>
          </div>

          <div className="w-full h-80 -mx-6 -mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDashboardData.consumption} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value.toLocaleString()} L`, 'Usage']}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Smart Recommendation</p>
              <p className="text-sm text-amber-700 mt-1">
                Based on your consumption pattern, you may require a refill within 7 days. Consider placing an order now to avoid delays.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

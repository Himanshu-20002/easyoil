import React from 'react';
import { Card } from './Card';
import { mockDashboardData } from '@/lib/dashboard-mock-data';
import { TrendingUp, TrendingDown, DollarSign, Droplet, Gift, ShoppingCart, Zap } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  unit?: string;
}

function KPICard({ title, value, trend, icon, unit }: KPICardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            {typeof value === 'number' 
              ? title.includes('Spend') || title.includes('Savings')
                ? `₹${(value / 1000).toFixed(0)}K`
                : `${value.toLocaleString()}`
              : value
            }
          </p>
          {unit && <span className="text-sm text-slate-600">{unit}</span>}
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(trend)}% {isPositive ? 'increase' : 'decrease'}
          </div>
        )}
      </div>
    </Card>
  );
}

export function BusinessInsights() {
  const { kpis } = mockDashboardData;

  return (
    <div id="kpis" className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Insights & KPIs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Monthly Spend"
          value={kpis.monthlySpend}
          trend={kpis.monthlySpendTrend}
          icon={<DollarSign className="w-5 h-5" />}
        />

        <KPICard
          title="Fuel Purchased"
          value={kpis.fuelPurchased}
          trend={kpis.fuelPurchasedTrend}
          icon={<Droplet className="w-5 h-5" />}
          unit="Litres"
        />

        <KPICard
          title="Savings Achieved"
          value={kpis.savingsAchieved}
          trend={kpis.savingsTrend}
          icon={<Gift className="w-5 h-5" />}
        />

        <KPICard
          title="Orders This Month"
          value={kpis.ordersThisMonth}
          trend={kpis.ordersTrend}
          icon={<ShoppingCart className="w-5 h-5" />}
        />

        <KPICard
          title="Avg Delivery Time"
          value={`${kpis.averageDeliveryTime} days`}
          icon={<Zap className="w-5 h-5" />}
        />

        <Card>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-600">Performance Rating</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${i < 4 ? 'bg-yellow-400' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-slate-900">4.0</p>
            </div>
            <p className="text-xs text-slate-500">Excellent performance this month</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

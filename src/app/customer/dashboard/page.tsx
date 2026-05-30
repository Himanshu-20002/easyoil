'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../../components/dashboard/SummaryCards';
import { QuickActions } from '../../../components/dashboard/QuickActions';
import { ActiveOrders } from '../../../components/dashboard/ActiveOrders';
import { ConsumptionAnalytics } from '../../../components/dashboard/ConsumptionAnalytics';
import { SmartAlerts } from '../../../components/dashboard/SmartAlerts';
import { DocumentCenter } from '../../../components/dashboard/DocumentCenter';
import { BusinessServices } from '../../../components/dashboard/BusinessServices';
import { BusinessInsights } from '../../../components/dashboard/BusinessInsights';
import { Loader2 } from 'lucide-react';

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/applications/current');
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || 'Failed to fetch dashboard data');
        }

        setData(json);
        setLoading(false);
      } catch (err: any) {
        console.error('[v0] Error loading dashboard:', err.message || 'Unknown error');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Loading Dashboard...</p>
      </div>
    );
  }

  const companyName = data?.company?.companyName || 'Fuel Solutions Inc';

  return (
    <DashboardLayout>
      <DashboardHeader companyName={companyName} status="approved" />
      <SummaryCards />
      <QuickActions />
      <ActiveOrders />
      <ConsumptionAnalytics />
      <SmartAlerts />
      <DocumentCenter />
      <BusinessServices />
      <BusinessInsights />
    </DashboardLayout>
  );
}

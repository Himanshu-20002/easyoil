'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/brand/Header';
import { Footer } from '../../../components/brand/Footer';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Shield, Users, ClipboardList, Database, Download, 
  FileText, Activity, Loader2, RefreshCw, CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/officer/applications'); // Re-use officer applications list for Admin
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error fetching details');
      
      setData(json);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const triggerSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Seeding failed');
      alert(json.message);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Seeding error');
    } finally {
      setSeeding(false);
    }
  };

  // Dynamically export report
  const triggerExport = async (format: 'excel' | 'pdf') => {
    try {
      // Lazy load the services on client side
      const { exportToExcel, exportToPDF } = await import('../../../services/exportServices');
      if (format === 'excel') {
        exportToExcel(data?.applications || []);
      } else {
        exportToPDF(data?.applications || []);
      }
    } catch (err: any) {
      alert('Error during report generation: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-iocl-blue animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Loading Executive Administration...</p>
      </div>
    );
  }

  const { applications, officers } = data || {};

  // Process data for charts
  const statusCounts: Record<string, number> = {
    draft: 0,
    submitted: 0,
    under_review: 0,
    correction_required: 0,
    approved: 0,
    rejected: 0
  };

  applications?.forEach((app: any) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  });

  const barData = Object.keys(statusCounts).map(status => ({
    name: status.toUpperCase().replace('_', ' '),
    count: statusCounts[status]
  }));

  const COLORS = ['#94a3b8', '#f97316', '#0284c7', '#eab308', '#22c55e', '#ef4444'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Title and config buttons */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">IOCL Executive Control Room</h2>
            <p className="text-slate-500 text-xs font-semibold mt-1">Platform analytics, sales officer workflows, audit trails, and reporting services.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={triggerSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Reset & Seed Database'}
            </button>
            <button
              onClick={fetchAdminData}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-iocl-blue/10 text-iocl-blue flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Deals</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{applications?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-iocl-orange/10 text-iocl-orange flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sales Officers</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{officers?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved Partners</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{statusCounts.approved}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Reviews</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{statusCounts.under_review + statusCounts.submitted}</p>
            </div>
          </div>
        </div>

        {/* Charts & Interactive Reporting Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recharts Bar chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Partner Onboarding Pipeline</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#0054A6" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reporting Panel & Export Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Reporting Services</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Download structured data streams compiling partner profiles, verified compliance flags, logistics requirements, and assigned officer pipelines.
              </p>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => triggerExport('excel')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-green-600" /> Excel Spreadsheet Report
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => triggerExport('pdf')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-red-600" /> PDF Executive Audit Report
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold text-center italic mt-6 border-t border-slate-100 pt-4">
              * Reports are compiled live from active MongoDB databases.
            </p>
          </div>
        </div>

        {/* Administration Table list */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <h3 className="text-base font-extrabold text-slate-800 mb-4 uppercase tracking-wider">System-wide Customer Pipelines</h3>
          
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                <th className="py-3 px-2">IOCL ID</th>
                <th className="py-3 px-2">Corporate Partner</th>
                <th className="py-3 px-2">Product Demand</th>
                <th className="py-3 px-2">Assigned Officer</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app: any) => (
                <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-2 font-bold text-slate-800">{app.applicationId}</td>
                  <td className="py-4 px-2">
                    <p className="font-bold text-slate-900">{app.companyRef?.companyName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{app.companyRef?.state} • Contact: {app.companyRef?.contactPerson}</p>
                  </td>
                  <td className="py-4 px-2 font-bold text-slate-800">{app.productType} ({Number(app.quantity).toLocaleString()} L)</td>
                  <td className="py-4 px-2 text-slate-500 font-semibold">{app.assignedOfficer?.name || 'Unassigned'}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${app.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}

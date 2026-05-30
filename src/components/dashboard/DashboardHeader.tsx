import React from 'react';
import { Badge } from './Badge';
import { Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  companyName?: string;
  status?: 'approved' | 'verified' | 'pending';
}

export function DashboardHeader({ 
  companyName = 'Fuel Solutions Inc',
  status = 'approved'
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Welcome back, <span className="text-blue-600">{companyName}</span>
          </h1>
          <p className="text-slate-600 mt-2">Manage your fuel procurement and business operations</p>
        </div>

        {/* User menu and notifications */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <User className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="success" size="sm">
          ✓ Account Approved
        </Badge>
        <Badge variant="info" size="sm">
          ✓ KYC Verified
        </Badge>
        <Badge variant="success" size="sm">
          ✓ GST Verified
        </Badge>
      </div>
    </div>
  );
}

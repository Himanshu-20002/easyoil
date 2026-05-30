import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { mockDashboardData } from '@/lib/dashboard-mock-data';
import { Download, Truck, Eye } from 'lucide-react';

export function ActiveOrders() {
  const getStatusBadgeVariant = (status: string): 'info' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'processing':
        return 'info';
      case 'in_transit':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <div id="orders" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Active Orders</h2>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          View All Orders →
        </a>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Delivery ETA</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDashboardData.orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="py-3 px-4 text-slate-700">{order.product}</td>
                    <td className="py-3 px-4 text-slate-700">{order.quantity.toLocaleString()} L</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {new Date(order.deliveryETA).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Track Order">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download Invoice">
                          <Download className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {mockDashboardData.orders.map((order) => (
          <Card key={order.id}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900">{order.id}</p>
                <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 text-xs font-semibold">Product</p>
                  <p className="text-slate-900 font-semibold mt-1">{order.product}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs font-semibold">Quantity</p>
                  <p className="text-slate-900 font-semibold mt-1">{order.quantity.toLocaleString()} L</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs font-semibold">Delivery ETA</p>
                  <p className="text-slate-900 font-semibold mt-1">
                    {new Date(order.deliveryETA).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors">
                  <Truck className="w-4 h-4" />
                  Track
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

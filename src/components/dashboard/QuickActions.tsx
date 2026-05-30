import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Fuel, Truck, Star, MapPin, DollarSign, ArrowRight } from 'lucide-react';

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <div id="buy-fuel" className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Fuel Card */}
        <Card variant="elevated">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Fuel className="w-6 h-6 text-blue-500" />
                Buy Fuel
              </h3>
            </div>

            <div className="space-y-3">
              {['Diesel (HSD)', 'Light Diesel Oil (LDO)', 'Bitumen'].map((product, idx) => (
                <div
                  key={product}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-slate-800">{product}</p>
                  <p className="text-xs text-slate-500 mt-1">Industrial grade fuel</p>
                </div>
              ))}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              Get Instant Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Find Transporters Card */}
        <Card variant="elevated">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-500" />
                Find Transporters
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { name: 'FuelExpress Logistics', rating: 4.8, fleet: 150 },
                { name: 'TransportHub Pro', rating: 4.6, fleet: 200 },
                { name: 'Regional Haulers', rating: 4.5, fleet: 85 }
              ].map((transporter) => (
                <div key={transporter.name} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{transporter.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {transporter.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {transporter.fleet} vehicles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              Book Transport
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

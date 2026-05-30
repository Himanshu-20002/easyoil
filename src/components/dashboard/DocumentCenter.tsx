import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { FileText, Download, Eye, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'certificate' | 'document';
  status: 'verified' | 'pending' | 'expired';
  date: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Invoice #231', type: 'invoice', status: 'verified', date: '2026-05-28' },
  { id: '2', name: 'GST Certificate', type: 'certificate', status: 'verified', date: '2026-05-01' },
  { id: '3', name: 'Delivery Report #ORD-001', type: 'document', status: 'verified', date: '2026-05-24' },
  { id: '4', name: 'Insurance Policy', type: 'certificate', status: 'pending', date: '2026-05-30' },
  { id: '5', name: 'KYC Document', type: 'document', status: 'verified', date: '2026-04-15' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
    case 'expired':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
}

function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'pending':
      return 'Pending';
    case 'expired':
      return 'Expired';
    default:
      return status;
  }
}

export function DocumentCenter() {
  return (
    <div id="documents" className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Center</h2>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Document</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-900">{doc.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 capitalize">{doc.type}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {new Date(doc.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(doc.status)} size="sm">
                        {getStatusLabel(doc.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
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
        {mockDocuments.map((doc) => (
          <Card key={doc.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(doc.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(doc.status)} size="sm">
                  {getStatusLabel(doc.status)}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../../components/brand/Header';
import { Footer } from '../../../components/brand/Footer';
import {
  FileText, Fuel, Clock, AlertTriangle, CheckCircle,
  Edit3, ArrowRight, Loader2
} from 'lucide-react';

import { Building2 } from 'lucide-react';

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
        console.error(err.message || 'Error occurred loading dashboard');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusBanner = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="bg-green-500 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-green-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Application Approved</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Welcome to EasyOil B2B Partner Network!</h2>
              <p className="text-xs font-semibold text-green-100 mt-2">Your commercial account is successfully active. You are cleared to place bulk commercial purchases.</p>
            </div>
            <div className="bg-green-600 px-6 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-green-200 uppercase tracking-widest font-bold">Partner Status</span>
              <p className="text-lg font-extrabold uppercase mt-0.5">Approved</p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-500 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Application Rejected</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Compliance Review Unsuccessful</h2>
              <p className="text-xs font-semibold text-red-100 mt-2">Unfortunately, compliance documentation or credit evaluation did not meet criteria.</p>
            </div>
            <div className="bg-red-600 px-6 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-red-200 uppercase tracking-widest font-bold">Partner Status</span>
              <p className="text-lg font-extrabold uppercase mt-0.5">Rejected</p>
            </div>
          </div>
        );
      case 'correction_required':
        return (
          <div className="bg-amber-500 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-amber-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Action Required</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Correction Details Requested</h2>
              <p className="text-xs font-semibold text-amber-100 mt-2">One or more uploaded compliance certificates are rejected or blurred. Re-upload details to proceed.</p>
            </div>
            <Link
              href="/customer/apply"
              className="bg-white text-amber-600 hover:bg-slate-50 px-6 py-3 rounded-2xl text-center font-extrabold text-sm shadow-md transition-colors"
            >
              Resolve Action Items
            </Link>
          </div>
        );
      case 'submitted':
        return (
          <div className="bg-iocl-blue text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-blue-800 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Under Verification</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Application Received Successfully</h2>
              <p className="text-xs font-semibold text-blue-100 mt-2">EasyOil Sales Officers are actively verifying uploaded files. Track details below.</p>
            </div>
            <div className="bg-blue-800 px-6 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Review Status</span>
              <p className="text-lg font-extrabold uppercase mt-0.5">Submitted</p>
            </div>
          </div>
        );
      case 'under_review':
        return (
          <div className="bg-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-sky-800 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Under Active Review</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Officer Review in Progress</h2>
              <p className="text-xs font-semibold text-sky-100 mt-2">Your documentation is currently under verification by the designated Sales Officer.</p>
            </div>
            <div className="bg-sky-800 px-6 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-sky-200 tracking-widest font-bold">Review Status</span>
              <p className="text-lg font-extrabold uppercase mt-0.5">Under Review</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-slate-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-slate-800 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Draft Profile</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">Complete Your Onboarding Form</h2>
              <p className="text-xs font-semibold text-slate-300 mt-2">Fill requirements, upload legal certificates, and click Submit to trigger evaluation.</p>
            </div>
            <Link
              href="/customer/apply"
              className="bg-iocl-orange hover:bg-iocl-orange/95 text-white px-6 py-3 rounded-2xl text-center font-extrabold text-sm shadow-md transition-colors"
            >
              Complete Application
            </Link>
          </div>
        );
    }
  };

  const getDocStatusIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-iocl-blue animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Loading Workspace...</p>
      </div>
    );
  }

  const { company, application, documents } = data || {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Status Display banner */}
        {application && getStatusBanner(application.status)}

        {/* Workspace Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

          {/* Company Details Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-iocl-blue" />
                Corporate Entity Details
              </h3>
              {application?.status === 'draft' || application?.status === 'correction_required' ? (
                <Link
                  href="/customer/apply"
                  className="text-xs text-iocl-orange font-extrabold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Modify Info
                </Link>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">Company Name</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.companyName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">Firm constitution</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.firmType}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">GSTIN Number</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.gst}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">PAN Number</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.pan}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">Contact Person</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.contactPerson}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider">Official Email / Mobile</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.email} / {company?.mobile}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-400 font-bold uppercase tracking-wider">Office Address</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{company?.address}, {company?.district}, {company?.state} - {company?.pincode}</p>
              </div>
            </div>

            {/* Logistics Requirements */}
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                <Fuel className="w-5 h-5 text-iocl-blue" />
                Product Logistics Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider">Target Fuel Category</p>
                  <p className="text-slate-800 text-sm font-bold mt-0.5">
                    {application?.productType === 'HSD' ? 'High Speed Diesel (HSD)' : application?.productType === 'LDO' ? 'Light Diesel Oil (LDO)' : 'Bitumen'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider">Monthly Required Volume</p>
                  <p className="text-slate-800 text-sm font-bold mt-0.5">{Number(application?.quantity).toLocaleString()} Litres/MT</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider">Delivery Facility Location</p>
                  <p className="text-slate-800 text-sm font-bold mt-0.5">{application?.location || 'Depot'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider">Requirement Commences</p>
                  <p className="text-slate-800 text-sm font-bold mt-0.5">{application?.requirementStartDate ? new Date(application.requirementStartDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Checklist Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
                <FileText className="w-5 h-5 text-iocl-blue" />
                Document Audit Trails
              </h3>

              <div className="space-y-4">
                {['request_letter', 'gst_certificate', 'pan_card'].map((type) => {
                  const doc = documents?.find((d: any) => d.fileType === type);
                  return (
                    <div key={type} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-700 capitalize">{type.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">{doc ? doc.fileName : 'Not uploaded'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocStatusIcon(doc?.verificationStatus)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {application?.status === 'draft' || application?.status === 'correction_required' ? (
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link
                  href="/customer/apply"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-white font-extrabold text-xs iocl-gradient-orange shadow-md hover:brightness-110 active:brightness-95 transition-all"
                >
                  Enter Form Editor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : null}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

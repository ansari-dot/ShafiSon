import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare, DollarSign, AlertCircle } from 'lucide-react';
import { apiGet } from '@/src/lib/api';

type Consultation = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  consultationType: 'curtains' | 'blinds' | 'upholstery' | 'interior' | 'commercial';
  preferredDate: string;
  preferredTime: string;
  projectDetails: string;
  budget: string;
  urgency: 'flexible' | '1-month' | '2-weeks' | 'urgent';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  submittedAt: string;
  notes?: string;
  createdAt: string;
};

const consultationTypeLabels = {
  curtains: 'Curtain Design',
  blinds: 'Blinds & Shades',
  upholstery: 'Upholstery Services',
  interior: 'Complete Interior Design',
  commercial: 'Commercial Projects'
};

const budgetLabels = {
  'under-25k': 'Under PKR 25,000',
  '25k-50k': 'PKR 25,000 - 50,000',
  '50k-100k': 'PKR 50,000 - 100,000',
  '100k-200k': 'PKR 100,000 - 200,000',
  '200k-plus': 'PKR 200,000+'
};

const urgencyLabels = {
  flexible: 'Flexible timeline',
  '1-month': 'Within 1 month',
  '2-weeks': 'Within 2 weeks',
  urgent: 'Urgent (ASAP)'
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-50 text-yellow-600';
    case 'confirmed': return 'bg-blue-50 text-blue-600';
    case 'completed': return 'bg-emerald-50 text-emerald-600';
    case 'cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-600';
  }
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'urgent': return 'bg-red-50 text-red-600';
    case '2-weeks': return 'bg-orange-50 text-orange-600';
    case '1-month': return 'bg-yellow-50 text-yellow-600';
    default: return 'bg-gray-50 text-gray-600';
  }
}

export default function Consultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    apiGet<{ consultations: Consultation[] }>('/api/consultations')
      .then((data) => setConsultations(Array.isArray(data.consultations) ? data.consultations : []))
      .catch(() => setConsultations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Interior Consultations
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultations List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-5 text-sm text-slate-500">Loading consultations...</div>
            ) : consultations.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">No consultation requests yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {consultations.map((consultation) => (
                  <div 
                    key={consultation._id} 
                    className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedConsultation?._id === consultation._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{consultation.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={12} />
                            {consultation.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatRelativeTime(consultation.createdAt)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pl-13">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {consultationTypeLabels[consultation.consultationType]}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${getUrgencyColor(consultation.urgency)}`}>
                          {urgencyLabels[consultation.urgency]}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(consultation.preferredDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {consultation.preferredTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          {consultation.phone}
                        </div>
                      </div>
                      
                      {consultation.projectDetails && (
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {consultation.projectDetails}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Consultation Details */}
        <div className="lg:col-span-1">
          {selectedConsultation ? (
            <div className="bg-white border border-black/10 rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Consultation Details</h3>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getStatusColor(selectedConsultation.status)}`}>
                  {selectedConsultation.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Client</span>
                  </div>
                  <p className="text-sm text-slate-900 font-semibold">{selectedConsultation.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Email</span>
                  </div>
                  <p className="text-sm text-slate-600">{selectedConsultation.email}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Phone</span>
                  </div>
                  <p className="text-sm text-slate-600">{selectedConsultation.phone}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Address</span>
                  </div>
                  <p className="text-sm text-slate-600">{selectedConsultation.address}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Preferred Date & Time</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {formatDate(selectedConsultation.preferredDate)} at {selectedConsultation.preferredTime}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-700">Service Type</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {consultationTypeLabels[selectedConsultation.consultationType]}
                  </p>
                </div>

                {selectedConsultation.budget && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Budget</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {budgetLabels[selectedConsultation.budget as keyof typeof budgetLabels] || selectedConsultation.budget}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Urgency</span>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getUrgencyColor(selectedConsultation.urgency)}`}>
                    {urgencyLabels[selectedConsultation.urgency]}
                  </span>
                </div>

                {selectedConsultation.projectDetails && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Project Details</span>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                      {selectedConsultation.projectDetails}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Submitted {formatRelativeTime(selectedConsultation.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-black/10 rounded-lg shadow-sm p-5">
              <div className="text-center text-slate-400">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a consultation to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
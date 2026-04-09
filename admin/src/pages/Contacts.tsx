import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User } from 'lucide-react';
import { apiGet } from '@/src/lib/api';

type ContactLead = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  topic?: string;
  message: string;
  status: 'New' | 'Replied';
  createdAt: string;
};

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

export default function Contacts() {
  const [messages, setMessages] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<ContactLead[]>('/api/contacts')
      .then((list) => setMessages(Array.isArray(list) ? list : []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Contacts & Leads
      </motion.h1>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 text-sm text-slate-500">Loading contacts...</div>
        ) : messages.length === 0 ? (
          <div className="p-5 text-sm text-slate-500">No contact messages yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg._id} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{msg.firstName} {msg.lastName}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Mail size={12} />
                        {msg.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">{formatRelativeTime(msg.createdAt)}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                        msg.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </div>
                <div className="pl-13">
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">{msg.topic || 'General Inquiry'}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

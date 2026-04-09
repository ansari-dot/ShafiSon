import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, User, Clock, CheckCircle } from 'lucide-react';

const MESSAGES = [
  { id: 1, name: 'Ahmed Ali', email: 'ahmed.a@example.com', subject: 'Bulk Order Inquiry', time: '3 hours ago', status: 'New' },
  { id: 2, name: 'Sana Malik', email: 'sana.m@example.com', subject: 'Product Availability', time: '5 hours ago', status: 'Replied' },
  { id: 3, name: 'Kamran Khan', email: 'kamran.k@example.com', subject: 'Shipping Delay', time: '1 day ago', status: 'New' },
];

export default function Contacts() {
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
        <div className="divide-y divide-slate-100">
          {MESSAGES.map((msg) => (
            <div key={msg.id} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail size={12} />
                      {msg.email}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                    msg.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              </div>
              <div className="pl-13">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">{msg.subject}</h4>
                <p className="text-sm text-slate-500 line-clamp-1">
                  I am interested in placing a bulk order for your Blue Velvet Sofa Fabric. Could you please provide...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

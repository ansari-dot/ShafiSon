import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Mail, Calendar } from 'lucide-react';
import { apiGet } from '@/src/lib/api';

type Subscriber = {
  _id: string;
  name: string;
  email: string;
  source?: string;
  active?: boolean;
  createdAt?: string;
};

export default function Customers() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    apiGet<Subscriber[]>('/api/subscribers')
      .then((list) => setRows(Array.isArray(list) ? list : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) =>
      [s.name, s.email, s.source].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Subscribers
        </motion.h1>
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[320px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
            />
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-slate-500">Loading subscribers...</div>}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Source</th>
                  <th className="px-6 py-4 font-bold">Subscribed At</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{s.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        {s.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.source || 'newsletter'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={13} className="text-slate-400" />
                        {s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${s.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-sm text-slate-400 text-center">No subscribers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

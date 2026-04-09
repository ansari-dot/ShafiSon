import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { apiGet } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';

type ReportPoint = {
  date: string;
  name: string;
  sales: number;
  orders: number;
};

type ReportResponse = {
  days: number;
  data: ReportPoint[];
};

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'Last 180 Days', value: 180 },
  { label: 'Last 365 Days', value: 365 },
];

const STORAGE_KEY = 'admin_reports_range_days';

export default function Reports() {
  const [days, setDays] = useState<number>(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY) || 180);
    return [7, 30, 90, 180, 365].includes(saved) ? saved : 180;
  });
  const [rows, setRows] = useState<ReportPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(days));
  }, [days]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    apiGet<ReportResponse>(`/api/reports?days=${days}`)
      .then((res) => {
        if (!active) return;
        setRows(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err: Error) => {
        if (!active) return;
        setRows([]);
        setError(err.message || 'Failed to load reports');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const summary = useMemo(() => {
    const totalSales = rows.reduce((sum, r) => sum + (r.sales || 0), 0);
    const totalOrders = rows.reduce((sum, r) => sum + (r.orders || 0), 0);

    const half = Math.floor(rows.length / 2);
    const prev = rows.slice(0, half);
    const curr = rows.slice(half);

    const prevSales = prev.reduce((sum, r) => sum + (r.sales || 0), 0);
    const currSales = curr.reduce((sum, r) => sum + (r.sales || 0), 0);
    const salesGrowth = prevSales === 0 ? 0 : ((currSales - prevSales) / prevSales) * 100;

    return { totalSales, totalOrders, salesGrowth };
  }, [rows]);

  const exportCsv = () => {
    const header = ['Date', 'Label', 'Sales', 'Orders'];
    const lines = rows.map((r) => [r.date, r.name, String(r.sales || 0), String(r.orders || 0)]);
    const csv = [header, ...lines].map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `reports-${days}d-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Analytics & Reports
        </motion.h1>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-md flex items-center gap-2 font-medium">
            <Calendar size={18} />
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-sm"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-black/10 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-slate-500">Total Revenue</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatPKR(summary.totalSales)}</div>
        </div>
        <div className="bg-white border border-black/10 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-slate-500">Total Paid Orders</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{summary.totalOrders}</div>
        </div>
        <div className="bg-white border border-black/10 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-slate-500">Revenue Trend</div>
          <div className={`text-xl font-bold mt-1 ${summary.salesGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {summary.salesGrowth >= 0 ? '+' : ''}{summary.salesGrowth.toFixed(1)}%
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading reports...</div>}
      {error && !loading && <div className="text-sm text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6">Revenue Growth</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0969da" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0969da" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `Rs${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(value: number) => [formatPKR(value), 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="#0969da" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6">Order Volume</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [String(value), 'Orders']} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

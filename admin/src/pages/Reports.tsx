import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const DATA = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 2000, orders: 150 },
  { name: 'Apr', sales: 2780, orders: 210 },
  { name: 'May', sales: 1890, orders: 120 },
  { name: 'Jun', sales: 2390, orders: 180 },
  { name: 'Jul', sales: 3490, orders: 250 },
];

export default function Reports() {
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
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            Last 7 Days
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6">Revenue Growth</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0969da" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0969da" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#0969da" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6">Order Volume</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

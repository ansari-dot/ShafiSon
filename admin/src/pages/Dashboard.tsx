import React, { useEffect, useMemo, useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Image as ImageIcon,
  AlertCircle,
  MessageCircle,
  Mail,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { apiGet } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isUp: boolean;
  };
  footerText?: string;
  iconBg?: string;
  iconColor?: string;
}

interface Order {
  id: string;
  customer: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
}

const MetricCard = ({ title, value, icon: Icon, trend, footerText, iconBg, iconColor }: MetricCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-black/10 rounded-lg p-5 flex flex-col gap-3 shadow-sm"
  >
    <div className="flex justify-between items-center text-slate-500">
      <span className="text-sm font-medium">{title}</span>
      <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", iconBg || "bg-slate-100", iconColor || "text-slate-900")}>
        <Icon size={16} />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-xs flex items-center gap-1.5">
      {trend && (
        <span className={cn("font-semibold", trend.isUp ? "text-emerald-600" : "text-red-600")}>
          {trend.value}
        </span>
      )}
      <span className="text-slate-500">{footerText}</span>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-blue-50 text-blue-700",
    Shipped: "bg-emerald-50 text-emerald-700",
    Delivered: "bg-indigo-50 text-indigo-700",
    Cancelled: "bg-slate-50 text-slate-500",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", styles[status])}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    apiGet('/api/dashboard')
      .then((data) => {
        setMetrics(data.metrics);
        setSalesData(data.salesData || []);
        setRecentOrders(data.recentOrders || []);
        setActivity(data.activityFeed || []);
      })
      .catch(() => {
        setMetrics(null);
      });
  }, []);

  const orderTrendText = metrics ? `${metrics.orderTrend >= 0 ? '+' : ''}${metrics.orderTrend.toFixed(1)}%` : '';
  const revenueTrendText = metrics ? `${metrics.revenueTrend >= 0 ? '+' : ''}${metrics.revenueTrend.toFixed(1)}%` : '';

  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Dashboard Overview
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <MetricCard 
          title="Total Orders" 
          value={metrics ? String(metrics.totalOrders) : '�'} 
          icon={ShoppingBag} 
          trend={metrics ? { value: orderTrendText, isUp: metrics.orderTrend >= 0 } : undefined}
          footerText="from last month"
        />
        <MetricCard 
          title="Total Revenue" 
          value={metrics ? formatPKR(metrics.totalRevenue) : '�'} 
          icon={DollarSign} 
          trend={metrics ? { value: revenueTrendText, isUp: metrics.revenueTrend >= 0 } : undefined}
          footerText="from last month"
        />
        <MetricCard 
          title="Pending Orders" 
          value={metrics ? String(metrics.pendingOrders) : '�'} 
          icon={Clock} 
          footerText="Needs attention today"
        />
        <MetricCard 
          title="Low Stock Items" 
          value={metrics ? String(metrics.lowStock) : '�'} 
          icon={AlertTriangle} 
          iconBg="bg-red-50" 
          iconColor="text-red-600"
          footerText="Requires restock"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 min-w-0 bg-white border border-black/10 rounded-lg shadow-sm flex flex-col"
        >
          <div className="p-5 border-b border-black/10 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Sales Summary</h2>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View Report</button>
          </div>
          <div className="p-5 h-[300px] min-h-[300px] w-full min-w-0">
            {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `Rs${value/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={32}>
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#0969da" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-black/10 rounded-lg shadow-sm flex flex-col"
        >
          <div className="p-5 border-b border-black/10">
            <h2 className="font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <button className="flex items-center gap-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors text-slate-900 font-medium text-sm group">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={16} />
              </div>
              Add New Product
            </button>
            <button className="flex items-center gap-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors text-slate-900 font-medium text-sm group">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <Tag size={16} />
              </div>
              Create Discount
            </button>
            <button className="flex items-center gap-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors text-slate-900 font-medium text-sm group">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon size={16} />
              </div>
              Post Homepage Banner
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-black/10 rounded-lg shadow-sm flex flex-col"
        >
          <div className="p-5 border-b border-black/10 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Latest Activity Feed</h2>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-5 flex flex-col gap-6">
            {activity.map((a, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", a.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')}>
                  {a.type === 'alert' ? (<AlertCircle size={18} />) : a.type === 'contact' ? (<MessageCircle size={18} />) : a.type === 'subscriber' ? (<Mail size={18} />) : (<ShoppingCart size={18} />)}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-700 leading-relaxed">{a.text}</p>
                  <span className="text-xs text-slate-400 mt-1">{a.time}</span>
                </div>
              </div>
            ))}
            {activity.length === 0 && <div className="text-sm text-slate-400">No recent activity.</div>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-black/10 rounded-lg shadow-sm flex flex-col"
        >
          <div className="p-5 border-b border-black/10 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View Orders</button>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-semibold text-slate-900">{order.id}</td>
                    <td className="py-4 text-sm text-slate-600">{order.customer}</td>
                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-900 text-right">{formatPKR(order.total || 0)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-slate-400">No recent orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

    </div>
  );
}



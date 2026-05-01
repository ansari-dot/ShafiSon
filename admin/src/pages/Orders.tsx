import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, ShoppingBag, CheckCircle, Truck, Clock, Eye, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { apiGet, apiPut, apiDelete } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Confirmed: "bg-blue-50 text-blue-700",
    Shipped: "bg-indigo-50 text-indigo-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-slate-50 text-slate-500",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", styles[status] || styles.Pending)}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-rose-50 text-rose-700",
    Cancelled: "bg-slate-50 text-slate-500",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", styles[status] || styles.Pending)}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deletingStatus, setDeletingStatus] = useState(false);

  useEffect(() => {
    apiGet('/api/orders')
      .then((res: any) => setOrders(Array.isArray(res) ? res : Array.isArray(res?.orders) ? res.orders : []))
      .catch(() => setOrders([]));
  }, []);

  const refreshOrders = () => {
    apiGet('/api/orders')
      .then((res: any) => setOrders(Array.isArray(res) ? res : Array.isArray(res?.orders) ? res.orders : []))
      .catch(() => setOrders([]));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      String(o.orderCode || '').toLowerCase().includes(q) ||
      String(o.customer?.firstName || '').toLowerCase().includes(q) ||
      String(o.customer?.lastName || '').toLowerCase().includes(q)
    );
  }, [orders, search]);

  const stats = useMemo(() => {
    const all = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    return [
      { label: 'All Orders', value: all, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Shipped', value: shipped, icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Completed', value: delivered, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
  }, [orders]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Orders
        </motion.h1>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            Create Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-black/10 flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              <div className="text-xl font-bold text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Order Status</th>
                <th className="px-6 py-4 font-bold">Payment Status</th>
                <th className="px-6 py-4 font-bold text-right">Total</th>
                <th className="px-6 py-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{order.orderCode}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={order.paymentStatus || "Pending"} />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatPKR(order.total || 0)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                      onClick={() => setSelected(order)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Order {selected.orderCode}</h3>
                <p className="text-sm text-slate-500">Placed {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-2">Customer</h4>
                <div className="text-sm text-slate-600">
                  <div>First name: <span className="font-semibold text-slate-900">{selected.customer?.firstName || '—'}</span></div>
                  <div>Last name: <span className="font-semibold text-slate-900">{selected.customer?.lastName || '—'}</span></div>
                  {selected.customer?.company && (
                    <div>Company: <span className="font-semibold text-slate-900">{selected.customer.company}</span></div>
                  )}
                  <div>Email: <span className="font-semibold text-slate-900">{selected.customer?.email || '—'}</span></div>
                  <div>Phone: <span className="font-semibold text-slate-900">{selected.customer?.phone || '—'}</span></div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  <div>{selected.customer?.address1}</div>
                  {selected.customer?.address2 && <div>{selected.customer?.address2}</div>}
                  <div>{selected.customer?.city} {selected.customer?.state}</div>
                  <div>{selected.customer?.postalCode} {selected.customer?.country}</div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-2">Payment</h4>
                <div className="text-sm text-slate-600">
                  <div>Payment Status: <span className="font-semibold text-slate-900">{selected.paymentStatus}</span></div>
                  <div>Provider: {selected.paymentProvider}</div>
                  <div>Coupon: {selected.couponCode || '—'}</div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-500">Order Status</label>
                  <div className="mt-2 flex items-center gap-2">
                    <select
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      value={selected.status}
                      onChange={(e) => setSelected({ ...selected, status: e.target.value })}
                    >
                      {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white"
                      disabled={savingStatus || deletingStatus}
                      onClick={async () => {
                        setSavingStatus(true);
                        try {
                          const updated = await apiPut(`/api/orders/${selected.orderCode}/status`, { status: selected.status });
                          setSelected(updated);
                          refreshOrders();
                        } finally {
                          setSavingStatus(false);
                        }
                      }}
                    >
                      {savingStatus ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="px-3 py-2 text-sm rounded-md bg-rose-600 text-white hover:bg-rose-700"
                      disabled={deletingStatus || savingStatus}
                      onClick={async () => {
                        if (!window.confirm('Delete this order? This cannot be undone.')) return;
                        setDeletingStatus(true);
                        try {
                          await apiDelete(`/api/orders/${selected.orderCode}`);
                          setSelected(null);
                          refreshOrders();
                        } catch (err) {
                          window.alert(err?.message || 'Failed to delete order');
                        } finally {
                          setDeletingStatus(false);
                        }
                      }}
                    >
                      {deletingStatus ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  <div>Subtotal: <strong className="text-slate-900">{formatPKR(selected.subtotal || 0)}</strong></div>
                  <div>Discount: <strong className="text-slate-900">{formatPKR(selected.discount || 0)}</strong></div>
                  <div>Total: <strong className="text-slate-900">{formatPKR(selected.total || 0)}</strong></div>
                </div>
              </div>
              <div className="md:col-span-2 bg-white border border-slate-100 rounded-lg">
                <div className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-900">Items</div>
                <div className="divide-y divide-slate-100">
                  {(selected.items || []).map((item: any, idx: number) => {
                    const unitLabel = String(item.priceUnit || 'per yard');
                    return (
                      <div key={idx} className="px-4 py-3 flex items-center gap-3 text-sm">
                        {item.img && (
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                          {item.sku && <div className="text-[11px] font-mono text-slate-400">SKU: {item.sku}</div>}
                          {item.subcategorySerial && <div className="text-[11px] font-mono text-slate-400">Sub-cat #: {item.subcategorySerial}</div>}
                          <div className="text-slate-500">Qty: {item.qty} {unitLabel}</div>
                          {(item.color || item.size) && (
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.color && (
                                <span className="text-slate-500">Pattern: {item.color}</span>
                              )}
                              {item.color && item.size && <span className="text-slate-300">·</span>}
                              {item.size && <span className="text-slate-500">Size: {item.size}</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-slate-900 font-semibold">{formatPKR(item.unitPrice || 0)}</div>
                          {item.originalPrice > item.unitPrice && (
                            <div className="text-slate-400 line-through">{formatPKR(item.originalPrice)}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

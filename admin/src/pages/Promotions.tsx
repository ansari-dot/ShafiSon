import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Tag, Calendar, Users, Percent, Plus, X, Save, Trash2, Search } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';


type Product = {
  _id: string;
  title: string;
  price: number;
};

type Coupon = {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesToAll: boolean;
  productIds: string[];
  startDate?: string | null;
  endDate?: string | null;
  active: boolean;
  usageCount?: number;
};

const emptyForm = {
  code: '',
  type: 'percentage',
  value: '',
  appliesToAll: true,
  productIds: [] as string[],
  startDate: '',
  endDate: '',
  active: true,
};

type FormState = typeof emptyForm;

export default function Promotions() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([apiGet<Coupon[]>('/api/coupons'), apiGet<Product[]>('/api/products')])
      .then(([coupons, prods]) => {
        if (!active) return;
        setItems(Array.isArray(coupons) ? coupons : []);
        setProducts(Array.isArray(prods) ? prods : []);
        setError('');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'Failed to load promotions');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSearch('');
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code || '',
      type: c.type || 'percentage',
      value: String(c.value ?? ''),
      appliesToAll: Boolean(c.appliesToAll),
      productIds: c.productIds || [],
      startDate: c.startDate ? c.startDate.slice(0, 10) : '',
      endDate: c.endDate ? c.endDate.slice(0, 10) : '',
      active: Boolean(c.active),
    });
    setSearch('');
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSaving(false);
  };

  const onChange = (key: keyof FormState, val: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const toggleProduct = (id: string) => {
    setForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value),
      appliesToAll: Boolean(form.appliesToAll),
      productIds: form.appliesToAll ? [] : form.productIds,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      active: Boolean(form.active),
    };

    try {
      if (editing) {
        const updated = await apiPut<Coupon>(`/api/coupons/${editing._id}`, payload);
        setItems((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      } else {
        const created = await apiPost<Coupon>('/api/coupons', payload);
        setItems((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save coupon';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Coupon) => {
    const ok = window.confirm(`Delete "${c.code}"?`);
    if (!ok) return;
    try {
      await apiDelete(`/api/coupons/${c._id}`);
      setItems((prev) => prev.filter((x) => x._id !== c._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete coupon';
      setError(message);
    }
  };

  const displayValue = (c: Coupon) => {
    if (c.type === 'percentage') return `${c.value}%`;
    return formatPKR(c.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Promotions
        </motion.h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Create Promo
        </button>
      </div>

      {loading && <div className="p-6 text-sm text-slate-500">Loading promotions...</div>}
      {error && !loading && <div className="p-6 text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((promo) => (
            <motion.div
              key={promo._id}
              className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-sm flex flex-col"
            >
              <div className="p-5 bg-slate-50 border-b border-black/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-blue-600" />
                  <span className="font-bold text-slate-900">{promo.code}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  promo.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  {promo.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Discount Type</span>
                  <span className="font-semibold text-slate-900">{promo.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Value</span>
                  <span className="font-bold text-blue-600 text-lg">{displayValue(promo)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Applies</span>
                  <span className="font-semibold text-slate-900">
                    {promo.appliesToAll ? 'All Products' : `${promo.productIds.length} products`}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users size={14} />
                    <span>Used {promo.usageCount ?? 0} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(promo)} className="text-slate-400 hover:text-slate-600">
                      <Percent size={16} />
                    </button>
                    <button onClick={() => remove(promo)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Promo' : 'Create Promo'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto" onSubmit={submit}>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Code *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.code} onChange={(e) => onChange('code', e.target.value.toUpperCase())} required />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Type *</label>
                <select className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.type} onChange={(e) => onChange('type', e.target.value as FormState['type'])} required>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Value *</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.value} onChange={(e) => onChange('value', e.target.value)} required />
              </div>
              <div className="col-span-1 flex items-center gap-2 mt-6">
                <input type="checkbox" checked={form.appliesToAll} onChange={(e) => onChange('appliesToAll', e.target.checked)} />
                <span className="text-sm text-slate-700">Applies to all products</span>
              </div>

              {!form.appliesToAll && (
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Select Products</label>
                  <div className="mt-2 border border-slate-200 rounded-md p-3">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 h-9 border border-transparent focus-within:border-blue-500/30 transition-all mb-3">
                      <Search size={16} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search product by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
                      />
                    </div>
                    <div className="max-h-56 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredProducts.map((p) => (
                        <label key={p._id} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={form.productIds.includes(p._id)}
                            onChange={() => toggleProduct(p._id)}
                          />
                          <span className="truncate">{p.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Start Date</label>
                <input type="date" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.startDate} onChange={(e) => onChange('startDate', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">End Date</label>
                <input type="date" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.endDate} onChange={(e) => onChange('endDate', e.target.value)} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => onChange('active', e.target.checked)} />
                <span className="text-sm text-slate-700">Active</span>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

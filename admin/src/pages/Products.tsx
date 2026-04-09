import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, X, Save, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { apiDelete, apiGet, apiPost, apiPut } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';

type Category = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  title: string;
  category: string;
  price: number;
  quantity?: number;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  img?: string;
  createdAt?: string;
  material?: string;
  badge?: string | null;
  color?: string;
  sizes?: string[];
  imgs?: string[];
  description?: string;
  specs?: {
    Dimensions?: string;
    Weight?: string;
    Material?: string;
    Assembly?: string;
    Warranty?: string;
  };
};

const emptyForm = {
  title: '',
  price: '',
  quantity: '',
  category: '',
  material: '',
  img: '',
  imgs: '',
  rating: '',
  reviews: '',
  badge: '',
  color: '',
  sizes: '',
  description: '',
  specDimensions: '',
  specWeight: '',
  specMaterial: '',
  specAssembly: '',
  specWarranty: '',
  inStock: true,
};

type FormState = typeof emptyForm;

function parseImageListInput(input: string): string[] {
  const text = String(input || '');
  if (!text.trim()) return [];

  // Keep full data URLs intact (they include one comma after "base64,").
  const dataUrlRegex = /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g;
  const dataUrls = text.match(dataUrlRegex) || [];
  const rest = text.replace(dataUrlRegex, ' ');
  const urls = rest
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return [...urls, ...dataUrls];
}

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    let active = true;
    Promise.all([apiGet<Product[]>('/api/products'), apiGet<Category[]>('/api/categories')])
      .then(([products, cats]) => {
        if (!active) return;
        setItems(Array.isArray(products) ? products : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setError('');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'Failed to load products');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.title, p.category, p.material].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title || '',
      price: String(p.price ?? ''),
      quantity: String(p.quantity ?? ''),
      category: p.category || '',
      material: p.material || '',
      img: p.img || '',
      imgs: (p.imgs || []).join('\n'),
      rating: String(p.rating ?? ''),
      reviews: String(p.reviews ?? ''),
      badge: p.badge || '',
      color: p.color || '',
      sizes: (p.sizes || []).join(', '),
      description: p.description || '',
      specDimensions: p.specs?.Dimensions || '',
      specWeight: p.specs?.Weight || '',
      specMaterial: p.specs?.Material || '',
      specAssembly: p.specs?.Assembly || '',
      specWarranty: p.specs?.Warranty || '',
      inStock: Boolean(p.inStock),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSaving(false);
  };

  const onChange = (key: keyof FormState, val: string | boolean) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = typeof reader.result === 'string' ? reader.result : '';
        if (!src) return reject(new Error('Invalid image file'));
        const img = new Image();
        img.onload = () => {
          const maxW = 1200;
          const maxH = 1200;
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to process image'));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      onChange('img', dataUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      setError(message);
    }
  };

  const handleGalleryUpload = async (fileList?: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    try {
      const uploaded = await Promise.all(Array.from(fileList).map((f) => compressImageFile(f)));
      setForm((prev) => {
        const existing = parseImageListInput(prev.imgs);
        return { ...prev, imgs: [...existing, ...uploaded].join('\n') };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process gallery images';
      setError(message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      quantity: form.quantity ? Number(form.quantity) : 0,
      category: form.category.trim(),
      material: form.material.trim(),
      img: form.img.trim(),
      imgs: parseImageListInput(form.imgs),
      rating: form.rating ? Number(form.rating) : 0,
      reviews: form.reviews ? Number(form.reviews) : 0,
      badge: form.badge ? form.badge.trim() : null,
      color: form.color ? form.color.trim() : '',
      sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
      description: form.description.trim(),
      specs: {
        Dimensions: form.specDimensions.trim(),
        Weight: form.specWeight.trim(),
        Material: form.specMaterial.trim(),
        Assembly: form.specAssembly.trim(),
        Warranty: form.specWarranty.trim(),
      },
      inStock: Boolean(form.inStock),
    };

    try {
      if (editing) {
        const updated = await apiPut<Product>(`/api/products/${editing._id}`, payload);
        setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      } else {
        const created = await apiPost<Product>('/api/products', payload);
        setItems((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    const ok = window.confirm(`Delete "${p.title}"?`);
    if (!ok) return;
    try {
      await apiDelete(`/api/products/${p._id}`);
      setItems((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Products
        </motion.h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-slate-500">Loading products...</div>}
        {error && !loading && <div className="p-6 text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Qty</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => (
                  <tr key={product._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0">
                          {product.img ? (
                            <img src={product.img} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-slate-200" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatPKR(product.price)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.quantity ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      )}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="text-slate-400 hover:text-slate-600">
                          <MoreVertical size={18} />
                        </button>
                        <button onClick={() => remove(product)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto" onSubmit={submit}>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Title *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.title} onChange={(e) => onChange('title', e.target.value)} required />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Price *</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.price} onChange={(e) => onChange('price', e.target.value)} required />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Quantity</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.quantity} onChange={(e) => onChange('quantity', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Category *</label>
                <select className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.category} onChange={(e) => onChange('category', e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Material *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.material} onChange={(e) => onChange('material', e.target.value)} required />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Main Image URL</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.img} onChange={(e) => onChange('img', e.target.value)} />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                  onChange={(e) => handleMainImageUpload(e.target.files?.[0] || null)}
                />
                <div className="text-[11px] text-slate-400 mt-1">Use URL or upload file (auto-compressed)</div>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Gallery URLs (one per line or comma separated)</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.imgs} onChange={(e) => onChange('imgs', e.target.value)} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                />
                <div className="text-[11px] text-slate-400 mt-1">Use URLs or upload multiple files (upload format stays valid)</div>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Badge</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.badge} onChange={(e) => onChange('badge', e.target.value)} placeholder="New, Sale, Popular" />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Color</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.color} onChange={(e) => onChange('color', e.target.value)} placeholder="e.g. Walnut" />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Rating</label>
                <input type="number" step="0.1" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.rating} onChange={(e) => onChange('rating', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Reviews</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.reviews} onChange={(e) => onChange('reviews', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Sizes (comma separated)</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.sizes} onChange={(e) => onChange('sizes', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={form.description} onChange={(e) => onChange('description', e.target.value)} />
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Spec - Dimensions</label>
                    <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.specDimensions} onChange={(e) => onChange('specDimensions', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Spec - Weight</label>
                    <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.specWeight} onChange={(e) => onChange('specWeight', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Spec - Material</label>
                    <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.specMaterial} onChange={(e) => onChange('specMaterial', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Spec - Assembly</label>
                    <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.specAssembly} onChange={(e) => onChange('specAssembly', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Spec - Warranty</label>
                    <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.specWarranty} onChange={(e) => onChange('specWarranty', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.inStock} onChange={(e) => onChange('inStock', e.target.checked)} />
                <span className="text-sm text-slate-700">In Stock</span>
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




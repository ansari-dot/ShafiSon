import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, X, Save, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { apiDelete, apiGet, apiPost, apiPut } from '@/src/lib/api';
import { formatPKR } from '@/src/lib/formatCurrency';

type Category = {
  _id: string;
  name: string;
  subcategories?: { name: string; serialNumber: string }[];
};

type PatternVariant = { name: string; image: string; hex: string };

type Product = {
  _id: string;
  sku?: string;
  title: string;
  category: string;
  subcategory?: string;
  price: number;
  priceUnit?: string;
  quantity?: number;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  img?: string;
  createdAt?: string;
  material?: string;
  badge?: string | null;
  sizes?: string[];
  imgs?: string[];
  colors?: PatternVariant[];
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
  priceUnit: 'per yard',
  quantity: '',
  category: '',
  subcategory: '',
  material: '',
  img: '',
  badge: '',
  sizes: '',
  description: '',
  specDimensions: '',
  specWeight: '',
  specMaterial: '',
  specAssembly: '',
  specWarranty: '',
  inStock: true,
};

const emptyPattern: PatternVariant = { name: '', image: '', hex: '' };

type FormState = typeof emptyForm;


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
  const [patternVariants, setPatternVariants] = useState<PatternVariant[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([apiGet<any>('/api/products'), apiGet<Category[]>('/api/categories')])
      .then(([res, cats]) => {
        if (!active) return;
        const products = Array.isArray(res) ? res : Array.isArray(res?.products) ? res.products : [];
        setItems(products);
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
      [p.title, p.category, p.material, p.sku].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPatternVariants([]);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setPatternVariants(p.colors && p.colors.length ? p.colors.map((c) => ({ name: c.name, image: c.image, hex: c.hex || '' })) : []);
    setForm({
      title: p.title || '',
      price: String(p.price ?? ''),
      priceUnit: p.priceUnit || 'per yard',
      quantity: String(p.quantity ?? ''),
      category: p.category || '',
      subcategory: p.subcategory || '',
      material: p.material || '',
      img: p.img || '',
      badge: p.badge || '',
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
    setPatternVariants([]);
  };

  const addPatternVariant = () => setPatternVariants((prev) => [...prev, { ...emptyPattern }]);

  const removePatternVariant = (i: number) =>
    setPatternVariants((prev) => prev.filter((_, idx) => idx !== i));

  const updatePatternVariant = (i: number, key: keyof PatternVariant, val: string) =>
    setPatternVariants((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  const handlePatternImageUpload = async (i: number, file?: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      updatePatternVariant(i, 'image', dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process pattern image');
    }
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
          const maxW = 800;
          const maxH = 800;
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to process image'));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      priceUnit: form.priceUnit || 'per yard',
      quantity: form.quantity ? Number(form.quantity) : 0,
      category: form.category.trim(),
      subcategory: form.subcategory.trim(),
      material: form.material.trim(),
      img: form.img.trim(),
      imgs: [],
      badge: form.badge ? form.badge.trim() : null,
      colors: patternVariants.filter((c) => c.name.trim()),
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
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{product.title}</div>
                          {product.sku && <div className="text-[11px] text-slate-400 font-mono">{product.sku}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatPKR(product.price)}<span className="text-xs font-normal text-slate-400 ml-1">{(product as any).priceUnit || 'per yard'}</span></td>
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
                <label className="text-xs font-semibold text-slate-500">SKU (Serial Number)</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono bg-slate-50" value={(editing as any)?.sku || 'Auto-generated'} readOnly />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Title *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.title} onChange={(e) => onChange('title', e.target.value)} required />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Price *</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.price} onChange={(e) => onChange('price', e.target.value)} required />
                  <select className="rounded-md border border-slate-200 px-2 py-2 text-sm shrink-0" value={(form as any).priceUnit || 'per yard'} onChange={(e) => onChange('priceUnit' as any, e.target.value)}>
                    <option value="per yard">/ yard</option>
                    <option value="per meter">/ meter</option>
                    <option value="per piece">/ piece</option>
                    <option value="per roll">/ roll</option>
                    <option value="per set">/ set</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Quantity</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.quantity} onChange={(e) => onChange('quantity', e.target.value)} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Category *</label>
                <select className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.category} onChange={(e) => { onChange('category', e.target.value); onChange('subcategory', ''); }} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Subcategory</label>
                <select className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.subcategory} onChange={(e) => onChange('subcategory', e.target.value)}>
                  <option value="">Select subcategory</option>
                  {(categories.find((c) => c.name === form.category)?.subcategories || []).map((s) => (
                    <option key={s.name} value={s.name}>{s.name}{s.serialNumber ? ` (${s.serialNumber})` : ''}</option>
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
                <label className="text-xs font-semibold text-slate-500">Badge</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.badge} onChange={(e) => onChange('badge', e.target.value)} placeholder="New, Sale, Popular" />
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

              {/* Patterns */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500">Patterns</label>
                  <button type="button" onClick={addPatternVariant} className="text-xs text-blue-600 hover:underline">+ Add Pattern</button>
                </div>
                {patternVariants.map((cv, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 p-2 border border-slate-200 rounded-md">
                    <input
                      className="w-36 rounded-md border border-slate-200 px-2 py-1 text-sm"
                      placeholder="Pattern name"
                      value={cv.name}
                      onChange={(e) => updatePatternVariant(i, 'name', e.target.value)}
                    />
                    {cv.image && (
                      <img src={cv.image} alt={cv.name} className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="flex-1 text-xs"
                      onChange={(e) => handlePatternImageUpload(i, e.target.files?.[0])}
                    />
                    <button type="button" onClick={() => removePatternVariant(i)} className="text-red-500 hover:text-red-700 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
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




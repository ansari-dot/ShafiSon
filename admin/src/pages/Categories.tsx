import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, MoreVertical, Trash2, X, Save } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/src/lib/api';


type Category = {
  _id: string;
  name: string;
  count?: number;
  img?: string;
  subcategories?: { name: string; serialNumber: string }[];
  createdAt?: string;
};

type Subcat = { name: string; serialNumber: string };

const emptyForm = { name: '', count: '', img: '' };

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [subcats, setSubcats] = useState<Subcat[]>([]);

  useEffect(() => {
    let active = true;
    apiGet<Category[]>('/api/categories')
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'Failed to load categories');
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
    return items.filter((c) => c.name.toLowerCase().includes(q));
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSubcats([]);
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name || '', count: String(c.count ?? ''), img: c.img || '' });
    setSubcats((c.subcategories || []).map((s) => ({ name: s.name || '', serialNumber: s.serialNumber || '' })));
    setOpen(true);
  };

  const closeModal = () => { setOpen(false); setSaving(false); setSubcats([]); };

  const onChange = (key: keyof typeof emptyForm, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const addSubcat = () => setSubcats((p) => [...p, { name: '', serialNumber: '' }]);
  const removeSubcat = (i: number) => setSubcats((p) => p.filter((_, idx) => idx !== i));
  const updateSubcat = (i: number, key: keyof Subcat, val: string) =>
    setSubcats((p) => p.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  const compressImageFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.onload = () => {
        const source = typeof reader.result === 'string' ? reader.result : '';
        if (!source) {
          reject(new Error('Invalid image source'));
          return;
        }
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.onload = () => {
          const maxW = 1000;
          const maxH = 1000;
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to process image'));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = source;
      };
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      onChange('img', compressed);
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
      name: form.name.trim(),
      count: form.count ? Number(form.count) : 0,
      img: form.img.trim(),
      subcategories: subcats.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), serialNumber: s.serialNumber.trim() })),
    };

    try {
      if (editing) {
        const updated = await apiPut<Category>(`/api/categories/${editing._id}`, payload);
        setItems((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      } else {
        const created = await apiPost<Category>('/api/categories', payload);
        setItems((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    const ok = window.confirm(`Delete "${c.name}"?`);
    if (!ok) return;
    try {
      await apiDelete(`/api/categories/${c._id}`);
      setItems((prev) => prev.filter((x) => x._id !== c._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
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
          Categories
        </motion.h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-black/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
            />
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-slate-500">Loading categories...</div>}
        {error && !loading && <div className="p-6 text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Subcategories</th>
                  <th className="px-6 py-4 font-bold">Count</th>
                  <th className="px-6 py-4 font-bold">Image</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((category) => (
                  <tr key={category._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {(category.subcategories || []).length
                        ? (category.subcategories || []).map((s) => (
                            <span key={s.name} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded mr-1 mb-1">
                              {s.name}{s.serialNumber ? <span className="font-mono text-slate-400">#{s.serialNumber}</span> : ''}
                            </span>
                          ))
                        : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{category.count ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{category.img || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(category)} className="text-slate-400 hover:text-slate-600">
                          <MoreVertical size={18} />
                        </button>
                        <button onClick={() => remove(category)} className="text-red-500 hover:text-red-700">
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
          <div className="w-full max-w-xl bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form className="p-6 grid grid-cols-1 gap-4" onSubmit={submit}>
              <div>
                <label className="text-xs font-semibold text-slate-500">Name *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Count</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.count} onChange={(e) => onChange('count', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Image URL</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.img} onChange={(e) => onChange('img', e.target.value)} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500">Subcategories</label>
                  <button type="button" onClick={addSubcat} className="text-xs text-blue-600 hover:underline">+ Add</button>
                </div>
                {subcats.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                      placeholder="Subcategory name"
                      value={s.name}
                      onChange={(e) => updateSubcat(i, 'name', e.target.value)}
                    />
                    <input
                      className="w-28 rounded-md border border-slate-200 px-2 py-1.5 text-sm font-mono"
                      placeholder="Serial #"
                      value={s.serialNumber}
                      onChange={(e) => updateSubcat(i, 'serialNumber', e.target.value)}
                    />
                    <button type="button" onClick={() => removeSubcat(i)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                />
                <div className="text-[11px] text-slate-400 mt-1">Use image URL above or upload file here.</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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

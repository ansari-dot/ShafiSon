import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Save, Trash2, Search, MessageSquare } from 'lucide-react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/src/lib/api';


type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote: string;
  img?: string;
  active: boolean;
  createdAt?: string;
};

const emptyForm = {
  name: '',
  role: '',
  quote: '',
  img: '',
  active: true,
};

type FormState = typeof emptyForm;

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    let active = true;
    apiGet<Testimonial[]>('/api/testimonials')
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'Failed to load testimonials');
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
    return items.filter((t) =>
      [t.name, t.role, t.quote].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name || '',
      role: t.role || '',
      quote: t.quote || '',
      img: t.img || '',
      active: Boolean(t.active),
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
      role: form.role.trim(),
      quote: form.quote.trim(),
      img: form.img.trim(),
      active: Boolean(form.active),
    };

    try {
      if (editing) {
        const updated = await apiPut<Testimonial>(`/api/testimonials/${editing._id}`, payload);
        setItems((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      } else {
        const created = await apiPost<Testimonial>('/api/testimonials', payload);
        setItems((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save testimonial';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t: Testimonial) => {
    const ok = window.confirm(`Delete "${t.name}"?`);
    if (!ok) return;
    try {
      await apiDelete(`/api/testimonials/${t._id}`);
      setItems((prev) => prev.filter((x) => x._id !== t._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete testimonial';
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
          Testimonials
        </motion.h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
            />
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-slate-500">Loading testimonials...</div>}
        {error && !loading && <div className="p-6 text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="px-6 py-4 font-bold">Person</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Quote</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                          {t.img ? (
                            <img src={t.img} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-slate-200" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.role || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[360px]">{t.quote}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        t.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {t.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(t)} className="text-slate-400 hover:text-slate-600">
                          <MessageSquare size={18} />
                        </button>
                        <button onClick={() => remove(t)} className="text-red-500 hover:text-red-700">
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
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form className="p-6 grid grid-cols-1 gap-4 overflow-y-auto" onSubmit={submit}>
              <div>
                <label className="text-xs font-semibold text-slate-500">Name *</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Role</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.role} onChange={(e) => onChange('role', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Quote *</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={4} value={form.quote} onChange={(e) => onChange('quote', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Image URL</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.img} onChange={(e) => onChange('img', e.target.value)} />
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
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => onChange('active', e.target.checked)} />
                <span className="text-sm text-slate-700">Active</span>
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

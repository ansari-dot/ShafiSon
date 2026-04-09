
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Edit, Trash2, Eye, Edit3, X, Save, Search, Scale, Sparkles, Layers, Flame } from 'lucide-react';
import { apiGet, apiPut } from '@/src/lib/api';

const PAGES = [
  { id: 1, title: 'Homepage', lastModified: '2 hours ago', status: 'Published' },
  { id: 2, title: 'About Us', lastModified: '1 day ago', status: 'Published' },
  { id: 3, title: 'Shipping Policy', lastModified: '3 days ago', status: 'Draft' },
  { id: 4, title: 'Terms & Conditions', lastModified: '1 week ago', status: 'Published' },
];

type Product = {
  _id: string;
  title: string;
};

type Category = {
  _id: string;
  name: string;
};

type HomeCollection = {
  title: string;
  heading: string;
  text: string;
  productIds: string[];
};

type CompareSection = {
  title: string;
  heading: string;
  text: string;
  productIds: string[];
};

type PopularPicks = {
  title: string;
  heading: string;
  text: string;
  productIds: string[];
};

type HomeCategories = {
  title: string;
  heading: string;
  text: string;
  categoryIds: string[];
};

type DealSection = {
  title: string;
  heading: string;
  text: string;
  productIds: string[];
  discountType?: 'percent' | 'amount' | 'none';
  discountValue?: number;
  endsAt?: string | null;
};

export default function Content() {
  const [open, setOpen] = useState(false);
  const [openCompare, setOpenCompare] = useState(false);
  const [openPopular, setOpenPopular] = useState(false);
  const [openCats, setOpenCats] = useState(false);
  const [openDeal, setOpenDeal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [compareSearch, setCompareSearch] = useState('');
  const [popularSearch, setPopularSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [dealSearch, setDealSearch] = useState('');

  const [form, setForm] = useState<HomeCollection>({
    title: 'Our Collection',
    heading: 'Crafted with Excellent Material',
    text: 'Every piece is designed with care — using sustainably sourced wood, premium fabrics, and timeless craftsmanship.',
    productIds: [],
  });

  const [compareForm, setCompareForm] = useState<CompareSection>({
    title: 'Compare',
    heading: 'Find Your Perfect Fit',
    text: 'Not sure which to pick? Compare our top sellers side by side.',
    productIds: [],
  });

  const [popularForm, setPopularForm] = useState<PopularPicks>({
    title: 'Trending Now',
    heading: 'Popular Picks',
    text: '',
    productIds: [],
  });

  const [catForm, setCatForm] = useState<HomeCategories>({
    title: 'Browse',
    heading: 'Shop by Category',
    text: 'Find the perfect piece for every room in your home.',
    categoryIds: [],
  });

  const [dealForm, setDealForm] = useState<DealSection>({
    title: 'Limited Offer',
    heading: 'Grab the Deal',
    text: '',
    productIds: [],
    discountType: 'percent',
    discountValue: 50,
    endsAt: null,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      apiGet<HomeCollection | null>('/api/home-collection'),
      apiGet<CompareSection | null>('/api/compare-section'),
      apiGet<PopularPicks | null>('/api/popular-picks'),
      apiGet<HomeCategories | null>('/api/home-categories'),
      apiGet<DealSection | null>('/api/deal-section'),
      apiGet<Product[]>('/api/products'),
      apiGet<Category[]>('/api/categories')
    ])
      .then(([doc, compareDoc, popularDoc, catDoc, dealDoc, list, catList]) => {
        if (!active) return;
        if (doc) {
          setForm({
            title: doc.title || 'Our Collection',
            heading: doc.heading || 'Crafted with Excellent Material',
            text: doc.text || '',
            productIds: doc.productIds || [],
          });
        }
        if (compareDoc) {
          setCompareForm({
            title: compareDoc.title || 'Compare',
            heading: compareDoc.heading || 'Find Your Perfect Fit',
            text: compareDoc.text || '',
            productIds: compareDoc.productIds || [],
          });
        }
        if (popularDoc) {
          setPopularForm({
            title: popularDoc.title || 'Trending Now',
            heading: popularDoc.heading || 'Popular Picks',
            text: popularDoc.text || '',
            productIds: popularDoc.productIds || [],
          });
        }
        if (catDoc) {
          setCatForm({
            title: catDoc.title || 'Browse',
            heading: catDoc.heading || 'Shop by Category',
            text: catDoc.text || '',
            categoryIds: catDoc.categoryIds || [],
          });
        }
        if (dealDoc) {
          setDealForm({
            title: dealDoc.title || 'Limited Offer',
            heading: dealDoc.heading || 'Grab the Deal',
            text: dealDoc.text || '',
            productIds: dealDoc.productIds || [],
            discountType: dealDoc.discountType || 'percent',
            discountValue: typeof dealDoc.discountValue === 'number' ? dealDoc.discountValue : 0,
            endsAt: dealDoc.endsAt || null,
          });
        }
        setProducts(Array.isArray(list) ? list : []);
        setCategories(Array.isArray(catList) ? catList : []);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'Failed to load data');
      });
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, search]);

  const filteredCompareProducts = useMemo(() => {
    const q = compareSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, compareSearch]);

  const filteredPopularProducts = useMemo(() => {
    const q = popularSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, popularSearch]);

  const filteredCategories = useMemo(() => {
    const q = catSearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, catSearch]);

  const filteredDealProducts = useMemo(() => {
    const q = dealSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, dealSearch]);

  const toggleProduct = (id: string) => {
    setForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const toggleCompareProduct = (id: string) => {
    setCompareForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const togglePopularProduct = (id: string) => {
    setPopularForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const toggleCategory = (id: string) => {
    setCatForm((f) => {
      const exists = f.categoryIds.includes(id);
      const next = exists ? f.categoryIds.filter((x) => x !== id) : [...f.categoryIds, id];
      return { ...f, categoryIds: next };
    });
  };

  const toggleDealProduct = (id: string) => {
    setDealForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const saveCollection = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/home-collection', form);
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save collection';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const saveCompare = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/compare-section', compareForm);
      setOpenCompare(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save compare section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const savePopular = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/popular-picks', popularForm);
      setOpenPopular(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save popular picks';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const saveCats = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/home-categories', catForm);
      setOpenCats(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save categories section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const saveDeal = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/deal-section', dealForm);
      setOpenDeal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save deal section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const toLocalInputValue = (value?: string | null) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEndsAtChange = (value: string) => {
    if (!value) {
      setDealForm((f) => ({ ...f, endsAt: null }));
      return;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      setDealForm((f) => ({ ...f, endsAt: null }));
      return;
    }
    setDealForm((f) => ({ ...f, endsAt: d.toISOString() }));
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Content Management
        </motion.h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          New Page
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Homepage: Our Collection</h2>
          <p className="text-sm text-slate-500">Choose products to display in the Home page collection section.</p>
        </div>
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Edit3 size={16} />
          Edit Collection
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Homepage: Compare Section</h2>
          <p className="text-sm text-slate-500">Pick products for the compare section on the Home page.</p>
        </div>
        <button onClick={() => setOpenCompare(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Scale size={16} />
          Edit Compare
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Homepage: Popular Picks</h2>
          <p className="text-sm text-slate-500">Select products for the Popular Picks section.</p>
        </div>
        <button onClick={() => setOpenPopular(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Sparkles size={16} />
          Edit Popular Picks
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Homepage: Categories</h2>
          <p className="text-sm text-slate-500">Select categories for the home category section.</p>
        </div>
        <button onClick={() => setOpenCats(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Layers size={16} />
          Edit Categories
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Homepage: Deal Section</h2>
          <p className="text-sm text-slate-500">Select products for the Limited Offer / Grab Deal section.</p>
        </div>
        <button onClick={() => setOpenDeal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Flame size={16} />
          Edit Deals
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PAGES.map((page) => (
          <motion.div 
            key={page.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/10 rounded-lg p-4 flex items-center justify-between shadow-sm hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-md flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{page.title}</h3>
                <span className="text-xs text-slate-400">Modified {page.lastModified}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                page.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {page.status}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Eye size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Our Collection</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
              </div>
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

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveCollection} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Compare Section</h3>
              <button onClick={() => setOpenCompare(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={compareForm.title} onChange={(e) => setCompareForm({ ...compareForm, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={compareForm.heading} onChange={(e) => setCompareForm({ ...compareForm, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={compareForm.text} onChange={(e) => setCompareForm({ ...compareForm, text: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Select Products</label>
                <div className="mt-2 border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 h-9 border border-transparent focus-within:border-blue-500/30 transition-all mb-3">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by name..."
                      value={compareSearch}
                      onChange={(e) => setCompareSearch(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredCompareProducts.map((p) => (
                      <label key={p._id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={compareForm.productIds.includes(p._id)}
                          onChange={() => toggleCompareProduct(p._id)}
                        />
                        <span className="truncate">{p.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCompare(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveCompare} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openPopular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Popular Picks</h3>
              <button onClick={() => setOpenPopular(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={popularForm.title} onChange={(e) => setPopularForm({ ...popularForm, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={popularForm.heading} onChange={(e) => setPopularForm({ ...popularForm, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={popularForm.text} onChange={(e) => setPopularForm({ ...popularForm, text: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Select Products</label>
                <div className="mt-2 border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 h-9 border border-transparent focus-within:border-blue-500/30 transition-all mb-3">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by name..."
                      value={popularSearch}
                      onChange={(e) => setPopularSearch(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredPopularProducts.map((p) => (
                      <label key={p._id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={popularForm.productIds.includes(p._id)}
                          onChange={() => togglePopularProduct(p._id)}
                        />
                        <span className="truncate">{p.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenPopular(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={savePopular} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openCats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Homepage Categories</h3>
              <button onClick={() => setOpenCats(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={catForm.title} onChange={(e) => setCatForm({ ...catForm, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={catForm.heading} onChange={(e) => setCatForm({ ...catForm, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={catForm.text} onChange={(e) => setCatForm({ ...catForm, text: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Select Categories</label>
                <div className="mt-2 border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 h-9 border border-transparent focus-within:border-blue-500/30 transition-all mb-3">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search category by name..."
                      value={catSearch}
                      onChange={(e) => setCatSearch(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredCategories.map((c) => (
                      <label key={c._id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={catForm.categoryIds.includes(c._id)}
                          onChange={() => toggleCategory(c._id)}
                        />
                        <span className="truncate">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCats(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveCats} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Deal Products</h3>
              <button onClick={() => setOpenDeal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={dealForm.heading} onChange={(e) => setDealForm({ ...dealForm, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={dealForm.text} onChange={(e) => setDealForm({ ...dealForm, text: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Discount Type</label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={dealForm.discountType || 'percent'}
                  onChange={(e) => setDealForm({ ...dealForm, discountType: e.target.value as DealSection['discountType'] })}
                >
                  <option value="percent">Percent</option>
                  <option value="amount">Amount</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Discount Value</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={dealForm.discountValue ?? 0}
                  onChange={(e) => setDealForm({ ...dealForm, discountValue: Number(e.target.value) })}
                  disabled={(dealForm.discountType || 'percent') === 'none'}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Deal Ends At</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  value={toLocalInputValue(dealForm.endsAt)}
                  onChange={(e) => handleEndsAtChange(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Select Deal Products</label>
                <div className="mt-2 border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 h-9 border border-transparent focus-within:border-blue-500/30 transition-all mb-3">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by name..."
                      value={dealSearch}
                      onChange={(e) => setDealSearch(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredDealProducts.map((p) => (
                      <label key={p._id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={dealForm.productIds.includes(p._id)}
                          onChange={() => toggleDealProduct(p._id)}
                        />
                        <span className="truncate">{p.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenDeal(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveDeal} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

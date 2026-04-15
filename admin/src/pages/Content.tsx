
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Edit3, X, Save, Search, Scale, Sparkles, Layers, Flame, Users } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/src/lib/api';

type Product = {
  _id: string;
  title: string;
  category?: string;
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

type TeamMember = {
  name: string;
  role: string;
  img: string;
  active: boolean;
};

type AboutTeamSection = {
  title: string;
  heading: string;
  text: string;
  members: TeamMember[];
};

type HeroBanner = {
  label: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  highlights: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  offerChip: string;
  heroImages: string[];
};

type CategorySection = {
  _id?: string;
  title: string;
  heading: string;
  text: string;
  categoryIds: string[];
  productIds: string[];
  position: number;
  active: boolean;
};

export default function Content() {
  const [openHero, setOpenHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCompare, setOpenCompare] = useState(false);
  const [openPopular, setOpenPopular] = useState(false);
  const [openCats, setOpenCats] = useState(false);
  const [openDeal, setOpenDeal] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openCatSections, setOpenCatSections] = useState(false);
  const [openEditCatSection, setOpenEditCatSection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [compareSearch, setCompareSearch] = useState('');
  const [popularSearch, setPopularSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [dealSearch, setDealSearch] = useState('');
  const [catSectionSearch, setCatSectionSearch] = useState('');
  const [catSectionProductSearch, setCatSectionProductSearch] = useState('');
  const [catSections, setCatSections] = useState<CategorySection[]>([]);
  const [selectedCatSection, setSelectedCatSection] = useState<CategorySection | null>(null);
  const [catSectionForm, setCatSectionForm] = useState<CategorySection>({
    title: 'Featured Category',
    heading: 'Explore Our Range',
    text: '',
    categoryIds: [],
    productIds: [],
    position: 0,
    active: true,
  });

  const [heroForm, setHeroForm] = useState<HeroBanner>({
    label: 'New Arrival Campaign',
    titleLine1: 'Timeless Interiors, Crafted by',
    titleLine2: 'shafisons',
    text: 'Premium Curtain Cloth, Sofa Fabrics & Office Blinds - trusted since 1972.',
    highlights: '50+ years of trusted interior fabric expertise',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Explore',
    secondaryBtnLink: '/services',
    offerChip: 'Free swatches + same day consultation',
    heroImages: ['/images/couch.png', '/images/sofa.png', '/images/product-1.png', '/images/product-2.png'],
  });

  const [form, setForm] = useState<HomeCollection>({
    title: 'Our Collection',
    heading: 'Crafted with Excellent Material',
    text: 'Every piece is designed with care � using sustainably sourced wood, premium fabrics, and timeless craftsmanship.',
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



  const [teamForm, setTeamForm] = useState<AboutTeamSection>({
    title: 'The People',
    heading: 'Meet Our Team',
    text: 'The talented individuals behind every Shafi Sons piece.',
    members: [
      { name: 'Lawson Arnold', role: 'CEO, Founder, Atty.', img: '/images/person_1.jpg', active: true },
      { name: 'Jeremy Walker', role: 'CEO, Founder, Atty.', img: '/images/person_2.jpg', active: true },
      { name: 'Patrik White', role: 'CEO, Founder, Atty.', img: '/images/person_3.jpg', active: true },
      { name: 'Kathryn Ryan', role: 'CEO, Founder, Atty.', img: '/images/person_4.jpg', active: true },
    ],
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      apiGet<HeroBanner | null>('/api/hero-banner'),
      apiGet<HomeCollection | null>('/api/home-collection'),
      apiGet<CompareSection | null>('/api/compare-section'),
      apiGet<PopularPicks | null>('/api/popular-picks'),
      apiGet<HomeCategories | null>('/api/home-categories'),
      apiGet<DealSection | null>('/api/deal-section'),
      apiGet<AboutTeamSection | null>('/api/about-team'),
      apiGet<{ products: Product[]; total: number } | Product[]>('/api/products?limit=1000'),
      apiGet<Category[]>('/api/categories'),
      apiGet<CategorySection[]>('/api/category-sections')
    ])
      .then(([heroDoc, doc, compareDoc, popularDoc, catDoc, dealDoc, teamDoc, list, catList, catSectionsList]) => {
        if (!active) return;
        if (heroDoc) {
          setHeroForm({
            label: heroDoc.label || 'New Arrival Campaign',
            titleLine1: heroDoc.titleLine1 || 'Timeless Interiors, Crafted by',
            titleLine2: heroDoc.titleLine2 || 'shafisons',
            text: heroDoc.text || '',
            highlights: heroDoc.highlights || '',
            primaryBtnText: heroDoc.primaryBtnText || 'Shop Now',
            primaryBtnLink: heroDoc.primaryBtnLink || '/shop',
            secondaryBtnText: heroDoc.secondaryBtnText || 'Explore',
            secondaryBtnLink: heroDoc.secondaryBtnLink || '/services',
            offerChip: heroDoc.offerChip || '',
            heroImages: Array.isArray(heroDoc.heroImages) ? heroDoc.heroImages.filter(Boolean) : [],
          });
        }
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
        if (teamDoc) {
          setTeamForm({
            title: teamDoc.title || 'The People',
            heading: teamDoc.heading || 'Meet Our Team',
            text: teamDoc.text || '',
            members: Array.isArray(teamDoc.members) ? teamDoc.members : [],
          });
        }
        setProducts(Array.isArray(list) ? list : (list as { products: Product[] }).products || []);
        setCategories(Array.isArray(catList) ? catList : []);
        setCatSections(Array.isArray(catSectionsList) ? catSectionsList : []);
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

  const filteredCategoryForCatSection = useMemo(() => {
    const q = catSectionSearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, catSectionSearch]);

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

  const saveHero = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...heroForm,
        heroImages: (heroForm.heroImages || []).map((s) => s.trim()).filter(Boolean),
      };
      await apiPut('/api/hero-banner', payload);
      setOpenHero(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save hero banner';
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

  const saveTeam = async () => {
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/about-team', teamForm);
      setOpenTeam(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save team section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategorySectionCategory = (id: string) => {
    setCatSectionForm((f) => {
      const exists = f.categoryIds.includes(id);
      const nextCategoryIds = exists ? f.categoryIds.filter((x) => x !== id) : [...f.categoryIds, id];
      // remove products that no longer belong to any selected category
      const selectedCatNames = categories
        .filter((c) => nextCategoryIds.includes(c._id))
        .map((c) => c.name);
      const nextProductIds = f.productIds.filter((pid) => {
        const p = products.find((pr) => pr._id === pid);
        return p && !!p.category && selectedCatNames.includes(p.category);
      });
      return { ...f, categoryIds: nextCategoryIds, productIds: nextProductIds };
    });
  };

  const toggleCategorySectionProduct = (id: string) => {
    setCatSectionForm((f) => {
      const exists = f.productIds.includes(id);
      const next = exists ? f.productIds.filter((x) => x !== id) : [...f.productIds, id];
      return { ...f, productIds: next };
    });
  };

  const saveCategorySection = async () => {
    setSaving(true);
    setError('');
    try {
      if (selectedCatSection?._id) {
        await apiPut(`/api/category-sections/${selectedCatSection._id}`, catSectionForm);
      } else {
        await apiPost('/api/category-sections', catSectionForm);
      }
      const updated = await apiGet<CategorySection[]>('/api/category-sections');
      setCatSections(Array.isArray(updated) ? updated : []);
      setOpenEditCatSection(false);
      setSelectedCatSection(null);
      setCatSectionSearch('');
      setCatSectionProductSearch('');
      setCatSectionForm({
        title: 'Featured Category',
        heading: 'Explore Our Range',
        text: '',
        categoryIds: [],
        productIds: [],
        position: 0,
        active: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save category section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategorySection = async (id: string) => {
    if (!confirm('Delete this category section?')) return;
    setSaving(true);
    setError('');
    try {
      await apiDelete(`/api/category-sections/${id}`);
      const updated = await apiGet<CategorySection[]>('/api/category-sections');
      setCatSections(Array.isArray(updated) ? updated : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category section';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const openEditCatSectionModal = (section: CategorySection) => {
    setSelectedCatSection(section);
    setCatSectionForm({ ...section, productIds: section.productIds || [] });
    setCatSectionSearch('');
    setCatSectionProductSearch('');
    setOpenEditCatSection(true);
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

  const updateTeamMember = (index: number, patch: Partial<TeamMember>) => {
    setTeamForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  };

  const addTeamMember = () => {
    setTeamForm((f) => ({
      ...f,
      members: [...f.members, { name: '', role: '', img: '', active: true }],
    }));
  };

  const removeTeamMember = (index: number) => {
    setTeamForm((f) => ({
      ...f,
      members: f.members.filter((_, i) => i !== index),
    }));
  };

  const compressImageFile = (file: File, maxW = 1600, maxH = 900, quality = 0.82): Promise<string> => (
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const source = typeof reader.result === 'string' ? reader.result : '';
        if (!source) return reject(new Error('Invalid image source'));
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(maxW / img.width, maxH / img.height, 1);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to process image'));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = source;
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    })
  );

  const handleHeroImagesUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    try {
      const list = Array.from(files).slice(0, 6);
      const compressed = await Promise.all(list.map((f) => compressImageFile(f, 1600, 900, 0.82)));
      setHeroForm((prev) => ({ ...prev, heroImages: [...prev.heroImages, ...compressed].slice(0, 10) }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process hero image';
      setError(message);
    }
  };

  const handleTeamImageUpload = (index: number, file?: File | null) => {
    if (!file) return;

    compressImageFile(file, 800, 800, 0.8)
      .then((compressed) => updateTeamMember(index, { img: compressed }))
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to process image';
        setError(message);
      });
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
          <h2 className="font-bold text-slate-900">Homepage: Hero Banner</h2>
          <p className="text-sm text-slate-500">Manage hero heading, text and button labels on the Home page.</p>
        </div>
        <button onClick={() => setOpenHero(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Edit3 size={16} />
          Edit Hero
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

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">About Page: Team Section</h2>
          <p className="text-sm text-slate-500">Manage team members shown in the About page.</p>
        </div>
        <button onClick={() => setOpenTeam(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
          <Users size={16} />
          Edit Team
        </button>
      </div>

      <div className="mb-6 bg-white border border-black/10 rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900">Homepage: Category Sections</h2>
            <p className="text-sm text-slate-500">Create multiple category-based sections for the home page.</p>
          </div>
          <button onClick={() => { setSelectedCatSection(null); setCatSectionForm({ title: 'Featured Category', heading: 'Explore Our Range', text: '', categoryIds: [], productIds: [], position: 0, active: true }); setCatSectionSearch(''); setCatSectionProductSearch(''); setOpenEditCatSection(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition-colors">
            <Layers size={16} />
            Add Section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {catSections.map((section, idx) => (
            <motion.div key={section._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-slate-500">{section.categoryIds?.length || 0} categories</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditCatSectionModal(section)} className="text-blue-600 hover:text-blue-700 p-1">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteCategorySection(section._id!)} className="text-red-600 hover:text-red-700 p-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{section.heading}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {openHero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit Hero Banner</h3>
              <button onClick={() => setOpenHero(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.label} onChange={(e) => setHeroForm({ ...heroForm, label: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Title Line 2</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.titleLine2} onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Title Line 1</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.titleLine1} onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={heroForm.text} onChange={(e) => setHeroForm({ ...heroForm, text: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Highlights</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.highlights} onChange={(e) => setHeroForm({ ...heroForm, highlights: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Primary Button Text</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.primaryBtnText} onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Primary Button Link</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.primaryBtnLink} onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Secondary Button Text</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.secondaryBtnText} onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Secondary Button Link</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.secondaryBtnLink} onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnLink: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Offer Chip</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={heroForm.offerChip} onChange={(e) => setHeroForm({ ...heroForm, offerChip: e.target.value })} />
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500">Hero Images (URLs)</label>
                  <button
                    type="button"
                    onClick={() => setHeroForm((prev) => ({ ...prev, heroImages: [...prev.heroImages, ''] }))}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Add Image URL
                  </button>
                </div>
                <div className="mt-2 border border-slate-200 rounded-md p-3 space-y-2">
                  {heroForm.heroImages.map((img, index) => (
                    <div key={`hero-img-${index}`} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-9 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="https://... or /images/..."
                        value={img}
                        onChange={(e) =>
                          setHeroForm((prev) => ({
                            ...prev,
                            heroImages: prev.heroImages.map((src, i) => (i === index ? e.target.value : src)),
                          }))
                        }
                      />
                      <div className="col-span-2">
                        {img ? <img src={img} alt={`Hero ${index + 1}`} className="w-full h-10 object-cover rounded border border-slate-200" /> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setHeroForm((prev) => ({
                            ...prev,
                            heroImages: prev.heroImages.filter((_, i) => i !== index),
                          }))
                        }
                        className="col-span-1 text-xs text-slate-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {heroForm.heroImages.length === 0 && (
                    <div className="text-xs text-slate-400">No hero images yet. Add URLs or upload files below.</div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                      onChange={(e) => handleHeroImagesUpload(e.target.files)}
                    />
                    <div className="text-[11px] text-slate-400 mt-1">Upload image files (auto-compressed). These images will show in homepage hero slider.</div>
                  </div>
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenHero(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveHero} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {openTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Edit About Team Section</h3>
              <button onClick={() => setOpenTeam(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Label</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={teamForm.title} onChange={(e) => setTeamForm({ ...teamForm, title: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={teamForm.heading} onChange={(e) => setTeamForm({ ...teamForm, heading: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} value={teamForm.text} onChange={(e) => setTeamForm({ ...teamForm, text: e.target.value })} />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500">Team Members</label>
                  <button type="button" onClick={addTeamMember} className="px-3 py-1.5 text-xs rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                    Add Member
                  </button>
                </div>
                <div className="border border-slate-200 rounded-md p-3 space-y-3">
                  {teamForm.members.map((m, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center border border-slate-100 rounded-md p-3">
                      <input
                        className="md:col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => updateTeamMember(i, { name: e.target.value })}
                      />
                      <input
                        className="md:col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Role"
                        value={m.role}
                        onChange={(e) => updateTeamMember(i, { role: e.target.value })}
                      />
                      <input
                        className="md:col-span-4 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="/images/person_1.jpg"
                        value={m.img}
                        onChange={(e) => updateTeamMember(i, { img: e.target.value })}
                      />
                      <div className="md:col-span-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                          onChange={(e) => handleTeamImageUpload(i, e.target.files?.[0] || null)}
                        />
                        <div className="text-[11px] text-slate-400 mt-1">Upload image file (auto-compressed) or use image URL above</div>
                      </div>
                      <div className="md:col-span-1">
                        <img
                          src={m.img || '/images/person_1.jpg'}
                          alt={m.name || 'Team member'}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      </div>
                      <label className="md:col-span-1 flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={m.active}
                          onChange={(e) => updateTeamMember(i, { active: e.target.checked })}
                        />
                        Active
                      </label>
                      <button type="button" onClick={() => removeTeamMember(i)} className="md:col-span-1 px-2 py-2 text-xs rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
                        Remove
                      </button>
                    </div>
                  ))}
                  {teamForm.members.length === 0 && (
                    <div className="text-sm text-slate-400">No members added yet.</div>
                  )}
                </div>
              </div>

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenTeam(false)} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveTeam} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openEditCatSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{selectedCatSection ? 'Edit' : 'New'} Category Section</h3>
              <button onClick={() => { setOpenEditCatSection(false); setSelectedCatSection(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Section Title</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={catSectionForm.title} onChange={(e) => setCatSectionForm({ ...catSectionForm, title: e.target.value })} placeholder="e.g., Bedroom Collection" />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-500">Position</label>
                <input type="number" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={catSectionForm.position} onChange={(e) => setCatSectionForm({ ...catSectionForm, position: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Heading</label>
                <input className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" value={catSectionForm.heading} onChange={(e) => setCatSectionForm({ ...catSectionForm, heading: e.target.value })} placeholder="e.g., Explore Bedrooms" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={2} value={catSectionForm.text} onChange={(e) => setCatSectionForm({ ...catSectionForm, text: e.target.value })} placeholder="Optional description" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">
                  <input type="checkbox" checked={catSectionForm.active} onChange={(e) => setCatSectionForm({ ...catSectionForm, active: e.target.checked })} className="mr-2" />
                  Active
                </label>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500">Categories</label>
                <div className="mt-2 p-2 border border-slate-200 rounded-md bg-white">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={catSectionSearch}
                    onChange={(e) => setCatSectionSearch(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded mb-2"
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredCategoryForCatSection.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={catSectionForm.categoryIds.includes(cat._id)}
                          onChange={() => toggleCategorySectionCategory(cat._id)}
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Selected: {catSectionForm.categoryIds.length} categor{catSectionForm.categoryIds.length === 1 ? 'y' : 'ies'}</p>
              </div>

              {catSectionForm.categoryIds.length > 0 && (() => {
                const selectedCatNames = categories
                  .filter((c) => catSectionForm.categoryIds.includes(c._id))
                  .map((c) => c.name);
                const availableProducts = products.filter((p) =>
                  !!p.category && selectedCatNames.includes(p.category)
                );
                const q = catSectionProductSearch.trim().toLowerCase();
                const visibleProducts = q
                  ? availableProducts.filter((p) => p.title.toLowerCase().includes(q))
                  : availableProducts;
                return (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-slate-500">
                      Products from selected categories
                    </label>
                    {availableProducts.length === 0 ? (
                      <p className="text-xs text-slate-400 mt-2">No products found in selected categories.</p>
                    ) : (
                      <div className="mt-2 p-2 border border-slate-200 rounded-md bg-white">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={catSectionProductSearch}
                          onChange={(e) => setCatSectionProductSearch(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded mb-2"
                        />
                        <div className="max-h-52 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1">
                          {visibleProducts.map((p) => (
                            <label key={p._id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={catSectionForm.productIds.includes(p._id)}
                                onChange={() => toggleCategorySectionProduct(p._id)}
                              />
                              <span className="truncate">{p.title}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Selected: {catSectionForm.productIds.length} product{catSectionForm.productIds.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {error && <div className="col-span-2 text-sm text-red-600">{error}</div>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setOpenEditCatSection(false); setSelectedCatSection(null); }} className="px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-600">Cancel</button>
                <button type="button" disabled={saving} onClick={saveCategorySection} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white flex items-center gap-2">
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

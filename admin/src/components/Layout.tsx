import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  FileText, 
  Tag, 
  Quote,
  MessageSquare, 
  BarChart2, 
  Settings, 
  Search, 
  Bell, 
  Box
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left font-medium text-sm",
      isActive 
        ? "bg-blue-600 text-white shadow-sm" 
        : "text-slate-600 hover:bg-slate-200/50"
    )}
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full bg-[#f7f8fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f1f3f5] border-r border-black/10 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-5 border-b border-black/10 font-bold text-lg gap-3 text-slate-900">
          <div className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-sm">
            <Box size={16} />
          </div>
          Shafisons
        </div>
        
        <div className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2 ml-3">Main</div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/products" icon={Package} label="Products" />
          <NavItem to="/categories" icon={Layers} label="Categories" />
          <NavItem to="/orders" icon={ShoppingCart} label="Orders" />
          <NavItem to="/customers" icon={Users} label="Customers" />

          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-6 mb-2 ml-3">Management</div>
          <NavItem to="/content" icon={FileText} label="Content" />
          <NavItem to="/promotions" icon={Tag} label="Promotions" />
          <NavItem to="/testimonials" icon={Quote} label="Testimonials" />
          <NavItem to="/contacts" icon={MessageSquare} label="Contacts & Leads" />

          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-6 mb-2 ml-3">System</div>
          <NavItem to="/reports" icon={BarChart2} label="Reports" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>

        <div className="p-5 border-t border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
              <img 
                src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FSouth%20Asian%2F0" 
                alt="Fatima Ahmed"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-semibold text-sm text-slate-900 truncate">Fatima Ahmed</div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Settings
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            {[
              { label: 'General', icon: SettingsIcon, active: true },
              { label: 'Profile', icon: User },
              { label: 'Notifications', icon: Bell },
              { label: 'Security', icon: Shield },
              { label: 'Localization', icon: Globe },
              { label: 'Backup', icon: Database },
            ].map((item, i) => (
              <button 
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  item.active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Store Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Store Name</label>
                <input type="text" defaultValue="Shafisons Retail" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Store Email</label>
                <input type="email" defaultValue="admin@shafisons.com" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Currency</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500">
                  <option>USD ($)</option>
                  <option>PKR (Rs)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Maintenance Mode</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Disable the store for customers while making changes.</p>
              </div>
              <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

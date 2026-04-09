import React from 'react';
import { motion } from 'motion/react';
import { Search, Mail, Phone, MapPin, MoreHorizontal } from 'lucide-react';

const CUSTOMERS = [
  { id: 1, name: 'Sarah Khan', email: 'sarah.k@example.com', phone: '+92 300 1234567', location: 'Lahore, PK', orders: 12, spent: '$1,450.00' },
  { id: 2, name: 'Bilal Ahmed', email: 'bilal.a@example.com', phone: '+92 321 7654321', location: 'Karachi, PK', orders: 5, spent: '$890.00' },
  { id: 3, name: 'Fatima Noor', email: 'fatima.n@example.com', phone: '+92 333 9876543', location: 'Islamabad, PK', orders: 8, spent: '$1,120.00' },
  { id: 4, name: 'Usman Tariq', email: 'usman.t@example.com', phone: '+92 345 5554443', location: 'Faisalabad, PK', orders: 3, spent: '$420.00' },
];

export default function Customers() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Customers
        </motion.h1>
      </div>

      <div className="bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/10">
          <div className="flex items-center bg-slate-100 rounded-md px-3 h-9 w-[300px] gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Orders</th>
                <th className="px-6 py-4 font-bold">Total Spent</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {customer.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{customer.spent}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

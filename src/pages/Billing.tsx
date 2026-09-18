import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, DollarSign, FileText } from 'lucide-react';
import { BillingRecord } from '../types';

export const Billing: React.FC = () => {
  const { billings, addBilling, deleteBilling, addAuditLog } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', description: '', amount: 0, status: 'Pending' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.description || formData.amount <= 0) return;
    
    const newBilling: BillingRecord = {
      id: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      status: formData.status as 'Paid' | 'Pending' | 'Overdue',
      date: new Date().toISOString()
    };
    
    await addBilling(newBilling);

    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Create Invoice',
        category: 'Billing',
        details: `Created invoice ${newBilling.id} for ${newBilling.patientName} - $${newBilling.amount}`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }

    setFormData({ patientName: '', description: '', amount: 0, status: 'Pending' });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string, patientName: string) => {
    await deleteBilling(id);
    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Delete Invoice',
        category: 'Billing',
        details: `Deleted invoice ${id} for patient ${patientName}`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Billing & Finance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage patient invoices and payments.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Invoice Details</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description / Treatment"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                  className="w-full pl-9 pr-4 py-2 border rounded-xl"
                  value={formData.amount || ''}
                  onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <select 
                className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-800"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Save Invoice</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice ID</th>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {user?.role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {billings.map(bill => (
              <tr key={bill.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50">
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-slate-400" />
                  {bill.id}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{bill.patientName}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{bill.description}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  ${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(bill.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    bill.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                    bill.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(bill.id, bill.patientName)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {billings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No invoices generated yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

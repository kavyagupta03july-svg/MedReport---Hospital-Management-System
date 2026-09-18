import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Package } from 'lucide-react';
import { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const { inventoryItems, addInventoryItem, deleteInventoryItem, addAuditLog } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ itemName: '', category: '', quantity: 0, unit: '', status: 'In Stock' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.category || !formData.unit) return;
    
    const newItem: InventoryItem = {
      id: `ITEM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      status: formData.status as 'In Stock' | 'Low Stock' | 'Out of Stock',
      lastUpdated: new Date().toISOString()
    };
    await addInventoryItem(newItem);
    
    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Add Inventory Item',
        category: 'Inventory',
        details: `Added ${newItem.quantity} ${newItem.unit} of ${newItem.itemName} (${newItem.id})`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }

    setFormData({ itemName: '', category: '', quantity: 0, unit: '', status: 'In Stock' });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string, itemName: string) => {
    await deleteInventoryItem(id);
    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Delete Inventory Item',
        category: 'Inventory',
        details: `Removed item ${itemName} (${id}) from inventory`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage hospital supplies, equipment, and stock levels.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Inventory Item</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Item Name"
                  className="w-full px-4 py-2 border rounded-xl"
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Category (e.g. Surgical)"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  min="0"
                  className="w-2/3 px-4 py-2 border rounded-xl"
                  value={formData.quantity === 0 ? '' : formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  className="w-1/3 px-2 py-2 border rounded-xl text-center"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  required
                />
              </div>
              <select 
                className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-800"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Add to Inventory</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Item Code</th>
              <th className="px-6 py-4 font-medium">Item Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Updated</th>
              {user?.role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50">
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium flex items-center">
                  <Package className="w-4 h-4 mr-2 text-slate-400" />
                  {item.id}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.itemName}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.category}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {item.quantity} <span className="text-slate-500 dark:text-slate-400 text-xs font-normal ml-1">{item.unit}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    item.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' : 
                    item.status === 'Out of Stock' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(item.id, item.itemName)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {inventoryItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No inventory items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

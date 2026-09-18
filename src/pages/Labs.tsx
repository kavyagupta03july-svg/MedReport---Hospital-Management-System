import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, TestTube2 } from 'lucide-react';
import { Lab } from '../types';

export const Labs: React.FC = () => {
  const { labs, addLab, deleteLab } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', testName: '', result: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.testName || !formData.result) return;
    
    const newLab: Lab = {
      id: `LAB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      date: new Date().toISOString()
    };
    addLab(newLab);
    setFormData({ patientName: '', testName: '', result: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Lab Results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track tests and diagnostic reports.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lab Result
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Lab Result</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Test Name"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.testName}
                onChange={e => setFormData({...formData, testName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Result"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.result}
                onChange={e => setFormData({...formData, result: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Save Result</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Lab ID</th>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Test</th>
              <th className="px-6 py-4 font-medium">Result</th>
              <th className="px-6 py-4 font-medium">Date</th>
              {user?.role === 'admin' && <th className="px-6 py-4 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {labs.map(lab => (
              <tr key={lab.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50">
                <td className="px-6 py-4 text-blue-600 font-medium">{lab.id}</td>
                <td className="px-6 py-4">{lab.patientName}</td>
                <td className="px-6 py-4 flex items-center">
                  <TestTube2 className="w-4 h-4 mr-2 text-slate-400" />
                  {lab.testName}
                </td>
                <td className="px-6 py-4 font-medium">{lab.result}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(lab.date).toLocaleDateString()}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4">
                    <button onClick={() => deleteLab(lab.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {labs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No lab results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

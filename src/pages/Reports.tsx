import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, FileBarChart, Clock, Users, ArrowRight } from 'lucide-react';
import { Report } from '../types';
import { useNavigate } from 'react-router-dom';

export const Reports: React.FC = () => {
  const { reports, addReport, deleteReport } = useHospital();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Operational', summary: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) return;
    
    const newReport: Report = {
      id: `RPT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      generatedBy: user?.name || 'Admin',
      date: new Date().toISOString()
    };
    addReport(newReport);
    setFormData({ title: '', type: 'Operational', summary: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Advanced Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review comprehensive analytics and summaries.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">Log New Report</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Report Title"
                  className="w-full px-4 py-2 border rounded-xl"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <select 
                className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-800"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Operational">Operational</option>
                <option value="Financial">Financial</option>
                <option value="Clinical">Clinical</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>
            <textarea
              placeholder="Report Summary / Executive Findings..."
              className="w-full px-4 py-3 border rounded-xl min-h-[100px]"
              value={formData.summary}
              onChange={e => setFormData({...formData, summary: e.target.value})}
              required
            />
            <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Log Report</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col relative group">
            {user?.role === 'admin' && (
              <button 
                onClick={() => deleteReport(report.id)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center space-x-3 mb-4 pr-8">
              <div className={`p-2 rounded-lg ${
                report.type === 'Financial' ? 'bg-green-50 text-green-600' :
                report.type === 'Clinical' ? 'bg-blue-50 text-blue-600' :
                report.type === 'Compliance' ? 'bg-yellow-50 text-yellow-600' :
                'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300'
              }`}>
                <FileBarChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">{report.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{report.id} • {report.type}</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">{report.summary}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(report.date).toLocaleDateString()}
              </span>
              <span>By {report.generatedBy}</span>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
            No advanced reports available.
          </div>
        )}
      </div>
    </div>
  );
};

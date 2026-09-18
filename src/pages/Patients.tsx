import React, { useState, useMemo, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { exportPatientsToPDF, exportPatientsToExcel } from '../utils/exportUtils';
import { Search, Download, FileSpreadsheet, Filter, Plus, Trash2 } from 'lucide-react';
import { isWithinInterval, parseISO } from 'date-fns';
import { Patient } from '../types';

export const Patients: React.FC = () => {
  const { patients, addPatient, deletePatient } = useHospital();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '', age: 0, gender: 'Male', diagnosis: '', department: '', status: 'Stable'
  });

  useEffect(() => {
    document.title = "Patients - MedReport";
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newPatient: Patient = {
      id: `PT-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      age: formData.age || 0,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      admissionDate: new Date().toISOString(),
      diagnosis: formData.diagnosis || '',
      status: formData.status as 'Critical' | 'Stable' | 'Discharged',
      department: formData.department || ''
    };
    addPatient(newPatient);
    setShowAddForm(false);
    setFormData({ name: '', age: 0, gender: 'Male', diagnosis: '', department: '', status: 'Stable' });
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      
      let matchesDate = true;
      if (startDate && endDate) {
        try {
          matchesDate = isWithinInterval(parseISO(p.admissionDate), {
            start: parseISO(startDate),
            end: parseISO(endDate)
          });
        } catch (e) {
          // Invalid date, ignore filter
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [patients, searchTerm, startDate, endDate, statusFilter]);

  const handleExportExcel = () => {
    try {
      exportPatientsToExcel(filteredPatients);
      // Give visual feedback since downloads can be silent or blocked in iframes
      const isIframe = window !== window.parent;
      if (isIframe) {
        alert('Export initiated! Note: If the file does not download, please open this app in a new tab, as downloads are restricted in the preview environment.');
      }
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };

  const handleExportPDF = () => {
    try {
      exportPatientsToPDF(filteredPatients);
      const isIframe = window !== window.parent;
      if (isIframe) {
        alert('Export initiated! Note: If the file does not download, please open this app in a new tab, as downloads are restricted in the preview environment.');
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Patient Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and export patient records.</p>
        </div>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </button>
          )}
          <button 
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel Export
          </button>
          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Export
          </button>
        </div>
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 print:hidden animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">New Patient Registration</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Patient Name" className="w-full px-4 py-2 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="number" placeholder="Age" className="w-full px-4 py-2 border rounded-xl" value={formData.age || ''} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} required />
              <select className="w-full px-4 py-2 border rounded-xl" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" placeholder="Diagnosis" className="w-full px-4 py-2 border rounded-xl" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} required />
              <input type="text" placeholder="Department" className="w-full px-4 py-2 border rounded-xl" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
              <select className="w-full px-4 py-2 border rounded-xl" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Register Patient</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <div className="flex-1">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
            <span className="text-slate-400 text-sm">to</span>
            <div className="flex-1">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Patient ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Age/Gender</th>
                <th className="px-6 py-4 font-medium">Admission Date</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {user?.role === 'admin' && <th className="px-6 py-4 font-medium print:hidden">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{patient.id}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>{patient.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{patient.diagnosis}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.age} / {patient.gender.charAt(0)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{new Date(patient.admissionDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.department}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                        patient.status === 'Critical' ? "bg-red-50 text-red-700 border-red-200" :
                        patient.status === 'Stable' ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-slate-100 text-slate-700 border-slate-200 dark:border-slate-700"
                      )}>
                        {patient.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 print:hidden">
                        <button onClick={() => deletePatient(patient.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No patients found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

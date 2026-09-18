import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, Bed, Activity as ActivityIcon, UserPlus, Settings2, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC = () => {
  const { stats, updateStats } = useHospital();
  const { user } = useAuth();
  
  const [showEdit, setShowEdit] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  type TrendData = { date: string, admissions: number | '', discharges: number | '' };
  const [editData, setEditData] = useState<{
    totalPatients: number | '';
    criticalCondition: number | '';
    availableBeds: number | '';
    doctorsOnDuty: number | '';
    admissionsTrend: TrendData[];
  }>({
    totalPatients: '', criticalCondition: '', availableBeds: '', doctorsOnDuty: '',
    admissionsTrend: []
  });

  useEffect(() => {
    document.title = "Dashboard - MedReport";
  }, []);

  const handleEditOpen = () => {
    let currentTrend = stats.admissionsTrend;
    if (!currentTrend || currentTrend.length === 0) {
      currentTrend = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          admissions: 0,
          discharges: 0
        };
      });
    }

    setEditData({
      totalPatients: stats.totalPatients === 0 ? '' : stats.totalPatients,
      criticalCondition: stats.criticalCondition === 0 ? '' : stats.criticalCondition,
      availableBeds: stats.availableBeds === 0 ? '' : stats.availableBeds,
      doctorsOnDuty: stats.doctorsOnDuty === 0 ? '' : stats.doctorsOnDuty,
      admissionsTrend: currentTrend.map(t => ({
        date: t.date,
        admissions: t.admissions === 0 ? '' : t.admissions,
        discharges: t.discharges === 0 ? '' : t.discharges
      }))
    });
    setShowEdit(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats({ 
      ...stats, 
      totalPatients: Number(editData.totalPatients) || 0,
      criticalCondition: Number(editData.criticalCondition) || 0,
      availableBeds: Number(editData.availableBeds) || 0,
      doctorsOnDuty: Number(editData.doctorsOnDuty) || 0,
      admissionsTrend: editData.admissionsTrend.map(d => ({
        date: d.date,
        admissions: Number(d.admissions) || 0,
        discharges: Number(d.discharges) || 0
      }))
    });
    setShowEdit(false);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const element = document.getElementById('dashboard-print-area');
      if (element) {
        // Use html-to-image to support modern CSS (like oklch in Tailwind v4)
        const dataUrl = await toPng(element, {
          quality: 1,
          pixelRatio: 2,
          filter: (node) => {
            // Ignore elements with data-html2canvas-ignore (kept the attribute for compatibility)
            return node?.getAttribute?.('data-html2canvas-ignore') !== '';
          }
        });
        
        // Load the image to get dimensions
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (img.height * imgWidth) / img.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(dataUrl, 'PNG', 0, 10, imgWidth, imgHeight);
        pdf.save('MedReport-Dashboard.pdf');
        
        const isIframe = window !== window.parent;
        if (isIframe) {
          alert('Export initiated! Note: If the file does not download, please open this app in a new tab, as downloads are restricted in the preview environment.');
        }
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const kpis = [
    { name: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-blue-500' },
    { name: 'Critical Condition', value: stats.criticalCondition, icon: ActivityIcon, color: 'bg-red-500' },
    { name: 'Available Beds', value: stats.availableBeds, icon: Bed, color: 'bg-green-500' },
    { name: 'Doctors on Duty', value: stats.doctorsOnDuty, icon: UserPlus, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500" id="dashboard-print-area">
      <div className="flex justify-between items-end print:hidden" data-html2canvas-ignore>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Hospital Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time data synchronization</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <button onClick={handleEditOpen} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200 inline-flex items-center">
              <Settings2 className="w-4 h-4 mr-2" />
              Edit Overview
            </button>
          )}
          <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center disabled:opacity-70"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isPrinting ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {showEdit && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">Edit Dashboard KPIs</h3>
          <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Patients</label>
              <input type="number" className="w-full px-4 py-2 border rounded-xl" value={editData.totalPatients} onChange={e => setEditData({...editData, totalPatients: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Critical Condition</label>
              <input type="number" className="w-full px-4 py-2 border rounded-xl" value={editData.criticalCondition} onChange={e => setEditData({...editData, criticalCondition: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Available Beds</label>
              <input type="number" className="w-full px-4 py-2 border rounded-xl" value={editData.availableBeds} onChange={e => setEditData({...editData, availableBeds: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Doctors on Duty</label>
              <input type="number" className="w-full px-4 py-2 border rounded-xl" value={editData.doctorsOnDuty} onChange={e => setEditData({...editData, doctorsOnDuty: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} />
            </div>
            
            <div className="col-span-2 md:col-span-4 mt-2">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Admissions vs Discharges (7 Days)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {editData.admissionsTrend.map((day, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 shadow-sm">
                    <input 
                      type="text" 
                      className="w-full text-sm font-medium mb-2 bg-transparent border-b border-slate-300 pb-1 text-slate-700 focus:outline-none focus:border-blue-500" 
                      value={day.date} 
                      onChange={(e) => {
                         const newTrend = [...editData.admissionsTrend];
                         newTrend[index].date = e.target.value;
                         setEditData({...editData, admissionsTrend: newTrend});
                      }} 
                    />
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Admissions</label>
                        <input 
                          type="number" 
                          className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500" 
                          value={day.admissions} 
                          onChange={(e) => {
                             const newTrend = [...editData.admissionsTrend];
                             newTrend[index].admissions = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                             setEditData({...editData, admissionsTrend: newTrend});
                          }} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Discharges</label>
                        <input 
                          type="number" 
                          className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500" 
                          value={day.discharges} 
                          onChange={(e) => {
                             const newTrend = [...editData.admissionsTrend];
                             newTrend[index].discharges = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                             setEditData({...editData, admissionsTrend: newTrend});
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 md:col-span-4 flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center print:border-slate-300">
            <div className={`p-4 rounded-xl ${kpi.color} text-white flex items-center justify-center mr-4 shadow-sm`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Admissions vs Discharges (7 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.admissionsTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="discharges" name="Discharges" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Patients by Department</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

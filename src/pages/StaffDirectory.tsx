import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, UserPlus, Mail, Phone, Building } from 'lucide-react';
import { StaffMember } from '../types';

export const StaffDirectory: React.FC = () => {
  const { staffMembers, addStaffMember, deleteStaffMember, addAuditLog } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Doctor', department: '', email: '', phone: '', status: 'Active' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.department) return;
    
    const newStaff: StaffMember = {
      id: `STAFF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      status: formData.status as 'Active' | 'On Leave' | 'Inactive'
    };
    
    await addStaffMember(newStaff);
    
    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Add Staff Member',
        category: 'User Management',
        details: `Registered new staff member ${newStaff.name} (${newStaff.id}) as ${newStaff.role} in ${newStaff.department}`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }
    
    setFormData({ name: '', role: 'Doctor', department: '', email: '', phone: '', status: 'Active' });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string, name: string) => {
    await deleteStaffMember(id);
    if (user?.role === 'admin') {
      await addAuditLog({
        id: `LOG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        action: 'Delete Staff Member',
        category: 'User Management',
        details: `Removed staff member ${name} (${id})`,
        user: user.name,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Staff Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage employees, shift schedules, and access credentials.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff Member
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4">Register New Staff</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Department (e.g. Cardiology)"
                className="w-full px-4 py-2 border rounded-xl"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                required
              />
              <select 
                className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-800"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Administrator">Administrator</option>
                <option value="Support Staff">Support Staff</option>
              </select>
              <select 
                className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-800"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 border rounded-xl hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Register Staff</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Role & Dept</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {user?.role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffMembers.map(staff => (
              <tr key={staff.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50">
                <td className="px-6 py-4 text-blue-600 font-medium">{staff.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{staff.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{staff.role}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center mt-0.5">
                      <Building className="w-3 h-3 mr-1" />
                      {staff.department}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-slate-600 dark:text-slate-300 flex items-center">
                      <Mail className="w-3 h-3 mr-1.5" />
                      {staff.email}
                    </span>
                    {staff.phone && (
                      <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center">
                        <Phone className="w-3 h-3 mr-1.5" />
                        {staff.phone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                    staff.status === 'On Leave' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                    'bg-slate-100 text-slate-700 border-slate-200 dark:border-slate-700'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(staff.id, staff.name)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {staffMembers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No staff members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, CalendarPlus, Calendar, Clock, User as UserIcon, Phone, Mail, CalendarDays } from 'lucide-react';
import { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const { appointments, addAppointment, deleteAppointment } = useHospital();
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', doctorName: '', date: '', time: '', type: '', status: 'Scheduled' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.time) return;
    
    const newAppointment: Appointment = {
      id: `APT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      status: formData.status as 'Scheduled' | 'Completed' | 'Cancelled'
    };
    addAppointment(newAppointment);
    setFormData({ patientName: '', doctorName: '', date: '', time: '', type: '', status: 'Scheduled' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Appointments</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage patient schedules and calendar bookings.</p>
        </div>
        {user && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Add Appointment
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 overflow-hidden animate-in slide-in-from-top-4">
          <div className="bg-blue-600 px-6 py-4 flex items-center">
            <CalendarDays className="w-5 h-5 text-white mr-2" />
            <h3 className="text-lg font-semibold text-white">Appointment Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleAdd} className="space-y-8">
              {/* Section 1: Select Service */}
              <div>
                <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">1. Select Service</h4>
                <div className="border-b border-slate-200 dark:border-slate-700 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                    <select 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Practice">General Practice</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Doctor (Optional)</label>
                    <select 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.doctorName}
                      onChange={e => setFormData({...formData, doctorName: e.target.value})}
                    >
                      <option value="">Any Available Doctor</option>
                      <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
                      <option value="Dr. James Wilson">Dr. James Wilson</option>
                      <option value="Dr. Emily Chen">Dr. Emily Chen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time *</label>
                    <select 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Patient Information */}
              <div>
                <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">2. Patient Information</h4>
                <div className="border-b border-slate-200 dark:border-slate-700 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                        value={formData.patientName}
                        onChange={e => setFormData({...formData, patientName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="px-5 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-900/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Appt ID</th>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Doctor / Dept</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {user?.role === 'admin' && <th className="px-6 py-4 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50 dark:bg-slate-900/50/50">
                <td className="px-6 py-4 text-blue-600 font-medium">{apt.id}</td>
                <td className="px-6 py-4 font-medium">{apt.patientName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{apt.date}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1.5 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center">
                  {apt.doctorName ? (
                    <>
                      <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
                      {apt.doctorName}
                    </>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{apt.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    apt.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4">
                    <button onClick={() => deleteAppointment(apt.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No appointments scheduled.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

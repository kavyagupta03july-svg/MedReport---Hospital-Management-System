import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, ShieldCheck, Check, AlertTriangle, Key, Phone, Camera, MapPin, Building, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { User } from '../types';

export const Settings: React.FC = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState<User['gender']>(user?.gender || 'Prefer not to say');
  const [address, setAddress] = useState(user?.address || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Delete Account State
  const [showDeleteFlow, setShowDeleteFlow] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteReasons = [
    "Privacy concerns",
    "I no longer use this application",
    "I have another account",
    "It's too difficult to use",
    "Other"
  ];

  useEffect(() => {
    document.title = "Settings & Profile - MedReport";
  }, []);

  // Update local state if user context changes externally
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setGender(user.gender || 'Prefer not to say');
      setAddress(user.address || '');
      setDepartment(user.department || '');
      setEmergencyContact(user.emergencyContact || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    NProgress.start();
    
    // Simulate API call delay
    setTimeout(() => {
      updateProfile({ name, email, phone, gender, address, department, emergencyContact, avatar });
      setIsSaving(false);
      NProgress.done();
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    
    if (!deleteReason) {
      setDeleteError("Please select a reason for leaving.");
      return;
    }

    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm.");
      return;
    }

    NProgress.start();
    const result = deleteAccount(deletePassword);
    
    setTimeout(() => {
      NProgress.done();
      if (!result.success) {
        setDeleteError(result.error || 'Failed to delete account.');
      } else {
        // Upon successful deletion, user is logged out automatically via Context
        navigate('/login');
      }
    }, 400); // Small delay to show the loading bar effect
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage hospital preferences and your profile.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <div className="relative mb-4 group inline-block">
              <img 
                src={avatar || user.avatar} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm object-cover"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                <Camera className="w-6 h-6" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <span className="absolute bottom-0 right-0 block w-6 h-6 bg-green-500 border-4 border-white rounded-full z-20"></span>
              
              {/* Remove Photo Button */}
              {avatar && avatar !== `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=b6e3f4` && (
                <button
                  type="button"
                  onClick={() => setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=b6e3f4`)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-sm z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none"
                  title="Remove custom photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center mt-1">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-500" />
                <span className="capitalize">{user.role} Account</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as User['gender'])}
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="Home Address"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Department / Ward</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="e.g. Cardiology, ER"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HeartPulse className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Role (Read-Only)</label>
                <input
                  type="text"
                  disabled
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  className="block w-full px-4 py-2.5 bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl sm:text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Roles can only be modified by system administrators via the Staff Directory.</p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
              
              {showSuccess && (
                <span className="inline-flex items-center text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2">
                  <Check className="w-4 h-4 mr-1.5" />
                  Profile updated successfully
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-100 overflow-hidden mt-8">
        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Delete Your Account !
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Permanently delete your account and remove all associated data. This action cannot be undone.
          </p>

          {!showDeleteFlow ? (
            <button
              onClick={() => setShowDeleteFlow(true)}
              className="px-6 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-xl transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleDeleteSubmit} className="space-y-6 max-w-xl animate-in slide-in-from-top-4 bg-red-50/50 p-6 rounded-xl border border-red-100">
              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {deleteError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">Why are you deleting your account?</label>
                <div className="space-y-3">
                  {deleteReasons.map((reason, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="deleteReason"
                        value={reason}
                        checked={deleteReason === reason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {deleteReason && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-red-100">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">To continue, please enter your password</label>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 font-medium rounded-xl transition-colors shadow-sm"
                    >
                      Permanently Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteFlow(false);
                        setDeleteReason('');
                        setDeletePassword('');
                        setDeleteError(null);
                      }}
                      className="px-6 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Stethoscope, Lock, Mail, User as UserIcon, AlertCircle, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { Role } from '../types';

export const Login: React.FC = () => {
  const { login, register, resetPassword, user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<Role>('medical');
  const [isLoginView, setIsLoginView] = useState(true); // Default to login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Login - MedReport Hospital Management";
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (isLoginView) {
      if (!email || !password) return;
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed.');
      }
    } else {
      if (!name || !email || !password) return;
      const result = await register(role, name, email, password);
      if (!result.success) {
        setError(result.error || 'Registration failed.');
      } else {
        setSuccessMsg('Account created successfully! Please sign in below.');
        setIsLoginView(true);
        setPassword('');
        setName('');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    
    const result = await resetPassword(email);
    if (result.success) {
      setSuccessMsg('Password reset link sent! Check your email.');
    } else {
      setError(result.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-900 transition-colors flex flex-col">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          title="Toggle Dark Mode"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          MedReport HMS
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300 dark:text-slate-400">
          Secure Role-Based Access Control
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700">
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm flex items-start">
              <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('medical')}
              className={cn(
                "flex-1 flex justify-center items-center py-2.5 text-sm font-medium rounded-lg transition-all",
                role === 'medical' ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Medical Staff
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={cn(
                "flex-1 flex justify-center items-center py-2.5 text-sm font-medium rounded-lg transition-all",
                role === 'admin' ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Administrator
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required={!isLoginView}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-slate-900 dark:text-white"
                  placeholder="john@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {isLoginView && (
                <div className="mt-2 flex justify-end">
                  <button type="button" onClick={handleResetPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
            >
              {isLoginView ? 'Sign In to Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300 dark:text-slate-400">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
                setSuccessMsg(null);
                setPassword('');
              }}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLoginView ? 'Create one now' : 'Sign in here'}
            </button>
          </div>
          
          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
              <p className="font-semibold mb-1">Quality Goal: Better Reporting</p>
              <p>Login to access seamless data analytics, improving operational efficiency and clinical decision-making.</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <footer className="py-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-slate-500 dark:text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} MedReport HMS. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

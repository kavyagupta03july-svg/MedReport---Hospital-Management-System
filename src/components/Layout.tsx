import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Activity, Calendar, TestTube, MessageSquare, Stethoscope, CreditCard, Package, Menu, ShieldAlert, Bell, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { messages } = useHospital();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [readMessageIds, setReadMessageIds] = useState<string[]>(() => {
    try {
      if (user) {
        const saved = localStorage.getItem(`read_msgs_${user.id}`);
        return saved ? JSON.parse(saved) : [];
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return <>{children}</>;

  const unreadMessages = messages.filter(msg => !readMessageIds.includes(msg.id));

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadMessages.length > 0) {
      const newReadIds = [...new Set([...readMessageIds, ...unreadMessages.map(m => m.id)])];
      setReadMessageIds(newReadIds);
      if (user) {
        localStorage.setItem(`read_msgs_${user.id}`, JSON.stringify(newReadIds));
      }
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Lab Results', href: '/labs', icon: TestTube },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Staff Directory', href: '/staff', icon: Stethoscope },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Doctor Directory', href: '/doctors', icon: Users },
    { name: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert, adminOnly: true },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex print:bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden when printing */}
      <aside className={cn(
        "bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col print:hidden transition-all duration-300 ease-in-out z-50 fixed inset-y-0 left-0 md:static",
        isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      )}>
        <div className={cn("h-16 flex items-center bg-slate-950", isSidebarOpen ? "px-6" : "justify-center")}>
          <Activity className={cn("h-6 w-6 text-blue-500 flex-shrink-0", isSidebarOpen ? "mr-3" : "")} />
          {isSidebarOpen && <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">MedReport</span>}
        </div>
        
        <div className={cn("py-6 flex items-center border-b border-slate-800", isSidebarOpen ? "px-6 space-x-3" : "px-0 justify-center")}>
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0" />
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>

        <nav className={cn("flex-1 py-6 space-y-1 overflow-y-auto", isSidebarOpen ? "px-4" : "px-2")}>
          {navigation.map((item) => {
            if (item.adminOnly && user.role !== 'admin') return null;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={!isSidebarOpen ? item.name : undefined}
                className={cn(
                  "flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isSidebarOpen ? "px-3" : "justify-center px-0",
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("flex-shrink-0 w-5 h-5", isSidebarOpen ? "mr-3" : "", isActive ? "text-white" : "text-slate-400")} />
                {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? "Logout" : undefined}
            className={cn(
              "flex items-center w-full py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group",
              isSidebarOpen ? "px-3" : "justify-center px-0"
            )}
          >
            <LogOut className={cn("flex-shrink-0 w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors", isSidebarOpen ? "mr-3" : "")} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 print:hidden shadow-sm z-10 transition-colors">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-center text-slate-800 dark:text-white capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1)}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live System
             </span>
             
             {/* Theme Toggle */}
             <button
               onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
               className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
               title="Toggle Dark Mode"
             >
               {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             
             {/* Notification Bell */}
             <div className="relative" ref={notificationRef}>
               <button 
                 onClick={handleNotificationClick}
                 className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                 title="Notifications"
               >
                 <Bell className="w-5 h-5" />
                 {unreadMessages.length > 0 && (
                   <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white box-content"></span>
                 )}
               </button>
               
               {/* Dropdown */}
               {showNotifications && (
                 <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                     <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                     {unreadMessages.length > 0 && (
                       <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-0.5 px-2 rounded-full text-xs font-medium">
                         {unreadMessages.length} New
                       </span>
                     )}
                   </div>
                   <div className="max-h-[28rem] overflow-y-auto">
                     {messages.length === 0 ? (
                       <div className="p-8 flex flex-col items-center justify-center text-center">
                         <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                         <p className="text-sm font-medium text-slate-900 dark:text-white">No notifications</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You're all caught up!</p>
                       </div>
                     ) : (
                       [...messages]
                         .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                         .slice(0, 8)
                         .map(msg => {
                           const isUnread = !readMessageIds.includes(msg.id) && showNotifications === false; // If dropdown is open, they are immediately marked read locally
                           return (
                             <div key={msg.id} className={cn("p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative", isUnread ? "bg-blue-50/50 dark:bg-blue-900/20" : "")}>
                               <p className="font-medium text-sm text-slate-900 dark:text-white pr-4">{msg.subject}</p>
                               <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{msg.content}</p>
                               <div className="flex justify-between items-center mt-2">
                                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{msg.author}</p>
                                 <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(msg.date).toLocaleDateString()}</p>
                               </div>
                             </div>
                           )
                         })
                     )}
                   </div>
                   <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center">
                     <Link 
                       to="/messages" 
                       onClick={() => setShowNotifications(false)} 
                       className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2 inline-block w-full"
                     >
                       View all broadcasts
                     </Link>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col overflow-y-auto print:p-0 print:overflow-visible bg-slate-50 dark:bg-slate-900 transition-colors">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
          <footer className="py-10 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto print:hidden transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-sm text-slate-500 dark:text-slate-400">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="text-slate-800 dark:text-white font-bold text-lg tracking-tight">MedReport HMS</span>
                  </div>
                  <p className="mb-4">Providing advanced healthcare management solutions with real-time reporting and analytics for medical professionals.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-xs">Contact Us</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><span className="w-8 font-medium mr-1">Tel:</span> +1 (800) 555-0199</li>
                    <li className="flex items-start"><span className="w-8 font-medium mr-1">Alt:</span> +1 (800) 555-0198</li>
                    <li className="flex items-start"><span className="w-8 font-medium mr-1">Email:</span> contact@medreport.local</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-xs">Appointments & Timings</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>Mon - Fri:</span> <span>8:00 AM - 8:00 PM</span></li>
                    <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 5:00 PM</span></li>
                    <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
                    <li className="flex justify-between text-blue-600 dark:text-blue-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700 mt-2"><span>Emergency:</span> <span>24/7 Available</span></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-xs">Doctors & Directory</h3>
                  <ul className="space-y-2">
                    <li><Link to="/doctors" className="hover:text-blue-600 transition-colors">Find a Doctor</Link></li>
                    <li><Link to="/staff" className="hover:text-blue-600 transition-colors">Staff Directory</Link></li>
                    <li><Link to="/appointments" className="hover:text-blue-600 transition-colors">Book an Appointment</Link></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 space-y-4 md:space-y-0">
                <div>
                  &copy; {new Date().getFullYear()} MedReport HMS. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Settings } from './pages/Settings';
import { Labs } from './pages/Labs';
import { Messages } from './pages/Messages';
import { Appointments } from './pages/Appointments';
import { StaffDirectory } from './pages/StaffDirectory';
import { Billing } from './pages/Billing';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { DoctorDetails } from './pages/DoctorDetails';
import { AuditLogs } from './pages/AuditLogs';

const DynamicTitle: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'Dashboard - MedReport',
      '/login': 'Login - MedReport',
      '/patients': 'Patient Directory - MedReport',
      '/appointments': 'Appointments - MedReport',
      '/labs': 'Laboratory - MedReport',
      '/messages': 'Messages - MedReport',
      '/staff': 'Staff Directory - MedReport',
      '/billing': 'Billing - MedReport',
      '/inventory': 'Inventory - MedReport',
      '/reports': 'Analytics & Reports - MedReport',
      '/doctors': 'Doctor Profiles - MedReport',
      '/settings': 'Settings - MedReport',
      '/audit-logs': 'Audit Logs - MedReport',
    };
    document.title = routeTitles[location.pathname] || 'MedReport – Hospital Management System';
  }, [location]);
  
  return null;
};

const PrivateRoute: React.FC<{ children: React.ReactNode, requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HospitalProvider>
          <Router>
            <DynamicTitle />
            <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/patients" element={
            <PrivateRoute>
              <Layout>
                <Patients />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/appointments" element={
            <PrivateRoute>
              <Layout>
                <Appointments />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/labs" element={
            <PrivateRoute>
              <Layout>
                <Labs />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <Layout>
                <Messages />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/staff" element={
            <PrivateRoute>
              <Layout>
                <StaffDirectory />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/billing" element={
            <PrivateRoute>
              <Layout>
                <Billing />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/inventory" element={
            <PrivateRoute>
              <Layout>
                <Inventory />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <Layout>
                <Reports />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/doctors" element={
            <PrivateRoute>
              <Layout>
                <DoctorDetails />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/audit-logs" element={
            <PrivateRoute requireAdmin>
              <Layout>
                <AuditLogs />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
        </Router>
      </HospitalProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

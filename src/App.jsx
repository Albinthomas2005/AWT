import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { JobsPage } from './pages/JobsPage';
import { ResultsPage } from './pages/ResultsPage';
import { LoginPage } from './pages/LoginPage';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = usePlacement();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/30',
    error: 'bg-rose-600 text-white shadow-rose-500/30',
    warning: 'bg-amber-500 text-white shadow-amber-500/30',
    info: 'bg-indigo-600 text-white shadow-indigo-500/30',
  }[toast.type] || 'bg-slate-900 text-white shadow-slate-900/30';

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[toast.type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold ${bgStyles}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

// Root redirect: Login is the first screen for unauthenticated users, or redirects to role dashboard
const RootRoute = () => {
  const { authSession } = usePlacement();
  if (!authSession?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (authSession.role === 'student') return <Navigate to="/student" replace />;
  if (authSession.role === 'company') return <Navigate to="/company" replace />;
  if (authSession.role === 'officer') return <Navigate to="/officer" replace />;
  return <Navigate to="/login" replace />;
};

// Login Route: If already authenticated, redirect to respective role dashboard
const LoginRoute = () => {
  const { authSession } = usePlacement();
  if (authSession?.isLoggedIn) {
    if (authSession.role === 'student') return <Navigate to="/student" replace />;
    if (authSession.role === 'company') return <Navigate to="/company" replace />;
    if (authSession.role === 'officer') return <Navigate to="/officer" replace />;
  }
  return <LoginPage />;
};

// Strict Role Guard: Redirects to /login if unauthenticated, or to own dashboard if wrong role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { authSession } = usePlacement();
  if (!authSession?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && authSession.role !== requiredRole) {
    const roleRedirect = authSession.role === 'student' ? '/student'
      : authSession.role === 'company' ? '/company'
      : authSession.role === 'officer' ? '/officer'
      : '/login';
    return <Navigate to={roleRedirect} replace />;
  }
  return children;
};

// Student/Admin Only Pages (Recruiters are strictly blocked from student job browsing)
const StudentOrAdminRoute = ({ children }) => {
  const { authSession } = usePlacement();
  if (!authSession?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (authSession.role === 'company') {
    return <Navigate to="/company" replace />;
  }
  return children;
};

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fe] dark:bg-[#0a0c13] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* First screen: Login if not logged in, or respective dashboard */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginRoute />} />

          {/* Student Dashboard & Sub-routes */}
          <Route path="/student" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/*" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* Placement Officer / Admin Dashboard */}
          <Route path="/officer" element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/officer/*" element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          {/* Recruiter Hub: ONLY accessible to authenticated Recruiter accounts */}
          <Route path="/company" element={
            <ProtectedRoute requiredRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/*" element={
            <ProtectedRoute requiredRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />

          {/* Job Drives & Results: Accessible to Students and Admin; Recruiters redirected to /company */}
          <Route path="/jobs" element={
            <StudentOrAdminRoute>
              <JobsPage />
            </StudentOrAdminRoute>
          } />
          <Route path="/results" element={
            <StudentOrAdminRoute>
              <ResultsPage />
            </StudentOrAdminRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastNotification />
    </div>
  );
};

function App() {
  return (
    <PlacementProvider>
      <Router>
        <AppLayout />
      </Router>
    </PlacementProvider>
  );
}

export default App;

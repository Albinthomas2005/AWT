import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Eye,
  EyeOff,
  AlertTriangle,
  HelpCircle,
  X,
  Phone,
  Globe,
  Hash,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { 
    login, 
    authSession, 
    logout, 
    students, 
    registerStudent, 
    registerRecruiter 
  } = usePlacement();

  // Mode: 'signin' | 'register-student' | 'register-recruiter'
  const [mode, setMode] = useState('signin');

  // Sign In State
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'company' | 'officer'
  const [identifier, setIdentifier] = useState('student@placement.com');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPendingNotice, setIsPendingNotice] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Student Registration Form State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    graduationYear: '2026',
    cgpa: ''
  });
  const [studentErrors, setStudentErrors] = useState({});

  // Recruiter Registration Form State
  const [recruiterForm, setRecruiterForm] = useState({
    recruiterName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    website: '',
    phone: ''
  });
  const [recruiterErrors, setRecruiterErrors] = useState({});

  const [registrationSuccess, setRegistrationSuccess] = useState('');

  const tabs = [
    { 
      id: 'student', 
      label: 'Student Portal', 
      Icon: GraduationCap, 
      defaultId: 'student@placement.com', 
      defaultPass: 'Student@123',
      badge: 'Candidate Hub'
    },
    { 
      id: 'company', 
      label: 'Recruiter Hub', 
      Icon: Building2, 
      defaultId: 'recruiter@placement.com', 
      defaultPass: 'Recruiter@123',
      badge: 'Corporate Partner'
    },
    { 
      id: 'officer', 
      label: 'Admin / TPO Hub', 
      Icon: UserCheck, 
      defaultId: 'admin@placement.com', 
      defaultPass: 'Admin@123',
      badge: 'Directorate'
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    setIdentifier(tab.defaultId);
    setPassword(tab.defaultPass);
    setError('');
    setIsPendingNotice(false);
  };

  const handleQuickFill = (emailVal, passVal, tabId) => {
    setActiveTab(tabId);
    setIdentifier(emailVal);
    setPassword(passVal);
    setError('');
    setIsPendingNotice(false);
  };

  const executeLogin = async (idToUse, passToUse) => {
    const finalId = idToUse !== undefined ? idToUse : identifier;
    const finalPass = passToUse !== undefined ? passToUse : password;
    setError('');
    setIsPendingNotice(false);

    if (!finalId.trim()) {
      setError('Please enter your email address or Login ID.');
      return;
    }
    if (!finalPass.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(finalId, finalPass, activeTab);
      setLoading(false);
      if (res && res.success) {
        navigate(res.path);
      } else {
        if (res?.isPending) {
          setIsPendingNotice(true);
        }
        setError(res?.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch {
      setLoading(false);
      setError('Unable to authenticate. Please verify your connection.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    executeLogin(identifier, password);
  };

  // Student Validation
  const validateStudentForm = () => {
    const errs = {};
    if (!studentForm.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!studentForm.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!studentForm.password) {
      errs.password = 'Password is required';
    } else if (studentForm.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (studentForm.password !== studentForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!studentForm.rollNo.trim()) errs.rollNo = 'Register number / Roll No is required';
    if (!studentForm.cgpa) {
      errs.cgpa = 'CGPA is required';
    } else {
      const val = parseFloat(studentForm.cgpa);
      if (isNaN(val) || val < 0 || val > 10) {
        errs.cgpa = 'CGPA must be between 0.00 and 10.00';
      }
    }
    setStudentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (!validateStudentForm()) return;

    const res = registerStudent(studentForm);
    if (res.success) {
      setRegistrationSuccess(`Student account created for ${studentForm.fullName}! You can now log in.`);
      setMode('signin');
      setActiveTab('student');
      setIdentifier(studentForm.email);
      setPassword(studentForm.password);
      setError('');
    } else {
      setStudentErrors({ general: res.message });
    }
  };

  // Recruiter Validation
  const validateRecruiterForm = () => {
    const errs = {};
    if (!recruiterForm.recruiterName.trim()) errs.recruiterName = 'Recruiter Name is required';
    if (!recruiterForm.email.trim()) {
      errs.email = 'Official corporate email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterForm.email)) {
      errs.email = 'Enter a valid official email address';
    }
    if (!recruiterForm.password) {
      errs.password = 'Password is required';
    } else if (recruiterForm.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (recruiterForm.password !== recruiterForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!recruiterForm.companyName.trim()) errs.companyName = 'Company Name is required';
    if (!recruiterForm.website.trim()) {
      errs.website = 'Company website is required';
    } else if (!/^https?:\/\/.+/.test(recruiterForm.website)) {
      errs.website = 'Website must begin with http:// or https://';
    }
    if (!recruiterForm.phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(recruiterForm.phone)) {
      errs.phone = 'Enter a valid 10-digit phone number';
    }
    setRecruiterErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRecruiterRegister = async (e) => {
    e.preventDefault();
    if (!validateRecruiterForm()) return;

    const res = await registerRecruiter(recruiterForm);
    if (res && res.success) {
      setRegistrationSuccess('Recruiter registration submitted! Status: PENDING APPROVAL. The Placement Officer must approve your account before you can access Recruiter Hub.');
      setMode('signin');
      setActiveTab('company');
      setIdentifier(recruiterForm.email);
      setPassword(recruiterForm.password);
      setError('');
    } else {
      setRecruiterErrors({ general: res?.message || 'Failed to submit recruiter registration.' });
    }
  };

  return (
    <div
      style={{ minHeight: 'calc(100vh - 80px)' }}
      className="w-full flex flex-col items-center justify-center px-4 sm:px-8 py-10 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-white to-sky-50/40 dark:from-[#0a0c13] dark:via-[#0f111c] dark:to-[#141526] pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6">

        {/* Portal Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>PlaceIQ Centralized Campus Recruitment Portal • Role-Based Access Control</span>
        </div>

        {/* Main Card */}
        <div className="w-full p-6 sm:p-10 md:p-12 rounded-[36px] bg-white/95 dark:bg-[#121422]/95 backdrop-blur-xl border-2 border-indigo-100 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.2)]">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
              {mode === 'signin' ? 'Portal Authentication' : mode === 'register-student' ? 'Student Registration' : 'Corporate Recruiter Registration'}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {mode === 'signin' 
                ? 'Sign in to access your role-specific dashboard, recruitment drives, and interview schedules'
                : mode === 'register-student'
                ? 'Create your student candidate profile to apply for campus placement drives and track interview rounds'
                : 'Register your company account to post campus recruitment drives and manage shortlisted candidates'}
            </p>
          </div>

          {/* Navigation Mode Pill Switcher */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setRegistrationSuccess(''); }}
              className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md scale-102'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register-student'); setError(''); setRegistrationSuccess(''); }}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center ${
                mode === 'register-student'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md scale-102'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Student Register
            </button>
            <button
              type="button"
              onClick={() => { setMode('register-recruiter'); setError(''); setRegistrationSuccess(''); }}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center ${
                mode === 'register-recruiter'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md scale-102'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Recruiter Register
            </button>
          </div>

          {/* Success Banner */}
          {registrationSuccess && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 flex items-start gap-3 text-xs sm:text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-emerald-900 dark:text-emerald-200 font-semibold">
                {registrationSuccess}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 1: SIGN IN FORM */}
          {/* ========================================================================= */}
          {mode === 'signin' && (
            <div className="mt-6 space-y-6">

              {/* Role selector tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto">
                {tabs.map((tab) => {
                  const Icon = tab.Icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab)}
                      className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-md scale-102'
                          : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-black">{tab.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{tab.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Currently Signed In Identity */}
              {authSession?.isLoggedIn && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">
                      Active Session: <strong className="font-black text-indigo-600 dark:text-indigo-400">{authSession.user?.name}</strong> ({authSession.role})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(authSession.role === 'student' ? '/student' : authSession.role === 'company' ? '/company' : '/officer')}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs"
                    >
                      Enter Dashboard →
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold border border-slate-200 dark:border-slate-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message Box */}
              {error && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm border-2 animate-shake ${
                  isPendingNotice 
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-200' 
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-900 dark:text-rose-200'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isPendingNotice ? 'text-amber-600' : 'text-rose-600'}`} />
                  <div>
                    <div className="font-black">{isPendingNotice ? 'Recruiter Account Pending Approval' : 'Authentication Failed'}</div>
                    <div className="mt-0.5 font-medium">{error}</div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="max-w-xl mx-auto space-y-4">
                
                {/* Email or Identifier Input */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {activeTab === 'student' ? 'Student Email / Roll Number' : activeTab === 'company' ? 'Corporate Recruiter Email' : 'Placement Officer Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                      placeholder={activeTab === 'student' ? 'student@placement.com or 1' : activeTab === 'company' ? 'recruiter@placement.com' : 'admin@placement.com'}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter account password"
                      required
                      className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-[#7d5fff] hover:opacity-95 text-white font-black text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to {activeTab === 'student' ? 'Student Portal' : activeTab === 'company' ? 'Recruiter Hub' : 'Admin Hub'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* DEMO ACCOUNTS QUICK-FILL SECTION (Requirement 8) */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                    One-Click Demo Test Accounts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Student Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('student@placement.com', 'Student@123', 'student')}
                    className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-left hover:scale-102 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        Student Demo
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        Candidate
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                      student@placement.com
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Pass: Student@123
                    </div>
                  </button>

                  {/* Recruiter Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('recruiter@placement.com', 'Recruiter@123', 'company')}
                    className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-left hover:scale-102 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        Recruiter Demo
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300">
                        Approved
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                      recruiter@placement.com
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Pass: Recruiter@123
                    </div>
                  </button>

                  {/* Admin Demo Account */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@placement.com', 'Admin@123', 'officer')}
                    className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-left hover:scale-102 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4" />
                        Admin Demo
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                        Directorate
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                      admin@placement.com
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Pass: Admin@123
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: STUDENT REGISTRATION FORM (Requirement 7) */}
          {/* ========================================================================= */}
          {mode === 'register-student' && (
            <form onSubmit={handleStudentRegister} className="mt-6 space-y-4 max-w-2xl mx-auto">
              
              {studentErrors.general && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  {studentErrors.general}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.fullName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.fullName && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@campus.edu"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.email && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Password * (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Create secure password"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.confirmPassword ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.confirmPassword && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.confirmPassword}</p>}
                </div>

                {/* Roll / Register Number */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Register Number / Roll No *
                  </label>
                  <input
                    type="text"
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    placeholder="e.g. 2022CS1050"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.rollNo ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.rollNo && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.rollNo}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Department / Branch *
                  </label>
                  <select
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                    <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                    <option value="Electrical Engineering">Electrical Engineering (EEE)</option>
                    <option value="AI & Data Science">AI & Data Science (AIDS)</option>
                  </select>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year *
                  </label>
                  <select
                    value={studentForm.graduationYear}
                    onChange={(e) => setStudentForm({ ...studentForm, graduationYear: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                  >
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026 (Current Batch)</option>
                    <option value="2027">Class of 2027</option>
                    <option value="2028">Class of 2028</option>
                  </select>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Current CGPA * (0.00 - 10.00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={studentForm.cgpa}
                    onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                    placeholder="e.g. 8.75"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      studentErrors.cgpa ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {studentErrors.cgpa && <p className="text-xs text-rose-500 mt-1 font-semibold">{studentErrors.cgpa}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Register as Student & Access Placement Drives</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODE 3: RECRUITER REGISTRATION FORM (Requirement 7) */}
          {/* ========================================================================= */}
          {mode === 'register-recruiter' && (
            <form onSubmit={handleRecruiterRegister} className="mt-6 space-y-4 max-w-2xl mx-auto">
              
              {/* Approval Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Administrative Approval Required:</strong>
                  <p className="mt-0.5">
                    Newly registered corporate recruiter accounts receive a <strong>Pending Approval</strong> status. You will not be granted access to the Recruiter Hub until verified and approved by the Placement Officer / Admin.
                  </p>
                </div>
              </div>

              {recruiterErrors.general && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  {recruiterErrors.general}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recruiter Full Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Recruiter Name *
                  </label>
                  <input
                    type="text"
                    value={recruiterForm.recruiterName}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, recruiterName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.recruiterName ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.recruiterName && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.recruiterName}</p>}
                </div>

                {/* Official Corporate Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Official Corporate Email *
                  </label>
                  <input
                    type="email"
                    value={recruiterForm.email}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                    placeholder="recruiter@company.com"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.email && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Password * (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    value={recruiterForm.password}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                    placeholder="Create recruiter password"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.password ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={recruiterForm.confirmPassword}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.confirmPassword ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.confirmPassword && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.confirmPassword}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={recruiterForm.companyName}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })}
                    placeholder="e.g. Apex Global Tech"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.companyName ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.companyName && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.companyName}</p>}
                </div>

                {/* Company Website */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Company Website * (https://...)
                  </label>
                  <input
                    type="url"
                    value={recruiterForm.website}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, website: e.target.value })}
                    placeholder="https://company.com"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.website ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.website && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.website}</p>}
                </div>

                {/* Contact Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Recruitment Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={recruiterForm.phone}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-sm font-medium ${
                      recruiterErrors.phone ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {recruiterErrors.phone && <p className="text-xs text-rose-500 mt-1 font-semibold">{recruiterErrors.phone}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Submit Recruiter Registration (Pending Verification)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

        </div>

        {/* Security & Architecture Footer */}
        <div className="text-center text-xs text-slate-400 font-medium max-w-lg">
          Protected by PlaceIQ Role-Based Access Control System. LocalStorage persistence enabled for demo environment.
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Account Password Recovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              In this environment, you can use the pre-configured demo credentials or reset your password through the Placement Directorate.
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 font-mono">
              <div><strong>Admin:</strong> admin@placement.com / Admin@123</div>
              <div><strong>Student:</strong> student@placement.com / Student@123</div>
              <div><strong>Recruiter:</strong> recruiter@placement.com / Recruiter@123</div>
            </div>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full mt-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black"
            >
              Got it, Return to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

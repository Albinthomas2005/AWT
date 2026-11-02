import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  Sun, 
  Moon, 
  RotateCcw, 
  ChevronDown, 
  Sparkles, 
  Award, 
  Layers,
  Bell,
  CheckCircle2,
  Calendar,
  LogIn,
  LogOut,
  Lock
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    darkMode, 
    setDarkMode, 
    currentRole, 
    currentStudent, 
    currentCompany,
    resetToDemoData,
    interviews,
    authSession,
    logout
  } = usePlacement();

  const [notifOpen, setNotifOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 transition-colors duration-200 backdrop-blur-md bg-white/90 dark:bg-[#0f111a]/95 border-b border-slate-200/80 dark:border-slate-800">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Brand Logo - links to role's dashboard if logged in, or /login */}
        <Link 
          to={authSession?.isLoggedIn ? (authSession.role === 'student' ? '/student' : authSession.role === 'company' ? '/company' : '/officer') : '/login'} 
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6c5ce7] via-[#7d5fff] to-[#a29bfe] flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">PlaceIQ</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium -mt-0.5 hidden sm:block">Campus Placement Portal</p>
          </div>
        </Link>

        {/* Center Nav Links - STRICT ROLE SEPARATION */}
        {authSession?.isLoggedIn && (
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-inner">
            
            {/* Student Navigation: Dashboard, Active Drives, Results */}
            {authSession.role === 'student' && (
              <>
                <Link
                  to="/student"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/student') 
                      ? 'bg-[#6c5ce7] text-white shadow-md shadow-indigo-500/25' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/jobs') 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Eligible Drives
                </Link>
                <Link
                  to="/results"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/results') 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Results
                </Link>
              </>
            )}

            {/* Recruiter Navigation: Recruiter Hub ONLY (NO student links) */}
            {authSession.role === 'company' && (
              <Link
                to="/company"
                className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                  isActive('/company') 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Recruiter Hub
              </Link>
            )}

            {/* Placement Officer / Admin Navigation */}
            {authSession.role === 'officer' && (
              <>
                <Link
                  to="/officer"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/officer') 
                      ? 'bg-[#6c5ce7] text-white shadow-md shadow-indigo-500/25' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/jobs') 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Drive Listings
                </Link>
                <Link
                  to="/results"
                  className={`px-5 py-2.5 text-sm font-extrabold rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive('/results') 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Placement Results
                </Link>
              </>
            )}

          </nav>
        )}

        {/* Right Action Tools: Role Switcher, Notifications, Dark Mode & Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Logged-in Candidate / Officer Identity */}
          {authSession?.isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
              {authSession.role === 'student' ? (
                <div className="flex items-center gap-2">
                  <img 
                    src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt={currentStudent?.name || 'Student'} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400 shrink-0" 
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {currentStudent?.name || authSession.user?.name || 'Student'}
                    </div>
                    <div className="text-[11px] font-bold text-slate-400">
                      {currentStudent?.branchCode || 'Candidate'}
                    </div>
                  </div>
                  {currentStudent?.cgpa !== undefined && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                      currentStudent.cgpa >= 9.0 
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40' 
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40'
                    }`}>
                      {currentStudent.cgpa} CGPA
                    </span>
                  )}
                </div>
              ) : authSession.role === 'officer' ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {authSession.user?.name || 'Directorate Officer'}
                    </div>
                    <div className="text-[11px] font-bold text-indigo-500">
                      TPO Directorate
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {currentCompany?.name ? `${currentCompany.name.split(' ')[0]} Recruiter` : (authSession.user?.name || 'Recruiter')}
                    </div>
                  </div>
                </div>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-200 dark:hover:text-rose-300 text-xs font-black transition-all cursor-pointer border border-slate-200 dark:border-slate-600 shadow-xs"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-[#7d5fff] hover:opacity-95 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-500/25"
            >
              <LogIn className="w-4 h-4" />
              <span>Student & Admin Login</span>
            </Link>
          )}

          {/* Quick Interviews / Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Interview notices & updates"
            >
              <Bell className="w-5 h-5" />
              {interviews.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
              )}
            </button>

            {notifOpen && (
              <div 
                className="absolute right-0 mt-2 w-88 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-fade-in"
                onClick={() => setNotifOpen(false)}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>Interview Schedule</span>
                  </div>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded-full">
                    {interviews.length} Active
                  </span>
                </div>
                <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto">
                  {interviews.map(inv => (
                    <div key={inv.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{inv.companyName}</span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{inv.date}</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{inv.studentName} ({inv.studentRoll})</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{inv.roundName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>



        </div>

      </div>

      {/* Mobile subnavigation bar - strictly role-aware */}
      {authSession?.isLoggedIn ? (
        <div className="flex md:hidden overflow-x-auto gap-2.5 pt-3 pb-1.5 no-scrollbar border-t border-slate-100 dark:border-slate-800/80 mt-2">
          {authSession.role === 'student' && (
            <>
              <Link to="/student" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/student') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Student Dashboard</Link>
              <Link to="/jobs" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/jobs') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Eligible Drives</Link>
              <Link to="/results" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/results') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Results</Link>
            </>
          )}
          {authSession.role === 'company' && (
            <Link to="/company" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/company') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Recruiter Hub</Link>
          )}
          {authSession.role === 'officer' && (
            <>
              <Link to="/officer" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/officer') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Admin Dashboard</Link>
              <Link to="/jobs" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/jobs') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Job Drives</Link>
              <Link to="/results" className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${isActive('/results') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'}`}>Results</Link>
            </>
          )}
        </div>
      ) : (
        <div className="flex md:hidden items-center justify-center pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80 mt-2">
          <Link to="/login" className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-md">
            Sign In to Placement Portal
          </Link>
        </div>
      )}
    </header>
  );
};

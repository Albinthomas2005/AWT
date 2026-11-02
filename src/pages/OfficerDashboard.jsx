import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Send,
  FileText,
  Lock,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { usePlacement } from '../context/PlacementContext';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { AddStudentModal } from '../components/AddStudentModal';
import { AddCompanyModal } from '../components/AddCompanyModal';
import { NewJobModal } from '../components/NewJobModal';
import { ScheduleInterviewModal } from '../components/ScheduleInterviewModal';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { ResumeModal } from '../components/ResumeModal';
import { AddRecruiterModal } from '../components/AddRecruiterModal';

export const OfficerDashboard = () => {
  const { 
    students, 
    companies, 
    jobs, 
    applications, 
    interviews,
    deleteStudent,
    deleteCompany,
    deleteJob,
    updateApplicationStatus,
    showToast,
    fireConfetti,
    authSession,
    currentRole,
    recruitersList,
    approveRecruiter,
    rejectRecruiter,
    deleteRecruiter
  } = usePlacement();

  // Active sub-tab: 'overview' | 'students' | 'recruiters' | 'companies' | 'drives' | 'interviews' | 'applications'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [inspectStudent, setInspectStudent] = useState(null);

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');

  const [companySearch, setCompanySearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Recruiter Search & Filters
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [recruiterStatusFilter, setRecruiterStatusFilter] = useState('All');

  const pendingRecruiters = (recruitersList || []).filter(r => r.status === 'Pending');
  const approvedRecruiters = (recruitersList || []).filter(r => r.status === 'Approved');
  const rejectedRecruiters = (recruitersList || []).filter(r => r.status === 'Rejected');

  const filteredRecruiters = (recruitersList || []).filter(r => {
    const q = recruiterSearch.toLowerCase().trim();
    const matchQuery = !q ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.companyName || '').toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.phone || '').toLowerCase().includes(q);
    const matchStatus = recruiterStatusFilter === 'All' || r.status === recruiterStatusFilter;
    return matchQuery && matchStatus;
  });

  // Statistics
  const totalStudents = students.length;
  const placedStudents = students.filter(s => s.status === 'Placed').length;
  const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
  const totalOffers = applications.filter(a => a.status === 'Offered').length;
  const activeDrives = jobs.filter(j => j.status === 'Open').length;

  // Chart Data: Department Placement Performance (dynamically calculated from database students)
  const branchMap = {};
  students.forEach(s => {
    const b = s.branchCode || 'OTHER';
    if (!branchMap[b]) branchMap[b] = { branch: b, total: 0, placed: 0 };
    branchMap[b].total += 1;
    if (s.status === 'Placed') branchMap[b].placed += 1;
  });
  const branchData = Object.values(branchMap).length > 0 
    ? Object.values(branchMap).map(b => ({
        ...b,
        rate: b.total > 0 ? Math.round((b.placed / b.total) * 100) : 0
      }))
    : [
        { branch: 'CSE', total: 0, placed: 0, rate: 0 },
        { branch: 'ECE', total: 0, placed: 0, rate: 0 },
        { branch: 'MECH', total: 0, placed: 0, rate: 0 }
      ];

  // Chart Data: Salary Tier Breakdown (dynamically calculated from database jobs)
  const dreamCount = jobs.filter(j => (parseFloat(j.packageCtc) || 0) >= 18).length;
  const coreCount = jobs.filter(j => {
    const p = parseFloat(j.packageCtc) || 0;
    return p >= 10 && p < 18;
  }).length;
  const standardCount = jobs.filter(j => {
    const p = parseFloat(j.packageCtc) || 0;
    return p >= 5 && p < 10;
  }).length;
  const massCount = jobs.filter(j => {
    const p = parseFloat(j.packageCtc) || 0;
    return p > 0 && p < 5;
  }).length;

  const rawSalaryTiers = [
    { name: 'Dream (> 18 LPA)', value: dreamCount, color: '#6c5ce7' },
    { name: 'Core (10 - 18 LPA)', value: coreCount, color: '#00b894' },
    { name: 'Standard (5 - 10 LPA)', value: standardCount, color: '#0984e3' },
    { name: 'Mass (< 5 LPA)', value: massCount, color: '#fdcb6e' },
  ].filter(t => t.value > 0);

  const salaryTiersData = rawSalaryTiers.length > 0
    ? rawSalaryTiers
    : [{ name: 'Campus Drives', value: jobs.length || 1, color: '#6c5ce7' }];

  // Dynamic CTC Calculations from active database jobs
  const allCtcs = jobs.map(j => parseFloat(j.packageCtc) || 0).filter(c => c > 0);
  const avgCtc = allCtcs.length > 0 ? (allCtcs.reduce((a, b) => a + b, 0) / allCtcs.length).toFixed(1) : '0.0';
  const highestJob = jobs.reduce((max, j) => ((parseFloat(j.packageCtc) || 0) > (parseFloat(max?.packageCtc) || 0) ? j : max), jobs[0] || null);
  const highestJobDisplay = highestJob ? `Highest: ₹${highestJob.packageCtc} LPA (${highestJob.companyName})` : 'Drives pending';

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesBranch = studentBranchFilter === 'All' || s.branchCode === studentBranchFilter;
    const matchesStatus = studentStatusFilter === 'All' || s.status === studentStatusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Filtered Companies
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.industry.toLowerCase().includes(companySearch.toLowerCase())
  );

  // Filtered Jobs
  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.companyName.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const exportStudentsCSV = () => {
    const headers = 'Roll No,Name,Email,Department,CGPA,Backlogs,Status,Placed Company,Package\n';
    const rows = students.map(s => `"${s.rollNo}","${s.name}","${s.email}","${s.department}",${s.cgpa},${s.backlogs},"${s.status}","${s.placedCompany || 'N/A'}","${s.placedPackage || 'N/A'}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Placement_Cohort_2026_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported student placement registry to CSV', 'success');
  };

  // Access Control: TPO Directorate is strictly reserved for verified Admin
  if (authSession?.role !== 'officer' || currentRole !== 'officer') {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner border border-rose-200 dark:border-rose-800">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider">
              Restricted Area • TPO Directorate Only
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Administrator Access Required
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              The University Placement Directorate Console is exclusively authorized for Placement Directorate Administrators. Candidate enrollment, recruiting enterprise contracts, and interview scheduling require verified administrative credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-left flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs block font-bold uppercase tracking-wider">Active Portal Session</span>
              <strong className="text-slate-900 dark:text-white font-black text-sm">
                {authSession?.user?.name || 'Student Account'}
              </strong>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs">
              Role: {authSession?.role || currentRole}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span>Sign In as TPO Admin</span>
            </Link>
            <Link
              to="/student"
              className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <span>Back to Student Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Directorate Console Badge */}
        <div className="relative z-10 mb-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm sm:text-base font-black tracking-wide">
            UNIVERSITY PLACEMENT DIRECTORATE
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
            All Actions Enabled
          </span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Outfit'] text-white">
              Placement Officer Directorate
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-medium">
              Complete placement lifecycle management — enroll students, register recruiting enterprises, coordinate interview schedules, and analyze cohort achievements.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white text-base font-black shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Announce Drive</span>
            </button>
            <button
              onClick={() => setStudentModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-base font-bold border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-5 h-5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => setRecruiterModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-base font-bold border border-amber-400/40 transition-all hover:scale-105 active:scale-95"
            >
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Add Recruiter</span>
            </button>
            <button
              onClick={() => setCompanyModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-base font-bold border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Building2 className="w-5 h-5" />
              <span>Add Partner Company</span>
            </button>
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Round</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Analytics & Overview', icon: TrendingUp },
            { id: 'students', label: `Manage Students (${students.length})`, icon: Users },
            { 
              id: 'recruiters', 
              label: `Recruiter Approvals (${recruitersList.length})`, 
              icon: UserCheck, 
              badge: pendingRecruiters.length 
            },
            { id: 'companies', label: `Recruiting Partners (${companies.length})`, icon: Building2 },
            { id: 'drives', label: `Campus Drives (${jobs.length})`, icon: Briefcase },
            { id: 'applications', label: `Applications (${applications.length})`, icon: CheckCircle },
            { id: 'interviews', label: `Interviews (${interviews.length})`, icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-base font-black whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 animate-pulse shadow-sm shadow-amber-500/50">
                    {tab.badge} Pending
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">

          {/* Pending Recruiter Registrations Banner (Notice if any are pending approval) */}
          {pendingRecruiters.length > 0 && (
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-700/60 shadow-xl shadow-amber-500/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                        {pendingRecruiters.length} Recruiter Registration{pendingRecruiters.length > 1 ? 's' : ''} Awaiting Approval
                      </h4>
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      New enterprise recruiters have registered on PlaceIQ and require Placement Directorate verification to access student resumes and post campus drives.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('recruiters')}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shrink-0 shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <span>Review All ({pendingRecruiters.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Approval Cards for Pending Recruiters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {pendingRecruiters.slice(0, 3).map(rec => (
                  <div 
                    key={rec.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-black text-base text-slate-900 dark:text-white">{rec.name}</h5>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{rec.companyName}</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          Pending
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="truncate font-medium">{rec.email}</div>
                        {rec.phone && <div>{rec.phone}</div>}
                        {rec.website && (
                          <a 
                            href={rec.website} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                          >
                            <span>{rec.website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => approveRecruiter(rec.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Approve Access</span>
                      </button>
                      <button
                        onClick={() => rejectRecruiter(rec.id)}
                        className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Placement Rate</span>
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                  %
                </span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit']">{placementRate}%</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                {placedStudents} of {totalStudents} Students Placed
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average CTC</span>
                <span className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                  ₹
                </span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit']">₹{avgCtc} LPA</h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-2">{highestJobDisplay}</p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Drives</span>
                <span className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit']">{activeDrives}</h3>
              <p className="text-sm text-slate-500 font-semibold mt-2">{companies.length} Corporate Recruiters</p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Offer Rollouts</span>
                <span className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit']">{totalOffers}</h3>
              <p className="text-sm text-amber-600 dark:text-amber-400 font-bold mt-2">Confirmed Letter of Intents</p>
            </div>
          </div>

          {/* Interactive Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Branch-wise Placement Rate Bar Chart */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                    Department-Wise Placement Performance
                  </h3>
                  <p className="text-xs text-slate-500">Placement conversion % across engineering disciplines</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  Target: 90%+
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                    <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip 
                      formatter={(val) => [`${val}%`, 'Placement Rate']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="rate" fill="#6c5ce7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Salary Tier Breakdown Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  Compensation Brackets (CTC)
                </h3>
                <p className="text-xs text-slate-500">Distribution of campus job packages</p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryTiersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {salaryTiersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}% Offers`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {salaryTiersData.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Live Applications & Fast Action Table */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  Recent Candidate Applications Requiring Review
                </h3>
                <p className="text-sm sm:text-base text-slate-400 font-medium">Fast action dashboard to shortlist, interview, or roll out formal offers</p>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
              >
                <span>View all ({applications.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 rounded-l-2xl">Candidate Details</th>
                    <th className="p-4">Recruiting Enterprise & Role</th>
                    <th className="p-4">Current Pipeline Status</th>
                    <th className="p-4">Active Round</th>
                    <th className="p-4 text-right rounded-r-2xl">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {applications.slice(0, 5).map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold">
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{app.studentName}</div>
                        <div className="text-xs sm:text-sm text-slate-400 font-semibold">{app.studentRoll} • {app.studentBranch} (CGPA {app.studentCgpa})</div>
                      </td>
                      <td className="p-4">
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{app.companyName}</div>
                        <div className="text-xs sm:text-sm text-indigo-500 dark:text-indigo-400 font-bold">{app.jobTitle}</div>
                      </td>
                      <td className="p-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-400">
                        {app.interviewRound || 'Pending review'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {app.status === 'Offered' && (
                          <button
                            onClick={() => setSelectedOfferApp(app)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-black shadow-xs"
                          >
                            View Offer Letter
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setInterviewModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-500/20"
                        >
                          Schedule Round
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[300px]">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student name, roll no, email..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <select
                value={studentBranchFilter}
                onChange={(e) => setStudentBranchFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl text-sm sm:text-base font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Engineering Branches</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>

              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl text-sm sm:text-base font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Placement Statuses</option>
                <option value="Placed">Placed Candidates</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Seeking">Seeking Opportunities</option>
              </select>
            </div>

            {/* Actions - Exclusive to Admin */}
            <div className="flex items-center gap-3">
              <button
                onClick={exportStudentsCSV}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm sm:text-base font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setStudentModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>+ Enroll Student</span>
              </button>
            </div>

          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Student Name & Identification</th>
                    <th className="p-4">Branch</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Backlogs</th>
                    <th className="p-4">Core Skills</th>
                    <th className="p-4">Placement Status</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-400 shadow-sm" />
                          <div>
                            <div className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{student.name}</div>
                            <div className="text-xs sm:text-sm text-slate-400 font-semibold">{student.rollNo} • {student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold">
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
                          {student.branchCode}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-base sm:text-lg font-black ${student.cgpa >= 8.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {student.cgpa}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black ${
                          student.backlogs === 0 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {student.backlogs} Backlogs
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {student.skills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {sk}
                            </span>
                          ))}
                          {student.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs sm:text-sm font-bold text-slate-400">+{student.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {student.status === 'Placed' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="w-4 h-4" /> Placed at {student.placedCompany}
                            </span>
                            <div className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">{student.placedPackage}</div>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {student.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectStudent(student)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-black hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5 mr-2 cursor-pointer"
                          title="Inspect verified candidate ATS resume"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Resume</span>
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer inline-flex items-center"
                          title="Delete student record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: RECRUITER REGISTRATIONS & APPROVALS */}
      {activeTab === 'recruiters' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Stats Banner */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Access Management
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {recruitersList.length} Total Accounts
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 font-['Outfit']">
                Corporate Recruiter Approvals & Directory
              </h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
                Verify and approve corporate recruiters requesting campus placement privileges. Approved recruiters gain immediate access to post campus job drives and evaluate student profiles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setRecruiterModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>+ Add Recruiter</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recruiters</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{recruitersList.length}</div>
              <div className="text-xs text-slate-500 mt-1">Self-registered & invited</div>
            </div>

            <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${pendingRecruiters.length > 0 ? 'border-amber-400 dark:border-amber-600/80 shadow-md shadow-amber-500/10' : 'border-slate-200 dark:border-slate-800'} shadow-xs`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Review</span>
                {pendingRecruiters.length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingRecruiters.length}</div>
              <div className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1 font-semibold">Requires verification</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Approved Partners</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{approvedRecruiters.length}</div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-semibold">Active Hub Access</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected Requests</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-600 dark:text-slate-400 mt-1">{rejectedRecruiters.length}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Access restricted</div>
            </div>
          </div>

          {/* Pending Verification Priority Queue (if any pending) */}
          {pendingRecruiters.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      Action Required: {pendingRecruiters.length} Pending Recruiter Verification Request{pendingRecruiters.length > 1 ? 's' : ''}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      These recruiters submitted their corporate details and cannot log in until you approve their access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRecruiters.map(rec => (
                  <div
                    key={rec.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                            Awaiting Approval
                          </span>
                          <h5 className="text-lg font-black text-slate-900 dark:text-white mt-1">{rec.name}</h5>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{rec.companyName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                          {(rec.name || 'R').charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold shrink-0">Email:</span>
                          <span className="truncate select-all font-semibold">{rec.email}</span>
                        </div>
                        {rec.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold shrink-0">Phone:</span>
                            <span className="font-semibold">{rec.phone}</span>
                          </div>
                        )}
                        {rec.website && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold shrink-0">Portal:</span>
                            <a
                              href={rec.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate font-bold"
                            >
                              <span className="truncate">{rec.website}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                          <span>Submitted: {rec.registeredAt || 'Today'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => approveRecruiter(rec.id)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Approve Access</span>
                      </button>
                      <button
                        onClick={() => rejectRecruiter(rec.id)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                        title="Reject application"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search, Filter Bar, and Complete Directory */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={recruiterSearch}
                  onChange={(e) => setRecruiterSearch(e.target.value)}
                  placeholder="Search by recruiter name, enterprise, email, phone..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'All', label: `All (${recruitersList.length})` },
                  { id: 'Pending', label: `Pending (${pendingRecruiters.length})` },
                  { id: 'Approved', label: `Approved (${approvedRecruiters.length})` },
                  { id: 'Rejected', label: `Rejected (${rejectedRecruiters.length})` }
                ].map(flt => (
                  <button
                    key={flt.id}
                    onClick={() => setRecruiterStatusFilter(flt.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                      recruiterStatusFilter === flt.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Directory Table */}
            {filteredRecruiters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4 rounded-l-2xl">Recruiter Identity</th>
                      <th className="p-4">Enterprise / Company</th>
                      <th className="p-4">Official Phone</th>
                      <th className="p-4">Registered Date</th>
                      <th className="p-4">Approval Status</th>
                      <th className="p-4 text-right rounded-r-2xl">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredRecruiters.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-black text-sm shrink-0">
                              {(rec.name || 'R').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 dark:text-white text-base">{rec.name}</div>
                              <div className="text-xs text-slate-400 font-medium truncate max-w-xs">{rec.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-slate-900 dark:text-white">{rec.companyName}</div>
                          {rec.website && (
                            <a
                              href={rec.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span>Corporate Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                          {rec.phone || '—'}
                        </td>

                        <td className="p-4 text-slate-400 font-semibold text-xs sm:text-sm">
                          {rec.registeredAt || '2026-11-01'}
                        </td>

                        <td className="p-4">
                          {rec.status === 'Approved' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Approved
                            </span>
                          ) : rec.status === 'Pending' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              Pending Approval
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Rejected
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right whitespace-nowrap space-x-2">
                          {rec.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => approveRecruiter(rec.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => rejectRecruiter(rec.id)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {rec.status === 'Approved' && (
                            <button
                              onClick={() => rejectRecruiter(rec.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-500 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                              title="Revoke access"
                            >
                              Revoke Access
                            </button>
                          )}

                          {rec.status === 'Rejected' && (
                            <button
                              onClick={() => approveRecruiter(rec.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-black transition-colors cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}

                          <button
                            onClick={() => deleteRecruiter(rec.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-xl transition-colors cursor-pointer inline-flex items-center"
                            title="Delete recruiter record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">No Recruiter Accounts Found</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  {recruiterSearch || recruiterStatusFilter !== 'All'
                    ? 'No recruiters match your current search or filter criteria. Try resetting filters.'
                    : 'No recruiters have registered yet. Recruiters who sign up via the Recruiter Portal will appear here.'}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  {(recruiterSearch || recruiterStatusFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setRecruiterSearch('');
                        setRecruiterStatusFilter('All');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold"
                    >
                      Reset Filters
                    </button>
                  )}
                  <button
                    onClick={() => setRecruiterModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black"
                  >
                    + Add Recruiter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANIES MANAGEMENT */}
      {activeTab === 'companies' && (
        <div className="space-y-6 animate-fade-in">
          {/* Linked Recruiter Summary Banner in Companies Tab */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Corporate Recruiter Accounts & Registration Queue ({recruitersList.length})
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {pendingRecruiters.length > 0 
                    ? `⚠️ ${pendingRecruiters.length} recruiter accounts are currently awaiting your approval.`
                    : 'All registered recruiter accounts are verified and up to date.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('recruiters')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              Manage Recruiter Approvals ({recruitersList.length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative min-w-[320px]">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Search recruiters, sectors..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <button
              onClick={() => setCompanyModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+ Register Partner Company</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <div 
                key={company.id}
                className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {company.tier}
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-['Outfit']">{company.name}</h4>
                      <p className="text-sm font-semibold text-slate-400">{company.industry}</p>
                    </div>
                    <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 rounded-xl transition-colors"
                      title="Remove company"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {company.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Average CTC</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg">{company.avgPackage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Campus Hires</span>
                    <span className="font-black text-slate-900 dark:text-white">{company.totalHires} Engineers</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">HR Contact</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold truncate max-w-[160px]">{company.hrContact}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>Corporate Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => {
                        setJobModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-black text-xs sm:text-sm shadow-xs hover:bg-indigo-100"
                    >
                      + Post Drive
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CAMPUS DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative min-w-[320px]">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search job drives, positions..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+ Publish New Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <div 
                key={job.id}
                className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{job.companyName}</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-['Outfit']">{job.title}</h4>
                      <p className="text-sm font-semibold text-slate-400">{job.role} • {job.location}</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{job.packageDisplay}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Eligibility criteria breakdown box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Min CGPA</span>
                    <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{job.minCgpa}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Max Backlogs</span>
                    <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{job.maxBacklogs}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Branches</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 truncate block text-sm sm:text-base">{job.allowedBranches.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm font-semibold">
                  <span className="text-slate-400">Deadline: <strong className="text-slate-800 dark:text-slate-200">{job.deadline}</strong></span>
                  <div className="space-x-2">
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 font-black text-sm transition-colors"
                    >
                      Archive Drive
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: APPLICATIONS & SELECTION MANAGEMENT */}
      {activeTab === 'applications' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-7 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Candidate Drive Applications & Evaluation
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Authorize selections, schedule rounds, or release final offer letters</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 rounded-l-2xl">Candidate</th>
                  <th className="p-4">Enterprise & Drive</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right rounded-r-2xl">Action Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{app.studentName}</div>
                      <div className="text-xs sm:text-sm text-slate-400 font-semibold">{app.studentRoll} • {app.studentBranch} (CGPA {app.studentCgpa})</div>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-slate-900 dark:text-white text-base">{app.companyName}</div>
                      <div className="text-xs sm:text-sm text-indigo-500 dark:text-indigo-400 font-bold">{app.jobTitle}</div>
                    </td>
                    <td className="p-4 text-slate-400 font-semibold">{app.appliedDate}</td>
                    <td className="p-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Screened')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-black shadow-xs"
                        title="Shortlist for interviews"
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() => {
                          setInterviewModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 text-xs sm:text-sm font-black shadow-xs"
                        title="Assign interview date"
                      >
                        Interview
                      </button>

                      <button
                        onClick={() => {
                          const pkg = '₹24.0 LPA';
                          updateApplicationStatus(app.id, 'Offered', pkg, 'Direct placement offer rollout accredited by TPO Directorate');
                          fireConfetti();
                          showToast(`Formal placement offer of ${pkg} rolled out to ${app.studentName}!`, 'success');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        title="Grant formal placement offer"
                      >
                        Rollout Offer 🎉
                      </button>

                      {app.status === 'Offered' && (
                        <button
                          onClick={() => setSelectedOfferApp(app)}
                          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                        >
                          View Offer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SCHEDULED INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Live Campus Interview Calendar
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Upcoming panel interviews and room allocations</p>
            </div>
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-black bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+ Schedule Interview Round</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map(inv => (
              <div 
                key={inv.id}
                className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                      {inv.companyName}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">{inv.status}</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{inv.roundName}</h4>
                  <p className="text-sm font-semibold text-slate-400 mt-1">Candidate: <strong className="text-slate-800 dark:text-slate-200">{inv.studentName}</strong> ({inv.studentRoll})</p>
                </div>

                <div className="space-y-2.5 text-sm p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-medium">
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="font-bold">{inv.date} • {inv.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 truncate">
                    <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{inv.venueOrLink}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-400 font-semibold italic">
                  Evaluation Lead: {inv.interviewer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddStudentModal isOpen={studentModalOpen} onClose={() => setStudentModalOpen(false)} />
      <AddCompanyModal isOpen={companyModalOpen} onClose={() => setCompanyModalOpen(false)} />
      <AddRecruiterModal isOpen={recruiterModalOpen} onClose={() => setRecruiterModalOpen(false)} />
      <NewJobModal isOpen={jobModalOpen} onClose={() => setJobModalOpen(false)} />
      <ScheduleInterviewModal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} />
      <OfferLetterModal application={selectedOfferApp} onClose={() => setSelectedOfferApp(null)} />
      <ResumeModal
        student={inspectStudent}
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
      />

    </div>
  );
};

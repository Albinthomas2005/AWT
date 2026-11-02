import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  LogOut,
  Bell,
  Settings,
  ShieldCheck,
  UserCheck,
  HelpCircle
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { NewJobModal } from '../components/NewJobModal';
import { ScheduleInterviewModal } from '../components/ScheduleInterviewModal';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { ResumeModal } from '../components/ResumeModal';

export const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentCompany, 
    students,
    jobs, 
    applications, 
    interviews,
    updateApplicationStatus, 
    deleteJob,
    showToast,
    fireConfetti,
    authSession,
    logout
  } = usePlacement();

  // Strict Role Guard: Only authenticated Recruiter accounts can access Recruiter Hub
  if (!authSession?.isLoggedIn || authSession?.role !== 'company') {
    return <Navigate to="/login" replace />;
  }

  // Navigation tab: 'overview' | 'profile' | 'jobs' | 'applicants' | 'shortlisted' | 'interviews' | 'results' | 'notifications' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [inspectStudent, setInspectStudent] = useState(null);

  // Filters for Applicants
  const [applicantSearch, setApplicantSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!currentCompany) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-500 font-bold">Connecting to corporate recruiter portal...</p>
        </div>
      </div>
    );
  }

  // Company specific jobs and applicants (Recruiter only sees their own company data)
  const companyJobs = jobs.filter(j => 
    j.companyId === currentCompany.id || 
    j.companyName?.toLowerCase() === currentCompany.name?.toLowerCase()
  );
  const companyJobIds = companyJobs.map(j => j.id);
  const companyApplicants = applications.filter(a => 
    a.companyId === currentCompany.id || 
    a.companyName?.toLowerCase() === currentCompany.name?.toLowerCase() || 
    companyJobIds.includes(a.jobId)
  );

  // Shortlisted applicants ('Screened' or 'Interview')
  const shortlistedApplicants = companyApplicants.filter(a => a.status === 'Screened' || a.status === 'Interview');

  // Offered applicants
  const offeredApplicants = companyApplicants.filter(a => a.status === 'Offered');

  // Company scheduled interviews
  const companyInterviews = interviews.filter(i => 
    i.companyName?.toLowerCase() === currentCompany.name?.toLowerCase() ||
    companyJobIds.includes(i.jobId)
  );

  // Filtered applicants
  const filteredApplicants = companyApplicants.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                          a.studentRoll.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                          a.studentBranch.toLowerCase().includes(applicantSearch.toLowerCase());
    const matchesJob = jobFilter === 'All' || a.jobId === jobFilter || a.jobTitle === jobFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Recruiter Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-2.5 shadow-xl flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit'] text-white">
                  {currentCompany.name}
                </h1>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-black border border-emerald-500/30">
                  {currentCompany.tier || 'Corporate Partner'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-semibold">
                Welcome back, {authSession?.user?.name || currentCompany.name} Recruitment Team!
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                Official Recruiter: {authSession?.user?.email || currentCompany.email} • {currentCompany.location || 'Headquarters'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Post a Job</span>
            </button>
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-bold border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Authenticated strip & Logout */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium text-xs">Authenticated Recruiter:</span>
            <strong className="text-white font-black">{authSession.user?.name}</strong>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              {currentCompany.name} Hub
            </span>
          </div>

          <button
            type="button"
            onClick={() => { logout(); navigate('/login'); }}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Recruiter Navigation Bar (Section 4 & 9 Requirements) */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Recruiter Hub', icon: Sparkles },
            { id: 'jobs', label: `Manage Jobs (${companyJobs.length})`, icon: Briefcase },
            { id: 'applicants', label: `View Applicants (${companyApplicants.length})`, icon: Users },
            { id: 'shortlisted', label: `Shortlisted (${shortlistedApplicants.length})`, icon: UserCheck },
            { id: 'interviews', label: `Interviews (${companyInterviews.length})`, icon: Calendar },
            { id: 'results', label: `Selection Results (${offeredApplicants.length})`, icon: Award },
            { id: 'profile', label: 'Company Profile', icon: Building2 },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-md scale-102 font-black'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RECRUITER HUB OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Key KPI Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Active Jobs</span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">{companyJobs.length}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">Drives hosted by {currentCompany.name}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Applicants</span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">{companyApplicants.length}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-2">Applications received</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Shortlisted Candidates</span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">{shortlistedApplicants.length}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-2">Passed screening review</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Scheduled Interviews</span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">{companyInterviews.length}</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-2">Upcoming evaluation rounds</p>
            </div>
          </div>

          {/* Quick Actions & Recent Applications Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Candidate Applications */}
            <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">Recent Candidate Applications</h4>
                  <p className="text-xs text-slate-400 font-medium">Latest submissions for {currentCompany.name} openings</p>
                </div>
                <button
                  onClick={() => setActiveTab('applicants')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All ({companyApplicants.length}) →
                </button>
              </div>

              {companyApplicants.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="font-bold text-sm">No applications received yet.</p>
                  <p className="text-xs mt-0.5">Post a campus job opening to start receiving student applications.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                      <tr>
                        <th className="py-2.5">Candidate</th>
                        <th className="py-2.5">Job Role</th>
                        <th className="py-2.5">CGPA</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {companyApplicants.slice(0, 5).map(app => (
                        <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-slate-900 dark:text-white">
                            <div>{app.studentName}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{app.studentBranch} • {app.studentRoll}</div>
                          </td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{app.jobTitle}</td>
                          <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{app.studentCgpa}</td>
                          <td className="py-3"><ApplicationStatusBadge status={app.status} /></td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                const st = students.find(s => s.id === app.studentId) || { name: app.studentName, rollNo: app.studentRoll };
                                setInspectStudent(st);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-xs font-bold"
                            >
                              Resume
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recruiter Activity & Drive Highlights */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">Recruitment Controls</h4>
              
              <div className="space-y-3">
                <button
                  onClick={() => setJobModalOpen(true)}
                  className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left hover:scale-102 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-emerald-900 dark:text-emerald-200">Post New Campus Drive</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400">Specify CTC, CGPA cutoff & branches</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInterviewModalOpen(true)}
                  className="w-full p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left hover:scale-102 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-indigo-900 dark:text-indigo-200">Schedule Evaluation Round</div>
                      <div className="text-xs text-indigo-700 dark:text-indigo-400">Technical or HR interview slot</div>
                    </div>
                  </div>
                </button>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-black uppercase text-slate-400">Corporate Information</div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tier: <span className="text-emerald-600 font-black">{currentCompany.tier || 'Tier 1 Dream'}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Industry: {currentCompany.industry || 'Technology & Software Systems'}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAGE JOBS (JOB POSTINGS) */}
      {/* ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Campus Job Drives Hosted by {currentCompany.name} ({companyJobs.length})
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Manage vacancies, application deadlines, and eligibility criteria</p>
            </div>
            
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>+ Create New Listing</span>
            </button>
          </div>

          {companyJobs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-black text-slate-800 dark:text-white">No active campus drives published</h4>
              <p className="text-sm text-slate-400 mt-1">Click the button above to publish your first campus job opening.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyJobs.map(job => (
                <div 
                  key={job.id}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xl transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">{job.title}</h4>
                        <p className="text-sm font-semibold text-slate-400">{job.role} • {job.location}</p>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{job.packageDisplay}</span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed font-medium">
                      {job.description}
                    </p>
                  </div>

                  {/* Eligibility parameters */}
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
                      <span className="font-black text-emerald-600 dark:text-emerald-400 truncate block text-sm sm:text-base">
                        {Array.isArray(job.allowedBranches) ? job.allowedBranches.join(', ') : job.allowedBranches}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm font-semibold">
                    <span className="text-slate-400">Deadline: <strong className="text-slate-800 dark:text-slate-200">{job.deadline}</strong></span>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-rose-600 hover:text-rose-700 hover:underline font-bold text-sm px-3 py-1 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      Archive Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VIEW APPLICANTS */}
      {/* ========================================================================= */}
      {activeTab === 'applicants' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[280px]">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Filter candidate name, roll, branch..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Application Stages</option>
                <option value="Applied">1. Applied</option>
                <option value="Screened">2. Profile Screened</option>
                <option value="Interview">3. Interview Scheduled</option>
                <option value="Offered">4. Offer Extended</option>
                <option value="Rejected">5. Rejected</option>
              </select>
            </div>

            <div className="text-sm font-bold text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredApplicants.length}</strong> Applications
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {filteredApplicants.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-lg font-black text-slate-700 dark:text-slate-300">No applicants found matching filter</p>
                <p className="text-sm mt-1">Adjust search terms or status criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800 text-xs">
                    <tr>
                      <th className="p-4">Candidate Profile</th>
                      <th className="p-4">Applied Opening</th>
                      <th className="p-4">Academic CGPA</th>
                      <th className="p-4">Current Stage</th>
                      <th className="p-4 text-right">Recruiter Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredApplicants.map(applicant => (
                      <tr key={applicant.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-slate-900 dark:text-white text-base">{applicant.studentName}</div>
                          <div className="text-xs text-slate-400 font-semibold">{applicant.studentRoll} • {applicant.studentBranch}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{applicant.jobTitle}</div>
                          <div className="text-xs text-slate-400 font-medium">Applied: {applicant.appliedDate}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">{applicant.studentCgpa} CGPA</div>
                        </td>
                        <td className="p-4">
                          <ApplicationStatusBadge status={applicant.status} />
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              const st = students.find(s => s.id === applicant.studentId) || {
                                id: applicant.studentId,
                                name: applicant.studentName,
                                rollNo: applicant.studentRoll,
                                branchCode: applicant.studentBranch,
                                department: applicant.studentBranch || 'Engineering',
                                cgpa: applicant.studentCgpa || 0,
                                backlogs: 0,
                                skills: [],
                                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                                email: `${applicant.studentRoll?.toLowerCase() || 'student'}@campus.edu`
                              };
                              setInspectStudent(st);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black hover:bg-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Resume</span>
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(applicant.id, 'Screened')}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-black shadow-xs cursor-pointer"
                          >
                            Shortlist
                          </button>

                          <button
                            onClick={() => setInterviewModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 text-xs font-black shadow-xs cursor-pointer"
                          >
                            Interview
                          </button>

                          <button
                            onClick={() => {
                              updateApplicationStatus(applicant.id, 'Offered', currentCompany.avgPackage || '₹24.0 LPA');
                              fireConfetti();
                              showToast(`Formal offer extended to ${applicant.studentName}!`, 'success');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/25 cursor-pointer"
                          >
                            Offer 🎉
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(applicant.id, 'Rejected')}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SHORTLISTED CANDIDATES */}
      {/* ========================================================================= */}
      {activeTab === 'shortlisted' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Shortlisted Candidates ({shortlistedApplicants.length})
            </h3>
            <p className="text-sm text-slate-400">Candidates approved through preliminary screening and eligible for technical interviews</p>
          </div>

          {shortlistedApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-black text-slate-800 dark:text-white">No shortlisted candidates</h4>
              <p className="text-sm text-slate-400 mt-1">Review candidate pipeline under "View Applicants" to shortlist candidates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shortlistedApplicants.map(candidate => (
                <div key={candidate.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">{candidate.studentName}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{candidate.studentRoll} • {candidate.studentBranch}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs">
                      {candidate.studentCgpa} CGPA
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs">
                    <span className="text-slate-400 block font-medium">Applied Opening</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">{candidate.jobTitle}</strong>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setInterviewModalOpen(true)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                    >
                      Schedule Round
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStatus(candidate.id, 'Offered', '₹24.0 LPA');
                        fireConfetti();
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: INTERVIEW MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Interview Schedules ({companyInterviews.length})
              </h3>
              <p className="text-sm text-slate-400">Technical assessment slots and evaluation panels</p>
            </div>
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule New Interview</span>
            </button>
          </div>

          {companyInterviews.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-black text-slate-800 dark:text-white">No interviews scheduled yet</h4>
              <p className="text-sm text-slate-400 mt-1">Click "Schedule New Interview" to coordinate evaluation slots with candidates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {companyInterviews.map(inv => (
                <div key={inv.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base">{inv.roundName}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{inv.studentName} ({inv.studentRoll})</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
                      {inv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <div>
                      <span className="text-slate-400 block font-medium">Date & Time</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inv.date} • {inv.time}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Interviewer Panel</span>
                      <strong className="text-slate-800 dark:text-slate-200">{inv.interviewer || 'Technical Panel'}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    Venue / Link: <span className="font-mono text-indigo-600 dark:text-indigo-400">{inv.venueOrLink}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SELECTION RESULTS */}
      {/* ========================================================================= */}
      {activeTab === 'results' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Selection & Placement Results ({offeredApplicants.length})
            </h3>
            <p className="text-sm text-slate-400">Formal placement offers issued by {currentCompany.name}</p>
          </div>

          {offeredApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Award className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-black text-slate-800 dark:text-white">No offers extended yet</h4>
              <p className="text-sm text-slate-400 mt-1">Once candidates complete evaluation rounds, extend formal placement offers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offeredApplicants.map(offer => (
                <div key={offer.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400/40 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs">
                      OFFER EXTENDED
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-black text-lg">
                      {offer.offeredPackage || '₹24.0 LPA'}
                    </strong>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-lg">{offer.studentName}</h4>
                    <p className="text-xs text-slate-400">{offer.studentBranch} • Roll: {offer.studentRoll}</p>
                  </div>

                  <div className="text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Position: <strong>{offer.jobTitle}</strong>
                  </div>

                  <button
                    onClick={() => {
                      fireConfetti();
                      setSelectedOfferApp(offer);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Offer Letter</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: COMPANY PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto animate-fade-in">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Recruiting Organization Profile</h3>
            <p className="text-sm text-slate-400 mt-1">Corporate accreditation and university talent partnership credentials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentCompany.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accredited Tier</span>
              <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">{currentCompany.tier || 'Tier 1 (Dream Partner)'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruitment Contact</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{authSession?.user?.name || currentCompany.hrContact || 'HR Directorate'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Official Email</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{authSession?.user?.email || currentCompany.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Corporate Careers URL</span>
              <a href={currentCompany.website} target="_blank" rel="noreferrer" className="text-base font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
                <span>{currentCompany.website || 'https://careers.google.com'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Office / Campus Hub</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{currentCompany.location || 'Bengaluru / Hyderabad'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">Company Description</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
              {currentCompany.description || `${currentCompany.name} is a premier campus recruiting partner authorized for recruitment on PlaceIQ.`}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-3xl mx-auto animate-fade-in">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Recruiter Notifications</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
              <Bell className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-800 dark:text-slate-200 font-bold block">Campus Drive Synchronization Active</strong>
                <span className="text-xs text-slate-400">All student job applications and resume updates for {currentCompany.name} are synchronized in real-time.</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-emerald-900 dark:text-emerald-200 font-bold block">Approved Recruiter Account</strong>
                <span className="text-xs text-emerald-700 dark:text-emerald-400">Your organization has full permission to post job drives and conduct interview evaluations.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl mx-auto animate-fade-in">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Account Settings</h3>
            <p className="text-xs text-slate-400 mt-1">Manage recruiter profile and credentials</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Recruiter Display Name</label>
              <input
                type="text"
                disabled
                value={authSession.user?.name || currentCompany.name}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-400 mb-1">Official Email Address</label>
              <input
                type="text"
                disabled
                value={authSession.user?.email || currentCompany.email}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-400 mb-1">Corporate Partner Entity</label>
              <input
                type="text"
                disabled
                value={currentCompany.name}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Signed in as Recruiter</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewJobModal isOpen={jobModalOpen} onClose={() => setJobModalOpen(false)} defaultCompany={currentCompany} />
      <ScheduleInterviewModal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} />
      <OfferLetterModal application={selectedOfferApp} onClose={() => setSelectedOfferApp(null)} />
      <ResumeModal
        student={inspectStudent}
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
        onSchedule={() => setInterviewModalOpen(true)}
      />

    </div>
  );
};

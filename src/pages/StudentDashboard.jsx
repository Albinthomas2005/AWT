import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Clock, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  Edit3,
  UserCheck,
  AlertCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { EligibilityBadge } from '../components/EligibilityBadge';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { ResumeModal } from '../components/ResumeModal';
import { EditProfileModal } from '../components/EditProfileModal';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentStudent, 
    students, 
    jobs, 
    applications, 
    interviews, 
    applyForJob, 
    checkEligibility,
    updateStudent,
    showToast,
    fireConfetti,
    logout,
    authSession
  } = usePlacement();

  // Active view tab
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'applications' | 'interviews' | 'profile'

  // Job Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [minCtcFilter, setMinCtcFilter] = useState('0');

  // Modals
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editCgpa, setEditCgpa] = useState(currentStudent?.cgpa || 0);
  const [editBacklogs, setEditBacklogs] = useState(currentStudent?.backlogs || 0);
  const [editSkills, setEditSkills] = useState(currentStudent?.skills?.join(', ') || '');

  // Strict access guard: only show student details if authenticated as student
  if (!authSession?.isLoggedIn || authSession?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  // Student specific data
  if (!currentStudent) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-500 font-bold">Synchronizing candidate credentials with database...</p>
        </div>
      </div>
    );
  }

  const myApplications = applications.filter(a => a.studentId === currentStudent.id);
  const myInterviews = interviews.filter(i => i.studentId === currentStudent.id);
  const myOffer = myApplications.find(a => a.status === 'Offered');

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCtc = job.packageCtc >= parseFloat(minCtcFilter);
    const { meetsRequirements } = checkEligibility(currentStudent, job);
    const matchesEligibility = onlyEligible ? meetsRequirements : true;
    return matchesSearch && matchesCtc && matchesEligibility;
  });

  const handleApplyClick = (job) => {
    // Check if already applied
    const already = myApplications.some(a => a.jobId === job.id);
    if (already) {
      showToast(`You have already submitted an application for ${job.title}!`, 'warning');
      return;
    }

    // ── CGPA Eligibility Gate ──────────────────────────────────────
    const { meetsRequirements, reasons } = checkEligibility(currentStudent, job);
    if (!meetsRequirements) {
      const reason = reasons.length > 0 ? reasons[0] : 'You do not meet the eligibility criteria.';
      showToast(`❌ Cannot apply — ${reason}`, 'error');
      return;
    }

    setApplyingJob(job);
  };

  const confirmApplication = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    applyForJob(applyingJob.id, currentStudent.id, coverNote);
    setApplyingJob(null);
    setCoverNote('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      cgpa: parseFloat(editCgpa) || currentStudent.cgpa,
      backlogs: parseInt(editBacklogs, 10) || 0,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setEditProfileOpen(false);
  };

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Top Banner & Profile Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-400 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-['Outfit'] text-white">
                  {currentStudent.name}
                </h1>
                {currentStudent.status === 'Placed' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold border border-emerald-500/30">
                    Placed 🎉
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium">
                {currentStudent.rollNo} • {currentStudent.department} ({currentStudent.branchCode})
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-sm font-bold">
                <span className={`px-3.5 py-1.5 rounded-xl border font-black text-sm sm:text-base flex items-center gap-1.5 ${
                  currentStudent.cgpa >= 9.0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                    : currentStudent.cgpa >= 8.0
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                }`}>
                  <span>CGPA: {currentStudent.cgpa}</span>
                  {currentStudent.cgpa >= 9.0 && <span className="text-xs bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full uppercase font-black">Top 2%</span>}
                </span>
                <span className={`px-3.5 py-1.5 rounded-xl border font-bold text-sm ${
                  (currentStudent.backlogs ?? 0) === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {(currentStudent.backlogs ?? 0) === 0 ? '✓ Zero Backlogs' : `${currentStudent.backlogs} Active Backlog${currentStudent.backlogs > 1 ? 's' : ''}`}
                </span>
                <span className="text-slate-300 font-semibold px-3 py-1.5 rounded-xl bg-white/10">
                  {currentStudent.branchCode} • Class of {currentStudent.passingYear ?? '–'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                setEditCgpa(currentStudent.cgpa);
                setEditBacklogs(currentStudent.backlogs);
                setEditSkills(currentStudent.skills.join(', '));
                setEditProfileOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Profile</span>
            </button>

            {myOffer && (
              <button
                onClick={() => {
                  fireConfetti();
                  setSelectedOfferApp(myOffer);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black shadow-lg shadow-emerald-500/30 transition-all animate-pulse"
              >
                <Award className="w-5 h-5" />
                <span>View Offer Letter 🎉</span>
              </button>
            )}
          </div>

        </div>

        {/* Authenticated session strip */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium text-xs">Authenticated Session:</span>
            <strong className="text-white font-black">{currentStudent.name}</strong>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
              {currentStudent.branchCode} • {currentStudent.cgpa} CGPA
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              {currentStudent.rollNo}
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

        {/* Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'drives', label: `Campus Drives (${jobs.length})`, icon: Briefcase },
            { id: 'applications', label: `My Applications (${myApplications.length})`, icon: CheckCircle2 },
            { id: 'interviews', label: `Interview Schedule (${myInterviews.length})`, icon: Calendar },
            { id: 'profile', label: 'Resume & Credentials', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-md'
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

      {/* TAB 1: CAMPUS JOB DRIVES & LIVE ELIGIBILITY FILTER */}
      {activeTab === 'drives' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Search & Criteria Filter Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company name, tech stack..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm sm:text-base font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Only Eligible Toggle */}
              <button
                onClick={() => setOnlyEligible(!onlyEligible)}
                className={`px-4 py-3 rounded-2xl text-sm sm:text-base font-black transition-all flex items-center gap-2 ${
                  onlyEligible
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Only Matching My Eligibility</span>
              </button>

              {/* Min CTC Selector */}
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
                <span className="text-slate-400">Min CTC:</span>
                <select
                  value={minCtcFilter}
                  onChange={(e) => setMinCtcFilter(e.target.value)}
                  className="px-4 py-3 rounded-2xl text-sm sm:text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="0">All Packages</option>
                  <option value="10">₹10+ LPA</option>
                  <option value="15">₹15+ LPA</option>
                  <option value="20">₹20+ LPA (Dream)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Job Openings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map(job => {
              const { eligible, reasons } = checkEligibility(currentStudent, job);
              const alreadyApplied = myApplications.some(a => a.jobId === job.id);
              const appliedRecord = myApplications.find(a => a.jobId === job.id);

              return (
                <div 
                  key={job.id}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-2xl"
                >
                  <div>
                    {/* Top Row: Company Name & Eligibility Badge */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                          {job.companyName}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-1">
                          {job.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-400">{job.role} • {job.location}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit'] whitespace-nowrap">
                          {job.packageDisplay}
                        </span>
                        <EligibilityBadge job={job} student={currentStudent} />
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed font-medium">
                      {job.description}
                    </p>

                    {/* Criteria Details Box */}
                    <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Min CGPA</span>
                        <span className={`text-base sm:text-lg font-black ${currentStudent.cgpa >= job.minCgpa ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {job.minCgpa} (You: {currentStudent.cgpa})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Max Backlogs</span>
                        <span className={`text-base sm:text-lg font-black ${currentStudent.backlogs <= job.maxBacklogs ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {job.maxBacklogs} max
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Branches</span>
                        <span className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-200 truncate block">
                          {job.allowedBranches.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Application policy notice — reflects real eligibility */}
                    {(() => {
                      const { meetsRequirements, reasons } = checkEligibility(currentStudent, job);
                      return meetsRequirements ? (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold flex items-center justify-between border border-emerald-200 dark:border-emerald-800/40">
                          <span>You meet all eligibility criteria</span>
                          <span className="font-bold">Eligible ✓</span>
                        </div>
                      ) : (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs sm:text-sm font-semibold flex items-center justify-between border border-rose-200 dark:border-rose-800/40">
                          <span>{reasons[0] || 'You do not meet eligibility requirements'}</span>
                          <span className="font-bold">Ineligible ✗</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom Apply or Status Row */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-semibold">Deadline: <strong className="text-slate-800 dark:text-slate-200">{job.deadline}</strong></span>

                    {alreadyApplied ? (
                      <div className="flex items-center gap-2">
                        <ApplicationStatusBadge status={appliedRecord?.status} />
                      </div>
                    ) : (() => {
                      const { meetsRequirements } = checkEligibility(currentStudent, job);
                      return meetsRequirements ? (
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="px-6 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="relative group">
                          <button
                            disabled
                            className="px-6 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed select-none border border-slate-300 dark:border-slate-700"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Not Eligible</span>
                          </button>
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Your CGPA ({currentStudent.cgpa}) is below the minimum required ({job.minCgpa}) for this role.
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: MY APPLICATIONS & STATUS TRACKER */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                My Job Applications ({myApplications.length})
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Track your recruitment pipeline from submission to final offer rollout</p>
            </div>
          </div>

          {myApplications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-lg font-black text-slate-800 dark:text-slate-200">No applications submitted yet</p>
              <p className="text-sm text-slate-400 mt-1">Explore campus drives and apply to positions matching your criteria.</p>
              <button
                onClick={() => setActiveTab('drives')}
                className="mt-4 px-6 py-3 rounded-2xl bg-[#6c5ce7] text-white text-sm sm:text-base font-black shadow-md shadow-indigo-500/20"
              >
                Explore Drives
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map(app => (
                <div 
                  key={app.id}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{app.companyName}</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-0.5">{app.jobTitle}</h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-semibold">Applied on {app.appliedDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <ApplicationStatusBadge status={app.status} />
                      {app.status === 'Offered' && (
                        <button
                          onClick={() => {
                            fireConfetti();
                            setSelectedOfferApp(app);
                          }}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                        >
                          View Offer Letter 🎉
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Step Progress Timeline */}
                  <div className="pt-2">
                    <p className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Application Pipeline:</p>
                    <div className="grid grid-cols-4 gap-3 text-center text-xs sm:text-sm">
                      {[
                        { step: 'Applied', label: '1. Applied', done: true },
                        { step: 'Screened', label: '2. Profile Screened', done: ['Screened', 'Interview', 'Offered'].includes(app.status) },
                        { step: 'Interview', label: '3. Interview Round', done: ['Interview', 'Offered'].includes(app.status) },
                        { step: 'Offered', label: '4. Offer Rollout', done: app.status === 'Offered' },
                      ].map((st, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-2xl border text-xs sm:text-sm font-black transition-all ${
                            st.done
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          {st.done ? '✓ ' : ''}{st.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {app.notes && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      <strong className="text-slate-900 dark:text-white">Remarks / Instructions:</strong> {app.notes}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: INTERVIEW SCHEDULE */}
      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                My Interview Calendar ({myInterviews.length})
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Upcoming company rounds, meeting links and venue briefings</p>
            </div>
          </div>

          {myInterviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-lg font-black text-slate-800 dark:text-slate-200">No interviews currently scheduled</p>
              <p className="text-sm text-slate-400 mt-1">Once recruiters shortlist your application, interview invitations will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myInterviews.map(inv => (
                <div 
                  key={inv.id}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3.5 py-1 rounded-full">
                      {inv.companyName}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">{inv.status}</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">{inv.roundName}</h4>
                    <p className="text-sm font-semibold text-slate-400 mt-1">Panelist: {inv.interviewer}</p>
                  </div>

                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm font-medium">
                    <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-bold">{inv.date} • {inv.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 truncate">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold truncate">{inv.venueOrLink}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 italic">
                    Instructions: {inv.instructions}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 4: PROFILE & RESUME */}
      {activeTab === 'profile' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified by Directorate Admin</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Student Academic Credentials</h3>
              <p className="text-sm text-slate-400 mt-0.5">Official academic and eligibility parameters verified by the University Directorate</p>
            </div>
            <button
              onClick={() => {
                setEditCgpa(currentStudent.cgpa);
                setEditBacklogs(currentStudent.backlogs);
                setEditSkills(currentStudent.skills.join(', '));
                setEditProfileOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white text-sm sm:text-base font-black shadow-md shadow-indigo-500/20 transition-all"
            >
              Update Profile Info
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentStudent.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roll / Registration Number</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentStudent.rollNo}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentStudent.department} ({currentStudent.branchCode})</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Email</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentStudent.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cumulative CGPA</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{currentStudent.cgpa} / 10.0</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Backlogs</span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{currentStudent.backlogs}</p>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">Technical Skills & Expertise</span>
            <div className="flex flex-wrap gap-2.5">
              {currentStudent.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 rounded-2xl text-sm font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Official ATS Resume Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {currentStudent.name.replace(/\s+/g, '_')}_Official_ATS_Resume_2026.pdf
                </p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  Verified by University Placement Directorate • 240 KB • Ready for Campus Recruiters
                </p>
              </div>
            </div>
            <button
              onClick={() => setResumeModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-sm sm:text-base font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect ATS Resume</span>
            </button>
          </div>

        </div>
      )}

      {/* APPLY CONFIRMATION MODAL */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-indigo-600">{applyingJob.companyName}</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                Submit Campus Application
              </h3>
              <p className="text-xs text-slate-500">{applyingJob.title} • {applyingJob.packageDisplay}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold">
              ✓ Open Candidate Application: All university candidates permitted to submit application.
            </div>

            <form onSubmit={confirmApplication} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Candidate Note / Statement of Interest (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Highlight key projects or why you are excited for this role..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  Confirm & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      {/* ATS RESUME DOSSIER MODAL */}
      <ResumeModal
        student={currentStudent}
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* Offer Letter Modal */}
      <OfferLetterModal application={selectedOfferApp} onClose={() => setSelectedOfferApp(null)} />

    </div>
  );
};

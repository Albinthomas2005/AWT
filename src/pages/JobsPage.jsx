import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Filter, 
  DollarSign, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Info,
  GraduationCap,
  XCircle
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { EligibilityBadge } from '../components/EligibilityBadge';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';

export const JobsPage = () => {
  const navigate = useNavigate();
  const { 
    jobs, 
    currentStudent, 
    applications, 
    applyForJob, 
    checkEligibility,
    showToast,
    authSession 
  } = usePlacement();

  const isStudentLoggedIn = Boolean(authSession?.isLoggedIn && authSession?.role === 'student');

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [minSalary, setMinSalary] = useState('0');
  const [sortBy, setSortBy] = useState('packageDesc'); // 'packageDesc' | 'deadline' | 'cgpaAsc'

  const [applyingJob, setApplyingJob] = useState(null);
  const [note, setNote] = useState('');

  // Filter & Sort
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          job.role.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || job.allowedBranches.includes('All') || job.allowedBranches.includes(selectedBranch);
    const matchesSalary = job.packageCtc >= parseFloat(minSalary);
    return matchesSearch && matchesBranch && matchesSalary;
  }).sort((a, b) => {
    if (sortBy === 'packageDesc') return b.packageCtc - a.packageCtc;
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === 'cgpaAsc') return a.minCgpa - b.minCgpa;
    return 0;
  });

  const handleApply = (job) => {
    if (!isStudentLoggedIn) {
      showToast('Please log in with your student account first to submit applications.', 'warning');
      navigate('/login');
      return;
    }
    const { eligible, reasons } = checkEligibility(currentStudent, job);
    if (!eligible) {
      showToast(`Not eligible: ${reasons[0]}`, 'error');
      return;
    }
    const already = applications.some(a => a.jobId === job.id && a.studentId === currentStudent.id);
    if (already) {
      showToast(`You have already applied for ${job.title}!`, 'warning');
      return;
    }
    setApplyingJob(job);
  };

  const confirmApply = (e) => {
    e.preventDefault();
    if (applyingJob && isStudentLoggedIn) {
      applyForJob(applyingJob.id, currentStudent.id, note);
      setApplyingJob(null);
      setNote('');
    }
  };

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Recruitment Season 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
              Campus Job Openings & Placement Drives
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {isStudentLoggedIn ? (
                <>
                  Explore open positions with verified Fortune 500 enterprises. Real-time criteria matching for <strong>{currentStudent.name}</strong> ({currentStudent.branchCode} - CGPA {currentStudent.cgpa}).
                </>
              ) : (
                <>
                  Explore open positions with verified Fortune 500 enterprises. Log in with your student account to verify real-time criteria eligibility and submit applications.
                </>
              )}
            </p>
          </div>

          {isStudentLoggedIn ? (
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs space-y-1">
              <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Active Candidate Profile</span>
              <p className="font-bold text-white text-sm">{currentStudent.name}</p>
              <p className="text-slate-300">{currentStudent.department} • CGPA {currentStudent.cgpa}</p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs flex flex-col justify-center items-start gap-2">
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Student Authentication</span>
                <p className="font-bold text-white text-sm">Sign in to check eligibility</p>
              </div>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm"
              >
                Log In as Student →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, job title, skills..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm sm:text-base font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Min Package:</span>
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="0">All CTCs</option>
              <option value="8">₹8+ LPA</option>
              <option value="15">₹15+ LPA</option>
              <option value="20">₹20+ LPA (Dream)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="packageDesc">Highest Package (CTC)</option>
              <option value="deadline">Application Deadline</option>
              <option value="cgpaAsc">Minimum CGPA</option>
            </select>
          </div>
        </div>

      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => {
          const { eligible, reasons } = checkEligibility(currentStudent, job);
          const already = applications.some(a => a.jobId === job.id && a.studentId === currentStudent.id);
          const appliedRecord = applications.find(a => a.jobId === job.id && a.studentId === currentStudent.id);

          return (
            <div 
              key={job.id}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-2xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{job.companyName}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] mt-1">{job.title}</h3>
                    <p className="text-sm font-semibold text-slate-400">{job.role} • {job.location}</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit'] whitespace-nowrap">
                    {job.packageDisplay}
                  </span>
                </div>

                <div className="my-3">
                  {isStudentLoggedIn ? (
                    <EligibilityBadge job={job} student={currentStudent} />
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-indigo-600 hover:border-indigo-400 transition"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Log in to check eligibility →</span>
                    </Link>
                  )}
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-medium">
                  {job.description}
                </p>

                {/* Criteria Box */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Min CGPA</span>
                    <span className={`text-base sm:text-lg font-black ${isStudentLoggedIn && currentStudent.cgpa >= job.minCgpa ? 'text-emerald-600 dark:text-emerald-400' : isStudentLoggedIn ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {job.minCgpa} {isStudentLoggedIn && <span className="text-xs font-bold text-slate-400 block">(You: {currentStudent.cgpa})</span>}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Max Backlogs</span>
                    <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200">{job.maxBacklogs}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Branches</span>
                    <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 truncate block">
                      {job.allowedBranches.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Rounds overview */}
                <div className="mt-3 text-xs sm:text-sm text-slate-400 font-semibold">
                  <span className="text-slate-500 uppercase tracking-wider text-xs">Evaluation: </span>
                  {job.rounds.join(' → ')}
                </div>
              </div>

              {/* Bottom apply action */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-400">Deadline: <strong className="text-slate-800 dark:text-slate-200">{job.deadline}</strong></span>

                {already ? (
                  <ApplicationStatusBadge status={appliedRecord?.status} />
                ) : (() => {
                  const eligible = !isStudentLoggedIn || checkEligibility(currentStudent, job).meetsRequirements;
                  return eligible ? (
                    <button
                      onClick={() => handleApply(job)}
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
                      <div className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Your CGPA ({currentStudent?.cgpa}) is below the minimum required ({job.minCgpa}) for this role.
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
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

            <form onSubmit={confirmApply} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Candidate Note / Statement of Interest
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share a brief highlight of your expertise or why you are excited for this role..."
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
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

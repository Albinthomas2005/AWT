import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const PlacementContext = createContext();

export const PlacementProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('placeiq_theme');
    return saved ? saved === 'dark' : false;
  });

  // Current simulation role: 'officer' | 'student' | 'company'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('placeiq_role') || 'officer';
  });

  const [activeStudentId, setActiveStudentId] = useState(() => {
    return localStorage.getItem('placeiq_active_student') || 'std-1';
  });

  const [activeCompanyId, setActiveCompanyId] = useState(() => {
    return localStorage.getItem('placeiq_active_company') || 'cmp-1';
  });

  // Live Database States (fetched via PHP API from SQLite/MySQL database)
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Global Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync theme
  useEffect(() => {
    localStorage.setItem('placeiq_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('placeiq_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('placeiq_active_student', activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem('placeiq_active_company', activeCompanyId);
  }, [activeCompanyId]);

  // Default demo accounts (Phase 2 Specifications)
  const DEFAULT_REGISTERED_USERS = [
    {
      id: 'usr-admin-demo',
      email: 'admin@placement.com',
      username: 'admin@placement.com',
      password: 'Admin@123',
      role: 'officer',
      name: 'Dr. Aris Thorne',
      title: 'Placement Directorate Head',
      status: 'Approved'
    },
    {
      id: 'usr-student-demo',
      email: 'student@placement.com',
      username: 'student@placement.com',
      password: 'Student@123',
      role: 'student',
      name: 'Aarav Sharma',
      studentId: 'std-1',
      rollNo: '2022CS1042',
      department: 'Computer Science & Engineering',
      branchCode: 'CSE',
      cgpa: 9.15,
      status: 'Approved'
    },
    {
      id: 'usr-recruiter-demo',
      email: 'recruiter@placement.com',
      username: 'recruiter@placement.com',
      password: 'Recruiter@123',
      role: 'company',
      companyId: 'cmp-1',
      companyName: 'Google India',
      name: 'Google Campus Recruiter',
      website: 'https://careers.google.com',
      phone: '+91 98111 22334',
      status: 'Approved'
    },
    // Backward-compatibility shortcuts
    {
      id: 'usr-std-1',
      email: 'student1@campus.edu',
      username: '1',
      password: '1',
      role: 'student',
      name: 'Aarav Sharma',
      studentId: 'std-1',
      rollNo: '1',
      status: 'Approved'
    },
    {
      id: 'usr-std-2',
      email: 'student2@campus.edu',
      username: '2',
      password: '2',
      role: 'student',
      name: 'Priya Nair',
      studentId: 'std-2',
      rollNo: '2',
      status: 'Approved'
    },
    {
      id: 'usr-std-3',
      email: 'student3@campus.edu',
      username: '3',
      password: '3',
      role: 'student',
      name: 'Vikram Aditya',
      studentId: 'std-3',
      rollNo: '3',
      status: 'Approved'
    },
    {
      id: 'usr-officer-edu',
      email: 'admin@placement.edu',
      username: 'admin@placement.edu',
      password: 'admin123',
      role: 'officer',
      name: 'Dr. Aris Thorne',
      status: 'Approved'
    },
    {
      id: 'usr-recruiter-google',
      email: 'campus-hiring@google.com',
      username: 'campus-hiring@google.com',
      password: 'hiring123',
      role: 'company',
      companyId: 'cmp-1',
      companyName: 'Google India',
      name: 'Google India Recruitment Lead',
      status: 'Approved'
    }
  ];

  const DEFAULT_RECRUITERS_LIST = [
    {
      id: 'rec-1',
      name: 'Google Campus Recruiter',
      email: 'recruiter@placement.com',
      companyName: 'Google India',
      website: 'https://careers.google.com',
      phone: '+91 98111 22334',
      status: 'Approved',
      registeredAt: '2026-10-15'
    },
    {
      id: 'rec-2',
      name: 'Google India Recruitment Lead',
      email: 'campus-hiring@google.com',
      companyName: 'Google India',
      website: 'https://careers.google.com',
      phone: '+91 98222 33445',
      status: 'Approved',
      registeredAt: '2026-10-20'
    },
    {
      id: 'rec-demo-pending',
      name: 'Vikram Mehta',
      email: 'hiring@nexustech.io',
      companyName: 'NexusTech Systems',
      website: 'https://nexustech.io',
      phone: '+91 98765 43210',
      status: 'Pending',
      registeredAt: '2026-11-01'
    }
  ];

  // Registered users in LocalStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('placeiq_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse registered users from localStorage', e);
    }
    return DEFAULT_REGISTERED_USERS;
  });

  useEffect(() => {
    localStorage.setItem('placeiq_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Recruiter directory with approval statuses
  const [recruitersList, setRecruitersList] = useState(() => {
    try {
      const saved = localStorage.getItem('placeiq_registered_recruiters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse recruiters list', e);
    }
    return DEFAULT_RECRUITERS_LIST;
  });

  useEffect(() => {
    localStorage.setItem('placeiq_registered_recruiters', JSON.stringify(recruitersList));
  }, [recruitersList]);

  // Student Registration Handler
  const registerStudent = (studentData) => {
    const emailClean = (studentData.email || '').trim().toLowerCase();
    
    // Check duplicate email
    const exists = registeredUsers.some(u => u.email.toLowerCase() === emailClean);
    if (exists) {
      return { success: false, message: `Email "${studentData.email}" is already registered. Please sign in instead.` };
    }

    const newStudentId = 'std-' + Date.now();
    const newStudent = {
      id: newStudentId,
      name: studentData.fullName.trim(),
      email: emailClean,
      rollNo: studentData.rollNo.trim(),
      department: studentData.department,
      branchCode: studentData.branchCode || (studentData.department || '').replace(/&/g, '').trim().split(/\s+/).map(w => w[0] || '').join('').toUpperCase().slice(0, 6) || 'GEN',
      cgpa: parseFloat(studentData.cgpa) || 0,
      backlogs: 0,
      passingYear: parseInt(studentData.graduationYear, 10) || 2026,
      skills: ['Core Fundamentals', 'Technical Problem Solving', 'Communication'],
      status: 'Seeking',
      placedCompany: null,
      placedPackage: null,
      resumeUrl: `https://example.com/resumes/${studentData.rollNo || 'candidate'}.pdf`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      headline: `${studentData.department} Candidate`,
      location: 'Campus Directorate'
    };

    const newUser = {
      id: 'usr-' + Date.now(),
      email: emailClean,
      username: emailClean,
      password: studentData.password,
      role: 'student',
      name: studentData.fullName.trim(),
      studentId: newStudentId,
      rollNo: studentData.rollNo.trim(),
      department: studentData.department,
      cgpa: parseFloat(studentData.cgpa) || 0,
      status: 'Approved'
    };

    setStudents(prev => [newStudent, ...prev]);
    setRegisteredUsers(prev => [newUser, ...prev]);

    // Persist student to the MySQL database so job applications work via PHP API
    fetch('/api/students.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          // Sync local student with DB-confirmed record
          setStudents(prev => prev.map(s => s.id === newStudentId ? { ...newStudent, ...res.data } : s));
        }
      })
      .catch(err => console.error('Failed to persist student to database:', err));

    showToast(`Account successfully created for ${newStudent.name}! You can now sign in.`, 'success');
    return { success: true, user: newUser, student: newStudent };
  };

  // Recruiter Registration Handler with Pending Approval requirement
  const registerRecruiter = async (recruiterData) => {
    const emailClean = (recruiterData.email || '').trim().toLowerCase();

    // Check duplicate email
    const exists = registeredUsers.some(u => u.email.toLowerCase() === emailClean);
    if (exists) {
      return { success: false, message: `Official email "${recruiterData.email}" is already registered. Please sign in or use another email.` };
    }

    const recId = 'rec-' + Date.now();
    const cmpId = 'cmp-' + Date.now();

    const newRecruiter = {
      id: recId,
      name: recruiterData.recruiterName.trim(),
      email: emailClean,
      companyName: recruiterData.companyName.trim(),
      website: recruiterData.website.trim(),
      phone: recruiterData.phone.trim(),
      status: 'Pending',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    const newUser = {
      id: 'usr-' + Date.now(),
      email: emailClean,
      username: emailClean,
      password: recruiterData.password,
      role: 'company',
      name: recruiterData.recruiterName.trim(),
      companyId: cmpId,
      companyName: recruiterData.companyName.trim(),
      website: recruiterData.website.trim(),
      phone: recruiterData.phone.trim(),
      status: 'Pending'
    };

    setRecruitersList(prev => [newRecruiter, ...prev]);
    setRegisteredUsers(prev => [newUser, ...prev]);

    // Persist to backend database via PHP API if available
    try {
      fetch('/api/recruiters.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecruiter,
          password: recruiterData.password
        })
      }).catch(err => console.log('Recruiter DB sync skipped:', err));
    } catch (_) {}

    showToast('Recruiter registered! Account is pending Placement Officer approval.', 'warning');
    return { 
      success: true, 
      status: 'Pending', 
      message: 'Registration submitted! Your account is in "Pending Approval" status until verified by the Placement Officer.' 
    };
  };

  // Admin approves recruiter
  const approveRecruiter = async (recruiterId) => {
    let targetRecruiter = null;

    setRecruitersList(prev => prev.map(r => {
      if (r.id === recruiterId || r.email === recruiterId) {
        targetRecruiter = { ...r, status: 'Approved' };
        return targetRecruiter;
      }
      return r;
    }));

    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === recruiterId || u.email === recruiterId || (targetRecruiter && u.email && u.email.toLowerCase() === targetRecruiter.email.toLowerCase())) {
        return { ...u, status: 'Approved' };
      }
      return u;
    }));

    // Auto-create/link partner company in `companies` state if it doesn't already exist
    const recruiter = targetRecruiter || recruitersList.find(r => r.id === recruiterId || r.email === recruiterId);
    if (recruiter && recruiter.companyName) {
      const companyAlreadyExists = companies.some(
        c => c.name.toLowerCase().trim() === recruiter.companyName.toLowerCase().trim()
      );
      if (!companyAlreadyExists) {
        const newCmp = {
          id: 'cmp-' + Date.now(),
          name: recruiter.companyName.trim(),
          industry: 'Technology & Enterprise Services',
          website: recruiter.website || 'https://example.com',
          location: 'Bengaluru / Pan India',
          hrContact: `${recruiter.name} (${recruiter.phone || 'Recruiter'})`,
          email: recruiter.email,
          tier: 'Tier 1 (Dream)',
          status: 'Active',
          logo: `https://logo.clearbit.com/${(recruiter.companyName || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
          totalHires: 0,
          avgPackage: '14.0 LPA',
          description: `${recruiter.companyName} is an authorized corporate recruitment partner registered via Recruiter Portal.`
        };
        addCompany(newCmp);
      }
    }

    // Backend API sync
    try {
      fetch('/api/recruiters.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recruiterId, status: 'Approved' })
      }).catch(err => console.log('API sync skipped:', err));
    } catch (_) {}

    showToast(`Recruiter account approved for ${recruiter?.name || 'recruiter'}! They can now log in.`, 'success');
  };

  // Admin rejects recruiter
  const rejectRecruiter = async (recruiterId) => {
    setRecruitersList(prev => prev.map(r => {
      if (r.id === recruiterId || r.email === recruiterId) {
        return { ...r, status: 'Rejected' };
      }
      return r;
    }));

    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === recruiterId || u.email === recruiterId) {
        return { ...u, status: 'Rejected' };
      }
      return u;
    }));

    // Backend API sync
    try {
      fetch('/api/recruiters.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recruiterId, status: 'Rejected' })
      }).catch(err => console.log('API sync skipped:', err));
    } catch (_) {}

    showToast('Recruiter application marked as Rejected.', 'info');
  };

  // Admin removes recruiter
  const deleteRecruiter = async (recruiterId) => {
    const recToDelete = recruitersList.find(r => r.id === recruiterId || r.email === recruiterId);
    setRecruitersList(prev => prev.filter(r => r.id !== recruiterId && r.email !== recruiterId));
    if (recToDelete) {
      setRegisteredUsers(prev => prev.filter(u => u.id !== recruiterId && u.email !== recToDelete.email));
    }

    try {
      fetch(`/api/recruiters.php?id=${encodeURIComponent(recruiterId)}`, {
        method: 'DELETE'
      }).catch(err => console.log('API sync skipped:', err));
    } catch (_) {}

    showToast('Recruiter account removed.', 'info');
  };

  // Direct Recruiter Creation by Admin
  const addRecruiterDirectly = async (recruiterData) => {
    const emailClean = (recruiterData.email || '').trim().toLowerCase();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === emailClean);
    if (exists) {
      showToast(`Email "${recruiterData.email}" is already registered.`, 'error');
      return { success: false, message: 'Email already registered' };
    }

    const recId = 'rec-' + Date.now();
    const cmpId = 'cmp-' + Date.now();
    const status = recruiterData.status || 'Approved';

    const newRecruiter = {
      id: recId,
      name: recruiterData.name.trim(),
      email: emailClean,
      companyName: recruiterData.companyName.trim(),
      website: recruiterData.website ? recruiterData.website.trim() : 'https://example.com',
      phone: recruiterData.phone ? recruiterData.phone.trim() : '+91 98000 00000',
      status: status,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    const newUser = {
      id: 'usr-' + Date.now(),
      email: emailClean,
      username: emailClean,
      password: recruiterData.password || 'Recruiter@123',
      role: 'company',
      name: recruiterData.name.trim(),
      companyId: cmpId,
      companyName: recruiterData.companyName.trim(),
      website: newRecruiter.website,
      phone: newRecruiter.phone,
      status: status
    };

    setRecruitersList(prev => [newRecruiter, ...prev]);
    setRegisteredUsers(prev => [newUser, ...prev]);

    // If approved, ensure company is added
    if (status === 'Approved' && recruiterData.companyName) {
      const companyAlreadyExists = companies.some(
        c => c.name.toLowerCase().trim() === recruiterData.companyName.toLowerCase().trim()
      );
      if (!companyAlreadyExists) {
        addCompany({
          id: cmpId,
          name: recruiterData.companyName.trim(),
          industry: recruiterData.industry || 'Technology & Services',
          website: newRecruiter.website,
          location: 'Pan India / Remote',
          hrContact: `${recruiterData.name} (${newRecruiter.phone})`,
          email: emailClean,
          tier: 'Tier 1 (Dream)',
          status: 'Active',
          logo: `https://logo.clearbit.com/${(recruiterData.companyName || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
          totalHires: 0,
          avgPackage: '14.0 LPA',
          description: `${recruiterData.companyName} is an authorized corporate recruitment partner.`
        });
      }
    }

    try {
      fetch('/api/recruiters.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRecruiter, password: newUser.password })
      }).catch(err => console.log('API sync skipped:', err));
    } catch (_) {}

    showToast(`Recruiter account created for ${newRecruiter.name} (${status})!`, 'success');
    return { success: true, recruiter: newRecruiter };
  };

  // Authentication & Session Management
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('placeiq_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth session from localStorage', e);
    }
    return {
      isLoggedIn: false,
      role: null,
      user: null
    };
  });

  useEffect(() => {
    localStorage.setItem('placeiq_auth_session', JSON.stringify(authSession));
    if (authSession?.isLoggedIn && authSession?.role) {
      setCurrentRole(authSession.role);
      if (authSession.role === 'student' && authSession.user?.studentId) {
        setActiveStudentId(authSession.user.studentId);
      } else if (authSession.role === 'company' && authSession.user?.companyId) {
        setActiveCompanyId(authSession.user.companyId);
      }
    }
  }, [authSession]);

  // Fetch all records from the PHP Database backend on mount
  const fetchDataFromDatabase = async () => {
    try {
      setDataLoading(true);
      const [resStd, resCmp, resJob, resApp, resInt, resRec] = await Promise.all([
        fetch('/api/students.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/companies.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/jobs.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/applications.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/interviews.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/recruiters.php').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (resStd?.success) setStudents(resStd.data || []);
      if (resCmp?.success) setCompanies(resCmp.data || []);
      if (resJob?.success) setJobs(resJob.data || []);
      if (resApp?.success) setApplications(resApp.data || []);
      if (resInt?.success) setInterviews(resInt.data || []);
      if (resRec?.success && Array.isArray(resRec.data) && resRec.data.length > 0) {
        setRecruitersList(resRec.data);
      }
    } catch (err) {
      console.error('Error fetching data from database:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  // After students are loaded: auto-sync logged-in student to DB if they are not found there
  useEffect(() => {
    if (!authSession?.isLoggedIn || authSession?.role !== 'student' || !authSession?.user?.studentId) return;
    if (dataLoading) return; // wait until data is fully loaded

    const studentInDb = students.find(s => s.id === authSession.user.studentId);
    if (!studentInDb) {
      // Student not in database — sync them now using registered users data
      const registeredUser = registeredUsers.find(u => u.studentId === authSession.user.studentId);
      const studentPayload = {
        id: authSession.user.studentId,
        name: authSession.user.name || 'Student',
        email: authSession.user.email || '',
        rollNo: authSession.user.rollNo || authSession.user.studentId,
        department: authSession.user.department || 'Computer Science & Engineering',
        branchCode: authSession.user.branchCode || 'CSE',
        cgpa: parseFloat(authSession.user.cgpa) || 0,
        backlogs: parseInt(authSession.user.backlogs, 10) || 0,
        passingYear: parseInt(authSession.user.passingYear, 10) || 2026,
        skills: registeredUser?.skills || ['Core Fundamentals', 'Technical Problem Solving', 'Communication'],
        status: 'Seeking',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        headline: `${authSession.user.department || 'Engineering'} Candidate`,
        location: 'Campus Directorate'
      };

      fetch('/api/students.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentPayload)
      })
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data) {
            setStudents(prev => {
              // Only add if still not present
              if (prev.some(s => s.id === res.data.id)) return prev;
              return [res.data, ...prev];
            });
          }
        })
        .catch(err => console.error('Auto-sync failed for logged-in student:', err));
    }
  }, [students, dataLoading, authSession]);


  // Login authentication supporting demo accounts, registered accounts, and API fallback
  const login = async (identifier, password = '', roleHint = null) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return { success: false, message: 'Please enter your email or login ID.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    // 1. Check in local registeredUsers first
    const matched = registeredUsers.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.username.toLowerCase() === cleanId ||
      (u.rollNo && u.rollNo.toLowerCase() === cleanId) ||
      (u.studentId && u.studentId.toLowerCase() === cleanId)
    );

    if (matched) {
      if (matched.password !== cleanPass) {
        showToast('Invalid credentials: password does not match.', 'error');
        return { success: false, message: 'Invalid password. Please verify your credentials.' };
      }

      // Check recruiter approval status
      if (matched.role === 'company' && matched.status === 'Pending') {
        showToast('Account Pending Approval by Placement Officer', 'warning');
        return { 
          success: false, 
          isPending: true,
          message: `Your recruiter account for "${matched.companyName || 'your company'}" is currently PENDING APPROVAL by the Placement Officer. Access to the Recruiter Hub is restricted until approved.` 
        };
      }

      if (matched.role === 'company' && matched.status === 'Rejected') {
        showToast('Recruiter Registration Rejected', 'error');
        return { 
          success: false, 
          message: 'Your recruiter account registration has been rejected by the Placement Officer.' 
        };
      }

      const rolePath = matched.role === 'student' ? '/student'
        : matched.role === 'company' ? '/company'
        : '/officer';

      const userSession = {
        name: matched.name,
        email: matched.email,
        role: matched.role,
        studentId: matched.studentId || null,
        companyId: matched.companyId || null,
        companyName: matched.companyName || null,
        rollNo: matched.rollNo || null,
        cgpa: matched.cgpa || null,
        department: matched.department || null,
        status: matched.status || 'Approved'
      };

      setAuthSession({
        isLoggedIn: true,
        role: matched.role,
        user: userSession
      });
      setCurrentRole(matched.role);
      if (matched.role === 'student' && matched.studentId) {
        setActiveStudentId(matched.studentId);
      } else if (matched.role === 'company' && matched.companyId) {
        setActiveCompanyId(matched.companyId);
      }

      showToast(`Welcome back, ${matched.name}!`, 'success');
      fireConfetti();
      return { success: true, role: matched.role, path: rolePath, user: userSession };
    }

    // 2. Fallback to API if not found locally
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPass, roleHint })
      });
      const data = await response.json();

      if (data.success) {
        setAuthSession({
          isLoggedIn: true,
          role: data.role,
          user: data.user
        });
        setCurrentRole(data.role);
        if (data.role === 'student' && data.user?.studentId) {
          setActiveStudentId(data.user.studentId);
        } else if (data.role === 'company' && data.user?.companyId) {
          setActiveCompanyId(data.user.companyId);
        }
        showToast(`Welcome, ${data.user.name}!`, 'success');
        fireConfetti();
        return { success: true, role: data.role, path: data.path };
      } else {
        showToast(data.message || 'Invalid email or password.', 'error');
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch {
      return { success: false, message: 'Invalid credentials. User record not found.' };
    }
  };

  const logout = () => {
    setAuthSession({
      isLoggedIn: false,
      role: null,
      user: null
    });
    localStorage.removeItem('placeiq_auth_session');
    showToast('Signed out of placement portal', 'info');
  };

  // Active candidate and recruiter profiles resolved directly from live database state
  const currentStudent = (() => {
    if (authSession?.isLoggedIn && authSession?.role === 'student' && authSession?.user?.studentId) {
      const authenticated = students.find(s => s.id === authSession.user.studentId);
      if (authenticated) return authenticated;
      // Fallback to session user with safe defaults for all required display fields
      const u = authSession.user;
      return {
        id: u.studentId,
        name: u.name || 'Student',
        email: u.email || '',
        rollNo: u.rollNo || u.studentId || '—',
        department: u.department || 'Computer Science & Engineering',
        branchCode: u.branchCode || 'CSE',
        cgpa: parseFloat(u.cgpa) || 0,
        backlogs: parseInt(u.backlogs, 10) || 0,
        passingYear: parseInt(u.passingYear, 10) || 2026,
        skills: u.skills || [],
        status: u.status || 'Seeking',
        placedCompany: null,
        placedPackage: null,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        headline: u.headline || `${u.department || 'Engineering'} Candidate`,
        location: u.location || 'Campus Directorate'
      };
    }
    return students.find(s => s.id === activeStudentId) || students[0] || null;
  })();

  const currentCompany = (() => {
    if (authSession?.isLoggedIn && authSession?.role === 'company') {
      if (authSession.user?.companyId) {
        const found = companies.find(c => c.id === authSession.user.companyId);
        if (found) return found;
      }
      if (authSession.user?.companyName) {
        const found = companies.find(c => c.name.toLowerCase() === authSession.user.companyName.toLowerCase());
        if (found) return found;
        return {
          id: authSession.user?.companyId || 'cmp-custom',
          name: authSession.user.companyName,
          tier: 'Corporate Partner',
          industry: 'Technology & Consulting',
          locations: ['Pan-India', 'Hybrid'],
          website: authSession.user?.website || 'https://company.com',
          email: authSession.user?.email,
          phone: authSession.user?.phone || '+91 98000 00000',
          description: `Corporate recruitment partner portal for ${authSession.user.companyName}`
        };
      }
    }
    return companies.find(c => c.id === activeCompanyId) || companies[0] || null;
  })();

  const isAdmin = Boolean(authSession?.isLoggedIn && authSession?.role === 'officer');

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // Eligibility Engine — only CGPA blocks applying; branch/backlogs shown for info only
  const checkEligibility = (student, job) => {
    if (!student || !job) {
      return { 
        eligible: false, 
        meetsRequirements: false, 
        cgpaOk: false, 
        branchOk: true, 
        backlogsOk: true, 
        reasons: ['Profile or Drive data unavailable'] 
      };
    }

    const studentCgpa = parseFloat(student.cgpa) || 0;
    const requiredCgpa = parseFloat(job.minCgpa) || 0;
    const cgpaOk = studentCgpa >= requiredCgpa;

    // Branch and backlogs computed for display only — they do NOT block eligibility
    const studentBranch = (student.branchCode || student.branch || '').toUpperCase();
    const allowedBranches = Array.isArray(job.allowedBranches) 
      ? job.allowedBranches.map(b => b.toUpperCase()) 
      : [];
    const branchOk = allowedBranches.length === 0 || allowedBranches.includes(studentBranch) || allowedBranches.includes('ALL');

    const studentBacklogs = parseInt(student.backlogs, 10) || 0;
    const maxAllowedBacklogs = parseInt(job.maxBacklogs, 10) || 0;
    const backlogsOk = studentBacklogs <= maxAllowedBacklogs;

    const reasons = [];
    if (!cgpaOk) {
      reasons.push(`CGPA ${studentCgpa.toFixed(2)} is below cutoff ${requiredCgpa.toFixed(2)}`);
    }

    // Eligibility is ONLY based on CGPA
    const meetsRequirements = cgpaOk;

    return {
      eligible: meetsRequirements,
      meetsRequirements,
      cgpaOk,
      branchOk,
      backlogsOk,
      reasons

    };
  };

  // Job Application: Saves directly into Database via PHP API
  const applyForJob = async (jobId, studentId = currentStudent.id, note = '') => {
    const student = students.find(s => s.id === studentId);
    const job = jobs.find(j => j.id === jobId);

    if (!student || !job) {
      showToast('Student or Job record not found.', 'error');
      return { success: false, message: 'Invalid records' };
    }

    const existing = applications.find(a => a.jobId === jobId && a.studentId === studentId);
    if (existing) {
      showToast(`You have already applied for ${job.title} at ${job.companyName}!`, 'warning');
      return { success: false, message: 'Already applied' };
    }

    try {
      // Auto-sync: ensure the student exists in MySQL before applying
      // This handles students registered via frontend (localStorage) who aren't yet in MySQL
      const checkRes = await fetch(`/api/students.php?id=${encodeURIComponent(studentId)}`).then(r => r.json()).catch(() => ({ success: false }));
      if (!checkRes.success) {
        // Student not in DB yet — insert them now
        await fetch('/api/students.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        }).catch(err => console.error('Auto-sync student to DB failed:', err));
      }

      const response = await fetch('/api/applications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, studentId, note })
      });
      const data = await response.json();

      if (data.success && data.data) {
        setApplications(prev => [data.data, ...prev]);
        showToast(data.message || `Application successfully submitted for ${job.title}!`, 'success');
        fireConfetti();
        return { success: true };
      } else {
        showToast(data.message || 'Failed to submit application', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Error applying for job in database:', err);
      showToast('Database error while submitting application', 'error');
      return { success: false };
    }
  };

  // Update Application Status in Database via PHP API
  const updateApplicationStatus = async (appId, newStatus, offeredPackage = null, feedbackNote = '') => {
    try {
      const response = await fetch('/api/applications.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status: newStatus, offeredPackage, notes: feedbackNote })
      });
      const data = await response.json();

      if (data.success && data.data) {
        setApplications(prev => prev.map(a => a.id === appId ? data.data : a));
        if (newStatus === 'Offered') {
          // Re-sync students list to reflect placed status
          fetch('/api/students.php')
            .then(r => r.json())
            .then(res => { if (res.success) setStudents(res.data); });
          fireConfetti();
        }
        showToast(`Candidate status updated to "${newStatus}" in database!`, 'success');
      }
    } catch (err) {
      console.error('Failed to update status in database:', err);
      showToast('Failed to update application in database', 'error');
    }
  };

  // Schedule Interview in Database via PHP API
  const scheduleInterview = async (interviewData) => {
    try {
      const response = await fetch('/api/interviews.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData)
      });
      const data = await response.json();

      if (data.success && data.data) {
        setInterviews(prev => [data.data, ...prev]);
        // Also refresh applications to reflect interview round
        fetch('/api/applications.php')
          .then(r => r.json())
          .then(res => { if (res.success) setApplications(res.data); });
        showToast(`Interview scheduled and saved to database!`, 'success');
      }
    } catch (err) {
      console.error('Failed to schedule interview:', err);
      showToast('Error saving interview schedule', 'error');
    }
  };

  // CRUD for Students: Saved to Database via PHP API
  const addStudent = async (studentData) => {
    try {
      const response = await fetch('/api/students.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(prev => [data.data, ...prev]);
        showToast(data.message || 'Student enrolled into placement database!', 'success');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      showToast('Failed to enroll student', 'error');
    }
  };

  const updateStudent = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/students.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(prev => prev.map(s => s.id === id ? data.data : s));
        setAuthSession(prev => {
          if (prev?.isLoggedIn && prev?.user?.studentId === id) {
            return {
              ...prev,
              user: {
                ...prev.user,
                ...updatedFields
              }
            };
          }
          return prev;
        });
        showToast('Student profile updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      showToast('Failed to update student profile', 'error');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`/api/students.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== id));
        showToast('Student profile removed from database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      showToast('Failed to remove student', 'error');
    }
  };

  // CRUD for Companies: Saved to Database via PHP API
  const addCompany = async (companyData) => {
    try {
      const response = await fetch('/api/companies.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCompanies(prev => [data.data, ...prev]);
        showToast(`Company registered in database!`, 'success');
      }
    } catch (err) {
      console.error('Error adding company:', err);
      showToast('Failed to register company', 'error');
    }
  };

  const updateCompany = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/companies.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCompanies(prev => prev.map(c => c.id === id ? data.data : c));
        showToast('Company record updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  const deleteCompany = async (id) => {
    try {
      const response = await fetch(`/api/companies.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(prev => prev.filter(c => c.id !== id));
        showToast('Company record removed from database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  // CRUD for Jobs: Saved to Database via PHP API
  const addJob = async (jobData) => {
    try {
      const response = await fetch('/api/jobs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setJobs(prev => [data.data, ...prev]);
        showToast(`Campus drive published: ${data.data.title}!`, 'success');
      }
    } catch (err) {
      console.error('Error adding job:', err);
      showToast('Failed to publish drive', 'error');
    }
  };

  const updateJob = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/jobs.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setJobs(prev => prev.map(j => j.id === id ? data.data : j));
        showToast('Job listing updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setJobs(prev => prev.filter(j => j.id !== id));
        showToast('Job listing archived in database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // Reset to Baseline Database State
  const resetToDemoData = async () => {
    try {
      const response = await fetch('/api/reset.php', { method: 'POST' });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(data.data.students || []);
        setCompanies(data.data.companies || []);
        setJobs(data.data.jobs || []);
        setApplications(data.data.applications || []);
        setInterviews(data.data.interviews || []);
        setCurrentRole('officer');
        setActiveStudentId('std-1');
        setActiveCompanyId('cmp-1');
        showToast('Placement directory successfully synchronized with database!', 'success');
      }
    } catch (err) {
      console.error('Error resetting database:', err);
      showToast('Failed to reset database', 'error');
    }
  };

  return (
    <PlacementContext.Provider
      value={{
        darkMode,
        setDarkMode,
        currentRole,
        setCurrentRole,
        activeStudentId,
        setActiveStudentId,
        activeCompanyId,
        setActiveCompanyId,
        students,
        companies,
        jobs,
        applications,
        interviews,
        currentStudent,
        currentCompany,
        isAdmin,
        dataLoading,
        applyForJob,
        updateApplicationStatus,
        scheduleInterview,
        addStudent,
        updateStudent,
        deleteStudent,
        addCompany,
        updateCompany,
        deleteCompany,
        addJob,
        updateJob,
        deleteJob,
        checkEligibility,
        resetToDemoData,
        showToast,
        fireConfetti,
        authSession,
        login,
        logout,
        registeredUsers,
        recruitersList,
        registerStudent,
        registerRecruiter,
        approveRecruiter,
        rejectRecruiter,
        deleteRecruiter,
        addRecruiterDirectly,
        fetchDataFromDatabase
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-600 border border-emerald-400'
                : toast.type === 'error'
                  ? 'bg-rose-600 border border-rose-400'
                  : toast.type === 'warning'
                    ? 'bg-amber-600 border border-amber-400'
                    : 'bg-indigo-600 border border-indigo-400'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </PlacementContext.Provider>
  );
};

export const usePlacement = () => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};

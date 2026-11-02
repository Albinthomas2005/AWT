-- =====================================================================
-- PlaceIQ - Centralized Campus Placement & Recruitment Management System
-- Full Database Export for XAMPP (MySQL / MariaDB / phpMyAdmin)
-- =====================================================================
-- 
-- HOW TO IMPORT IN XAMPP / PHPMYADMIN:
-- 1. Open XAMPP Control Panel and start "Apache" and "MySQL"
-- 2. Open your browser and go to: http://localhost/phpmyadmin/
-- 3. Click the "Import" tab at the top
-- 4. Click "Choose File" and select this "placeiq.sql" file
-- 5. Scroll to the bottom and click "Import" (or "Go")
-- 
-- DEMO LOGIN CREDENTIALS:
-- -------------------------------------------------------------
-- Role                     | Username / Email          | Password
-- -------------------------------------------------------------
-- Student 1 (Placed Google)| 1                         | 1
-- Student 2 (Seeking)      | 2                         | 2
-- Student 3 (Placed MSFT)  | 3                         | 3
-- Placement Admin Officer  | admin@placement.edu       | admin123
-- Recruiter (Google India) | campus-hiring@google.com  | hiring123
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `placeiq`
--
CREATE DATABASE IF NOT EXISTS `placeiq` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `placeiq`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `company_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` VALUES
('usr-1', '1', '1', 'student', 'Student 1', 'student1@campus.edu', 'std-1', NULL, '2026-11-02 10:38:32'),
('usr-2', '2', '2', 'student', 'Student 2', 'student2@campus.edu', 'std-2', NULL, '2026-11-02 10:38:32'),
('usr-3', '3', '3', 'student', 'Student 3', 'student3@campus.edu', 'std-3', NULL, '2026-11-02 10:38:32'),
('usr-admin', 'admin@placement.edu', 'admin123', 'officer', 'Dr. Aris Thorne', 'admin@placement.edu', NULL, NULL, '2026-11-02 10:38:32'),
('usr-recruiter', 'campus-hiring@google.com', 'hiring123', 'company', 'Google India', 'campus-hiring@google.com', NULL, 'cmp-1', '2026-11-02 10:38:32');

-- --------------------------------------------------------
-- Table structure for table `students`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `roll_no` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `department` varchar(100) NOT NULL,
  `branch_code` varchar(20) NOT NULL,
  `cgpa` decimal(4,2) NOT NULL,
  `backlogs` int(11) NOT NULL DEFAULT 0,
  `passing_year` int(11) NOT NULL DEFAULT 2026,
  `skills` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Seeking',
  `placed_company` varchar(150) DEFAULT NULL,
  `placed_package` varchar(50) DEFAULT NULL,
  `resume_url` text DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `linkedin` text DEFAULT NULL,
  `github` text DEFAULT NULL,
  `headline` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `projects` text DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  `education_10th` text DEFAULT NULL,
  `education_12th` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roll_no` (`roll_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `students`
INSERT INTO `students` VALUES
('std-1', 'Student 1', '1', 'student1@campus.edu', '+91 98765 43210', 'Computer Science & Engineering', 'CSE', '9.40', '0', '2026', '[\"React\",\"Node.js\",\"Python\",\"AWS\",\"Data Structures\",\"SQL\",\"System Design\"]', 'Seeking', NULL, NULL, 'https://example.com/resumes/student1.pdf', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/student1', 'https://github.com/student1', 'Aspiring Software Development Engineer & Cloud Systems Architect', 'Bengaluru / Hybrid, India', '[{\"title\":\"Distributed High-Throughput Task Processing Pipeline\",\"tech\":\"Node.js \\u2022 Redis \\u2022 Docker \\u2022 AWS S3\",\"description\":\"Designed and deployed an asynchronous message queuing architecture handling 12,000+ jobs\\/sec with exponential backoff retries and dead-letter queues. Achieved sub-45ms execution response times with 99.98% reliability.\"},{\"title\":\"Full-Stack Campus Algorithmic Evaluation Engine\",\"tech\":\"React \\u2022 TypeScript \\u2022 Tailwind \\u2022 PostgreSQL\",\"description\":\"Constructed automated code sandbox running C++, Java, and Python submissions against test cases in isolated containers. Integrated WebSocket channels for live leaderboard rendering during intra-college coding hackathons.\"}]', '[\"AWS Certified Cloud Practitioner (Scored 910\\/1000)\",\"LeetCode Top 5% Rank (650+ Problems Solved)\",\"Finalist: National Smart Campus Hackathon 2025\",\"HackerRank 5-Star Gold Badge in Problem Solving & SQL\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"All India Secondary Exam\",\"score\":\"96.2% (10.0 CGPA)\",\"details\":\"Top 1% Percentile Distinction\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"Central Board (CBSE \\/ State)\",\"score\":\"94.6%\",\"details\":\"Physics, Chemistry, Mathematics & CS\"}', '2026-11-02 10:38:32'),
('std-2', 'Student 2', '2', 'student2@campus.edu', '+91 98234 56789', 'Electronics & Communication', 'ECE', '7.15', '1', '2026', '[\"Embedded C\",\"IoT\",\"Python\",\"MATLAB\",\"VLSI\",\"Verilog\"]', 'Seeking', NULL, NULL, 'https://example.com/resumes/student2.pdf', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/student2', 'https://github.com/student2', 'Embedded Systems & IoT Hardware Systems Engineer', 'Hyderabad / Chennai, India', '[{\"title\":\"Edge AI Smart Agricultural Sensor Mesh\",\"tech\":\"Embedded C \\u2022 ESP32 \\u2022 LoRaWAN \\u2022 Python\",\"description\":\"Engineered mesh network of low-power soil moisture and microclimate telemetry nodes transmitting over 12km range. Reduced irrigation water consumption by 32%.\"},{\"title\":\"Autonomous Quadcopter Flight Controller with PID Tuning\",\"tech\":\"STM32 \\u2022 C++ \\u2022 FreeRTOS \\u2022 MPU6050\",\"description\":\"Developed hard real-time flight telemetry firmware with Kalman filter sensor fusion and responsive stabilization loops running at 400Hz.\"}]', '[\"ARM Cortex-M Embedded Systems Certification\",\"MATLAB & Simulink Specialist Credential\",\"First Place: Inter-College Robocon Circuit Design\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"State Secondary Board\",\"score\":\"91.8%\",\"details\":\"Distinction in Sciences & Mathematics\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"State Higher Secondary Board\",\"score\":\"89.4%\",\"details\":\"Electronics, Physics & Mathematics\"}', '2026-11-02 10:38:32'),
('std-3', 'Student 3', '3', 'student3@campus.edu', '+91 91234 56780', 'Computer Science & Engineering', 'CSE', '9.35', '0', '2026', '[\"Distributed Systems\",\"Go\",\"Rust\",\"Kubernetes\",\"Algorithms\",\"C++\"]', 'Placed', 'Microsoft', '24.0 LPA', 'https://example.com/resumes/student3.pdf', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/student3', 'https://github.com/student3', 'Systems Programmer & Distributed Infrastructure Architect', 'Bengaluru / Pune, India', '[{\"title\":\"Raft Distributed Consensus Key-Value Store\",\"tech\":\"Rust \\u2022 Tokio \\u2022 gRPC \\u2022 RocksDB\",\"description\":\"Implemented replicated state machine protocol with dynamic cluster membership changes, snapshot compaction, and high-performance log replication.\"},{\"title\":\"Zero-Copy Linux Kernel Packet Filtering Driver\",\"tech\":\"C \\u2022 eBPF \\u2022 Linux Kernel \\u2022 XDP\",\"description\":\"Created line-rate packet filter dropping malicious SYN floods at NIC driver level, processing 14.8M packets\\/sec.\"}]', '[\"Certified Kubernetes Application Developer (CKAD)\",\"Codeforces Candidate Master (Rating 1942)\",\"Winner: National Systems Programming Olympiad\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"ICSE Board\",\"score\":\"95.4%\",\"details\":\"Top Tier Academic Honor Roll\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"ISC Board\",\"score\":\"93.8%\",\"details\":\"Computer Science, Physics & Mathematics\"}', '2026-11-02 10:38:32'),
('std-4', 'Ananya Patel', '2022EC1077', 'ananya.patel@campus.edu', '+91 97123 45678', 'Electronics & Communication', 'ECE', '7.95', '0', '2026', '[\"Embedded C\",\"IoT\",\"Python\",\"MATLAB\",\"VLSI\",\"Verilog\"]', 'Shortlisted', NULL, NULL, 'https://example.com/resumes/ananya-patel.pdf', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/ananyapatel', 'https://github.com/ananyapatel', 'VLSI Chip Design & Digital Electronics Specialist', 'Bengaluru, India', '[{\"title\":\"32-Bit RISC-V Pipelined Microprocessor Core\",\"tech\":\"Verilog \\u2022 ModelSim \\u2022 Vivado \\u2022 FPGA\",\"description\":\"Designed five-stage pipelined RV32I architecture with forwarding unit and branch hazard detection. Synthesized on Artix-7 FPGA target at 100MHz clock.\"}]', '[\"Cadence VLSI Digital Design Specialist\",\"IEEE Student Technical Paper Award 2025\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"CBSE\",\"score\":\"92.0%\",\"details\":\"First Division with Honors\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"CBSE\",\"score\":\"90.5%\",\"details\":\"Mathematics & Electronics Stream\"}', '2026-11-02 10:38:32'),
('std-5', 'Rohan Gupta', '2022CS1091', 'rohan.gupta@campus.edu', '+91 99887 66554', 'Computer Science & Engineering', 'CSE', '6.95', '1', '2026', '[\"Web Development\",\"JavaScript\",\"HTML\\/CSS\",\"MySQL\",\"PHP\"]', 'Seeking', NULL, NULL, 'https://example.com/resumes/rohan-gupta.pdf', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/rohangupta', 'https://github.com/rohangupta', 'Full-Stack Web Architect & Database Engineer', 'Delhi NCR / Remote, India', '[{\"title\":\"Campus Placement & Recruiter Portal Backend\",\"tech\":\"PHP \\u2022 SQLite \\u2022 MySQL \\u2022 RESTful APIs\",\"description\":\"Architected relational recruitment database schema with role-based JWT authentication, automated eligibility triggers, and high concurrency PDO query handlers.\"}]', '[\"Oracle Certified Associate: Database SQL\",\"Full-Stack Web Development Nanodegree\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"CBSE\",\"score\":\"88.6%\",\"details\":\"Distinction in Computer Applications\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"CBSE\",\"score\":\"86.2%\",\"details\":\"Computer Science & Mathematics\"}', '2026-11-02 10:38:32'),
('std-6', 'Sneha Reddy', '2022ME1004', 'sneha.reddy@campus.edu', '+91 96543 21098', 'Mechanical Engineering', 'MECH', '7.65', '0', '2026', '[\"SolidWorks\",\"AutoCAD\",\"Thermal Engineering\",\"MATLAB\",\"Lean Mfg\"]', 'Placed', 'Tata Motors', '12.0 LPA', 'https://example.com/resumes/sneha-reddy.pdf', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'https://linkedin.com/in/snehareddy', 'https://github.com/snehareddy', 'Mechanical Systems & CAD / FEA Simulation Engineer', 'Pune / Bengaluru, India', '[{\"title\":\"Electric Vehicle Battery Enclosure Thermal Dissipation\",\"tech\":\"SolidWorks \\u2022 ANSYS Fluent \\u2022 MATLAB\",\"description\":\"Modeled liquid-cooling jacket geometry optimizing heat dissipation under peak discharge cycles, reducing hotspot variance by 4.2\\u00b0C.\"},{\"title\":\"Lightweight Robotic Arm Kinematic Synthesis\",\"tech\":\"AutoCAD \\u2022 Simscape \\u2022 Finite Element Analysis\",\"description\":\"Topology-optimized 6-DOF robotic manipulator arm achieving 28% mass reduction while maintaining structural safety factor > 2.5.\"}]', '[\"Certified SOLIDWORKS Professional (CSWP)\",\"ANSYS Mechanical FEA Credential\",\"SAE BAJA National Team Lead 2025\"]', '{\"title\":\"Secondary School (Class X)\",\"board\":\"State Board\",\"score\":\"93.2%\",\"details\":\"Academic Excellence Award\"}', '{\"title\":\"Senior Secondary (Class XII)\",\"board\":\"State Higher Secondary\",\"score\":\"91.0%\",\"details\":\"Physics, Chemistry & Applied Mechanics\"}', '2026-11-02 10:38:32');

-- --------------------------------------------------------
-- Table structure for table `companies`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `industry` varchar(100) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `hr_contact` varchar(150) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `tier` varchar(50) NOT NULL DEFAULT 'Tier 2 (Core)',
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `logo` text DEFAULT NULL,
  `total_hires` int(11) NOT NULL DEFAULT 0,
  `avg_package` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `companies`
INSERT INTO `companies` VALUES
('cmp-1', 'Google India', 'Technology / Cloud / AI', 'https://careers.google.com', 'Bengaluru / Hyderabad', 'Siddharth Sen (University Recruiter)', 'campus-hiring@google.com', 'Tier 1 (Dream)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', '18', '28.5 LPA', 'Google organizes the world’s information and makes it universally accessible and useful.', '2026-11-02 10:38:32'),
('cmp-2', 'Microsoft IDC', 'Cloud Computing / Enterprise Software', 'https://careers.microsoft.com', 'Bengaluru / Hyderabad / Noida', 'Kavita Menon (Talent Acquisition Lead)', 'idc-recruitment@microsoft.com', 'Tier 1 (Dream)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', '24', '22.0 LPA', 'Microsoft enables digital transformation for the era of an intelligent cloud and intelligent edge.', '2026-11-02 10:38:32'),
('cmp-3', 'Amazon Development Centre', 'E-Commerce / Cloud (AWS)', 'https://amazon.jobs', 'Bengaluru / Chennai / Hyderabad', 'Rajeev Nambiar (Campus HR Head)', 'campus-india@amazon.com', 'Tier 1 (Dream)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', '32', '24.5 LPA', 'Guided by customer obsession rather than competitor focus, Amazon builds planet-scale infrastructure.', '2026-11-02 10:38:32'),
('cmp-4', 'Cisco Systems', 'Networking / Cyber Security / IoT', 'https://cisco.com/careers', 'Bengaluru', 'Debashish Ray (Senior Director - Talent)', 'india-campus@cisco.com', 'Tier 2 (Core)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg', '28', '16.5 LPA', 'Cisco is the worldwide technology leader that securely connects everything to make anything possible.', '2026-11-02 10:38:32'),
('cmp-5', 'Deloitte USI', 'Consulting / Analytics / Advisory', 'https://deloitte.com/careers', 'Hyderabad / Mumbai / Bengaluru', 'Meenakshi Sundaram (Campus Lead)', 'usi-campus@deloitte.com', 'Tier 2 (Core)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg', '42', '11.0 LPA', 'Deloitte drives progress through global consulting, analytics, and digital transformation.', '2026-11-02 10:38:32'),
('cmp-6', 'TCS Digital', 'IT & Digital Engineering', 'https://tcs.com/careers', 'Pan India', 'Pradeep Iyer (Campus Lead)', 'campus.tcs@tcs.com', 'Tier 3 (Mass / IT)', 'Active', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', '95', '7.5 LPA', 'A global leader in IT services, consulting, and business solutions.', '2026-11-02 10:38:32');

-- --------------------------------------------------------
-- Table structure for table `jobs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` varchar(50) NOT NULL,
  `company_id` varchar(50) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `title` varchar(200) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'Full-time',
  `role` varchar(100) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `package_ctc` decimal(5,2) NOT NULL,
  `package_display` varchar(50) NOT NULL,
  `stipend` varchar(100) DEFAULT NULL,
  `min_cgpa` decimal(4,2) NOT NULL DEFAULT 6.00,
  `allowed_branches` text NOT NULL,
  `max_backlogs` int(11) NOT NULL DEFAULT 0,
  `deadline` date NOT NULL,
  `posted_date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Open',
  `vacancies` int(11) NOT NULL DEFAULT 5,
  `rounds` text NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `jobs`
INSERT INTO `jobs` VALUES
('job-1', 'cmp-1', 'Google India', 'Software Development Engineer - I (SDE 1)', 'Full-time', 'Frontend / Backend / Full Stack', 'Bengaluru / Hyderabad', '28.50', '₹28.5 LPA', '₹1,20,000 / month (Internship)', '8.00', '[\"CSE\",\"IT\"]', '0', '2026-11-15', '2026-10-18', 'Open', '8', '[\"Online Assessment (DSA + Coding)\",\"Technical Interview 1\",\"Technical Interview 2\",\"Googliness & Leadership\"]', 'Join Google core engineering teams building scalable platforms used by billions of users worldwide.', '2026-11-02 10:38:32'),
('job-2', 'cmp-2', 'Microsoft IDC', 'Support & Cloud Solutions Engineer', 'Full-time', 'Azure Cloud / DevOps', 'Bengaluru / Hyderabad / Noida', '22.00', '₹22.0 LPA', '₹95,000 / month', '7.50', '[\"CSE\",\"IT\",\"ECE\"]', '0', '2026-11-20', '2026-10-20', 'Open', '12', '[\"Coding Challenge (Codility)\",\"Technical Discussion (OS + Networking)\",\"Cloud Architecture Round\",\"Director Round\"]', 'Design and optimize mission-critical cloud solutions on Microsoft Azure.', '2026-11-02 10:38:32'),
('job-3', 'cmp-3', 'Amazon Development Centre', 'Software Development Engineer (AWS SDE)', 'Full-time', 'Cloud Services & Distributed Data', 'Bengaluru / Chennai', '24.50', '₹24.5 LPA', '₹1,10,000 / month', '7.50', '[\"CSE\",\"IT\"]', '0', '2026-11-25', '2026-10-22', 'Open', '15', '[\"Online Coding Test\",\"DSA & System Design\",\"Bar Raiser Round\",\"Behavioral Leadership\"]', 'Build ultra-high throughput services powering Amazon AWS, Prime Video, and Alexa.', '2026-11-02 10:38:32'),
('job-4', 'cmp-4', 'Cisco Systems', 'Associate Consulting Systems Engineer (CSE)', 'Full-time', 'Networking / Cyber Security', 'Bengaluru', '16.50', '₹16.5 LPA', '₹65,000 / month', '7.00', '[\"CSE\",\"IT\",\"ECE\"]', '1', '2026-11-30', '2026-10-24', 'Open', '20', '[\"Aptitude & Technical MCQ\",\"Cisco Technical Interview\",\"Managerial Interview\",\"HR Round\"]', 'Help global enterprises transform their digital networks with Cisco SDN and zero-trust cybersecurity.', '2026-11-02 10:38:32'),
('job-5', 'cmp-5', 'Deloitte USI', 'Business Technology Analyst (BTA)', 'Full-time', 'Consulting & Analytics', 'Hyderabad / Mumbai / Gurugram', '11.00', '₹11.0 LPA', '₹40,000 / month', '6.50', '[\"CSE\",\"IT\",\"ECE\",\"MECH\",\"CIVIL\",\"EEE\"]', '1', '2026-12-05', '2026-10-25', 'Open', '35', '[\"Deloitte Aptitude & Verbal Test\",\"Case Study Assessment\",\"Partner Technical Round\",\"HR Evaluation\"]', 'Collaborate with Fortune 500 executives to deliver strategic digital transformation and analytics.', '2026-11-02 10:38:32'),
('job-6', 'cmp-6', 'TCS Digital', 'Digital Systems Engineer', 'Full-time', 'Full Stack & AI Development', 'Pan India', '7.50', '₹7.5 LPA', '₹25,000 / month', '6.00', '[\"CSE\",\"IT\",\"ECE\",\"MECH\",\"CIVIL\",\"EEE\"]', '2', '2026-12-15', '2026-10-26', 'Open', '60', '[\"TCS NQT Advanced Cognitive & Coding\",\"Technical Interview\",\"Managerial & HR Interview\"]', 'Spearhead next-generation application development, IoT platforms, and digital client initiatives.', '2026-11-02 10:38:32');

-- --------------------------------------------------------
-- Table structure for table `applications`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `id` varchar(50) NOT NULL,
  `job_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `student_name` varchar(150) NOT NULL,
  `student_roll` varchar(50) NOT NULL,
  `student_branch` varchar(20) NOT NULL,
  `student_cgpa` decimal(4,2) NOT NULL,
  `company_id` varchar(50) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `job_title` varchar(200) NOT NULL,
  `applied_date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Applied',
  `offered_package` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `interview_round` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `applications`
INSERT INTO `applications` VALUES
('app-1', 'job-1', 'std-1', 'Student 1', '1', 'CSE', '9.40', 'cmp-1', 'Google India', 'Software Development Engineer - I (SDE 1)', '2026-10-19', 'Offered', '₹28.5 LPA', 'Exceptional performance in algorithmic problem solving and system scalability. Tier 1 Dream Offer.', 'Final HR / Offer Extended', '2026-11-02 10:38:32'),
('app-1b', 'job-2', 'std-1', 'Student 1', '1', 'CSE', '9.40', 'cmp-2', 'Microsoft IDC', 'Azure Cloud / DevOps', '2026-10-21', 'Interview', NULL, 'Scored 98 percentile in Codility coding assessment. Shortlisted for Cloud Architecture Round.', 'Round 3: System Design & Cloud Scalability', '2026-11-02 10:38:32'),
('app-2', 'job-4', 'std-2', 'Student 2', '2', 'ECE', '7.15', 'cmp-4', 'Cisco Systems', 'Associate Consulting Systems Engineer (CSE)', '2026-10-22', 'Interview', NULL, 'Cleared technical round 1 with high proficiency in core networking. Meets CGPA criteria (7.15 >= 7.0).', 'Technical Interview 2 - Core Networking', '2026-11-02 10:38:32'),
('app-2b', 'job-6', 'std-2', 'Student 2', '2', 'ECE', '7.15', 'cmp-6', 'TCS Digital', 'Digital Systems Engineer', '2026-10-24', 'Screened', NULL, 'Cognitive and digital programming evaluation cleared.', 'Awaiting Technical Evaluation Schedule', '2026-11-02 10:38:32'),
('app-3', 'job-2', 'std-3', 'Student 3', '3', 'CSE', '9.35', 'cmp-2', 'Microsoft IDC', 'Support & Cloud Solutions Engineer', '2026-10-20', 'Offered', '₹24.0 LPA', 'Accepted formal offer letter. Top performer in university recruitment cohort.', 'Final Selection Completed', '2026-11-02 10:38:32'),
('app-4', 'job-5', 'std-4', 'Ananya Patel', '2022EC1077', 'ECE', '7.95', 'cmp-5', 'Deloitte USI', 'Business Technology Analyst (BTA)', '2026-10-25', 'Applied', NULL, 'Application registered; eligibility confirmed (CGPA >= 6.5).', 'Application Under Review', '2026-11-02 10:38:32');

-- --------------------------------------------------------
-- Table structure for table `interviews`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `interviews`;
CREATE TABLE `interviews` (
  `id` varchar(50) NOT NULL,
  `job_id` varchar(50) DEFAULT NULL,
  `student_id` varchar(50) NOT NULL,
  `student_name` varchar(150) NOT NULL,
  `student_roll` varchar(50) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `round_name` varchar(150) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `venue_or_link` text NOT NULL,
  `interviewer` varchar(150) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Scheduled',
  `instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `interviews`
INSERT INTO `interviews` VALUES
('int-1', 'job-4', 'std-2', 'Student 2', '2', 'Cisco Systems', 'Round 2: Core Networking & Protocol Design', '2026-10-29', '11:00 AM - 12:00 PM', 'Placement Block Room 302 / Webex Meeting', 'Debashish Ray (Systems Engineer Leader)', 'Scheduled', 'Prepare code walk-through of your capstone IoT & networking repository.', '2026-11-02 10:38:32'),
('int-2', 'job-1', 'std-1', 'Student 1', '1', 'Google India', 'Offer Rollout & Executive Welcome Orientation', '2026-10-27', '04:00 PM - 05:00 PM', 'https://meet.google.com/xyz-placement-google', 'Siddharth Sen (University Recruitment Lead)', 'Completed', 'Review candidate employment declaration form and sign digitally.', '2026-11-02 10:38:32'),
('int-3', 'job-2', 'std-1', 'Student 1', '1', 'Microsoft IDC', 'Round 3: System Design & Cloud Scalability', '2026-10-31', '02:00 PM - 03:00 PM', 'https://teams.microsoft.com/l/meetup-join/pms-interview-student1', 'Kavita Menon (Talent Acquisition & Cloud Lead)', 'Scheduled', 'Bring your distributed systems architecture diagrams.', '2026-11-02 10:38:32'),
('int-4', 'job-2', 'std-3', 'Student 3', '3', 'Microsoft IDC', 'Executive Director Orientation', '2026-10-30', '10:00 AM - 11:00 AM', 'https://teams.microsoft.com/l/meetup-join/pms-interview-student3', 'Kavita Menon (Talent Acquisition Lead)', 'Completed', 'Final onboarding paperwork review.', '2026-11-02 10:38:32');

SET FOREIGN_KEY_CHECKS = 1;

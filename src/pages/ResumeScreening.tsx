import { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, XCircle, BrainCircuit, UserPlus, Filter, Search, Award, Type, Zap, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Candidate {
  id: string;
  name: string;
  roleApplied: string;
  skillsMatch: number; // percentage
  score: number; // out of 10
  status: 'Shortlisted' | 'Rejected' | 'Pending Review';
  avatar: string;
  keySkills: string[];
}

const initialCandidates: Candidate[] = [
  {
    id: "C101",
    name: "Alex Thompson",
    roleApplied: "Senior Frontend Engineer",
    skillsMatch: 80,
    score: 8,
    status: "Shortlisted",
    avatar: "https://i.pravatar.cc/150?u=alex",
    keySkills: ["React", "TypeScript", "Redux"]
  },
  {
    id: "C102",
    name: "Michael Chang",
    roleApplied: "Java Developer",
    skillsMatch: 45,
    score: 4.5,
    status: "Rejected",
    avatar: "https://i.pravatar.cc/150?u=michael",
    keySkills: ["Python", "Django", "SQL"]
  }
];

export default function ResumeScreening() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('hr');

  // Job Configuration
  const [jobTitle, setJobTitle] = useState('Java Developer');
  const [requiredSkills, setRequiredSkills] = useState('Java, Spring Boot, SQL, Microservices');

  // NLP Simulation Text
  const [resumeText, setResumeText] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'hr');
      } catch (e) {
        // default
      }
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Simulate reading a file by auto-filling some dummy resume text
      setResumeText("Experienced software engineer with 5 years of background. Strong knowledge in Java, Spring Boot, and SQL databases. Familiar with Agile methodologies.");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeText("Experienced software developer worked extensively with Python, machine learning, deep learning, Docker, and SQL. Fast learner.");
    }
  };

  const analyzeResumeWithNLP = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      // NLP Extraction Simulation
      const reqSkills = requiredSkills.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
      const resumeLower = resumeText.toLowerCase();

      const extracted: string[] = [];

      // Match against required skills
      reqSkills.forEach(req => {
        if (resumeLower.includes(req)) {
          extracted.push(req);
        }
      });

      // Look for other common IT skills
      const commonITSkills = ['react', 'python', 'javascript', 'typescript', 'docker', 'kubernetes', 'aws', 'azure', 'node.js', 'html', 'css', 'agile', 'scrum', 'git', 'c++', 'c#', 'machine learning'];
      commonITSkills.forEach(skill => {
        if (resumeLower.includes(skill) && !extracted.includes(skill)) {
          extracted.push(skill);
        }
      });

      // Calculate matching metrics
      let matchPercentage = 0;
      if (reqSkills.length > 0) {
        const matches = extracted.filter(e => reqSkills.includes(e)).length;
        matchPercentage = Math.round((matches / reqSkills.length) * 100);
      } else {
        matchPercentage = extracted.length > 0 ? 50 : 0;
      }

      // Base score out of 10
      let baseScore = (matchPercentage / 10);
      if (baseScore === 0 && extracted.length > 0) baseScore = 2.0;

      // Formatting
      const formattedSkills = extracted.map(s => s.charAt(0).toUpperCase() + s.slice(1));

      const newCandidate: Candidate = {
        id: `C${Math.floor(Math.random() * 900) + 100}`,
        name: `Applicant ${Math.floor(Math.random() * 1000)}`,
        roleApplied: jobTitle,
        skillsMatch: matchPercentage,
        score: parseFloat(Math.min(10, baseScore + (Math.random() * 1.5)).toFixed(1)),
        status: "Pending Review",
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
        keySkills: formattedSkills.length > 0 ? formattedSkills : ["General Fit"]
      };

      setCandidates(prev => [newCandidate, ...prev]);
      setResumeText(''); // Clear input after scan
      setIsAnalyzing(false);
    }, 2000);
  };

  const updateCandidateStatus = (id: string, status: 'Shortlisted' | 'Rejected') => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status } : c));
  };

  const sortedAndFilteredCandidates = candidates
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleApplied.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.score - a.score);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 5.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getMatchColorClass = (match: number) => {
    if (match >= 80) return 'bg-emerald-500';
    if (match >= 50) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner">
              <BrainCircuit className="w-8 h-8" />
            </span>
            AI Resume Screening module
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Utilize NLP to parse resumes, match keywords against job descriptions, and automatically shortlist candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column: Job Spec & Upload */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Job Spec Configurator */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] z-0"></div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 relative z-10 flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-500" /> Target Job Profile
            </h2>

            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Required Skills (CSV)
                </label>
                <textarea
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  className="w-full h-24 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                />
              </div>
            </div>
          </div>

          {/* Upload & NLP Extractor */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-br-[100px] z-0"></div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 relative z-10 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-500" /> Resume NLP Parser
            </h2>

            {userRole === 'hr' || userRole === 'admin' ? (
              <div className="flex flex-col h-full gap-4 relative z-10">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                    ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 bg-gray-50 dark:bg-gray-800/50'}
                  `}
                >
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-3 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Drop PDF/DOCX here</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">or click Browse Files below</p>

                  <label className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-indigo-500 hover:text-indigo-600 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm inline-block">
                    Browse Files
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileInput} />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs font-medium text-gray-400 uppercase">OR Paste Text</span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <textarea
                  placeholder="Paste raw resume text here for NLP extraction..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full flex-1 min-h-[120px] p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow text-gray-900 dark:text-gray-100"
                ></textarea>

                <button
                  onClick={analyzeResumeWithNLP}
                  disabled={!resumeText.trim() || isAnalyzing}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Parsing Context...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Run AI Scan
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-8 text-center border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">Only HR and Admin personnel can upload resumes for AI Screening.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Candidate Ranking List */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full min-h-[700px]">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Candidate Pipeline
              </h2>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">{candidates.length}</strong> Total</span>
                <span className="text-emerald-600 dark:text-emerald-400"><strong className="text-emerald-700 dark:text-emerald-300">{candidates.filter(c => c.status === 'Shortlisted').length}</strong> Shortlisted</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto p-4">
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {sortedAndFilteredCandidates.map((candidate, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    key={candidate.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-5 rounded-2xl border transition-all ${idx === 0 && filterStatus === 'all' && searchQuery === ''
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-md'
                      : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                      }`}
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img src={candidate.avatar} alt={candidate.name} className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-100" />
                        {idx === 0 && filterStatus === 'all' && searchQuery === '' && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm border border-white dark:border-gray-900">
                            #1 MATCH
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                          {candidate.name}
                        </h3>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                          {candidate.roleApplied}
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                          {candidate.keySkills.map((skill, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle: AI Scores */}
                    <div className="flex gap-8 items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                      <div className="flex flex-col items-center gap-1 min-w-[80px]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keyword Match</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">{candidate.skillsMatch}%</span>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getMatchColorClass(candidate.skillsMatch)}`}
                            style={{ width: `${candidate.skillsMatch}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>

                      <div className="flex flex-col items-center gap-1 min-w-[80px]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center flex gap-1 items-center justify-center">
                          <BrainCircuit className="w-3 h-3" /> AI Score
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-black ${getScoreColor(candidate.score)}`}>{candidate.score}</span>
                          <span className="text-xs font-medium text-gray-400">/ 10</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-3 min-w-[140px] items-end sm:items-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold border w-full text-center ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>

                      {candidate.status === 'Pending Review' && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => updateCandidateStatus(candidate.id, 'Shortlisted')}
                            className="flex-1 flex justify-center p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/40 rounded-xl transition-all shadow-sm"
                            title="Shortlist Candidate"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateCandidateStatus(candidate.id, 'Rejected')}
                            className="flex-1 flex justify-center p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/40 rounded-xl transition-all shadow-sm"
                            title="Reject Candidate"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                  </motion.div>
                ))}
                {sortedAndFilteredCandidates.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <UserPlus className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No candidates found</h3>
                    <p className="text-sm">Try adjusting your filters or search query, or parse a new resume.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

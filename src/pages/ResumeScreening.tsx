import { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, XCircle, BrainCircuit, BarChart, UserPlus, Filter, Search, Award } from "lucide-react";
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
    name: "Samantha Reed",
    roleApplied: "UX Designer",
    skillsMatch: 95,
    score: 9.5,
    status: "Shortlisted",
    avatar: "https://i.pravatar.cc/150?u=samantha",
    keySkills: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: "C103",
    name: "Michael Chang",
    roleApplied: "Backend Developer",
    skillsMatch: 45,
    score: 4,
    status: "Rejected",
    avatar: "https://i.pravatar.cc/150?u=michael",
    keySkills: ["Java", "Spring Boot", "SQL"]
  },
  {
    id: "C104",
    name: "Emily Watson",
    roleApplied: "Product Manager",
    skillsMatch: 75,
    score: 7,
    status: "Pending Review",
    avatar: "https://i.pravatar.cc/150?u=emily",
    keySkills: ["Agile", "Jira", "Roadmapping"]
  }
];

export default function ResumeScreening() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Must be HR to effectively use this module, but we'll show it generically for demo
  const [userRole, setUserRole] = useState<string>('hr');

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

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate API delay for AI processing
    setTimeout(() => {
      const newCandidate: Candidate = {
        id: `C${Math.floor(Math.random() * 900) + 100}`,
        name: "New Applicant",
        roleApplied: "Software Engineer",
        skillsMatch: Math.floor(Math.random() * (98 - 60 + 1)) + 60,
        score: parseFloat((Math.random() * (9.5 - 6.0) + 6.0).toFixed(1)),
        status: "Pending Review",
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
        keySkills: ["JavaScript", "Node.js", "MongoDB"]
      };
      
      setCandidates(prev => [newCandidate, ...prev]);
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateAnalysis();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateAnalysis();
    }
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
    .sort((a, b) => b.score - a.score); // Default ranking by AI score

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'Pending Review': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 6) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getMatchColorClass = (match: number) => {
    if (match >= 80) return 'bg-emerald-500';
    if (match >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> 
            AI Resume Screening
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automatically filter job applications, analyze skills match, and rank candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Analysis Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-0"></div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 relative z-10 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-500" /> Parse Resume
            </h2>
            
            {userRole === 'hr' || userRole === 'admin' ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all relative z-10
                  ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800/50'}
                `}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">AI is analyzing resume...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Extracting skills and calculating match</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Drag & drop resume here</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports PDF, DOCX (Max 5MB)</p>
                    </div>
                    <div className="pt-2">
                      <label className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-indigo-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-block">
                        Browse Files
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileInput} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">Only HR and Admin personnel can upload resumes for AI Screening.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-500" /> Pipeline Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Total Processed</span>
                <span className="font-bold text-gray-900 dark:text-white">{candidates.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                <span className="font-medium">Shortlisted</span>
                <span className="font-bold">{candidates.filter(c => c.status === 'Shortlisted').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-800/50">
                <span className="font-medium">Rejected</span>
                <span className="font-bold">{candidates.filter(c => c.status === 'Rejected').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Ranking List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full min-h-[600px]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Candidate Ranking
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate / Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Skills Match</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">AI Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {sortedAndFilteredCandidates.map((candidate, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={candidate.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${idx === 0 && filterStatus === 'all' && searchQuery === '' ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-3">
                          <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm mt-1" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {candidate.name} 
                              {idx === 0 && filterStatus === 'all' && searchQuery === '' && <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded border border-amber-200">#1 Rank</span>}
                            </p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{candidate.roleApplied}</p>
                            <p className="text-[10px] text-gray-400">ID: {candidate.id}</p>
                            <div className="flex gap-1 mt-1.5 max-w-[200px] overflow-hidden">
                              {candidate.keySkills.slice(0, 2).map((skill, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 whitespace-nowrap">{skill}</span>
                              ))}
                              {candidate.keySkills.length > 2 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">+{candidate.keySkills.length - 2}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{candidate.skillsMatch}%</span>
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getMatchColorClass(candidate.skillsMatch)}`} 
                              style={{ width: `${candidate.skillsMatch}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BrainCircuit className={`w-4 h-4 ${getScoreColor(candidate.score)}`} />
                          <span className={`text-base font-black ${getScoreColor(candidate.score)}`}>{candidate.score}</span>
                          <span className="text-xs text-gray-400">/10</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {candidate.status === 'Pending Review' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => updateCandidateStatus(candidate.id, 'Shortlisted')}
                              className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-800/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/50"
                              title="Shortlist Candidate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateCandidateStatus(candidate.id, 'Rejected')}
                              className="p-1.5 bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-800/60 rounded-lg transition-colors border border-rose-200 dark:border-rose-800/50"
                              title="Reject Candidate"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium">
                            View Profile
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {sortedAndFilteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                          <p>No candidates found matching criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

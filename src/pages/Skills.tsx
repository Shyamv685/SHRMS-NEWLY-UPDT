import { useState, useEffect } from "react";
import { Plus, Award, Target, BookOpen, Search, Star, Lightbulb, CheckCircle2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillRecord {
  id: string;
  employeeId: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft Skill' | 'Language' | 'Other';
  lastUpdated: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  validUntil: string;
  status: 'Active' | 'Expired';
}

const initialSkills: SkillRecord[] = [
  { id: "SK101", employeeId: "E201", name: "Python", level: "Intermediate", category: "Technical", lastUpdated: "10-02-2025" },
  { id: "SK102", employeeId: "E202", name: "Data Analysis", level: "Advanced", category: "Technical", lastUpdated: "15-01-2025" },
  { id: "SK103", employeeId: "E201", name: "Project Management", level: "Advanced", category: "Soft Skill", lastUpdated: "05-03-2025" },
  { id: "SK104", employeeId: "E205", name: "Spanish", level: "Beginner", category: "Language", lastUpdated: "20-02-2025" }
];

const mockCertifications: Certification[] = [
  { id: "C1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "15-08-2024", validUntil: "15-08-2027", status: "Active" },
  { id: "C2", name: "PMP Certification", issuer: "Project Management Institute", date: "10-05-2023", validUntil: "10-05-2026", status: "Active" }
];

export default function Skills() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [skills, setSkills] = useState<SkillRecord[]>(initialSkills);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'certifications' | 'training'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Beginner' as const,
    category: 'Technical' as const
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'employee');
      } catch (e) {
        setUserRole('employee');
      }
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const skill: SkillRecord = {
      id: `SK${Math.floor(Math.random() * 1000) + 200}`,
      employeeId: userRole === 'hr' ? "Select Employee" : "E201", // Mock current user ID if employee
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setSkills([skill, ...skills]);
    setShowAddModal(false);
    setNewSkill({ name: '', level: 'Beginner', category: 'Technical' });
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Advanced': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Beginner': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const recommendedTrainings = [
    { title: "Advanced Python for Data Science", matches: "Python", duration: "4 Weeks", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&q=80" },
    { title: "Data Visualization Masterclass", matches: "Data Analysis", duration: "2 Weeks", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" },
    { title: "Agile Leadership", matches: "Project Management", duration: "3 Weeks", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Development Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track competencies, manage certifications, and discover new growth opportunities.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Skill
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-indigo-400 transition-colors">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Skills</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{skills.length}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Certifications</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{mockCertifications.length}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-emerald-400 transition-colors">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg. Skill Level</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced</h3>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Suggested Paths</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3 Programs</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Content Areas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex overflow-x-auto hide-scrollbar space-x-4">
            <button 
              onClick={() => setActiveTab('skills')}
              className={`pb-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'skills' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Target className="w-4 h-4"/> Skills Matrix</div>
            </button>
            <button 
              onClick={() => setActiveTab('certifications')}
              className={`pb-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'certifications' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Award className="w-4 h-4"/> Certifications</div>
            </button>
            <button 
              onClick={() => setActiveTab('training')}
              className={`pb-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'training' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Suggested Training</div>
            </button>
          </div>
          
          {activeTab === 'skills' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}
        </div>
        
        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skill ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skill Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proficiency Level</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredSkills.map((skill, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={skill.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">{skill.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{skill.employeeId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {skill.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelColor(skill.level)}`}>
                          {skill.level === 'Expert' && <Star className="w-3 h-3 mr-1" />}
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {skill.lastUpdated}
                      </td>
                    </motion.tr>
                  ))}
                  {filteredSkills.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                          <p>No skills found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {mockCertifications.map((cert, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={cert.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -z-0"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {cert.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 relative z-10">{cert.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 relative z-10">{cert.issuer}</p>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400 relative z-10">
                    <div>
                      <span className="block font-medium text-gray-700 dark:text-gray-300">Issued</span>
                      {cert.date}
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-gray-700 dark:text-gray-300">Valid Until</span>
                      {cert.validUntil}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer min-h-[220px]"
            >
              <div className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Upload Certificate</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new certification to your profile</p>
            </motion.div>
          </div>
        )}

        {/* SUGGESTED TRAINING TAB */}
        {activeTab === 'training' && (
          <div className="p-6">
            <div className="mb-6 flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm">AI-Powered Skill Gap Analysis</h3>
                <p className="text-blue-700 dark:text-blue-400/80 text-sm mt-1">
                  Based on your current skill matrix and organizational goals, we've curated these training programs to help you level up your expertise.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedTrainings.map((train, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm group hover:shadow-lg transition-all"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img src={train.image} alt={train.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    <span className="absolute bottom-3 left-4 text-xs font-semibold px-2 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full">
                      Level up: {train.matches}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{train.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5">
                      <div className="flex items-center gap-1"><BookOpen className="w-4 h-4"/> Online Course</div>
                      <div className="flex items-center gap-1">⏱ {train.duration}</div>
                    </div>
                    <button className="w-full py-2 bg-gray-100 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/30 text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400 font-semibold rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-800">
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700 bg-indigo-50/50 dark:bg-gray-800">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log New Skill</h3>
              </div>
              
              <form onSubmit={handleAddSkill} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. React.js, Public Speaking"
                    value={newSkill.name}
                    onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    value={newSkill.category}
                    onChange={e => setNewSkill({...newSkill, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Soft Skill">Soft Skill</option>
                    <option value="Language">Language</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proficiency Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewSkill({...newSkill, level: lvl as any})}
                        className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                          newSkill.level === lvl 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-500 text-center shadow-sm' 
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Skill
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Plus, Heart, Activity, ClipboardList, Calendar as CalendarIcon, Users, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WellnessProgram {
  id: string;
  name: string;
  date: string;
  participation: string;
  type: 'Mental Health' | 'Fitness' | 'Survey';
  status: 'Upcoming' | 'Completed' | 'Active';
}

const initialData: WellnessProgram[] = [
  {
    id: "W01",
    name: "Yoga Session",
    date: "10-03-2025",
    participation: "20 Employees",
    type: "Fitness",
    status: "Upcoming"
  },
  {
    id: "W02",
    name: "Stress Management",
    date: "15-03-2025",
    participation: "15 Employees",
    type: "Mental Health",
    status: "Upcoming"
  },
  {
    id: "W03",
    name: "Annual Health Survey",
    date: "01-03-2025",
    participation: "142 Employees",
    type: "Survey",
    status: "Active"
  },
  {
    id: "W04",
    name: "5K Fun Run",
    date: "28-02-2025",
    participation: "45 Employees",
    type: "Fitness",
    status: "Completed"
  }
];

export default function Wellness() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [programs, setPrograms] = useState<WellnessProgram[]>(initialData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'Mental Health' | 'Fitness' | 'Survey'>('all');
  
  const [newProgram, setNewProgram] = useState({
    name: '',
    date: '',
    type: 'Fitness' as const,
    description: ''
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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    const program: WellnessProgram = {
      id: `W0${programs.length + 1}`,
      name: newProgram.name,
      date: newProgram.date || new Date().toISOString().split('T')[0],
      participation: "0 Employees",
      type: newProgram.type,
      status: "Upcoming"
    };
    
    setPrograms([program, ...programs]);
    setShowAddModal(false);
    setNewProgram({ name: '', date: '', type: 'Fitness', description: '' });
  };

  const filteredPrograms = programs.filter(prog => {
    if (activeTab === 'all') return true;
    return prog.type === activeTab;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Mental Health': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Fitness': return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'Survey': return <ClipboardList className="w-5 h-5 text-blue-500" />;
      default: return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Wellness</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track employee health, mental well-being, and fitness activities.
          </p>
        </div>
        {userRole === 'hr' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Program
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <Heart className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-20" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">Mental Health</h3>
            <p className="text-rose-100 text-sm font-medium">Stress management & support</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <Activity className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-20" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">Fitness</h3>
            <p className="text-emerald-100 text-sm font-medium">Physical activities & challenges</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <ClipboardList className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-20" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">Surveys</h3>
            <p className="text-blue-100 text-sm font-medium">Regular wellness check-ins</p>
          </div>
        </motion.div>
      </div>

      {/* Data Table Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Wellness Programs & Activities</h2>
          
          <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              All Programs
            </button>
            <button 
              onClick={() => setActiveTab('Mental Health')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'Mental Health' ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Heart className="w-3.5 h-3.5" /> Mental Health
            </button>
            <button 
              onClick={() => setActiveTab('Fitness')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'Fitness' ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Activity className="w-3.5 h-3.5" /> Fitness
            </button>
            <button 
              onClick={() => setActiveTab('Survey')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'Survey' ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <ClipboardList className="w-3.5 h-3.5" /> Surveys
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wellness ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participation</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                {userRole === 'employee' && (
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredPrograms.map((prog, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={prog.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white">{prog.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{prog.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        {getIconForType(prog.type)}
                        {prog.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {prog.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="font-medium">{prog.participation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(prog.status)}`}>
                        {prog.status}
                      </span>
                    </td>
                    {userRole === 'employee' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {prog.status === 'Upcoming' ? (
                          <button className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium text-sm transition-colors border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1.5 rounded-lg">
                            Join Activity
                          </button>
                        ) : prog.status === 'Active' && prog.type === 'Survey' ? (
                          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                            Take Survey
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Unavailable</span>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
                {filteredPrograms.length === 0 && (
                  <tr>
                    <td colSpan={userRole === 'employee' ? 7 : 6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p>No wellness programs found for this category.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Program Modal (HR Only) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-rose-50/50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Wellness Program</h3>
                </div>
              </div>
              
              <form onSubmit={handleAdd} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. Yoga Session, Health Survey"
                    value={newProgram.name}
                    onChange={e => setNewProgram({...newProgram, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newProgram.date}
                      onChange={e => setNewProgram({...newProgram, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select 
                      value={newProgram.type}
                      onChange={e => setNewProgram({...newProgram, type: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Mental Health">Mental Health</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Survey">Survey</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Additional details about the program..."
                    value={newProgram.description}
                    onChange={e => setNewProgram({...newProgram, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
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
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Create Program
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

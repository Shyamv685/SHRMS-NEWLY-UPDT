import { useState, useEffect } from "react";
import { TrendingUp, GraduationCap, Map, Target, Calendar, ArrowRight, Award, Plus, Search, ChevronRight, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromotionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  previousRole: string;
  newRole: string;
  date: string;
  avatar: string;
}

interface CareerGoal {
  id: string;
  title: string;
  status: 'In Progress' | 'Completed' | 'At Risk';
  progress: number;
  deadline: string;
}

const initialPromotions: PromotionRecord[] = [
  {
    id: "CG101",
    employeeId: "E201",
    employeeName: "Alice Johnson",
    previousRole: "Junior Developer",
    newRole: "Senior Developer",
    date: "01-02-2025",
    avatar: "https://i.pravatar.cc/150?u=alice"
  },
  {
    id: "CG102",
    employeeId: "E205",
    employeeName: "Maria Garcia",
    previousRole: "Marketing Specialist",
    newRole: "Marketing Manager",
    date: "15-01-2025",
    avatar: "https://i.pravatar.cc/150?u=maria"
  }
];

const mockGoals: CareerGoal[] = [
  { id: "G1", title: "Obtain AWS Solutions Architect Cert", status: "In Progress", progress: 60, deadline: "30-05-2025" },
  { id: "G2", title: "Complete Leadership Training", status: "At Risk", progress: 25, deadline: "15-04-2025" },
  { id: "G3", title: "Master React Framework", status: "Completed", progress: 100, deadline: "28-02-2025" }
];

export default function CareerGrowth() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [promotions, setPromotions] = useState<PromotionRecord[]>(initialPromotions);
  const [activeTab, setActiveTab] = useState<'history' | 'planning' | 'recommendations'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const [newPromo, setNewPromo] = useState({
    employeeName: '',
    previousRole: '',
    newRole: '',
    date: new Date().toISOString().split('T')[0]
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

  const handleLogPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    const promo: PromotionRecord = {
      id: `CG${Math.floor(Math.random() * 900) + 100}`,
      employeeId: `E${Math.floor(Math.random() * 900) + 100}`,
      employeeName: newPromo.employeeName,
      previousRole: newPromo.previousRole,
      newRole: newPromo.newRole,
      date: newPromo.date,
      avatar: `https://i.pravatar.cc/150?u=${newPromo.employeeName.toLowerCase().replace(' ', '')}`
    };

    setPromotions([promo, ...promotions]);
    setShowLogModal(false);
    setNewPromo({ employeeName: '', previousRole: '', newRole: '', date: new Date().toISOString().split('T')[0] });
  };

  const filteredPromotions = promotions.filter(p => 
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.newRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Career Growth Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track promotions, outline long-term career goals, and discover paths to success.
          </p>
        </div>
        {userRole === 'hr' && (
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Log Promotion
          </button>
        )}
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Recent Promotions</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{promotions.length} <span className="text-sm text-emerald-500 font-medium">this quarter</span></h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Goals</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2 <span className="text-sm text-blue-500 font-medium">pending</span></h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-indigo-100 font-medium text-sm mb-1">Growth Analysis</p>
            <h3 className="text-xl font-bold">You're on track!</h3>
            <p className="text-xs text-indigo-200 mt-1">Review your path below</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Map className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Main Tabbed Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex overflow-x-auto hide-scrollbar space-x-6">
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'history' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Promotion History</div>
            </button>
            <button 
              onClick={() => setActiveTab('planning')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'planning' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Target className="w-4 h-4"/> Goal Planning</div>
            </button>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'recommendations' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Map className="w-4 h-4"/> Career Path</div>
            </button>
          </div>
          
          {activeTab === 'history' && (
            <div className="relative w-full sm:w-64 pb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pb-3" style={{ top: '35%' }} />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Promotion History Tab */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transition</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredPromotions.map((promo, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={promo.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{promo.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={promo.avatar} alt={promo.employeeName} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{promo.employeeName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{promo.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium">
                          <span className="text-gray-500 dark:text-gray-400 max-w-[120px] truncate" title={promo.previousRole}>{promo.previousRole}</span>
                          <ArrowRight className="w-4 h-4 mx-3 text-emerald-500" />
                          <span className="text-gray-900 dark:text-white font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-800 max-w-[140px] truncate" title={promo.newRole}>{promo.newRole}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {promo.date}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredPromotions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                          <p>No promotion records found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Career Planning Tab */}
        {activeTab === 'planning' && (
          <div className="p-6">
            <div className="space-y-4">
              {mockGoals.map((goal, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={goal.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
                    <span className={`mt-2 sm:mt-0 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                      goal.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                      goal.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Target: {goal.deadline}</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'Completed' ? 'bg-emerald-500' : 
                          goal.status === 'In Progress' ? 'bg-blue-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 transition-colors flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add New Goal
              </button>
            </div>
          </div>
        )}

        {/* Growth Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="p-6">
             <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-1">Career Path: Lead Developer</h3>
                    <p className="text-purple-700 dark:text-purple-400/80 text-sm leading-relaxed mb-4">
                      Based on your current role as a Senior Developer and your active skill set, a path to "Lead Developer" is the most logical next step. Here are the core competencies required to reach this stage within 12 months.
                    </p>
                    
                    <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Recommended Actions:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            ✓
                          </div>
                          <span>Shadow a current team lead on project scope meetings to understand delegation.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                            2
                          </div>
                          <span>Acquire an advanced certification in Cloud Architecture.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                            3
                          </div>
                          <span>Mentor a Junior Developer for the upcoming fiscal quarter.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 mb-4 px-2">
               <span>Upcoming Reviews</span>
             </div>

             <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center border-t-4 border-indigo-500">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">OCT</span>
                    <span className="font-bold text-gray-900 dark:text-white leading-none">15</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Annual Performance Review</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Discussion covering promotion tracks</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </div>
          </div>
        )}
      </div>

      {/* Log Promotion Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700 bg-emerald-50/50 dark:bg-gray-800">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log Promotion Event</h3>
              </div>
              
              <form onSubmit={handleLogPromotion} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. John Doe"
                    value={newPromo.employeeName}
                    onChange={e => setNewPromo({...newPromo, employeeName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Previous Role</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Junior Manager"
                      value={newPromo.previousRole}
                      onChange={e => setNewPromo({...newPromo, previousRole: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Role</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Senior Manager"
                      value={newPromo.newRole}
                      onChange={e => setNewPromo({...newPromo, newRole: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all border-emerald-300 dark:border-emerald-700/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Promotion Date</label>
                  <input 
                    type="date" 
                    required
                    value={newPromo.date}
                    onChange={e => setNewPromo({...newPromo, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Save Record
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

import { useState, useEffect } from "react";
import { Award, Star, Trophy, Gift, Plus, Search, CheckCircle2, Crown, Zap, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AwardRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  award: string;
  month: string;
  avatar: string;
  points: number;
}

interface Badge {
  id: string;
  name: string;
  earnedDate: string;
  description: string;
  icon: 'crown' | 'zap' | 'heart' | 'star';
  color: string;
}

const initialData: AwardRecord[] = [
  {
    id: "A01",
    employeeId: "E202",
    employeeName: "Robert Smith",
    award: "Employee of the Month",
    month: "March",
    points: 5000,
    avatar: "https://i.pravatar.cc/150?u=robert",
  },
  {
    id: "A02",
    employeeId: "E205",
    employeeName: "Maria Garcia",
    award: "Innovation Champion",
    month: "February",
    points: 2500,
    avatar: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "A03",
    employeeId: "E201",
    employeeName: "Alice Johnson",
    award: "Team Player Award",
    month: "January",
    points: 1500,
    avatar: "https://i.pravatar.cc/150?u=alice",
  }
];

const mockBadges: Badge[] = [
  { id: "B1", name: "Problem Solver", earnedDate: "10-02-2025", description: "Resolved a critical priority issue", icon: "zap", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 border-amber-200" },
  { id: "B2", name: "Culture Champion", earnedDate: "15-01-2025", description: "Consistently promotes positive workplace", icon: "heart", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 border-rose-200" },
  { id: "B3", name: "Top Performer Q1", earnedDate: "05-03-2025", description: "Exceeded all Q1 KPIs", icon: "crown", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 border-purple-200" },
  { id: "B4", name: "5 Year Anniversary", earnedDate: "20-02-2025", description: "5 years of dedicated service", icon: "star", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 border-indigo-200" }
];

export default function Recognition() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [awards, setAwards] = useState<AwardRecord[]>(initialData);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newAward, setNewAward] = useState({
    employeeName: '',
    award: 'Employee of the Month',
    month: new Date().toLocaleString('default', { month: 'long' }),
    points: 1000
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

  const handleGiveAward = (e: React.FormEvent) => {
    e.preventDefault();
    
    const award: AwardRecord = {
      id: `A0${awards.length + 1}`,
      employeeId: `E${Math.floor(Math.random() * 900) + 100}`,
      employeeName: newAward.employeeName,
      award: newAward.award,
      month: newAward.month,
      points: newAward.points,
      avatar: `https://i.pravatar.cc/150?u=${newAward.employeeName.toLowerCase().replace(' ', '')}`,
    };
    
    setAwards([award, ...awards]);
    setShowRewardModal(false);
    setNewAward({ 
      employeeName: '', 
      award: 'Employee of the Month', 
      month: new Date().toLocaleString('default', { month: 'long' }),
      points: 1000 
    });
  };

  const filteredAwards = awards.filter(a => {
    return a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           a.award.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'heart': return <Heart className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Recognition</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Celebrate achievements, award badges, and manage reward points.
          </p>
        </div>
        {userRole === 'hr' && (
          <button
            onClick={() => setShowRewardModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Give Recognition
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -z-0 group-hover:bg-amber-500/20 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Employee of the Month</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">March: Robert Smith</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-0 group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mockBadges.length}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Achievement Badges Earned</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-0 group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Gift className="w-6 h-6" />
            </div>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Redeem
            </button>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">8,500</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Available Reward Points</p>
        </motion.div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaderboard / Awards Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Recent Recognition
            </h2>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search awards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Award / ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredAwards.map((award, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={award.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {award.award === 'Employee of the Month' && <Crown className="w-4 h-4 text-amber-500" />}
                            {award.award}
                          </p>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{award.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden">
                            <img src={award.avatar} alt={award.employeeName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white">{award.employeeName}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{award.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {award.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          +{award.points} <Gift className="w-3 h-3" />
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredAwards.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                          <p>No recognition records found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* My Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> My Badges
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
            {mockBadges.map((badge, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:scale-[1.02] cursor-pointer ${badge.color}`}
              >
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg shadow-sm">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{badge.name}</h3>
                  <p className="text-sm opacity-90 line-clamp-2 leading-snug">{badge.description}</p>
                  <p className="text-xs font-medium mt-2 opacity-75">Earned: {badge.earnedDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Give Award Modal (HR Only) */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Give Recognition</h3>
              </div>
              
              <form onSubmit={handleGiveAward} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter employee name"
                    value={newAward.employeeName}
                    onChange={e => setNewAward({...newAward, employeeName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Award Title</label>
                  <select 
                    value={newAward.award}
                    onChange={e => setNewAward({...newAward, award: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="Employee of the Month">Employee of the Month</option>
                    <option value="Innovation Champion">Innovation Champion</option>
                    <option value="Team Player Award">Team Player Award</option>
                    <option value="Outstanding Service">Outstanding Service</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Month</label>
                    <select 
                      value={newAward.month}
                      onChange={e => setNewAward({...newAward, month: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reward Points</label>
                    <input 
                      type="number" 
                      required
                      min={100}
                      step={100}
                      value={newAward.points}
                      onChange={e => setNewAward({...newAward, points: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowRewardModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Issue Award
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

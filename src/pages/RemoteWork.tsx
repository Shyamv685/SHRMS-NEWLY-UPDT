import { useState, useEffect } from "react";
import { Plus, Check, X, Clock, MapPin, Building, Home, Laptop, BarChart, Calendar, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RemoteRequest {
  id: string;
  employeeId: string;
  name: string;
  location: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  productivityScore?: number;
  avatar?: string;
}

const initialData: RemoteRequest[] = [
  {
    id: "RW101",
    employeeId: "E201",
    name: "Alice Johnson",
    location: "Home",
    date: "05-03-2025",
    status: "Approved",
    productivityScore: 94,
    avatar: "https://i.pravatar.cc/150?u=alice",
  },
  {
    id: "RW102",
    employeeId: "E203",
    name: "Robert Smith",
    location: "Co-working Space",
    date: "06-03-2025",
    status: "Pending",
    productivityScore: 0,
    avatar: "https://i.pravatar.cc/150?u=robert",
  },
  {
    id: "RW103",
    employeeId: "E205",
    name: "Maria Garcia",
    location: "Client Office",
    date: "06-03-2025",
    status: "Approved",
    productivityScore: 88,
    avatar: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "RW104",
    employeeId: "E201",
    name: "Alice Johnson",
    location: "Home",
    date: "07-03-2025",
    status: "Rejected",
    productivityScore: 0,
    avatar: "https://i.pravatar.cc/150?u=alice",
  }
];

export default function RemoteWork() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [requests, setRequests] = useState<RemoteRequest[]>(initialData);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  
  const [newRequest, setNewRequest] = useState({
    location: 'Home',
    otherLocation: '',
    date: '',
    reason: ''
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

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = newRequest.location === 'Other' ? newRequest.otherLocation : newRequest.location;
    
    const request: RemoteRequest = {
      id: `RW${Math.floor(Math.random() * 1000) + 200}`,
      employeeId: "E208", // Mock current user
      name: "Current User",
      location: finalLocation || 'Home',
      date: newRequest.date || new Date().toISOString().split('T')[0],
      status: "Pending",
      productivityScore: 0,
      avatar: "https://i.pravatar.cc/150?u=current",
    };
    
    setRequests([request, ...requests]);
    setShowApplyModal(false);
    setNewRequest({ location: 'Home', otherLocation: '', date: '', reason: '' });
  };

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return req.status === 'Pending';
    if (activeTab === 'approved') return req.status === 'Approved';
    return true;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    avgProductivity: Math.round(
      requests.filter(r => r.status === 'Approved' && r.productivityScore).reduce((acc, curr) => acc + (curr.productivityScore || 0), 0) / 
      Math.max(1, requests.filter(r => r.status === 'Approved' && r.productivityScore).length)
    )
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Remote Work Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Apply for remote work, track attendance, and monitor productivity.
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          Apply for Remote Work
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Approved Today</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Productivity</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgProductivity}%</h3>
              <span className="text-sm text-emerald-500 font-medium mb-1">Good</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Remote Work Tracking</h2>
          
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'approved' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Approved
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Work Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Productivity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                {userRole === 'hr' && (
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredRequests.map((req, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={req.id} 
                    className="hover:bg-gray-50 flex-none dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{req.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{req.id} • {req.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {req.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm">
                        {req.location.toLowerCase().includes('home') ? (
                          <Home className="w-4 h-4 text-blue-500" />
                        ) : req.location.toLowerCase().includes('office') ? (
                          <Building className="w-4 h-4 text-indigo-500" />
                        ) : (
                          <Laptop className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="font-medium">{req.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.status === 'Approved' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                req.productivityScore && req.productivityScore > 80 ? 'bg-emerald-500' : 
                                req.productivityScore && req.productivityScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${req.productivityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{req.productivityScore}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {userRole === 'hr' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {req.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => updateStatus(req.id, 'Approved')}
                              className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-800/60 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateStatus(req.id, 'Rejected')}
                              className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-800/60 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={userRole === 'hr' ? 6 : 5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p>No remote work requests found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Apply for Remote Work</h3>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleApply} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newRequest.date}
                    onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Location Name/Type</label>
                  <select 
                    value={newRequest.location}
                    onChange={e => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Home">Home</option>
                    <option value="Co-working Space">Co-working Space</option>
                    <option value="Client Office">Client Office</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {newRequest.location === 'Other' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specify Location</label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. Library, Hotel"
                      value={newRequest.otherLocation}
                      onChange={e => setNewRequest({...newRequest, otherLocation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Briefly state why you need to work remotely..."
                    value={newRequest.reason}
                    onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Submit Request
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

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Clock, 
  BarChart2, 
  Search, 
  BrainCircuit,
  ChevronRight,
  UserX,
  Target
} from "lucide-react";

interface EmployeeAttritionData {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  riskScore: number; 
  attendance: string;
  performance: string;
  salaryGrowth: string;
  workHours: string;
  riskFactors: string[];
}

const mockData: EmployeeAttritionData[] = [
  {
    id: "EMP001",
    name: "Sarah Jenkins",
    role: "Senior Developer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    riskScore: 85,
    attendance: "85%",
    performance: "Declining (3.2/5)",
    salaryGrowth: "2% in 3 years",
    workHours: "55 hrs/week",
    riskFactors: ["High Workload", "Low Salary Growth", "Declining Performance"]
  },
  {
    id: "EMP042",
    name: "Michael Chen",
    role: "Product Manager",
    department: "Product",
    avatar: "https://i.pravatar.cc/150?u=michael",
    riskScore: 72,
    attendance: "92%",
    performance: "Average (3.5/5)",
    salaryGrowth: "5% last year",
    workHours: "48 hrs/week",
    riskFactors: ["Above Average Hours", "Role Stagnation"]
  },
  {
    id: "EMP028",
    name: "Emily Rodriguez",
    role: "UX Designer",
    department: "Design",
    avatar: "https://i.pravatar.cc/150?u=emily",
    riskScore: 15,
    attendance: "98%",
    performance: "Excellent (4.8/5)",
    salaryGrowth: "15% last year",
    workHours: "40 hrs/week",
    riskFactors: []
  },
  {
    id: "EMP091",
    name: "David Kim",
    role: "Sales Representative",
    department: "Sales",
    avatar: "https://i.pravatar.cc/150?u=david",
    riskScore: 68,
    attendance: "90%",
    performance: "Good (4.0/5)",
    salaryGrowth: "Market Average",
    workHours: "50 hrs/week",
    riskFactors: ["Commute Distance", "Inconsistent Commissions"]
  },
  {
    id: "EMP112",
    name: "Anita Bose",
    role: "Marketing Specialist",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=anita",
    riskScore: 92,
    attendance: "78%",
    performance: "Poor (2.5/5)",
    salaryGrowth: "0% in 2 years",
    workHours: "35 hrs/week",
    riskFactors: ["Low Attendance", "Poor Performance", "No Recent Raises"]
  }
];

export default function AttritionPrediction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeAttritionData | null>(mockData[0]);

  const filteredData = useMemo(() => {
    return mockData.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesRisk = true;
      if (filterRisk === "High") matchesRisk = emp.riskScore >= 70;
      else if (filterRisk === "Medium") matchesRisk = emp.riskScore >= 40 && emp.riskScore < 70;
      else if (filterRisk === "Low") matchesRisk = emp.riskScore < 40;

      return matchesSearch && matchesRisk;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchQuery, filterRisk]);

  const stats = useMemo(() => {
    const highRiskCount = mockData.filter(e => e.riskScore >= 70).length;
    const avgRisk = Math.round(mockData.reduce((acc, curr) => acc + curr.riskScore, 0) / mockData.length);
    return { highRiskCount, avgRisk };
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-rose-600 dark:text-rose-400";
    if (score >= 40) return "text-amber-500 dark:text-amber-400";
    return "text-emerald-500 dark:text-emerald-400";
  };

  const getRiskBadgeClass = (score: number) => {
    if (score >= 70) return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    if (score >= 40) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
  };
  
  const getRiskLabel = (score: number) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            AI Attrition Prediction
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Predicts which employees may leave soon based on key operational metrics.
          </p>
        </div>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-lg group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Critical Flight Risks</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highRiskCount} <span className="text-sm text-rose-500 font-medium">employees</span></h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Company Avg Risk</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRisk}% <span className="text-sm text-gray-500 font-medium">score</span></h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-md p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-indigo-100 font-medium text-sm mb-1">AI Model Confidence</p>
            <h3 className="text-3xl font-bold">94%</h3>
            <p className="text-xs text-indigo-200 mt-1">Based on historic retention data</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {["All", "High", "Medium", "Low"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterRisk(level as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filterRisk === level 
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filteredData.map((employee, idx) => (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={employee.id} 
                  >
                    <button
                      onClick={() => setSelectedEmployee(employee)}
                      className={`w-full text-left p-4 transition-colors flex items-center justify-between group ${
                        selectedEmployee?.id === employee.id 
                          ? "bg-indigo-50 dark:bg-indigo-900/20" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm group-hover:border-indigo-100 transition-colors" />
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{employee.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{employee.role} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getRiskColor(employee.riskScore)}`}>
                            {employee.riskScore}%
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Risk Score</div>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${selectedEmployee?.id === employee.id ? "text-indigo-500" : "text-gray-400"}`} />
                      </div>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {filteredData.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
                  <UserX className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p>No employees match your criteria.</p>
                </div>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column - Deep Dive Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px] relative">
          {selectedEmployee ? (
            <div className="flex-1 overflow-y-auto w-full">
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-20 h-20 rounded-xl object-cover shadow-md border-4 border-white dark:border-gray-700" />
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getRiskBadgeClass(selectedEmployee.riskScore)}`}>
                    {getRiskLabel(selectedEmployee.riskScore)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmployee.role} • {selectedEmployee.department}</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    AI Prediction Breakdown
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" /> Attendance
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEmployee.attendance}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Target className="w-3.5 h-3.5" /> Performance
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEmployee.performance}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Salary Growth
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEmployee.salaryGrowth}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <BarChart2 className="w-3.5 h-3.5" /> Work Hours
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEmployee.workHours}</p>
                    </div>
                  </div>
                </div>

                {selectedEmployee.riskFactors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Detected Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {selectedEmployee.riskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-rose-500 mt-0.5">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                    Schedule Retention Check-in
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <BrainCircuit className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
              <p>Select an employee from the list to view their detailed AI retention analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Download, Calendar, Search, AlertCircle, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyRecord {
  date: string;
  loginTime: string | null;
  logoutTime: string | null;
  hours: number;
  status: string;
}

interface MonthlyReportEmployee {
  employeeId: number;
  employeeName: string;
  totalHours: number;
  permissions: number;
  offDays: number;
  halfDays: number;
  avgCheckIn?: string;
  avgCheckOut?: string;
  totalWorkingDays: number;
  presentDays: number;
  dailyRecords?: DailyRecord[];
}

interface MonthlyReport {
  period: { year: string; month: string; startDate: string; endDate: string };
  employees: MonthlyReportEmployee[];
  summary: { totalEmployees: number; avgHoursPerEmployee: number };
}

// Mock data for demo/unauthenticated users
const MOCK_REPORT: MonthlyReport = {
  period: { year: "2025", month: "10", startDate: "2025-10-01", endDate: "2025-10-31" },
  employees: [
    { employeeId: 1, employeeName: "John Doe", avgCheckIn: "08:34 AM", avgCheckOut: "09:00 PM", totalHours: 168.5, permissions: 2, offDays: 1, halfDays: 3, totalWorkingDays: 22, presentDays: 18 },
    { employeeId: 2, employeeName: "Jane Smith", avgCheckIn: "08:45 AM", avgCheckOut: "05:45 PM", totalHours: 162.3, permissions: 1, offDays: 2, halfDays: 1, totalWorkingDays: 22, presentDays: 19 },
    { employeeId: 3, employeeName: "Mike Johnson", avgCheckIn: "09:00 AM", avgCheckOut: "06:15 PM", totalHours: 175.2, permissions: 0, offDays: 0, halfDays: 0, totalWorkingDays: 22, presentDays: 22 },
    { employeeId: 4, employeeName: "Sarah Wilson", avgCheckIn: "09:15 AM", avgCheckOut: "05:30 PM", totalHours: 155.8, permissions: 4, offDays: 3, halfDays: 2, totalWorkingDays: 22, presentDays: 17 },
    { employeeId: 5, employeeName: "Emily Brown", avgCheckIn: "08:50 AM", avgCheckOut: "06:00 PM", totalHours: 160.0, permissions: 1, offDays: 1, halfDays: 0, totalWorkingDays: 22, presentDays: 21 },
    { employeeId: 6, employeeName: "David Clark", avgCheckIn: "08:40 AM", avgCheckOut: "06:20 PM", totalHours: 172.5, permissions: 0, offDays: 0, halfDays: 1, totalWorkingDays: 22, presentDays: 21 },
    { employeeId: 7, employeeName: "Sophia Taylor", avgCheckIn: "09:20 AM", avgCheckOut: "05:40 PM", totalHours: 145.0, permissions: 3, offDays: 4, halfDays: 0, totalWorkingDays: 22, presentDays: 18 },
    { employeeId: 8, employeeName: "James Anderson", avgCheckIn: "08:55 AM", avgCheckOut: "06:10 PM", totalHours: 170.1, permissions: 0, offDays: 1, halfDays: 0, totalWorkingDays: 22, presentDays: 21 },
    { employeeId: 9, employeeName: "Olivia Martinez", avgCheckIn: "09:05 AM", avgCheckOut: "05:55 PM", totalHours: 165.4, permissions: 2, offDays: 0, halfDays: 2, totalWorkingDays: 22, presentDays: 20 },
    { employeeId: 10, employeeName: "William Thomas", avgCheckIn: "08:30 AM", avgCheckOut: "06:05 PM", totalHours: 168.0, permissions: 1, offDays: 1, halfDays: 1, totalWorkingDays: 22, presentDays: 20 },
  ],
  summary: { totalEmployees: 10, avgHoursPerEmployee: 164.28 }
};

export default function MonthlyAttendanceReport() {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      return !!userData;
    } catch {
      return false;
    }
  };

  const fetchReport = async () => {
    if (!isAuthenticated) {
      setReport(MOCK_REPORT);
      setError("Demo mode - Login as HR/Admin for real data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.getMonthlyAttendanceReport(year, month);
      setReport(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load report. Please try again.';
      console.error('Failed to fetch report:', err);
      setError(errorMessage);
      // Fallback to mock data
      setReport(MOCK_REPORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    fetchReport();
  }, [year, month]);

  const filteredEmployees = report?.employees.filter(emp => 
    emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportToCSV = () => {
    if (!report) return;
    const headers = ['Employee', 'Total Hours', 'Permissions', 'Off Days', 'Half Days', 'Working Days', 'Present Days'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeName,
        emp.totalHours,
        emp.permissions,
        emp.offDays,
        emp.halfDays,
        emp.totalWorkingDays,
        emp.presentDays
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-attendance-${year}-${month}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-lg text-gray-600 animate-pulse">Loading monthly report...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Monthly Attendance Report
          </h2>
          <p className="text-gray-600">
            {report?.period ? `${report.period.month}/${report.period.year}` : ''}
            {!isAuthenticated && ' (Demo Mode)'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
          <div className="w-[100px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              {Array.from({length: 12}, (_, i) => (i+1).toString().padStart(2, '0')).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={fetchReport} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={exportToCSV} 
            disabled={!report || filteredEmployees.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error & Auth Status */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              {!isAuthenticated && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-red-700">Login required for live data</span>
                  <a href="/login" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    <LogIn className="w-3 h-3" />
                    Go to Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{report.summary.totalEmployees}</div>
            <p className="text-sm text-gray-600 mt-1">Total Employees</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{report.summary.avgHoursPerEmployee.toFixed(1)}h</div>
            <p className="text-sm text-gray-600 mt-1">Avg Hours</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{report.period.month}/{report.period.year}</div>
            <p className="text-sm text-gray-600 mt-1">Period</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No employees found for this period{searchTerm && ' or search term'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="w-10 px-6"></th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Employee</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Avg Check In</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Avg Check Out</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Total Hours</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Permissions</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Off Days</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Half Days</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900 text-sm">Present Days</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <React.Fragment key={emp.employeeId}>
                      <motion.tr
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedEmployee(expandedEmployee === emp.employeeId ? null : emp.employeeId)}
                      >
                        <td className="py-4 px-6 text-gray-400">
                          {expandedEmployee === emp.employeeId ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">{emp.employeeName}</td>
                        <td className="py-4 px-6 text-left text-gray-600 font-medium">{emp.avgCheckIn || '-'}</td>
                        <td className="py-4 px-6 text-left text-gray-600 font-medium">{emp.avgCheckOut || '-'}</td>
                        <td className="py-4 px-6 text-right font-semibold text-lg text-blue-600">
                          {emp.totalHours.toFixed(1)}h
                        </td>
                        <td className="py-4 px-6 text-right text-orange-600 font-semibold">
                          {emp.permissions}
                        </td>
                        <td className="py-4 px-6 text-right text-red-600 font-semibold">
                          {emp.offDays}
                        </td>
                        <td className="py-4 px-6 text-right text-yellow-600 font-semibold">
                          {emp.halfDays}
                        </td>
                        <td className="py-4 px-6 text-right text-green-600 font-semibold text-lg">
                          {emp.presentDays}
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedEmployee === emp.employeeId && emp.dailyRecords && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50/50"
                          >
                            <td colSpan={10} className="p-0 border-b border-gray-100">
                              <div className="overflow-hidden">
                                <div className="p-6">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Daily Records for {emp.employeeName}</h4>
                                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                          <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                                          <th className="text-left py-3 px-4 font-medium text-gray-700">Login Time</th>
                                          <th className="text-left py-3 px-4 font-medium text-gray-700">Logout Time</th>
                                          <th className="text-right py-3 px-4 font-medium text-gray-700">Total Hours</th>
                                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {emp.dailyRecords.map((record, i) => (
                                          <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{record.date}</td>
                                            <td className="py-3 px-4 text-gray-600">{record.loginTime || '-'}</td>
                                            <td className="py-3 px-4 text-gray-600">{record.logoutTime || '-'}</td>
                                            <td className="py-3 px-4 text-right font-medium text-blue-600">{record.hours.toFixed(1)}h</td>
                                            <td className="py-3 px-4">
                                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                                record.status === 'Half Day' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'
                                              }`}>
                                                {record.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


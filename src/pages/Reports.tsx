import DashboardAnalytics from "@/components/analytics/DashboardAnalytics";
import MonthlyAttendanceReport from "@/components/reports/MonthlyAttendanceReport";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and download comprehensive reports</p>
      </div>

      <MonthlyAttendanceReport />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Analytics Overview
        </h2>
        <DashboardAnalytics />
      </div>
    </div>
  );
}


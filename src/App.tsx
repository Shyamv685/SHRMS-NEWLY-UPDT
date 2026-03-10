import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Calendar from "./pages/Calendar";
import Todos from "./pages/Todos";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import CareerSite from "./pages/CareerSite";
import Timesheet from "./pages/Timesheet";
import Meeting from "./pages/Meeting";
import Settings from "./pages/Settings";
import HelpCentre from "./pages/HelpCentre";
import Announcements from "./pages/Announcements";
import Tripets from "./pages/Tripets";
import Training from "./pages/Training";
import Feedback from "./pages/Feedback";
import PayrollCorrection from "./pages/PayrollCorrection";
import Salary from "./pages/Salary";
import Wellness from "./pages/Wellness";
import Skills from "./pages/Skills";
import Recognition from "./pages/Recognition";
import InternalChat from "./pages/InternalChat";
import CareerGrowth from "./pages/CareerGrowth";
import ResumeScreening from "./pages/ResumeScreening";
import DocumentManagement from "./pages/DocumentManagement";
import EmployeeSurvey from "./pages/EmployeeSurvey";
import LearningPortal from "./pages/LearningPortal";
import Admin from "./pages/Admin";
import RemoteWork from "./pages/RemoteWork";
import AttritionPrediction from "./pages/AttritionPrediction";
import HRChatbot from "./pages/HRChatbot";
import SmartAttendance from "./pages/SmartAttendance";
import AIPerformanceAnalyzer from "./pages/AIPerformanceAnalyzer";
import MoodTracker from "./pages/MoodTracker";
import SmartLearning from "./pages/SmartLearning";
import PayrollFraudDetection from "./pages/PayrollFraudDetection";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="smart-attendance" element={<SmartAttendance />} />
          <Route path="remote-work" element={<RemoteWork />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="salary" element={<Salary />} />
          <Route path="wellness" element={<Wellness />} />
          <Route path="skills" element={<Skills />} />
          <Route path="recognition" element={<Recognition />} />
          <Route path="internal-chat" element={<InternalChat />} />
          <Route path="career-growth" element={<CareerGrowth />} />
          <Route path="resume-screening" element={<ResumeScreening />} />
          <Route path="documents" element={<DocumentManagement />} />
          <Route path="surveys" element={<EmployeeSurvey />} />
          <Route path="learning-portal" element={<LearningPortal />} />
          <Route path="attrition-prediction" element={<AttritionPrediction />} />
          <Route path="hr-chatbot" element={<HRChatbot />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="todos" element={<Todos />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="career-site" element={<CareerSite />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-centre" element={<HelpCentre />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="tripets" element={<Tripets />} />
          <Route path="training" element={<Training />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="performance-analyzer" element={<AIPerformanceAnalyzer />} />
          <Route path="mood-tracker" element={<MoodTracker />} />
          <Route path="smart-learning" element={<SmartLearning />} />
          <Route path="payroll-fraud-detection" element={<PayrollFraudDetection />} />
          <Route path="payroll-correction" element={<PayrollCorrection />} />
          <Route path="admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

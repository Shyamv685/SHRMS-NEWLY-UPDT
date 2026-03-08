import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";
import TrainingCard from "../components/training/TrainingCard";
import TrainingTable from "../components/training/TrainingTable";
import CertificateCard from "../components/training/CertificateCard";
import FeedbackForm from "../components/training/FeedbackForm";
import TrainingCalendar from "../components/training/TrainingCalendar";


interface Training {
  id: number;
  title: string;
  trainer: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: string;
  seatsAvailable: number;
  totalSeats: number;
  description: string;
  category: string;
  status: string;
  isEnrolled?: boolean;
  enrollment?: {
    id: number;
    status: string;
    progress: number;
    completedAt?: string;
    rating?: number;
    feedback?: string;
  };
}

export default function Training() {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
  }, []);

  // Redirect if not employee
  if (userRole && userRole !== 'employee') {
    return <Navigate to="/dashboard" replace />;
  }

  const [activeTab, setActiveTab] = useState<'available' | 'my' | 'certificates' | 'calendar' | 'resources' | 'analytics'>('available');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [myTrainings, setMyTrainings] = useState<Training[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadTrainings();
    loadMyTrainings();
  }, []);

  useEffect(() => {
    filterAndSortTrainings();
  }, [trainings, searchTerm, selectedCategory, selectedMode, sortBy]);

  const filterAndSortTrainings = () => {
    let filtered = trainings.filter(training => {
      const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory;
      const matchesMode = selectedMode === 'all' || training.mode === selectedMode;

      return matchesSearch && matchesCategory && matchesMode;
    });

    // Sort trainings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'seats':
          return b.seatsAvailable - a.seatsAvailable;
        default:
          return 0;
      }
    });

    setFilteredTrainings(filtered);
  };

  const categories = ['all', ...Array.from(new Set(trainings.map(t => t.category)))];
  const modes = ['all', ...Array.from(new Set(trainings.map(t => t.mode)))];

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const response = await api.getTrainings();
      setTrainings(response.trainings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMyTrainings = async () => {
    try {
      const response = await api.getMyTrainings();
      setMyTrainings(response.trainings);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEnroll = async (trainingId: number) => {
    try {
      await api.enrollTraining(trainingId);
      await loadTrainings();
      await loadMyTrainings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleComplete = async (trainingId: number) => {
    try {
      await api.completeTraining(trainingId);
      await loadMyTrainings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFeedback = async (trainingId: number, rating: number, feedback: string) => {
    try {
      await api.submitFeedback(trainingId, rating, feedback);
      await loadMyTrainings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleViewDetails = (training: Training) => {
    setSelectedTraining(training);
    setShowDetailsModal(true);
  };

  const tabs = [
    { id: 'available', label: 'Available Courses', icon: Icons.BookOpen },
    { id: 'my', label: 'My Trainings', icon: Icons.UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Icons.Award },
    { id: 'calendar', label: 'Training Calendar', icon: Icons.Calendar },
    { id: 'resources', label: 'Learning Resources', icon: Icons.FileText },
    { id: 'analytics', label: 'Analytics', icon: Icons.BarChart3 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enhance your skills and track your professional growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icons.GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Icons.AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Courses</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.Info className="w-4 h-4" />
                  <span>{trainings.filter(t => t.status === 'Open').length} trainings available</span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icons.Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTrainings.map((training) => (
                    <TrainingCard
                      key={training.id}
                      training={training}
                      onEnroll={handleEnroll}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Trainings</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.CheckCircle className="w-4 h-4" />
                  <span>{myTrainings.filter(t => t.enrollment?.status === 'Completed').length} completed</span>
                </div>
              </div>

              <TrainingTable
                trainings={myTrainings}
                onComplete={handleComplete}
                onFeedback={handleFeedback}
              />
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Certificates</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.Award className="w-4 h-4" />
                  <span>{certificates.length} certificates earned</span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myTrainings
                  .filter(t => t.enrollment?.status === 'Completed')
                  .map((training) => (
                    <CertificateCard
                      key={training.id}
                      training={training}
                    />
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Training Calendar</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.Calendar className="w-4 h-4" />
                  <span>View scheduled trainings</span>
                </div>
              </div>

              <TrainingCalendar trainings={trainings} />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Resources</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.FileText className="w-4 h-4" />
                  <span>Additional learning materials</span>
                </div>
              </div>

              <div className="text-center py-12">
                <Icons.FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Learning Resources Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400">We're preparing additional learning materials, videos, and articles for you.</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Training Analytics</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icons.BarChart3 className="w-4 h-4" />
                  <span>Track your progress</span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{myTrainings.length}</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {myTrainings.filter(t => t.enrollment?.status === 'Completed').length}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Award className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {myTrainings.filter(t => t.enrollment?.status === 'Completed').length}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {myTrainings.filter(t => t.enrollment?.status === 'In Progress').length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Training Details Modal */}
      {showDetailsModal && selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTraining.title}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icons.User className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Trainer: {selectedTraining.trainer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Calendar className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Date: {new Date(selectedTraining.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Time: {selectedTraining.startTime} - {selectedTraining.endTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icons.MapPin className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Mode: {selectedTraining.mode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Users className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Seats: {selectedTraining.seatsAvailable} / {selectedTraining.totalSeats} available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedTraining.category === 'Technical'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : selectedTraining.category === 'Soft Skills'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {selectedTraining.category}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedTraining.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEnroll(selectedTraining.id);
                    setShowDetailsModal(false);
                  }}
                  disabled={selectedTraining.seatsAvailable === 0 || selectedTraining.isEnrolled}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedTraining.isEnrolled
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      : selectedTraining.seatsAvailable === 0
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedTraining.isEnrolled ? 'Enrolled' : selectedTraining.seatsAvailable === 0 ? 'Full' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

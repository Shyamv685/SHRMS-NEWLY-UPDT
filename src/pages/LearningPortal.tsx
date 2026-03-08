import { useState } from "react";
import { BookOpen, Video, PlayCircle, Award, Clock, Search, CheckCircle2, Play, BookText, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: string;
  name: string;
  duration: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  type: 'Video' | 'Interactive' | 'Reading';
  thumbnail: string;
  instructor: string;
}

const mockCourses: Course[] = [
  {
    id: "L101",
    name: "Advanced Excel for Finance",
    duration: "10 Hours",
    status: "Completed",
    progress: 100,
    type: "Video",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    instructor: "David Miller"
  },
  {
    id: "L102",
    name: "Leadership Communication",
    duration: "4.5 Hours",
    status: "In Progress",
    progress: 65,
    type: "Interactive",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
    instructor: "Sarah Jenkins"
  },
  {
    id: "L103",
    name: "Cybersecurity Basics 2025",
    duration: "2 Hours",
    status: "Not Started",
    progress: 0,
    type: "Video",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
    instructor: "IT Security Team"
  },
  {
    id: "L104",
    name: "Agile Project Management",
    duration: "8 Hours",
    status: "Not Started",
    progress: 0,
    type: "Reading",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    instructor: "Elena Rodriguez"
  }
];

export default function LearningPortal() {
  const [courses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-learning'>('my-learning');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Interactive': return <PlayCircle className="w-4 h-4" />;
      case 'Reading': return <BookText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCourses = courses
    .filter(c => filterType === 'all' || c.status === filterType)
    .filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const completedCount = courses.filter(c => c.status === 'Completed').length;
  const inProgressCount = courses.filter(c => c.status === 'In Progress').length;
  const totalHours = courses.reduce((acc, curr) => {
    if (curr.status === 'Completed') {
      return acc + parseFloat(curr.duration);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-400" /> 
            Learning Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access online courses, video tutorials, and track your training progress.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressCount}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Hours</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalHours}h</h3>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('my-learning')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'my-learning' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              My Learning
            </button>
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'catalog' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Course Catalog
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
            {activeTab === 'my-learning' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'my-learning' ? (
            <div className="overflow-x-auto">
              {/* Detailed Progress Table View for "My Learning" */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Name / ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredCourses.map((course, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={course.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                              <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                {course.type === 'Video' && <PlayCircle className="w-6 h-6 text-white/90" />}
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {course.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">{course.id}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  {getTypeIcon(course.type)} {course.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" /> {course.duration}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5 w-full max-w-[150px]">
                            <div className="flex justify-between text-xs font-bold">
                              <span className={course.progress === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                            {course.status === 'Completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                            course.status === 'Completed' 
                              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                              : 'bg-cyan-600 border border-transparent text-white hover:bg-cyan-700 focus:ring-cyan-500'
                          }`}>
                            {course.status === 'Completed' ? 'Review' : course.status === 'Not Started' ? 'Start' : 'Continue'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="font-medium text-lg text-gray-900 dark:text-gray-300">No courses found matching criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Card View for Course Catalog */}
              {courses.map((course, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={`catalog-${course.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full hover:border-cyan-300 dark:hover:border-cyan-700"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-white/20">
                        {getTypeIcon(course.type)} {course.type}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="text-white/90 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span className="bg-cyan-600 text-white px-2 py-0.5 rounded text-xs font-bold">Free</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 mb-1 block">COURSE ID: {course.id}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">by {course.instructor}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button className="w-full py-2.5 bg-gray-50 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 dark:bg-gray-700/50 dark:hover:bg-cyan-900/30 dark:text-gray-300 dark:hover:text-cyan-400 font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-cyan-200 dark:hover:border-cyan-800 flex items-center justify-center gap-2">
                        View Course Details <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

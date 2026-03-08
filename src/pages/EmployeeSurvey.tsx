import { useState, useEffect } from "react";
import { ClipboardList, Star, MessageSquare, PieChart, Send, CheckCircle2, AlertCircle, Users, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SurveyResponse {
  id: string;
  surveyId: string;
  question: string;
  rating: number; // out of 5
  comment: string;
  isAnonymous: boolean;
  date: string;
}

interface ActiveSurvey {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dueDate: string;
  status: 'Active' | 'Completed';
}

const mockResponses: SurveyResponse[] = [
  {
    id: "R001",
    surveyId: "S101",
    question: "Work environment",
    rating: 4,
    comment: "The office is generally great, but we could use more quiet zones.",
    isAnonymous: true,
    date: "05-03-2025"
  },
  {
    id: "R002",
    surveyId: "S101",
    question: "Management Communication",
    rating: 5,
    comment: "Very transparent about company goals.",
    isAnonymous: true,
    date: "06-03-2025"
  },
  {
    id: "R003",
    surveyId: "S102",
    question: "Work-Life Balance",
    rating: 3,
    comment: "Deadlines are getting a bit tight lately.",
    isAnonymous: true,
    date: "08-03-2025"
  }
];

const mockSurveys: ActiveSurvey[] = [
  {
    id: "S101",
    title: "Q1 Workplace Satisfaction",
    description: "Help us understand your current experience with the office environment and management.",
    questions: ["Work environment", "Management Communication", "Overall Satisfaction"],
    dueDate: "30-03-2025",
    status: "Active"
  },
  {
    id: "S102",
    title: "Remote Work Feedback",
    description: "Tell us about your work-from-home setup and challenges.",
    questions: ["Work-Life Balance", "Remote Tools Efficiency", "Team Collaboration"],
    dueDate: "25-03-2025",
    status: "Active"
  }
];

export default function EmployeeSurvey() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [activeTab, setActiveTab] = useState<'take' | 'analysis'>('take');
  
  // HR Analysis State
  const [responses, setResponses] = useState<SurveyResponse[]>(mockResponses);
  
  // Active Survey State
  const [selectedSurvey, setSelectedSurvey] = useState<ActiveSurvey | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<{rating: number, comment: string}[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'employee');
        if (user.role === 'hr' || user.role === 'admin') {
          setActiveTab('analysis'); // Default HR to analysis view
        }
      } catch (e) {
        setUserRole('employee');
      }
    }
  }, []);

  const handleStartSurvey = (survey: ActiveSurvey) => {
    setSelectedSurvey(survey);
    setCurrentAnswers(survey.questions.map(() => ({ rating: 0, comment: '' })));
    setSubmitSuccess(false);
  };

  const setRating = (questionIndex: number, rating: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex].rating = rating;
    setCurrentAnswers(newAnswers);
  };

  const setComment = (questionIndex: number, comment: string) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex].comment = comment;
    setCurrentAnswers(newAnswers);
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      // Create new response records
      if (selectedSurvey) {
        const newResponses = selectedSurvey.questions.map((q, idx) => ({
          id: `R${Math.floor(Math.random() * 9000) + 1000}`,
          surveyId: selectedSurvey.id,
          question: q,
          rating: currentAnswers[idx].rating,
          comment: currentAnswers[idx].comment,
          isAnonymous: isAnonymous,
          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
        }));
        
        setResponses([...newResponses, ...responses]);
      }
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedSurvey(null);
      }, 2000);
    }, 1500);
  };

  const avgRating = (responses.reduce((acc, curr) => acc + curr.rating, 0) / responses.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400" /> 
            Employee Surveys
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share anonymous feedback and evaluate workplace satisfaction.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('take')}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'take' ? 'border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <MessageSquare className="w-4 h-4"/> Take Survey
            </button>
            {(userRole === 'hr' || userRole === 'admin') && (
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'analysis' ? 'border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <PieChart className="w-4 h-4"/> HR Analysis
              </button>
            )}
          </div>
        </div>

        <div className="p-6 min-h-[500px]">
          {/* Employee Facing: Take Survey View */}
          {activeTab === 'take' && (
            <AnimatePresence mode="wait">
              {!selectedSurvey ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {mockSurveys.map((survey) => (
                    <div key={survey.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-fuchsia-300 dark:hover:border-fuchsia-700/50 flex flex-col h-full relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 rounded-bl-full -z-0"></div>
                      
                      <div className="mb-4 relative z-10 flex justify-between items-start">
                        <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl">
                          <ClipboardList className="w-6 h-6" />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                          {survey.status}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{survey.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 relative z-10">{survey.description}</p>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between mt-auto">
                        <div className="text-xs text-gray-400 font-medium">
                           Due: {survey.dueDate}
                        </div>
                        <button 
                          onClick={() => handleStartSurvey(survey)}
                          className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-1.5 shadow-sm"
                        >
                          Start <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <button 
                        onClick={() => setSelectedSurvey(null)}
                        className="text-sm text-fuchsia-600 dark:text-fuchsia-400 hover:underline mb-2 inline-block"
                      >
                        &larr; Back to Surveys
                      </button>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSurvey.title}</h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedSurvey.description}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                       <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Survey ID</span>
                       <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedSurvey.id}</span>
                    </div>
                  </div>

                  {submitSuccess ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you for your feedback!</h3>
                      <p className="text-gray-500 dark:text-gray-400">Your anonymous responses have been successfully recorded.</p>
                      <p className="text-sm text-gray-400 mt-4">Redirecting...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitSurvey} className="space-y-8">
                      {selectedSurvey.questions.map((question, qIdx) => (
                        <div key={qIdx} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                            <span className="text-fuchsia-500 mr-2">{qIdx + 1}.</span> 
                            {question}
                          </h4>
                          
                          <div className="mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Rate your satisfaction (1 = Lowest, 5 = Highest):</p>
                            <div className="flex gap-2 sm:gap-4">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(qIdx, star)}
                                  className={`p-3 rounded-xl flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                                    currentAnswers[qIdx]?.rating === star 
                                      ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 border-2 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-400 shadow-sm' 
                                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 text-gray-400'
                                  }`}
                                >
                                  <Star className={`w-6 h-6 ${currentAnswers[qIdx]?.rating >= star ? 'fill-current' : ''}`} />
                                  <span className="font-bold">{star}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Comments (Optional):</label>
                            <textarea
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all resize-none"
                              placeholder="Tell us more about why you chose this rating..."
                              value={currentAnswers[qIdx]?.comment || ''}
                              onChange={(e) => setComment(qIdx, e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Anonymity Guaranteed</p>
                          <p className="text-xs text-blue-700 dark:text-blue-400/80">
                            Your responses are collected anonymously. Your personal identifiers are stripped from this submission before it reaches the HR analytics dashboard.
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="isAnonymous" 
                              checked={isAnonymous} 
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              className="w-4 h-4 text-fuchsia-600 rounded focus:ring-fuchsia-500"
                            />
                            <label htmlFor="isAnonymous" className="text-sm font-medium text-blue-800 dark:text-blue-300 cursor-pointer">
                              Submit as completely anonymous
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button 
                          type="submit"
                          disabled={isSubmitting || currentAnswers.some(a => a.rating === 0)}
                          className="px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Feedback <Send className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* HR Facing: Analysis View */}
          {activeTab === 'analysis' && (userRole === 'hr' || userRole === 'admin') && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 p-5 rounded-xl border border-fuchsia-100 dark:border-fuchsia-900/30 flex items-center gap-4">
                  <div className="p-3 bg-fuchsia-200 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-fuchsia-700 dark:text-fuchsia-400">{avgRating}<span className="text-lg text-fuchsia-500">/5</span></h4>
                    <p className="text-sm font-bold text-fuchsia-900 dark:text-fuchsia-300">Average Satisfaction</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                  <div className="p-3 bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-blue-700 dark:text-blue-400">{responses.length}</h4>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Total Responses</p>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                  <div className="p-3 bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{(responses.length / 3).toFixed(0)}</h4>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Unique Participants</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-gray-500" /> Recent Feedback
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Survey ID</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Question Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Rating</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Anon Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {responses.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {res.surveyId}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{res.question}</span>
                            <span className="block text-xs text-gray-500 mt-0.5">{res.date}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className={`w-4 h-4 ${res.rating >= 4 ? 'text-emerald-500 fill-current' : res.rating === 3 ? 'text-amber-500 fill-current' : 'text-rose-500 fill-current'}`} />
                              <span className="font-bold text-gray-900 dark:text-white">{res.rating}/5</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md truncate relative group">
                              {res.comment || <span className="text-gray-400 italic">No comment provided</span>}
                              {res.comment && (
                                <div className="absolute hidden group-hover:block z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm w-64 -translate-y-full -translate-x-1/2 left-1/2 top-0 mt-[-10px] whitespace-normal">
                                  {res.comment}
                                  <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

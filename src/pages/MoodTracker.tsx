import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface AtRiskEmployee {
    id: string;
    name: string;
    department: string;
    role: string;
    recentMoods: ('Happy' | 'Neutral' | 'Stressed')[];
    riskScore: number;
    lastComment: string;
}

export default function MoodTracker() {
    const [userRole, setUserRole] = useState<string>('employee');
    const [selectedMood, setSelectedMood] = useState<'Happy' | 'Neutral' | 'Stressed' | null>(null);
    const [feedbackNote, setFeedbackNote] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
            if (user.role === 'hr' || user.role === 'admin') {
                setActiveTab('dashboard');
            }
        }
    }, []);

    const moods = [
        { id: 'Happy', emoji: '😊', label: 'Happy', desc: 'Feeling great and productive!', color: 'from-green-400 to-green-500', shadow: 'shadow-green-500/30' },
        { id: 'Neutral', emoji: '😐', label: 'Neutral', desc: 'Just a normal day.', color: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-500/30' },
        { id: 'Stressed', emoji: '😞', label: 'Stressed', desc: 'Feeling overwhelmed or tired.', color: 'from-red-400 to-red-500', shadow: 'shadow-red-500/30' }
    ];

    const atRiskEmployees: AtRiskEmployee[] = [
        {
            id: "E001",
            name: "Sarah Jenkins",
            department: "Engineering",
            role: "Frontend Developer",
            recentMoods: ["Stressed", "Stressed", "Neutral"],
            riskScore: 85,
            lastComment: "Deadlines are very tight this week."
        },
        {
            id: "E005",
            name: "Michael Chen",
            department: "Sales",
            role: "Account Executive",
            recentMoods: ["Neutral", "Stressed", "Stressed"],
            riskScore: 78,
            lastComment: "Struggling to meet Q3 targets."
        },
        {
            id: "E012",
            name: "Emma Davis",
            department: "Marketing",
            role: "Content Strategist",
            recentMoods: ["Stressed", "Neutral", "Happy"],
            riskScore: 45,
            lastComment: "Things are getting better after the campaign launch."
        }
    ];

    const handleSubmit = () => {
        if (!selectedMood) return;
        setIsSubmitted(true);
        // Submit to API logic would go here
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Icons.HeartPulse className="w-8 h-8 text-rose-500" />
                        Employee Mood & Sentiment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        Track weekly morale and detect early signs of employee burnout.
                    </p>
                </div>

                {(userRole === 'hr' || userRole === 'admin') && (
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Team Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'submit' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            My Mood
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'submit' && (
                    <motion.div
                        key="submit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto"
                    >
                        {isSubmitted ? (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-12 text-center relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
                                <Icons.CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Thank you for sharing!</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Your feedback helps us create a better, healthier work environment.
                                    Have a wonderful rest of your week!
                                </p>
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setSelectedMood(null);
                                        setFeedbackNote('');
                                    }}
                                    className="mt-8 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Submit Another Response
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How are you feeling this week?</h2>
                                    <p className="text-gray-500 dark:text-gray-400">Please select the mood that best represents your overall experience at work recently.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {moods.map((mood) => (
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            key={mood.id}
                                            onClick={() => setSelectedMood(mood.id as any)}
                                            className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${selectedMood === mood.id
                                                    ? `border-transparent bg-gradient-to-br ${mood.color} text-white shadow-xl ${mood.shadow}`
                                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700'
                                                }`}
                                        >
                                            {selectedMood === mood.id && (
                                                <div className="absolute top-3 right-3">
                                                    <Icons.CheckCircle className="w-6 h-6 text-white opacity-80" />
                                                </div>
                                            )}
                                            <span className="text-6xl mb-4 filter drop-shadow-sm">{mood.emoji}</span>
                                            <span className="text-xl font-bold mb-2">{mood.label}</span>
                                            <span className={`text-sm text-center ${selectedMood === mood.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {mood.desc}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Icons.MessageSquare className="w-4 h-4" />
                                        Additional Note (Optional)
                                    </label>
                                    <textarea
                                        value={feedbackNote}
                                        onChange={(e) => setFeedbackNote(e.target.value)}
                                        placeholder="Care to share more about why you feel this way?"
                                        className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedMood}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Icons.Send className="w-5 h-5" />
                                    Submit Weekly Feedback
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'dashboard' && (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/30 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-green-600 dark:text-green-400 font-medium mb-1">Happy / Thriving</p>
                                    <h3 className="text-3xl font-bold text-green-700 dark:text-green-300">65%</h3>
                                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2 flex items-center gap-1">
                                        <Icons.ArrowUpRight className="w-3 h-3" /> +5% from last week
                                    </p>
                                </div>
                                <div className="text-5xl opacity-80">😊</div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800/30 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-yellow-600 dark:text-yellow-400 font-medium mb-1">Neutral</p>
                                    <h3 className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">25%</h3>
                                    <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-2 flex items-center gap-1">
                                        <Icons.ArrowDownRight className="w-3 h-3" /> -2% from last week
                                    </p>
                                </div>
                                <div className="text-5xl opacity-80">😐</div>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-red-600 dark:text-red-400 font-medium mb-1">Stressed / At Risk</p>
                                    <h3 className="text-3xl font-bold text-red-700 dark:text-red-300">10%</h3>
                                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-2 flex items-center gap-1">
                                        <Icons.ArrowDownRight className="w-3 h-3" /> -3% from last week
                                    </p>
                                </div>
                                <div className="text-5xl opacity-80">😞</div>
                            </div>
                        </div>

                        {/* Burnout Risk Detection AI */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg">
                                        <Icons.AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Burnout Risk Detection</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">AI-analyzed patterns indicating high stress</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                    Live Monitoring Active
                                </div>
                            </div>

                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                                            <th className="p-4 font-medium">Employee</th>
                                            <th className="p-4 font-medium">Department</th>
                                            <th className="p-4 font-medium text-center">Recent Trends (3 Weeks)</th>
                                            <th className="p-4 font-medium">Burnout Score</th>
                                            <th className="p-4 font-medium">Recent Comment</th>
                                            <th className="p-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {atRiskEmployees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">{emp.name}</p>
                                                            <p className="text-xs text-gray-500 font-medium">{emp.id} • {emp.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">{emp.department}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {emp.recentMoods.map((mood, idx) => (
                                                            <div key={idx} title={mood} className="relative">
                                                                {idx < 2 && <div className="absolute top-1/2 left-full w-2 h-[2px] bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>}
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm relative z-10
                                  ${mood === 'Happy' ? 'bg-green-100 text-green-700' :
                                                                        mood === 'Neutral' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-red-100 text-red-700'}
                                `}>
                                                                    {mood === 'Happy' ? '😊' : mood === 'Neutral' ? '😐' : '😞'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 max-w-[100px]">
                                                            <div
                                                                className={`h-2.5 rounded-full ${emp.riskScore > 80 ? 'bg-red-500' : emp.riskScore > 60 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                                                                style={{ width: `${emp.riskScore}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`font-bold ${emp.riskScore > 80 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                            {emp.riskScore}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 dark:text-gray-400 italic max-w-[200px] truncate">
                                                    "{emp.lastComment}"
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                                                        Schedule 1-on-1
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quick actions or info card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                                    <Icons.Lightbulb className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">AI Recommendation</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Engineering team stress levels have increased by 12% over the last 3 weeks due to project deadlines. Consider initiating a team building event or reviewing project distribution.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

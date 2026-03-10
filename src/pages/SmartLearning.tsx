import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface Course {
    id: string;
    title: string;
    provider: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    matchScore: number;
    tags: string[];
    imageColor: string;
    icon: any;
    reason: string;
}

export default function SmartLearning() {
    const [userSkills, setUserSkills] = useState<string[]>(['Python', 'SQL', 'Data Analysis']);
    const [newSkill, setNewSkill] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Simulated AI recommendation generation based on skills
    const getRecommendations = (skills: string[]): Course[] => {
        const allCourses: Course[] = [
            {
                id: 'c1', title: 'Machine Learning A-Z', provider: 'DataCamp', duration: '40h', level: 'Intermediate',
                matchScore: 0, tags: ['Python', 'Machine Learning'], imageColor: 'from-blue-500 to-indigo-600', icon: Icons.BrainCircuit,
                reason: 'Because you know Python'
            },
            {
                id: 'c2', title: 'Advanced SQL Performance Tuning', provider: 'Coursera', duration: '12h', level: 'Advanced',
                matchScore: 0, tags: ['SQL', 'Database'], imageColor: 'from-emerald-500 to-green-600', icon: Icons.Database,
                reason: 'Because you know SQL'
            },
            {
                id: 'c3', title: 'Data Engineering Fundamentals', provider: 'Udacity', duration: '25h', level: 'Beginner',
                matchScore: 0, tags: ['Python', 'SQL', 'Data Pipeline'], imageColor: 'from-orange-500 to-red-600', icon: Icons.ActivitySquare,
                reason: 'Because you know Python & SQL'
            },
            {
                id: 'c4', title: 'React Performance Optimization', provider: 'Frontend Masters', duration: '8h', level: 'Advanced',
                matchScore: 0, tags: ['React', 'JavaScript'], imageColor: 'from-cyan-500 to-blue-600', icon: Icons.Code2,
                reason: 'Trending in your department'
            },
            {
                id: 'c5', title: 'Generative AI with LLMs', provider: 'DeepLearning.AI', duration: '16h', level: 'Intermediate',
                matchScore: 0, tags: ['AI', 'Python'], imageColor: 'from-purple-500 to-pink-600', icon: Icons.Bot,
                reason: 'Because you know Python'
            },
            {
                id: 'c6', title: 'Cloud Data Architecture', provider: 'AWS Training', duration: '30h', level: 'Intermediate',
                matchScore: 0, tags: ['Cloud', 'Architecture'], imageColor: 'from-sky-500 to-blue-600', icon: Icons.Cloud,
                reason: 'Next step in Data Analysis'
            }
        ];

        // Score calculation logic
        const lowerSkills = skills.map(s => s.toLowerCase());
        return allCourses.map(course => {
            let score = 50; // Base serendipity score

            const courseTagsLower = course.tags.map(t => t.toLowerCase());
            const overlappingTags = courseTagsLower.filter(t => lowerSkills.includes(t) || lowerSkills.some(s => t.includes(s) || s.includes(t)));

            if (overlappingTags.length > 0) {
                score += overlappingTags.length * 20;
            }

            // Department/Trending bump (simulated)
            if (course.reason.includes('Trending')) {
                score += 35;
            }

            // Cap at 99%
            score = Math.min(99, score);

            // Random variance for that "AI" feel
            score += Math.floor(Math.random() * 5) - 2;

            return { ...course, matchScore: Math.min(99, Math.max(0, score)) };
        }).sort((a, b) => b.matchScore - a.matchScore);
    };

    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

    useEffect(() => {
        setRecommendedCourses(getRecommendations(userSkills));
    }, []);

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !userSkills.includes(newSkill.trim())) {
            const updatedSkills = [...userSkills, newSkill.trim()];
            setUserSkills(updatedSkills);
            setNewSkill('');

            // Animate refresh
            setIsRefreshing(true);
            setTimeout(() => {
                setRecommendedCourses(getRecommendations(updatedSkills));
                setIsRefreshing(false);
            }, 800);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const updatedSkills = userSkills.filter(s => s !== skillToRemove);
        setUserSkills(updatedSkills);

        setIsRefreshing(true);
        setTimeout(() => {
            setRecommendedCourses(getRecommendations(updatedSkills));
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 animate-in fade-in zoom-in duration-500 pb-20">
            {/* Header section with Netflix-like dark/sleek theme */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl p-8 md:p-12 pb-24">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-gray-900 to-black/80"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
                        <Icons.Sparkles className="w-4 h-4 text-blue-400" />
                        AI-Powered Recommendations
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
                        Unlock Your Potential.
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl">
                        Smart, tailored learning paths based on your unique skill profile. Discover what to learn next to advance your career.
                    </p>
                </div>
            </div>

            <div className="relative z-20 -mt-20 mx-4 md:mx-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="flex-1 w-full">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Your Learning DNA
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {userSkills.map(skill => (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        key={skill}
                                        className="pl-3 pr-1 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium flex items-center gap-1"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                                        >
                                            <Icons.X className="w-3 h-3" />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-6 md:pt-0 md:pl-6">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Teach the AI
                        </h3>
                        <form onSubmit={handleAddSkill} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="Add a new skill..."
                                className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={!newSkill.trim() || isRefreshing}
                                className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                                <Icons.Plus className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Recommendations Feed */}
            <div className="space-y-12">
                {/* Top Picks Row */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Picks for You</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isRefreshing ? (
                            // Loading Skeletons
                            [1, 2, 3].map(i => (
                                <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 h-[380px] animate-pulse"></div>
                            ))
                        ) : (
                            <AnimatePresence>
                                {recommendedCourses.slice(0, 3).map((course, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={course.id}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                    >
                                        <div className={`h-40 bg-gradient-to-br ${course.imageColor} relative p-6 flex flex-col justify-between overflow-hidden`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 shadow-sm">
                                                    <Icons.Focus className="w-3 h-3" /> {course.matchScore}% Match
                                                </div>
                                                <button className="p-2 text-white/70 hover:text-white bg-black/20 backdrop-blur-sm rounded-full transition-colors hover:bg-black/30">
                                                    <Icons.Bookmark className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <course.icon className="w-16 h-16 text-white/90 relative z-10 filter drop-shadow-md" />
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                {course.provider} • {course.level}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                                                    {course.duration}
                                                </span>
                                                {course.tags.slice(0, 2).map(t => (
                                                    <span key={t} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2 mb-4">
                                                    <Icons.Lightbulb className="w-4 h-4 text-amber-500" />
                                                    {course.reason}
                                                </p>

                                                <button className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                                    <Icons.PlayCircle className="w-5 h-5" />
                                                    Start Course
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Explore More Row */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore More</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                        {isRefreshing ? null : (
                            <AnimatePresence>
                                {recommendedCourses.slice(3).map((course, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        key={course.id}
                                        className="flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group cursor-pointer"
                                    >
                                        <div className={`w-24 bg-gradient-to-br ${course.imageColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform origin-left`}>
                                            <course.icon className="w-8 h-8 text-white/90" />
                                        </div>
                                        <div className="p-4 flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                    {course.matchScore}% Match
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{course.duration}</span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                                                {course.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{course.reason}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

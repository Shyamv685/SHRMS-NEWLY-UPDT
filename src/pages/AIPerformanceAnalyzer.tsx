import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface AnalysisResult {
    strengths: string[];
    weaknesses: string[];
    score: number;
    sentiment: string;
}

export default function AIPerformanceAnalyzer() {
    const [feedbackText, setFeedbackText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const analyzeFeedback = (text: string) => {
        // Simulated AI NLP Analysis
        const lowerText = text.toLowerCase();

        const strengths: string[] = [];
        const weaknesses: string[] = [];
        let score = 50; // Base score

        // Keywords mapping for heuristic analysis
        const positiveTraits = {
            'work ethic': ['hard', 'dedicated', 'diligent', 'effort'],
            'teamwork': ['team player', 'collaborative', 'helpful', 'supportive'],
            'leadership': ['leadership', 'initiative', 'proactive', 'leads'],
            'quality': ['good', 'great', 'excellent', 'high quality', 'outstanding']
        };

        const negativeTraits = {
            'communication': ['communication', 'unresponsive', 'quiet', 'unclear'],
            'time management': ['slow', 'late', 'delay', 'overdue'],
            'accuracy': ['mistakes', 'errors', 'buggy', 'careless'],
            'attitude': ['unprofessional', 'rude', 'complain']
        };

        // Analyze Strengths
        Object.entries(positiveTraits).forEach(([trait, words]) => {
            if (words.some(word => lowerText.includes(word))) {
                strengths.push(trait.charAt(0).toUpperCase() + trait.slice(1));
                score += 15;
            }
        });

        // Analyze Weaknesses
        Object.entries(negativeTraits).forEach(([trait, words]) => {
            if (words.some(word => lowerText.includes(word))) {
                weaknesses.push(trait.charAt(0).toUpperCase() + trait.slice(1) + ' Needs Improvement');
                score -= 15;
            }
        });

        // Semantic catch-alls for demo purposes
        if (lowerText.includes('needs improvement')) {
            if (strengths.length === 0) weaknesses.push('General Performance Needs Improvement');
            score -= 10;
        }
        if (lowerText.includes('but')) score -= 5;

        // Default fallback if nothing matches
        if (strengths.length === 0 && weaknesses.length === 0) {
            if (lowerText.length > 10) {
                strengths.push('Consistent Output');
                score += 10;
            }
        }

        // Normalize score
        score = Math.max(0, Math.min(100, score));

        let sentiment = 'Neutral';
        if (score >= 70) sentiment = 'Positive';
        else if (score < 40) sentiment = 'Negative';

        return { strengths, weaknesses, score, sentiment };
    };

    const handleAnalyze = () => {
        if (!feedbackText.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        // Simulate network/AI processing delay
        setTimeout(() => {
            const analysis = analyzeFeedback(feedbackText);
            setResult(analysis);
            setIsAnalyzing(false);
        }, 1500);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        AI Performance Feedback Analyzer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        Harness the power of AI to extract insights and sentiment from employee reviews.
                    </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shadow-inner">
                    <Icons.BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                        <Icons.MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Input Feedback</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Paste employee review or feedback below
                            </label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="e.g., He works hard but needs improvement in communication."
                                className="w-full h-40 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !feedbackText.trim()}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Icons.Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Text...
                                </>
                            ) : (
                                <>
                                    <Icons.Sparkles className="w-5 h-5" />
                                    Analyze with AI
                                </>
                            )}
                        </button>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center flex items-center gap-1 justify-center">
                                <Icons.Info className="w-3 h-3" />
                                Powered by Sentiment Analysis Engine v2.0
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Results Section */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-10 text-center"
                            >
                                <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                    <Icons.BarChartBig className="w-12 h-12 text-gray-300 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                                    Waiting for input...
                                </h3>
                                <p className="text-gray-400 dark:text-gray-500">
                                    Enter feedback on the left and click analyze to see AI-generated insights, strengths, and weaknesses.
                                </p>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-10 space-y-6"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                                    <Icons.Fingerprint className="w-20 h-20 text-blue-500 animate-pulse relative z-10" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                                        Processing Data
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                        Extracting semantic meaning...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {result && !isAnalyzing && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                            >
                                {/* Score Header */}
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Overall Sentiment
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                                                {result.sentiment}
                                            </span>
                                            {result.sentiment === 'Positive' && <Icons.Smile className={`w-6 h-6 ${getScoreColor(result.score)}`} />}
                                            {result.sentiment === 'Neutral' && <Icons.Meh className={`w-6 h-6 ${getScoreColor(result.score)}`} />}
                                            {result.sentiment === 'Negative' && <Icons.Frown className={`w-6 h-6 ${getScoreColor(result.score)}`} />}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Score</span>
                                        <div className="relative w-16 h-16 flex items-center justify-center shadow-inner rounded-full bg-gray-100 dark:bg-gray-900">
                                            <svg viewBox="0 0 64 64" className="w-16 h-16 transform -rotate-90 absolute">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    fill="transparent"
                                                    className="text-gray-200 dark:text-gray-700"
                                                />
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    fill="transparent"
                                                    strokeDasharray={28 * 2 * Math.PI}
                                                    strokeDashoffset={28 * 2 * Math.PI - (result.score / 100) * (28 * 2 * Math.PI)}
                                                    className={`${getScoreColor(result.score).replace('text-', 'text-')} transition-all duration-1000 ease-out`}
                                                />
                                            </svg>
                                            <span className={`text-lg font-bold relative z-10 ${getScoreColor(result.score)}`}>
                                                {result.score}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Insights */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                    {/* Strengths */}
                                    <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                                <Icons.TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h4 className="font-semibold text-green-900 dark:text-green-300">Strengths</h4>
                                        </div>
                                        {result.strengths.length > 0 ? (
                                            <ul className="space-y-3">
                                                {result.strengths.map((str, i) => (
                                                    <motion.li
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + i * 0.1 }}
                                                        key={i}
                                                        className="flex items-start gap-2 text-green-800 dark:text-green-400 text-sm"
                                                    >
                                                        <Icons.CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                                                        <span>{str}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-green-800/60 dark:text-green-400/60 italic">
                                                No clear strengths identified.
                                            </p>
                                        )}
                                    </div>

                                    {/* Weaknesses */}
                                    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-5 border border-red-100 dark:border-red-800/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-red-100 dark:bg-red-800/50 rounded-lg">
                                                <Icons.TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            </div>
                                            <h4 className="font-semibold text-red-900 dark:text-red-300">Areas for Improvement</h4>
                                        </div>
                                        {result.weaknesses.length > 0 ? (
                                            <ul className="space-y-3">
                                                {result.weaknesses.map((weak, i) => (
                                                    <motion.li
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + i * 0.1 }}
                                                        key={i}
                                                        className="flex items-start gap-2 text-red-800 dark:text-red-400 text-sm"
                                                    >
                                                        <Icons.AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                                                        <span>{weak}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-red-800/60 dark:text-red-400/60 italic">
                                                No significant weaknesses identified.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

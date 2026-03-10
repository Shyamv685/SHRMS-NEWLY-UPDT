import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

interface FraudAlert {
    id: string;
    employeeName: string;
    employeeId: string;
    department: string;
    issueType: "Duplicate Payment" | "Abnormal Bonus" | "Ghost Employee" | "Account Change";
    amount: number;
    severity: "Critical" | "High" | "Medium" | "Low";
    dateDetected: string;
    description: string;
    status: "Pending Investigation" | "Resolved" | "False Positive";
}

export default function PayrollFraudDetection() {
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

    // Mock data generation
    const mockAlerts: FraudAlert[] = [
        {
            id: "FRD-2026-001",
            employeeName: "James Wilson",
            employeeId: "EMP-1045",
            department: "Sales",
            issueType: "Abnormal Bonus",
            amount: 45000,
            severity: "Critical",
            dateDetected: "2026-03-09T14:23:00Z",
            description: "Bonus payout is 400% higher than the average in the Sales department for this quarter.",
            status: "Pending Investigation",
        },
        {
            id: "FRD-2026-002",
            employeeName: "Maria Garcia",
            employeeId: "EMP-2032",
            department: "Engineering",
            issueType: "Duplicate Payment",
            amount: 8500,
            severity: "High",
            dateDetected: "2026-03-10T08:15:00Z",
            description: "Two identical base salary transactions detected for the current pay period.",
            status: "Pending Investigation",
        },
        {
            id: "FRD-2026-003",
            employeeName: "Unknown Record",
            employeeId: "EMP-9999",
            department: "Operations",
            issueType: "Ghost Employee",
            amount: 5200,
            severity: "Critical",
            dateDetected: "2026-03-08T11:45:00Z",
            description: "Payroll record found with no matching active HR identity or recent badge swipes.",
            status: "Pending Investigation",
        },
        {
            id: "FRD-2026-004",
            employeeName: "Sarah Jenkins",
            employeeId: "EMP-1088",
            department: "Marketing",
            issueType: "Account Change",
            amount: 0,
            severity: "Medium",
            dateDetected: "2026-03-10T02:10:00Z",
            description: "Direct deposit bank account changed twice within the last 48 hours before payroll cutoff.",
            status: "Pending Investigation",
        },
    ];

    useEffect(() => {
        // Initial load
        setAlerts(mockAlerts);
    }, []);

    const runScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            // Let's pretend it found one more thing
            const newAlert: FraudAlert = {
                id: `FRD-2026-00${alerts.length + 1}`,
                employeeName: "Robert Fox",
                employeeId: "EMP-3011",
                department: "Finance",
                issueType: "Abnormal Bonus",
                amount: 15000,
                severity: "High",
                dateDetected: new Date().toISOString(),
                description: "Off-cycle bonus issued without standard multi-level manager approval workflow.",
                status: "Pending Investigation",
            };
            if (!alerts.find(a => a.employeeName === newAlert.employeeName)) {
                setAlerts([newAlert, ...alerts]);
            }
        }, 2500);
    };

    const handleAction = (id: string, newStatus: FraudAlert["status"]) => {
        setAlerts(alerts.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
        setSelectedAlert(null);
    };

    const pendingAlerts = alerts.filter(a => a.status === "Pending Investigation");

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "Critical": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800";
            case "High": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800";
            case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800";
            default: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800";
        }
    };

    const getIssueIcon = (type: string) => {
        switch (type) {
            case "Duplicate Payment": return <Icons.Copy className="w-5 h-5" />;
            case "Abnormal Bonus": return <Icons.TrendingUp className="w-5 h-5" />;
            case "Ghost Employee": return <Icons.Ghost className="w-5 h-5" />;
            case "Account Change": return <Icons.RefreshCw className="w-5 h-5" />;
            default: return <Icons.AlertTriangle className="w-5 h-5" />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                        <span className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                            <Icons.ShieldAlert className="w-8 h-8" />
                        </span>
                        AI Payroll Fraud Detection
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        Monitor, flag, and investigate unusual payroll activities and anomalies.
                    </p>
                </div>

                <button
                    onClick={runScan}
                    disabled={isScanning}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
                >
                    {isScanning ? (
                        <>
                            <Icons.Loader2 className="w-5 h-5 animate-spin" />
                            Scanning Records...
                        </>
                    ) : (
                        <>
                            <Icons.ScanLine className="w-5 h-5" />
                            Run Deep AI Scan
                        </>
                    )}
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-2xl">
                        <Icons.AlertOctagon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Flags</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{alerts.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 rounded-2xl">
                        <Icons.Flame className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical / High</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {alerts.filter(a => a.severity === "Critical" || a.severity === "High").length}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-2xl">
                        <Icons.Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingAlerts.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-2xl">
                        <Icons.ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Funds Secured</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${alerts.filter(a => a.status === "Resolved").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Alerts List */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Anomalies</h2>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Monitoring Live
                            </span>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 space-y-4">
                        <AnimatePresence>
                            {alerts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
                                    <Icons.ShieldCheck className="w-16 h-16 text-green-500/50" />
                                    <p>All clear! No anomalies detected.</p>
                                </div>
                            ) : (
                                alerts.map((alert) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={alert.id}
                                        onClick={() => setSelectedAlert(alert)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedAlert?.id === alert.id
                                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md"
                                                : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-gray-600 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-700 ${alert.status === 'Resolved' ? 'opacity-50 text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {getIssueIcon(alert.issueType)}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-gray-900 dark:text-white ${alert.status !== 'Pending Investigation' && 'opacity-60 line-through decoration-2'}`}>
                                                        {alert.employeeName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-medium">{alert.employeeId} • {alert.department}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">{alert.issueType}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{alert.description}</p>
                                            </div>
                                            {alert.amount > 0 && (
                                                <div className="text-right shrink-0 ml-4">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${alert.amount.toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                        {alert.status !== "Pending Investigation" && (
                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                <span className={`text-xs font-bold flex items-center gap-1 ${alert.status === 'Resolved' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                                    {alert.status === 'Resolved' ? <Icons.CheckCheck className="w-4 h-4" /> : <Icons.XCircle className="w-4 h-4" />}
                                                    {alert.status}
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Detailed Inspection Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-[600px] flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Investigation Panel</h2>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {!selectedAlert ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400 dark:text-gray-500"
                                >
                                    <Icons.Search className="w-16 h-16 opacity-50" />
                                    <p>Select an anomaly from the list to review details and take action.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Incident ID</p>
                                            <p className="font-mono text-sm text-gray-600 dark:text-gray-300">{selectedAlert.id}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(selectedAlert.severity)}`}>
                                            {selectedAlert.severity} Priority
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                {selectedAlert.employeeName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedAlert.employeeName}</p>
                                                <p className="text-sm text-gray-500">{selectedAlert.employeeId} • {selectedAlert.department}</p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />

                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Issue Detected</p>
                                            <p className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                                {getIssueIcon(selectedAlert.issueType)}
                                                {selectedAlert.issueType}
                                            </p>
                                        </div>

                                        {selectedAlert.amount > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Flagged Amount</p>
                                                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                                                    ${selectedAlert.amount.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Icons.BrainCircuit className="w-4 h-4 text-indigo-500" />
                                            AI Analysis
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                            {selectedAlert.description}
                                            <br /><br />
                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium text-xs">
                                                Detected on: {new Date(selectedAlert.dateDetected).toLocaleString()}
                                            </span>
                                        </p>
                                    </div>

                                    {selectedAlert.status === "Pending Investigation" ? (
                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => handleAction(selectedAlert.id, "Resolved")}
                                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors flex justify-center items-center gap-2"
                                            >
                                                <Icons.MinusCircle className="w-4 h-4" /> Halt Payment
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedAlert.id, "False Positive")}
                                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium shadow-sm transition-colors flex justify-center items-center gap-2"
                                            >
                                                <Icons.CheckCircle2 className="w-4 h-4" /> Allow (Safe)
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pt-4">
                                            <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                                                <Icons.Info className="w-5 h-5 text-gray-500" />
                                                This incident has been marked as: {selectedAlert.status}
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

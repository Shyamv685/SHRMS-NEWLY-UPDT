import { useState, useEffect } from "react";
import { Folder, UploadCloud, FileText, Download, Trash2, Search, Filter, ShieldCheck, Eye, FileBadge, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  uploadDate: string;
  fileSize: string;
  format: 'pdf' | 'img' | 'doc';
  status: 'Verified' | 'Pending' | 'Rejected';
}

const initialDocuments: DocumentRecord[] = [
  {
    id: "D101",
    employeeId: "E201",
    employeeName: "Alice Johnson",
    documentType: "Degree Certificate",
    uploadDate: "02-03-2025",
    fileSize: "2.4 MB",
    format: "pdf",
    status: "Verified"
  },
  {
    id: "D102",
    employeeId: "E205",
    employeeName: "Maria Garcia",
    documentType: "ID Proof (Passport)",
    uploadDate: "15-02-2025",
    fileSize: "1.1 MB",
    format: "img",
    status: "Verified"
  },
  {
    id: "D103",
    employeeId: "E201",
    employeeName: "Alice Johnson",
    documentType: "Tax Declaration",
    uploadDate: "10-03-2025",
    fileSize: "500 KB",
    format: "pdf",
    status: "Pending"
  },
  {
    id: "D104",
    employeeId: "E202",
    employeeName: "Robert Smith",
    documentType: "Previous Experience Letter",
    uploadDate: "20-01-2025",
    fileSize: "800 KB",
    format: "doc",
    status: "Verified"
  }
];

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userRole, setUserRole] = useState<string>('employee');

  const [newDoc, setNewDoc] = useState({
    employeeId: 'E201',
    employeeName: 'Alice Johnson',
    documentType: 'ID Proof',
    file: null as File | null
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'employee');
        
        // For employees, we'd normally filter documents by their ID here
        // if (user.role === 'employee') {
        //   setDocuments(initialDocuments.filter(d => d.employeeId === user.employeeId));
        // }
      } catch (e) {
        setUserRole('employee');
      }
    }
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const doc: DocumentRecord = {
        id: `D${Math.floor(Math.random() * 900) + 100}`,
        employeeId: userRole === 'hr' ? newDoc.employeeId : "E201",
        employeeName: userRole === 'hr' ? newDoc.employeeName : "Current User",
        documentType: newDoc.documentType,
        uploadDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), // DD-MM-YYYY format
        fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        format: newDoc.file?.type.includes('pdf') ? 'pdf' : 
                newDoc.file?.type.includes('image') ? 'img' : 'doc',
        status: userRole === 'hr' ? 'Verified' : 'Pending'
      };
      
      setDocuments([doc, ...documents]);
      setIsUploading(false);
      setShowUploadModal(false);
      setNewDoc({ employeeId: 'E201', employeeName: 'Alice Johnson', documentType: 'ID Proof', file: null });
    }, 1500);
  };

  const handleDelete = (id: string) => {
    // In a real app, you'd confirm first and check permissions
    setDocuments(documents.filter(d => d.id !== id));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-8 h-8 text-rose-500" />;
      case 'img': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'doc': return <FileBadge className="w-8 h-8 text-indigo-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><ShieldCheck className="w-3 h-3"/> {status}</span>;
      case 'Pending': 
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">{status}</span>;
      case 'Rejected': 
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">{status}</span>;
      default: return null;
    }
  };

  const filteredDocuments = documents
    .filter(d => filterType === 'all' || 
                 (filterType === 'verified' && d.status === 'Verified') || 
                 (filterType === 'pending' && d.status === 'Pending'))
    .filter(d => 
      d.documentType.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" /> 
            Digital Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Securely store, manage, and access employee compliance documents and certificates.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
        >
          <UploadCloud className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Files</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{documents.filter(d => d.status === 'Verified').length}</h3>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Storage Used</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12.5 <span className="text-sm text-gray-500 font-medium">GB</span></h3>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            25% of 50GB
          </div>
        </motion.div>
      </div>

      {/* Main vault area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Document Vault
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Documents</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredDocuments.map((doc, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={doc.id}
                  className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      {getFormatIcon(doc.format)}
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate" title={doc.documentType}>{doc.documentType}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[120px]" title={doc.employeeName}>{doc.employeeName}</span>
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 rounded">{doc.id}</span>
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <span>{doc.uploadDate}</span>
                    <span>{doc.fileSize}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors text-sm">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 font-medium rounded-md transition-colors text-sm">
                      <Download className="w-4 h-4" /> Save
                    </button>
                    {(userRole === 'hr' || doc.status !== 'Verified') && (
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="font-medium text-lg text-gray-900 dark:text-gray-300">No documents found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-500" /> Upload Document
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
                {userRole === 'hr' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                      <input 
                        type="text" 
                        required
                        value={newDoc.employeeId}
                        onChange={e => setNewDoc({...newDoc, employeeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
                      <input 
                        type="text" 
                        required
                        value={newDoc.employeeName}
                        onChange={e => setNewDoc({...newDoc, employeeName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                  <select 
                    required
                    value={newDoc.documentType}
                    onChange={e => setNewDoc({...newDoc, documentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select type...</option>
                    <option value="Degree Certificate">Degree Certificate</option>
                    <option value="ID Proof">ID Proof (Passport, Driving License)</option>
                    <option value="Tax Declaration">Tax Declaration</option>
                    <option value="Previous Experience Letter">Previous Experience Letter</option>
                    <option value="Health/Medical Record">Health/Medical Record</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Click or drag file to upload</p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG or DOC (max. 10MB)</p>
                    <div className="mt-4">
                      <label className="cursor-pointer bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        {newDoc.file ? newDoc.file.name : "Browse Files"}
                        <input 
                          type="file" 
                          className="hidden" 
                          required
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setNewDoc({...newDoc, file: e.target.files[0]});
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUploading || !newDoc.file || !newDoc.documentType}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Start Upload</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
